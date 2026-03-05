import { api } from 'boot/axios'
import {Category} from "src/models/Category.js";

export const GaleriaService = {
  async getObres() {
    const response = await api.get('/list');
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return Object.keys(response.data).map(key => new Category({ name: key }));
  },

  async saveObra(obraData) {
    const response = await api.post('/save', obraData);
    return response.data;
  }
}
