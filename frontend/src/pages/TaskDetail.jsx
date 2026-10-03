import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTaskById } from "../services/dashboardService";
import Sidebar from "../components/Sidebar";
import { FiArrowLeft, FiFolder, FiCheckCircle, FiZap, FiUser, FiFileText } from "react-icons/fi";
import "../styles/taskDetail.css";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getTaskById(id);
        setTask(res);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "done":
        return "badge-success";
      case "in progress":
      case "në progres":
        return "badge-primary";
      case "pending":
      case "në pritje":
        return "badge-warning";
      default:
        return "badge-secondary";
    }
  };

  if (loading) {
    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="task-detail-container">
          <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="task-detail-container">
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="task-detail-container">
          <div className="alert alert-warning mt-4" role="alert">
            Task not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="task-detail-container">
        <div className="task-detail-header">
          <Link to="/tasks" className="task-back-btn">
            <FiArrowLeft size={18} />
            <span>Back to Tasks</span>
          </Link>
        </div>

        <div className="task-detail-content">
          <div className="task-detail-main">
            {/* Task Title */}
            <div className="task-header-section">
              <h1 className="task-title">{task.titulli}</h1>
              <div className="task-badges">
                <span className={`badge ${getStatusBadgeClass(task.statusi)}`}>
                  {task.statusi}
                </span>
                <span className={`badge ${getPriorityBadgeClass(task.prioriteti)}`}>
                  {task.prioriteti} Priority
                </span>
              </div>
            </div>

            {/* Task Description */}
            <div className="task-section">
              <div className="section-title">
                <FiFileText size={18} />
                <h2>Description</h2>
              </div>
              <div className="task-description">
                {task.pershkrimi || "No description provided."}
              </div>
            </div>

            {/* Task Details Grid */}
            <div className="task-details-grid">
              {/* Project */}
              <div className="detail-card">
                <div className="detail-header">
                  <FiFolder size={16} />
                  <span className="detail-label">Project</span>
                </div>
                <div className="detail-value">{task.emriProjektit}</div>
              </div>

              {/* Status */}
              <div className="detail-card">
                <div className="detail-header">
                  <FiCheckCircle size={16} />
                  <span className="detail-label">Status</span>
                </div>
                <div className="detail-value">
                  <span className={`badge ${getStatusBadgeClass(task.statusi)}`}>
                    {task.statusi}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="detail-card">
                <div className="detail-header">
                  <FiZap size={16} />
                  <span className="detail-label">Priority</span>
                </div>
                <div className="detail-value">
                  <span className={`badge ${getPriorityBadgeClass(task.prioriteti)}`}>
                    {task.prioriteti}
                  </span>
                </div>
              </div>

              {/* Assigned To */}
              <div className="detail-card">
                <div className="detail-header">
                  <FiUser size={16} />
                  <span className="detail-label">Assigned To</span>
                </div>
                <div className="detail-value">
                  {task.emriPerdoruesitCaktuar || "Not assigned"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar with Additional Info */}
          <div className="task-detail-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Quick Info</h3>
              <div className="info-item">
                <span className="info-label">Task ID</span>
                <span className="info-value">#{task.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}