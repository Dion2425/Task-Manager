import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getMembers, getProjects } from "../services/dashboardService";
import "../styles/dashboard.css";
import { FiUsers, FiFilter } from "react-icons/fi";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const projectsRes = await getProjects();
        if (!mounted) return;
        setProjects(projectsRes || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load projects");
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadMembers() {
      setLoading(true);
      setError(null);

      try {
        const membersRes = await getMembers(selectedProject === "all" ? undefined : selectedProject);
        if (!mounted) return;
        setMembers(membersRes || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load members");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMembers();
    return () => {
      mounted = false;
    };
  }, [selectedProject]);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-primary bg-gradient p-2 rounded-3 shadow-sm">
                <FiUsers size={24} className="text-white" />
              </div>
              <h1 className="fw-bold mb-0 tracking-tight">Project Members</h1>
            </div>
            <p className="text-muted mb-0">View all collaborators and their roles across projects</p>
          </div>
          
          <div className="d-flex gap-3 align-items-center bg-dark p-2 rounded-3 border border-secondary shadow-sm">
            <FiFilter className="text-muted ms-2" />
            <select
              className="form-select border-0 bg-transparent text-white shadow-none cursor-pointer"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="all" className="text-dark">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id} className="text-dark">
                  {project.emertimi}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 rounded-3 shadow-sm mb-4">{error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card border-secondary shadow-sm">
            <div className="card-header border-bottom border-secondary bg-transparent p-4 d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0 fw-bold">Members Roster</h2>
              <span className="badge bg-primary rounded-pill px-3 py-2">{members.length} Total</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-borderless align-middle mb-0">
                  <thead className="table-dark bg-transparent text-muted small text-uppercase tracking-wider">
                    <tr>
                      <th className="ps-4 py-3 fw-medium">Member Name</th>
                      <th className="py-3 fw-medium">Email</th>
                      <th className="py-3 fw-medium">Role</th>
                      <th className="pe-4 py-3 fw-medium">Project</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length > 0 ? members.map((member, idx) => (
                      <tr key={member.id} className={idx !== members.length - 1 ? "border-bottom border-secondary" : ""}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}>
                              {(member.emriPerdoruesit)[0].toUpperCase()}
                            </div>
                            <span className="fw-semibold text-white">
                              {member.emriPerdoruesit}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-muted">
                          {member.emailPerdoruesit}
                        </td>
                        <td className="py-3">
                          <span className={`badge rounded-pill px-3 py-2 ${
                            (member.roliNeProjekt) === 'Admin' 
                              ? 'bg-danger' : 'bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50'
                          }`}>
                            {member.roliNeProjekt}
                          </span>
                        </td>
                        <td className="pe-4 py-3 text-white">
                          {member.emriProjektit}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">No members found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
