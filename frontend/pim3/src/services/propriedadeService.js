import api from './api';

export const propriedadeService = {
  listar: async () => {
    const response = await api.get('/Propriedades');
    return response.data;
  },

  cadastrar: async (dados) => {
    const response = await api.post('/Propriedades', dados);
    return response.data;
  }
};