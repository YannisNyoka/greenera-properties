import api from './api';

export const submitEnquiry = async (payload) => {
  const { data } = await api.post('/enquiries', payload);
  return data;
};

export const getEnquiries = async (status) => {
  const { data } = await api.get('/enquiries', { params: status ? { status } : {} });
  return data;
};

export const updateEnquiryStatus = async (id, status) => {
  const { data } = await api.put(`/enquiries/${id}/status`, { status });
  return data;
};