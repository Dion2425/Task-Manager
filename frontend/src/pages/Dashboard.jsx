import { useEffect, useState } from "react";
import { FaTasks, FaProjectDiagram, FaUsers, FaChartLine } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getProjects, getTasks, getMembers } from "../services/dashboardService";
import "../styles/dashboard.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-3 shadow-lg border border-secondary">
        <p className="mb-1 text-white fw-bold">{label}</p>
        <p className="mb-0 text-primary">{`Tasks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [membersCount, setMembersCount] = useState(0);
  const [tasksByStatus, setTasksByStatus] = useState([]);

  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5; // Reduced for premium look
  const [projectChartData, setProjectChartData] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [projectsRes, tasksRes, membersRes] = await Promise.all([
          getProjects(),
          getTasks(),
          getMembers(),
        ]);
        if (!mounted) return;
        setProjects(projectsRes || []);
        setTasks(tasksRes || []);
        setMembersCount((membersRes && membersRes.length) || 0);

        const counts = (tasksRes || []).reduce((acc, task) => {
          const key = task.statusi;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        setTasksByStatus(Object.entries(counts).map(([name, value]) => ({ name, value })));
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function getFilteredTasks() {
    return tasks.filter((task) => {
      if (projectFilter !== "all") {
          const projId = task.projectId;
          if (String(projId) !== String(projectFilter)) return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const title = ((task.titulli) || "").toLowerCase();
      return title.includes(q);
    });
  }

  function updateProjectChart(projectId) {
    if (!projectId || projectId === "all") {
      setProjectChartData([]);
      return;
    }
    const projTasks = tasks.filter((task) => String(task.projectId) === String(projectId));
    const counts = projTasks.reduce((acc, task) => {
      const key = task.statusi;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    setProjectChartData(Object.entries(counts).map(([name, value]) => ({ name, value })));
  }

  const filteredTasks = getFilteredTasks();
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageItems = filteredTasks.slice(pageStart, pageStart + pageSize);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />

      <main className="flex-grow-1 p-5 overflow-auto">
        <div className="mb-5">
          <h1 className="fw-bold mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-muted">Welcome back! Here's what's happening with your projects today.</p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger border-0 rounded-3 shadow-sm">{error}</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card h-100 position-relative overflow-hidden border-0 bg-primary bg-gradient text-white shadow-lg">
                  <div className="card-body p-4 position-relative z-1">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center">
                        <FaProjectDiagram size={24} />
                      </div>
                      <span className="badge bg-white bg-opacity-25 text-white border-0">Total</span>
                    </div>
                    <h2 className="display-4 fw-bold mb-0">{projects.length}</h2>
                    <p className="mb-0 text-white-50 fw-medium">Active Projects</p>
                  </div>
                  <div className="position-absolute end-0 bottom-0 opacity-25" style={{ transform: 'translate(20%, 20%)' }}>
                    <FaProjectDiagram size={150} />
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 position-relative overflow-hidden border-0 bg-success bg-gradient text-white shadow-lg">
                  <div className="card-body p-4 position-relative z-1">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center">
                        <FaTasks size={24} />
                      </div>
                      <span className="badge bg-white bg-opacity-25 text-white border-0">Total</span>
                    </div>
                    <h2 className="display-4 fw-bold mb-0">{tasks.length}</h2>
                    <p className="mb-0 text-white-50 fw-medium">Tasks Tracked</p>
                  </div>
                  <div className="position-absolute end-0 bottom-0 opacity-25" style={{ transform: 'translate(20%, 20%)' }}>
                    <FaTasks size={150} />
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 position-relative overflow-hidden border-0" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}>
                  <div className="card-body p-4 position-relative z-1 text-white">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="bg-white bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center">
                        <FaUsers size={24} />
                      </div>
                      <span className="badge bg-white bg-opacity-25 text-white border-0">Total</span>
                    </div>
                    <h2 className="display-4 fw-bold mb-0">{membersCount}</h2>
                    <p className="mb-0 text-white-50 fw-medium">Team Members</p>
                  </div>
                  <div className="position-absolute end-0 bottom-0 text-white opacity-25" style={{ transform: 'translate(20%, 20%)' }}>
                    <FaUsers size={150} />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4 mb-5">
              <div className="col-lg-8">
                <div className="card h-100 border-secondary">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <FaChartLine className="text-primary" size={20} />
                      <h2 className="h5 mb-0 fw-bold">Overall Task Status</h2>
                    </div>
                    <div style={{ height: '300px' }} className="w-100 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tasksByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card h-100 border-secondary">
                  <div className="card-body p-4 d-flex flex-column">
                    <h2 className="h5 mb-4 fw-bold">Project Breakdown</h2>
                    <select
                      className="form-select form-select-lg mb-4"
                      value={projectFilter}
                      onChange={(e) => {
                        setProjectFilter(e.target.value);
                        setPage(1);
                        updateProjectChart(e.target.value);
                      }}
                    >
                      <option value="all">Select project to inspect</option>
                      {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.emertimi}
                        </option>
                          ))} 
                    </select>

                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                      {projectChartData.length > 0 ? (
                        <div style={{ height: '200px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={projectChartData}>
                              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                              <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-secondary rounded-3 border-dashed" style={{ borderStyle: 'dashed' }}>
                          <p className="text-muted mb-0 small">Select a project above to view its specific task distribution.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tasks Table */}
            <div className="card border-secondary">
              <div className="card-header border-bottom border-secondary bg-transparent p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h2 className="h5 mb-0 fw-bold">Recent Tasks Tracker</h2>
                <div className="d-flex gap-3">
                  <input
                    className="form-control"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    style={{ width: "250px" }}
                  />
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-borderless align-middle mb-0">
                    <thead className="table-dark bg-transparent text-muted small text-uppercase tracking-wider">
                      <tr>
                        <th className="ps-4 py-3 fw-medium">Task</th>
                        <th className="py-3 fw-medium">Project</th>
                        <th className="py-3 fw-medium">Status</th>
                        <th className="pe-4 py-3 fw-medium">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.length > 0 ? pageItems.map((task, idx) => (
                        <tr key={task.id} className={idx !== pageItems.length - 1 ? "border-bottom border-secondary" : ""}>
                          <td className="ps-4 py-3">
                            <Link to={`/task/${task.id}`} className="text-decoration-none fw-semibold text-white">
                                {(task.titulli)}
                            </Link>
                          </td>
                          <td className="py-3 text-muted">
                            {task.emriProjektit}
                          </td>
                          <td className="py-3">
                            <span className="badge bg-secondary text-white rounded-pill px-3 py-2">
                              {task.statusi}
                            </span>
                          </td>
                          <td className="pe-4 py-3">
                            <span className={`badge-priority priority-${task.prioriteti}`}>
                              {task.prioriteti}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">No tasks found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="card-footer bg-transparent border-top border-secondary p-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    Showing {pageStart + 1} to {Math.min(pageStart + pageSize, filteredTasks.length)} of {filteredTasks.length} tasks
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary px-3"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Prev
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary px-3"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
