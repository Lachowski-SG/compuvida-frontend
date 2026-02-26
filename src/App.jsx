import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Trash2, RefreshCw, 
  ShoppingCart, AlertCircle, DollarSign, Tag, Layers
} from 'lucide-react';

const API_URL = "https://compuvida-backend.onrender.com/api/v1/inventario";

/**
 * Función auxiliar para formatear números a moneda
 */
const formatearMoneda = (valor) => {
  if (valor === undefined || valor === null) return "$ 0.00";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor).replace("USD", "$");
};

export default function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: '', categoria: '', stock: '', precio: '' });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error de conexión");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("El servidor está despertando. Reintenta en unos segundos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarDatos(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock),
          precio: Number(form.precio)
        })
      });
      if (res.ok) {
        setForm({ nombre: '', categoria: '', stock: '', precio: '' });
        cargarDatos();
      }
    } catch (err) {
      setError("No se pudo guardar el producto.");
    }
  };

  const eliminar = async (id) => {
    if(!window.confirm("¿Deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) cargarDatos();
    } catch (err) {
      setError("Error al eliminar.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-indigo-600" size={24} />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">COMPUVIDA SOLUCIONES INTELIGENTES</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inventario General Actualizado</p>
          </div>
          <button 
            onClick={cargarDatos} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                placeholder="Nombre"
                value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
              />
              <input 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                placeholder="Categoría"
                value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  placeholder="Stock"
                  value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required
                />
                <input 
                  type="number" step="0.01" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  placeholder="Precio"
                  value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required
                />
              </div>
              <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Guardar
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-700">
              <Layers size={18} /> Existencias
            </h3>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded uppercase text-slate-500">{p.categoria}</span>
                  <button onClick={() => eliminar(p.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 mb-4">{p.nombre}</h4>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Precio</p>
                    <p className="text-xl font-black text-indigo-600">{formatearMoneda(p.precio)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Stock</p>
                    <p className="font-bold">{p.stock} un.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {productos.length === 0 && !loading && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
              <ShoppingCart className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">No hay productos disponibles</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
