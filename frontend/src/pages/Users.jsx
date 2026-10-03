import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  createUser,
  deleteUser,
  getRoles,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "../services/dashboardService";
import "../styles/dashboard.css";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiPower } from "react-icons/fi";

const emptyForm = {
  Emri: "",
  Mbiemri: "",
  Email: "",
  Password: "",
  PhoneNumber: "",
  Statusi: true,
  RoleIds: [],
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const normalizeUser = (user) => ({
    ...user,
    Id: user.id,
    Emri: user.emri,
    Mbiemri: user.mbiemri ?? "",
    Email: user.email ?? "",
    PhoneNumber: user.phoneNumber ?? "",
    Statusi: user.statusi ?? true,
    Rolet: user.rolet ?? [],
    RoleIds: user.RoleIds ?? user.roleIds ?? [],
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
        if (!mounted) return;
        setUsers((usersData || []).map(normalizeUser));
        setRoles(rolesData || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "checkbox") {
      setForm((current) => ({ ...current, [name]: checked }));
      return;
    }
    if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => Number(option.value));
      setForm((current) => ({ ...current, RoleIds: selected }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setSelectedUser(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  };

  const refreshUsers = async () => {
    const updatedUsers = await getUsers();
    setUsers((updatedUsers || []).map(normalizeUser));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        Emri: form.Emri,
        Mbiemri: form.Mbiemri,
        Email: form.Email,
        Password: form.Password,
        PhoneNumber: form.PhoneNumber,
        Statusi: form.Statusi,
        RoleIds: form.RoleIds,
      };

      if (selectedUser) {
        await updateUser(selectedUser.Id, {
          Emri: form.Emri,
          Mbiemri: form.Mbiemri,
          PhoneNumber: form.PhoneNumber,
          Statusi: form.Statusi,
          RoleIds: form.RoleIds,
        });
      } else {
        await createUser(payload);
      }

      await refreshUsers();
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setForm({
      Emri: user.Emri || "",
      Mbiemri: user.Mbiemri || "",
      Email: user.Email || "",
      Password: "",
      PhoneNumber: user.PhoneNumber || "",
      Statusi: user.Statusi ?? true,
      RoleIds: user.RoleIds || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.Emri} ${user.Mbiemri}?`)) return;
    setError(null);
    try {
      await deleteUser(user.Id);
      setUsers((current) => current.filter((item) => item.Id !== user.Id));
    } catch (err) {
      setError(err?.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (user) => {
    setError(null);
    try {
      await toggleUserStatus(user.Id);
      await refreshUsers();
    } catch (err) {
      setError(err?.message || "Failed to toggle status");
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

  const filteredUsers = users.filter((user) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (user.Emri || "").toLowerCase().includes(q) ||
      (user.Mbiemri || "").toLowerCase().includes(q) ||
      (user.Email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-primary bg-gradient p-2 rounded-3 shadow-sm">
                <FiUser size={24} className="text-white" />
              </div>
              <h1 className="fw-bold mb-0 tracking-tight">System Users</h1>
            </div>
            <p className="text-muted mb-0">Manage accounts, permissions, and roles</p>
          </div>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setIsFormOpen(true)}>
              <FiPlus size={18} />
              <span>New User</span>
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 rounded-3 shadow-sm mb-4">{error}</div>}

        {isFormOpen && (
          <div className="card mb-5 glass-panel">
            <div className="card-body p-4">
              <h2 className="h5 mb-4 fw-bold">{selectedUser ? "Edit User" : "Create New User"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">First Name</label>
                    <input name="Emri" value={form.Emri} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Last Name</label>
                    <input name="Mbiemri" value={form.Mbiemri} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Email</label>
                    <input name="Email" value={form.Email} onChange={handleChange} className="form-control" type="email" required readOnly={Boolean(selectedUser)} />
                  </div>
                  {!selectedUser && (
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Password</label>
                      <input name="Password" value={form.Password} onChange={handleChange} className="form-control" type="password" required />
                    </div>
                  )}
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Phone</label>
                    <input name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Status</label>
                    <div className="form-check form-switch mt-2">
                      <input type="checkbox" className="form-check-input" id="statusSwitch" name="Statusi" checked={form.Statusi} onChange={handleChange} />
                      <label className="form-check-label text-white" htmlFor="statusSwitch">
                        {form.Statusi ? "Active User" : "Account Disabled"}
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase">Assigned Roles</label>
                    <select name="RoleIds" multiple value={form.RoleIds} onChange={handleChange} className="form-select" style={{ height: "100px" }}>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id} className="p-2">
                          {role.emertimi}
                        </option>
                      ))}
                    </select>
                    <div className="form-text text-muted">Hold CTRL (or CMD on Mac) to select multiple roles.</div>
                  </div>
                </div>
                <div className="mt-4 d-flex gap-3">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : selectedUser ? "Update user" : "Create user"}
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
                    <th className="ps-4 py-3 fw-medium">User Information</th>
                    <th className="py-3 fw-medium">Status</th>
                    <th className="py-3 fw-medium">Roles</th>
                    <th className="pe-4 py-3 fw-medium text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <tr key={user.Id} className={idx !== filteredUsers.length - 1 ? "border-bottom border-secondary" : ""}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: "40px", height: "40px", fontSize: "1rem" }}>
                              {(user.Emri || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-white">{`${user.Emri || ""} ${user.Mbiemri || ""}`.trim()}</div>
                              <div className="small text-muted">{user.Email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`badge rounded-pill px-3 py-2 ${user.Statusi ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50' : 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50'}`}>
                            {user.Statusi ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-wrap gap-1">
                            {user.Rolet && user.Rolet.length > 0 ? user.Rolet.map(r => (
                              <span key={r} className="badge bg-secondary text-white rounded-pill">{r}</span>
                            )) : <span className="text-muted small">No roles</span>}
                          </div>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <button className="btn btn-sm btn-link text-muted me-2 p-0" title="Edit" onClick={() => handleEdit(user)}>
                            <FiEdit2 size={16} />
                          </button>
                          <button className={`btn btn-sm btn-link me-2 p-0 ${user.Statusi ? 'text-warning' : 'text-success'}`} title={user.Statusi ? "Disable" : "Enable"} onClick={() => handleToggleStatus(user)}>
                            <FiPower size={16} />
                          </button>
                          <button className="btn btn-sm btn-link text-danger p-0" title="Delete" onClick={() => handleDelete(user)}>
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
