import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Map, Navigation } from 'lucide-react';

export default function LocationView() {
  const branches = [
    { id: 'mlg', name: 'LJ Futsal Malang', address: 'Jl. Ikan Tombro 21, Malang, Jawa Timur', image: '/lapangan1.jpg', active: true },
    { id: 'sby', name: 'LJ Futsal Surabaya', address: 'Jl. Raya Darmo 10, Surabaya, Jawa Timur', image: '/lapangan2.jpg', active: true },
    { id: 'jkt', name: 'LJ Futsal Jakarta', address: 'Jl. Kemang Raya 15, Jakarta Selatan', image: '/lapangan3.jpg', active: true },
    { id: 'smg', name: 'LJ Futsal Semarang', address: 'Cabang Baru Segera Hadir', image: null, active: false }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full h-full overflow-y-auto custom-scrollbar"
    >
      <div className="p-6 pb-20 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <div className="mb-8 mt-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Map size={28} className="text-blue-600" />
            Lokasi Cabang
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium max-w-2xl">
            Temukan cabang LJ Futsal terdekat di kota Anda. Fasilitas lapangan futsal bertaraf nasional dengan material rumput sintetis premium.
          </p>
        </div>

        {/* Grid 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map(b => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              
              {/* Gambar / Banner */}
              <div className={`h-48 w-full flex items-center justify-center relative overflow-hidden ${!b.active ? 'bg-slate-200' : 'bg-slate-100'}`}>
                {b.active && b.image ? (
                  <Image src={b.image} alt={b.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <Map size={48} className="text-slate-400 opacity-50" />
                )}
                
                {b.active && b.image && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none z-10"></div>}
                
                {!b.active && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-sm z-20">
                    <span className="bg-slate-900 text-white font-black px-6 py-2 rounded-full text-xs tracking-widest uppercase">Coming Soon</span>
                  </div>
                )}
              </div>
              
              {/* Detail Lokasi */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`text-xl font-black mb-2 ${b.active ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-600'} transition-colors`}>{b.name}</h4>
                  <p className="text-sm text-slate-500 font-medium flex items-start gap-2">
                    <MapPin size={16} className={`shrink-0 mt-0.5 ${b.active ? 'text-blue-500' : 'text-slate-400'}`} /> 
                    {b.address}
                  </p>
                </div>
                
                {b.active && (
                  <button 
                    onClick={() => window.open('https://maps.google.com', '_blank', 'noopener,noreferrer')}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    <Navigation size={16} /> Buka di Maps
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}