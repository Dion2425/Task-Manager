import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createTask, deleteTask, getProjects, getTasks, getUsers, updateTask, updateTaskStatus } from "../services/dashboardService";
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiFolder, FiUser } from "react-icons/fi";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import Sidebar from "../components/Sidebar";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

// Kanban Card Component
function SortableTaskCard({ task, onEdit, onDelete, isAdminOrManager }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task.Id),
    data: task
  });

  const transformStr = CSS.Transform.toString(transform) || "";
  const style = {
    transform: transformStr,
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    willChange: "transform",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kanban-card"
      {...attributes}
      {...listeners}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className={`badge-priority priority-${task.Prioriteti || "Mesatar"}`}>
          {task.Prioriteti || "Mesatar"}
        </span>
        {isAdminOrManager && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-link text-muted p-0"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onEdit(task)}
            >
              <FiEdit2 size={14} />
            </button>
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onDelete(task)}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )}
      </div>
      <Link to={`/task/${task.Id}`} className="text-decoration-none text-white" onPointerDown={(e) => e.stopPropagation()}>
        <div className="kanban-card-title">{task.Titulli || "No Title"}</div>
      </Link>
      <div className="kanban-card-desc mb-2 text-muted small d-flex align-items-center gap-1">
        <FiFolder size={12} />
        <span>{task.EmriProjektit || "No Project"}</span>
      </div>
      <div className="kanban-card-desc">{task.Pershkrimi || "No Description"}</div>
      
      <div className="kanban-card-footer mt-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-1 text-muted small">
          <FiCalendar size={12} />
          <span>{task.DataAfatit ? new Date(task.DataAfatit).toLocaleDateString() : "No Date"}</span>
        </div>
        <div className="d-flex align-items-center gap-1 text-truncate" style={{maxWidth: '120px'}} title={task.EmriPerdoruesitCaktuar}>
          <FiUser size={12} className="text-primary" />
          <span className="small fw-semibold">{task.EmriPerdoruesitCaktuar || "Unassigned"}</span>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="kanban-column" id={id}>
      {children}
    </div>
  );
}

const COLUMNS = [
  { id: "NeBerje", title: "To Do" },
  { id: "NeProgres", title: "In Progress" },
  { id: "NeTestim", title: "Testing" },
  { id: "Perfunduar", title: "Done" },
];

