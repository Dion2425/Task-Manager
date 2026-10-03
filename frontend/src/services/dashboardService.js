import api from "./api";

export const getProjects = async () => {
  const res = await api.get("/project");
  return res.data || [];
};

export const getProjectById = async (id) => {
  const res = await api.get(`/project/${id}`);
  return res.data;
};

export const createProject = async (payload) => {
  const res = await api.post("/project", payload);
  return res.data;
};

export const updateProject = async (id, payload) => {
  await api.put(`/project/${id}`, payload);
};

export const deleteProject = async (id) => {
  await api.delete(`/project/${id}`);
};

export const getTasks = async (projectId) => {
  const url = projectId ? `/task?projectId=${projectId}` : "/task";
  const res = await api.get(url);
  return res.data || [];
};

export const getTaskById = async (id) => {
  const res = await api.get(`/task/${id}`);
  return res.data;
};

export const createTask = async (payload) => {
  const res = await api.post("/task", payload);
  return res.data;
};

export const updateTask = async (id, payload) => {
  await api.put(`/task/${id}`, payload);
};

export const deleteTask = async (id) => {
  await api.delete(`/task/${id}`);
};

export const updateTaskStatus = async (id, statusi) => {
  await api.patch(`/task/${id}/status`, { Statusi: statusi });
};

export const getUsers = async () => {
  try {
    const res = await api.get("/user");
    return res.data || [];
  } catch (err) {
    if (err.response && err.response.status === 403) {
      return []; // Return empty array for regular users without permission
    }
    throw err;
  }
};

export const getUserById = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/user", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  await api.put(`/user/${id}`, payload);
};

export const deleteUser = async (id) => {
  await api.delete(`/user/${id}`);
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/user/${id}/toggle-status`);
  return res.data;
};

export const getRoles = async () => {
  const res = await api.get("/role");
  return res.data || [];
};

export const getMembers = async (projectId) => {
  const url = projectId ? `/pmember?projectId=${projectId}` : "/pmember";
  const res = await api.get(url);
  return res.data || [];
};

export const createProjectMember = async (payload) => {
  const res = await api.post(`/pmember`, payload);
  return res.data;
};

export const deleteProjectMember = async (id) => {
  await api.delete(`/pmember/${id}`);
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getRoles,
  getMembers,
  createProjectMember,
  deleteProjectMember,
};
