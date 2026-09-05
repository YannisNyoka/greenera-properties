import api from './api';

export const getProperties = async (filters = {}) => {
  const { data } = await api.get('/properties', { params: filters });
  return data;
};

export const getPropertyBySlug = async (slug) => {
  const { data } = await api.get(`/properties/${slug}`);
  return data;
};

export const getAllPropertiesAdmin = async () => {
  const { data } = await api.get('/properties/admin/all');
  return data;
};

export const createProperty = async (payload) => {
  const { data } = await api.post('/properties', payload);
  return data;
};

export const updateProperty = async (id, payload) => {
  const { data } = await api.put(`/properties/${id}`, payload);
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};

export const getSimilarProperties = async (slug) => {
  const { data } = await api.get(`/properties/${slug}/similar`);
  return data;
};