import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createProject,deleteProject,getProjects,getUsers,updateProject, getMembers, createProjectMember, deleteProjectMember } from "../services/dashboardService";
import "../styles/dashboard.css";
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiUsers } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  Emertimi: "",
  Pershkrimi: "",
  DataPerfundimit: "",
  OwnerId: "",
  MemberIds: [],
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { roles } = useAuth();
  const isAdminOrManager = roles.includes("Admin") || roles.includes("Menaxher");

  const normalizeUser = (user) => ({
    ...user,
    Id: user.id,
    Emri: user.emri ?? "",
    Mbiemri: user.mbiemri ?? "",
  });
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRole, setMemberRole] = useState("Anetar");

  const normalizeProject = (project) => ({
    ...project,
    Id: project.id,
    Emertimi: project.Emertimi || project.emertimi,
    Pershkrimi: project.Pershkrimi || project.pershkrimi,
    DataFillimit: project.DataFillimit || project.dataFillimit,
    DataPerfundimit: project.DataPerfundimit || project.dataPerfundimit,
    Statusi: project.Statusi || project.statusi,
    OwnerId: project.OwnerId ?? project.ownerId,
    EmriPronarit: project.EmriPronarit || project.emriPronarit,
    PerqindjaProgresit: project.PerqindjaProgresit ?? project.perqindjaProgresit ?? 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [projectsData, usersData] = await Promise.all([getProjects(), getUsers()]);
        if (!mounted) return;
        setProjects((projectsData || []).map(normalizeProject));
        setUsers((usersData || []).map(normalizeUser));
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setForm((current) => ({ ...current, [name]: values }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      Emertimi: form.Emertimi,
      Pershkrimi: form.Pershkrimi,
      DataPerfundimit: form.DataPerfundimit,
      OwnerId: Number(form.OwnerId),
    };

    try {
      let projectId = selectedProject?.Id || selectedProject?.id;
      if (selectedProject) {
        await updateProject(projectId, payload);
      } else {
        const newProj = await createProject(payload);
        projectId = newProj?.Id || newProj?.id;
      }

      // Sync members
      if (projectId && form.MemberIds) {
        const existingMembers = await getMembers(projectId);
        const existingUserIds = existingMembers.map(m => Number(m.UserId || m.userId || m.userId));
        
        const selectedUserIds = form.MemberIds.map(Number);
        const toAdd = selectedUserIds.filter(id => !existingUserIds.includes(id));
        const toRemove = existingMembers.filter(m => !selectedUserIds.includes(Number(m.UserId || m.userId)));
        
        for (const id of toAdd) {
           await createProjectMember({ ProjectId: projectId, UserId: id, RoliNeProjekt: "Anetar" });
        }
        for (const m of toRemove) {
           await deleteProjectMember(m.Id || m.id);
        }
      }

      const updatedProjects = await getProjects();
      setProjects((updatedProjects || []).map(normalizeProject));
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
    setForm({
      Emertimi: project.Emertimi || project.emertimi,
      Pershkrimi: project.Pershkrimi || project.pershkrimi,
      DataPerfundimit: project.DataPerfundimit
        ? new Date(project.DataPerfundimit).toISOString().substring(0, 10)
        : "",
      OwnerId: project.OwnerId?.toString() || "",
      MemberIds: [], // Will load async
    });
    
    try {
      const members = await getMembers(project.Id || project.id);
      setForm((cur) => ({ ...cur, MemberIds: members.map(m => (m.UserId || m.userId).toString()) }));
    } catch (err) {
      console.error("Failed to load members for edit", err);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project ${project.Emertimi}?`)) return;
    setError(null);
    try {
      await deleteProject(project.Id);
      setProjects((current) => current.filter((item) => item.Id !== project.Id));
    } catch (err) {
      setError(err?.message || "Failed to delete project");
    }
  };

  const openMembers = async (project) => {
    // mark for debugging: indicate handler was invoked
    try { window.__openMembersCalled = true; } catch {}
    setActiveProject(project);
    setShowMembersModal(true);
    setMembersLoading(true);
    setProjectMembers([]);
    try {
      const members = await getMembers(project.Id || project.id);
      setProjectMembers(members || []);
    } catch (err) {
      setError(err?.message || "Failed to load members");
    } finally {
      setMembersLoading(false);
    }
  };

  const closeMembers = () => {
    setShowMembersModal(false);
    setActiveProject(null);
    setProjectMembers([]);
    setMemberUserId("");
    setMemberRole("Anetar");
  };

  const handleAddMember = async () => {
    if (!memberUserId || !activeProject) return;
    setMembersLoading(true);
    try {
      await createProjectMember({ ProjectId: activeProject.Id, UserId: Number(memberUserId), RoliNeProjekt: memberRole });
      const members = await getMembers(activeProject.Id);
      setProjectMembers(members || []);
      setMemberUserId("");
      setMemberRole("Anetar");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add member");
    } finally {
      setMembersLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from project?")) return;
    setMembersLoading(true);
    try {
      await deleteProjectMember(memberId);
      setProjectMembers((cur) => cur.filter((m) => m.Id !== memberId));
    } catch (err) {
      setError(err?.message || "Failed to remove member");
    } finally {
      setMembersLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100">
        <Sidebar />
        <main className="flex-grow-1 p-5 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </main>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (project.Emertimi || "").toLowerCase();
    return name.includes(q);
  });

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-primary bg-gradient p-2 rounded-3 shadow-sm">
                <FiFolder size={24} className="text-white" />
              </div>
              <h1 className="fw-bold mb-0 tracking-tight">Projects</h1>
            </div>
            <p className="text-muted mb-0">Manage your workspaces and repositories</p>
          </div>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            {isAdminOrManager && (
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setIsFormOpen(true)}>
                <FiPlus size={18} />
                <span>New Project</span>
              </button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 rounded-3 shadow-sm mb-4">{error}</div>}

        {isFormOpen && (
          <div className="card mb-5 glass-panel">
            <div className="card-body p-4">
              <h2 className="h5 mb-4 fw-bold">{selectedProject ? "Edit Project" : "Create New Project"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Project Name</label>
                    <input
                      name="Emertimi"
                      value={form.Emertimi}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Owner</label>
                    <select
                      name="OwnerId"
                      value={form.OwnerId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select owner</option>
                      {users.map((user) => (
                        <option key={user.Id} value={user.Id}>
                          {`${user.Emri} ${user.Mbiemri}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">End date</label>
                    <input
                      type="date"
                      name="DataPerfundimit"
                      value={form.DataPerfundimit}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase">Project Members</label>
                    <select
                      name="MemberIds"
                      multiple
                      value={form.MemberIds}
                      onChange={handleChange}
                      className="form-select"
                      style={{ height: "100px" }}
                    >
                      {users.map((user) => (
                        <option key={user.Id} value={user.Id} className="p-2">
                          {`${user.Emri} ${user.Mbiemri}`.trim() || user.Email}
                        </option>
                      ))}
                    </select>
                    <div className="form-text text-muted small">Hold CTRL (or CMD on Mac) to select multiple members. They will be added as "Anetar".</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase">Description</label>
                    <textarea
                      name="Pershkrimi"
                      value={form.Pershkrimi}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="mt-4 d-flex gap-3">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : selectedProject ? "Update project" : "Create project"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card border-secondary shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-borderless align-middle mb-0">
                <thead className="table-dark bg-transparent text-muted small text-uppercase tracking-wider">
                  <tr>
                    <th className="ps-4 py-3 fw-medium">Name</th>
                    <th className="py-3 fw-medium">Status</th>
                    <th className="py-3 fw-medium">Owner</th>
                    <th className="py-3 fw-medium">Dates</th>
                    <th className="py-3 fw-medium">Progress</th>
                    {isAdminOrManager && <th className="pe-4 py-3 fw-medium text-end">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, idx) => (
                      <tr key={project.id} className={idx !== filteredProjects.length - 1 ? "border-bottom border-secondary" : ""}>
                        <td className="ps-4 py-3">
                          <Link to={`/project/${project.id}`} className="text-decoration-none fw-semibold text-white d-flex align-items-center gap-2">
                            <FiFolder className="text-primary" />
                            {project.emertimi || "-"}
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className="badge bg-secondary text-white rounded-pill px-3 py-2">
                            {project.statusi || "-"}
                          </span>
                        </td>
                        <td className="py-3 text-muted">{project.emriPronarit || "-"}</td>
                        <td className="py-3">
                          <div className="small text-muted mb-1">Start: {project.dataFillimit ? new Date(project.dataFillimit).toLocaleDateString() : "-"}</div>
                          <div className="small text-white">End: {project.dataPerfundimit ? new Date(project.dataPerfundimit).toLocaleDateString() : "-"}</div>
                        </td>
                        <td className="py-3" style={{ width: "200px" }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.1)" }}>
                              <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${project.perqindjaProgresit || 0}%` }}></div>
                            </div>
                            <span className="small text-muted">{project.perqindjaProgresit ?? "0"}%</span>
                          </div>
                        </td>
                        {isAdminOrManager && (
                          <td className="pe-4 py-3 text-end">
                            <button className="btn btn-sm btn-link text-muted me-2 p-0" onClick={() => handleEdit(project)}>
                              <FiEdit2 size={16} />
                            </button>
                            <button className="btn btn-sm btn-link text-muted me-2 p-0" onClick={() => openMembers(project)} title="Manage members">
                              <FiUsers size={16} />
                            </button>
                            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDelete(project)}>
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {showMembersModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
            <div className="card p-4" style={{ width: '720px', maxWidth: '90%' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Members — {activeProject?.emertimi}</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={closeMembers}>Close</button>
              </div>

              <div className="mb-3">
                <div className="d-flex gap-2">
                  <select className="form-select" value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)}>
                    <option value="">Select user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{`${u.emri} ${u.mbiemri}`.trim() || u.email}</option>
                    ))}
                  </select>
                  <input className="form-control" placeholder="Role (e.g. Anetar, Admin)" value={memberRole} onChange={(e) => setMemberRole(e.target.value)} />
                  <button className="btn btn-primary" onClick={handleAddMember} disabled={membersLoading || !memberUserId}>{membersLoading ? 'Adding...' : 'Add'}</button>
                </div>
              </div>

              <div style={{ maxHeight: '360px', overflow: 'auto' }}>
                {membersLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectMembers.length > 0 ? projectMembers.map((m) => (
                        <tr key={m.id}>
                          <td>{m.emriPerdoruesit}</td>
                          <td className="text-muted">{m.emailPerdoruesit}</td>
                          <td>{m.roliNeProjekt}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-danger" onClick={() => handleRemoveMember(m.id)}>Remove</button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center text-muted py-4">No members</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
