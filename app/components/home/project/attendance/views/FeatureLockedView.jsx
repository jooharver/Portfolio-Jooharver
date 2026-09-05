import { ArrowLeft, Lock } from 'lucide-react';

export default function FeatureLockedView({ title, setActiveTab }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pb-4 border-b border-zinc-800/50 flex items-center justify-between">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 -ml-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-[-10%]">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <Lock size={32} className="text-blue-400" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Fitur {title} Terkunci</h3>
        <p className="text-zinc-400 text-xs leading-relaxed max-w-[250px] mx-auto">
          Layanan manajemen <strong>{title}</strong> membutuhkan integrasi langsung dengan server backend. Fitur ini dinonaktifkan pada mode Live Demo.
        </p>
      </div>
    </div>
  );
}