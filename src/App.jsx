import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Trash2, RefreshCw, 
  ShoppingCart, AlertCircle, DollarSign, Layers 
} from 'lucide-react';

const API_URL = "https://compuvida-backend.onrender.com/api/v1/inventario";

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor).replace("USD", "$");
};

function useInventario() {
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
      setProductos(data);
      setError(null);
    } catch (err) {
      setError("El servidor en Render está despertando o no disponible. Reintenta en un momento.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  const agregar = async (obj) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
    if (res.ok) cargarDatos();
  };

  const actualizar = async (id, stock) => {
    const res = await fetch(`${API_URL}/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevoStock: stock })
    });
    if (res.ok) cargarDatos();
  };

  const eliminar = async (id) => {
    if(!confirm("¿Deseas eliminar este producto?")) return;
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) cargarDatos();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Package className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">COMPUVIDA Soluciones Inteligentes</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inventorio System Cloud</p>
            </div>
          </div>
          <button onClick={cargarDatos} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin text-indigo-600' : 'text-slate-600'} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-10">
        {/* Formulario Lateral */}
        <section className="col-span-12 lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 sticky top-28">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" /> Registrar Producto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Categoría</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Stock</label>
                  <input 
                    type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                    value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Precio</label>
                  <input 
                    type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                    value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required
                  />
                </div>
              </div>
              <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-4">
                Guardar en Nube
              </button>
            </form>
          </div>
        </section>

        {/* Listado de Productos */}
        <section className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Existencias</h3>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase">
              {productos.length} Items
            </span>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 text-rose-600 mb-8">
              <AlertCircle size={24} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productos.map(p => (
              <div key={p.id} className="group bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-indigo-50 transition-colors duration-300" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {p.categoria}
                    </span>
                    <button onClick={() => eliminar(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 mb-6 group-hover:text-indigo-900 transition-colors">
                    {p.nombre}
                  </h4>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Precio Unitario</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">
                        {formatearMoneda(p.precio)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Disponibles</p>
                      <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-black group-hover:bg-indigo-600 transition-colors">
                        {p.stock} Unidades
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {productos.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <ShoppingCart className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay productos registrados</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}