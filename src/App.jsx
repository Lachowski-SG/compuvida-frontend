import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Trash2, RefreshCw, 
  ShoppingCart, AlertCircle, DollarSign, Layers 
} from 'lucide-react';

const API_URL = "https://compuvida-backend.onrender.com/api/v1/inventario";

function useInventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) cargarDatos();
  };

  useEffect(() => { cargarDatos(); }, []);

  return { productos, loading, error, agregar, actualizar, eliminar, refrescar: cargarDatos };
}

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={16} />
      </div>
      <input 
        {...props}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
      />
    </div>
  </div>
);

export default function App() {
  const { productos, loading, error, agregar, actualizar, eliminar, refrescar } = useInventario();
  const [form, setForm] = useState({ nombre: '', categoria: '', stock: '', precio: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    agregar({ ...form, stock: Number(form.stock), precio: Number(form.precio) });
    setForm({ nombre: '', categoria: '', stock: '', precio: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Package className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">COMPUVIDA</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inventory System Cloud</p>
            </div>
          </div>
          <button 
            onClick={refrescar}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all active:rotate-180 duration-500"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin text-indigo-600' : 'text-slate-600'} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-10">
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-indigo-600" /> Registrar Producto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField 
                label="Nombre del Producto" icon={Package} placeholder="Ej. MacBook Air M2"
                value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
              />
              <InputField 
                label="Categoría" icon={Layers} placeholder="Ej. Laptops"
                value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Stock Inicial" icon={ShoppingCart} type="number" placeholder="0"
                  value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required
                />
                <InputField 
                  label="Precio Unitario" icon={DollarSign} type="number" step="0.01" placeholder="0.00"
                  value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required
                />
              </div>
              <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95">
                Guardar en Inventario
              </button>
            </form>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Existencias en la Nube</h3>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase">
              {productos.length} Items
            </span>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 text-rose-600 mb-8">
              <AlertCircle size={24} />
              <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productos.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-indigo-600 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {p.categoria}
                    </span>
                    <button onClick={() => eliminar(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-6 group-hover:text-white transition-colors">{p.nombre}</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase group-hover:text-white/60 transition-colors">Precio</p>
                      <p className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors">${p.precio}</p>
                    </div>
                    <div className="text-right">
                      <button 
                        onClick={() => {
                            const n = prompt("Nuevo stock:", p.stock);
                            if(n) actualizar(p.id, parseInt(n));
                        }}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white hover:text-indigo-600 transition-all"
                      >
                        <RefreshCw size={12} /> {p.stock} Uds
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}