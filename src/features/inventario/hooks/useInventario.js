import { useState, useEffect } from 'react';

import { inventarioService } from '../../../api/inventarioApi';

export function useInventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await inventarioService.fetchAll();
      setProductos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("No se pudo conectar con el Backend. ¿Está encendido en el puerto 8080?");
    } finally {
      setLoading(false);
    }
  };

  const agregar = async (obj) => {
    try {
      const res = await inventarioService.create(obj);
      if (res.ok) {
        await cargarDatos();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor al agregar:", errorData);
      }
    } catch (err) { 
      console.error("Error de red al agregar:", err); 
    }
  };

  const actualizar = async (id, stock) => {
    try {
      const nuevoStock = prompt("Ingrese la nueva cantidad de stock:", stock);
      if (nuevoStock === null || nuevoStock.trim() === "") return;

      const cantidadNumerica = parseInt(nuevoStock, 10);
      if (isNaN(cantidadNumerica)) {
        alert("Por favor, ingrese un número válido.");
        return;
      }

      const res = await inventarioService.updateStock(id, cantidadNumerica);
      if (res.ok) {
        await cargarDatos();
      }
    } catch (err) { 
      console.error("Error al actualizar stock:", err); 
    }
  };

  const eliminar = async (id) => {
    try {
      if (!window.confirm("¿Está seguro de que desea eliminar este producto del inventario?")) return;
      
      const res = await inventarioService.delete(id);
      if (res.ok) {
        await cargarDatos();
      }
    } catch (err) { 
      console.error("Error al eliminar producto:", err); 
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return { 
    productos, 
    loading, 
    error, 
    agregar, 
    actualizar, 
    eliminar, 
    refrescar: cargarDatos 
  };
}