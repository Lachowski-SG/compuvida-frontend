import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Trash2, RefreshCw, 
  ShoppingCart, AlertCircle, DollarSign, 
  Layers, Search, MoreVertical, Edit3,
  TrendingUp, Box, CheckCircle2
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
      if (!res.ok) throw new Error("Error de respuesta del servidor");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("El servidor está iniciando. Por favor espera 30s y Actualiza");
    } finally {
      setLoading(false);
    }
  };

  const agregar = async (nuevo) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      if (res.ok) cargarDatos();
    } catch (err) { setError("Error al guardar producto"); }
  };

  const actualizarStock = async (id, stock) => {
    try {
      const res = await fetch(`${API_URL}/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoStock: stock })
      });
      if (res.ok) cargarDatos();
    } catch (err) { setError("Error al actualizar stock"); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Confirmas la eliminación de este registro?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) cargarDatos();
    } catch (err) { setError("Error al eliminar"); }
  };

  useEffect(() => { cargarDatos(); }, []);

  return { productos, loading, error, agregar, actualizarStock, eliminar, refrescar: cargarDatos };
}

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default function App() {
  const { productos, loading, error, agregar, actualizarStock, eliminar, refrescar } = useInventario();
  const [form, setForm] = useState({ nombre: '', categoria: '', stock: '', precio: '' });
  const [busqueda, setBusqueda] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    agregar({ ...form, stock: Number(form.stock), precio: Number(form.precio) });
    setForm({ nombre: '', categoria: '', stock: '', precio: '' });
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-100">
      
      {}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from bg-orange-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900">COMPUVIDA Soluciones Inteligentes</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Conexión Exitosa Live</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-4 py-2 w-96 border border-slate-200">
            <Search className="text-slate-400 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button onClick={refrescar} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <RefreshCw size={20} className={`${loading ? 'animate-spin border-b-orange-400' : 'text-slate-400'}`} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Items" 
            value={productos.length} 
            icon={Box} 
            color="bg-indigo-600"
          />
          <StatCard 
            title="Valor Inventario" 
            value={`$${productos.reduce((acc, p) => acc + (p.precio * p.stock), 0).toLocaleString()}`} 
            icon={TrendingUp} 
            color="bg-violet-600"
          />
          <StatCard 
            title="Stock Bajo" 
            value={productos.filter(p => p.stock < 5).length} 
            icon={AlertCircle} 
            color="bg-rose-500"
          />
        </div>

        <div className="grid grid-cols-12 gap-10">
          
          {}
          <section className="col-span-12 lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-28">
              <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 to-blue-600 rounded-lg"><Plus size={18}/></div>
                Añadir Producto
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detalles del Equipo</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none text-sm font-semibold"
                    placeholder="Nombre del modelo"
                    value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
                  />
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none text-sm font-semibold"
                    placeholder="Categoría (Hardware, Redes...)"
                    value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Existencia</label>
                    <input 
                      type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                      value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio Unit.</label>
                    <input 
                      type="number" step="0.01" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                      value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required
                    />
                  </div>
                </div>

                <button className="w-full bg-slate-900 hover:border-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group">
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform"/>
                  Guardar Registro
                </button>
              </form>
            </div>
          </section>

          {}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Layers className="to-lime-300 " size={20}/> Existencias Actuales
              </h3>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 text-rose-400 animate-in fade-in slide-in-from-top-4 duration-500">
                <AlertCircle size={24} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productosFiltrados.map(p => (
                <div key={p.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
                  
                  {}
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {p.categoria}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          const n = prompt("Actualizar stock:", p.stock);
                          if(n !== null) actualizarStock(p.id, parseInt(n));
                        }}
                        className="p-2 text-slate-300 hover:text-indigo-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => eliminar(p.id)} className="p-2 text-slate-300 hover:text-rose-300 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {}
                  <h4 className="text-lg font-bold text-slate-800 mb-8 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-300 transition-colors">
                    {p.nombre}
                  </h4>

                  <div className="flex items-end justify-between border-t border-slate-50 pt-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <DollarSign size={10} /> Valor Venta
                      </p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">
                        ${p.precio.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-2xl flex flex-col items-center justify-center ${p.stock < 5 ? 'bg-rose-50 text-rose-400' : 'bg-slate-900 text-white'}`}>
                      <p className="text-[8px] font-black uppercase opacity-60">Stock</p>
                      <p className="text-sm font-black tracking-tighter">{p.stock}</p>
                    </div>
                  </div>

                  {}
                  <div className="absolute bottom-0 left-0 w-full h-1 border-s-orange-500  scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </div>
              ))}
            </div>

            {}
            {productosFiltrados.length === 0 && !loading && (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
                <ShoppingCart className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No se encontraron productos</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-10 text-center border-t border-slate-200 mt-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Compuvida Soluciones Inteligentes • Inventario v2.0
        </p>
      </footer>
    </div>
  );
}