const emptyForm = {
  Titulli: "",
  Pershkrimi: "",
  ProjectId: "",
  AssignedTo: "",
  Prioriteti: "Mesatar",
  Statusi: "NeBerje",
  DataAfatit: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { roles, user } = useAuth();
  const isAdminOrManager = roles.includes("Admin") || roles.includes("Menaxher");

  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Keep `activeTask` in sync with `activeId` and `tasks` in case of timing issues
  useEffect(() => {
    if (!activeId) {
      setActiveTask(null);
      return;
    }
    const found = tasks.find((t) => String(t.Id) === String(activeId));
    setActiveTask(found || null);
  }, [activeId, tasks]);

  const normalizeTask = (task) => ({
    ...task,
    Id: task.id,
    EmriProjektit: task.emriProjektit ?? "",
    Titulli: task.titulli ?? "",
    Pershkrimi: task.pershkrimi ?? "",
    Prioriteti: task.prioriteti ?? "Mesatar",
    Statusi: task.statusi ?? "NeBerje",
    AssignedTo: task.assignedTo ?? null,
    ProjectId: task.projectId ?? null,
    EmriPerdoruesitCaktuar: task.emriPerdoruesitCaktuar.trim(),
    DataAfatit: task.dataAfatit ?? null,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [tasksData, projectsData, usersData] = await Promise.all([getTasks(), getProjects(), getUsers()]);
        if (!mounted) return;
        setTasks((tasksData || []).map(normalizeTask));
        setProjects(projectsData || []);
        setUsers(usersData || []);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setSelectedTask(null);
    setForm(emptyForm);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      Titulli: form.Titulli,
      Pershkrimi: form.Pershkrimi,
      ProjectId: Number(form.ProjectId),
      AssignedTo: form.AssignedTo ? Number(form.AssignedTo) : null,
      Prioriteti: form.Prioriteti,
      Statusi: form.Statusi,
      DataAfatit: form.DataAfatit ? new Date(form.DataAfatit).toISOString() : null,
    };
    try {
      if (selectedTask) {
        await updateTask(selectedTask.Id, payload);
      } else {
        await createTask(payload);
      }
      const updatedTasks = await getTasks();
      setTasks((updatedTasks || []).map(normalizeTask));
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setForm({
      Titulli: task.Titulli || "",
      Pershkrimi: task.Pershkrimi || "",
      ProjectId: task.ProjectId?.toString() || "",
      AssignedTo: task.AssignedTo?.toString() || "",
      Prioriteti: task.Prioriteti || "Mesatar",
      Statusi: task.Statusi || "NeBerje",
      DataAfatit: task.DataAfatit ? new Date(task.DataAfatit).toISOString().substring(0, 10) : "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task ${task.Titulli}?`)) return;
    try {
      await deleteTask(task.Id);
      setTasks((curr) => curr.filter((item) => item.Id !== task.Id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const taskId = String(active?.id);
    const overId = String(over?.id);

    console.debug("handleDragEnd", { activeId: taskId, overId });
    if (!over) {
      console.debug("handleDragEnd no over target");
      return;
    }

    // Find task (compare as strings to avoid type mismatches)
    const task = tasks.find((t) => String(t.Id) === taskId);
    if (!task) {
      console.debug("handleDragEnd task not found", taskId);
      return;
    }

    // Find destination status column
    let destStatus = null;
    if (COLUMNS.find((c) => c.id === overId)) {
      destStatus = overId;
    } else {
      const overTask = tasks.find((t) => String(t.Id) === overId);
      if (overTask) destStatus = overTask.Statusi;
    }

    if (!destStatus) {
      console.debug("handleDragEnd no destination status", { overId });
      return;
    }

    if (destStatus === task.Statusi) {
      console.debug("handleDragEnd same status, no update", { taskId, destStatus });
      return;
    }

    console.debug("DnD handleDragEnd — activeId:", taskId, "overId:", overId, "taskId:", task.Id, "destStatus:", destStatus);
    // Optimistic update
    setTasks(tasks.map(t => String(t.Id) === taskId ? { ...t, Statusi: destStatus } : t));
    try {
      await updateTaskStatus(taskId, destStatus);
    } catch (err) {
      console.error("Failed to persist task status", err);
      // Revert on failure
      const updatedTasks = await getTasks();
      setTasks((updatedTasks || []).map(normalizeTask));
      setError("Failed to update status");
    }
    // clear any active overlay state
    setActiveId(null);
    setActiveTask(null);
  };

  const handleDragStart = (event) => {
    const id = String(event.active?.id);
    setActiveId(id);
    const task = tasks.find((t) => String(t.Id) === id) || null;
    setActiveTask(task);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTask(null);
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

  const filteredTasks = tasks.filter((task) => {
    if (!search.trim()) return true;
    return (task.Titulli || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h1 className="fw-bold mb-2 tracking-tight">Project Tasks</h1>
            <p className="text-muted mb-0">Manage and track your team's progress</p>
          </div>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            {isAdminOrManager && (
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setIsFormOpen(true)}>
                <FiPlus size={18} />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 rounded-3 shadow-sm">{error}</div>}

        {isFormOpen && (
          <div className="card mb-5 glass-panel">
            <div className="card-body p-4">
              <h2 className="h5 mb-4 fw-bold">{selectedTask ? "Edit Task" : "Create New Task"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase">Title</label>
                    <input name="Titulli" value={form.Titulli} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Project</label>
                    <select name="ProjectId" value={form.ProjectId} onChange={handleChange} className="form-select" required>
                      <option value="">Select project</option>
                      {projects.map((p) => (
                        <option key={p.Id ?? p.id} value={p.Id ?? p.id}>{p.Emertimi || p.emertimi || p.name || "Unnamed Project"}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Assignee</label>
                    <select name="AssignedTo" value={form.AssignedTo} onChange={handleChange} className="form-select">
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.Id ?? u.id} value={u.Id ?? u.id}>{`${u.Emri || u.emri || ""} ${u.Mbiemri || u.mbiemri || ""}`.trim()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Priority</label>
                    <select name="Prioriteti" value={form.Prioriteti} onChange={handleChange} className="form-select">
                      <option value="Mesatar">Medium</option>
                      <option value="Ulte">Low</option>
                      <option value="Larte">High</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Status</label>
                    <select name="Statusi" value={form.Statusi} onChange={handleChange} className="form-select">
                      <option value="NeBerje">To Do</option>
                      <option value="NeProgres">In Progress</option>
                      <option value="NeTestim">Testing</option>
                      <option value="Perfunduar">Done</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Due date</label>
                    <input type="date" name="DataAfatit" value={form.DataAfatit} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold text-uppercase">Description</label>
                    <textarea name="Pershkrimi" value={form.Pershkrimi} onChange={handleChange} className="form-control" rows={3} />
                  </div>
                </div>
                <div className="mt-4 d-flex gap-3">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Task"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="kanban-board">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.Statusi === col.id);
              return (
                <DroppableColumn key={col.id} id={col.id}>
                  <div className="kanban-column-title">
                    <span>{col.title}</span>
                    <span className="badge bg-secondary text-white rounded-pill px-2">{colTasks.length}</span>
                  </div>
                  <SortableContext items={colTasks.map((t) => String(t.Id))} strategy={verticalListSortingStrategy}>
                    <div className="kanban-tasks">
                      {colTasks.map((task) => (
                        <SortableTaskCard
                          key={task.Id}
                          task={task}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isAdminOrManager={isAdminOrManager}
                        />
                      ))}
                      {colTasks.length === 0 && (
                        <div className="text-center p-3 text-muted small border border-secondary rounded-3 border-dashed" style={{ borderStyle: 'dashed' }}>
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              );
            })}
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="kanban-card drag-overlay">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className={`badge-priority priority-${activeTask.Prioriteti || "Mesatar"}`}>
                    {activeTask.Prioriteti || "Mesatar"}
                  </span>
                </div>
                <div className="kanban-card-title">{activeTask.Titulli || "No Title"}</div>
                <div className="kanban-card-desc mb-2 text-muted small d-flex align-items-center gap-1">
                  <span>{activeTask.EmriProjektit || "No Project"}</span>
                </div>
                <div className="kanban-card-desc">{activeTask.Pershkrimi || "No Description"}</div>
                <div className="kanban-card-footer mt-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-1 text-muted small">
                    <span>{activeTask.DataAfatit ? new Date(activeTask.DataAfatit).toLocaleDateString() : "No Date"}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
