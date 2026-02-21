const API_URL = "https://compuvida-backend.onrender.com/api/v1/inventario";

export const inventarioService = {
  // Obtener todos los productos
  async fetchAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error de conexión con el servidor");
    return res.json();
  },

  // Crear un producto nuevo
  async create(obj) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
  },

  // Actualizar el stock por ID
  async updateStock(id, stock) {
    return fetch(`${API_URL}/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevoStock: stock })
    });
  },

  // Eliminar un producto
  async delete(id) {
    return fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  }
};