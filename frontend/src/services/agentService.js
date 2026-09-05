import api from './api';

export const getAgents = async () => {
  const { data } = await api.get('/agents');
  return data;
};

export const getAllAgentsAdmin = async () => {
  const { data } = await api.get('/agents/admin/all');
  return data;
};

export const createAgent = async (payload) => {
  const { data } = await api.post('/agents', payload);
  return data;
};

export const updateAgent = async (id, payload) => {
  const { data } = await api.put(`/agents/${id}`, payload);
  return data;
};

export const deleteAgent = async (id) => {
  const { data } = await api.delete(`/agents/${id}`);
  return data;
};

export const getAgentById = async (id) => {
  const { data } = await api.get(`/agents/${id}`);
  return data;
};