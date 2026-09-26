import api from './api';

export const designerService = {
  getDesigners: async (activeOnly = false) => {
    const url = activeOnly ? '/designers?active=true' : '/designers';
    const response = await api.get(url);
    return response.data;
  },

  getDesignerById: async (id) => {
    const response = await api.get(`/designers/${id}`);
    return response.data;
  },

  createDesigner: async (designerData) => {
    const response = await api.post('/designers', designerData);
    return response.data;
  },

  updateDesigner: async (id, designerData) => {
    const response = await api.put(`/designers/${id}`, designerData);
    return response.data;
  },

  deleteDesigner: async (id) => {
    const response = await api.delete(`/designers/${id}`);
    return response.data;
  },
};
