import { useState, useEffect, useRef } from 'react';
import { ScanFace, MapPin, CameraOff, AlertTriangle } from 'lucide-react';
import { useAttendanceStore, formatFullDate } from '../store/useAttendanceStore';

export default function CameraView({ setActiveTab, showToast }) {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const history = useAttendanceStore((state) => state.history);
  const checkIn = useAttendanceStore((state) => state.checkIn);
  const checkOut = useAttendanceStore((state) => state.checkOut);

  const todayString = formatFullDate(new Date());
  const todaysRecord = history.find(h => h.date === todayString);

  let btnText = "Absen Masuk";
  let checkState = 'IN'; 
  let btnColor = "from-blue-600 to-emerald-500"; 
  
  if (todaysRecord) {
    if (todaysRecord.out === '-') {
      btnText = "Absen Keluar";
      checkState = 'OUT';
      btnColor = "from-amber-500 to-orange-500";
    } else {
      btnText = "Absensi Selesai";
      checkState = 'DONE';
      btnColor = "from-zinc-700 to-zinc-800";
    }
  }

  useEffect(() => {
    let activeStream = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        activeStream = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setHasPermission(false));
    return () => activeStream && activeStream.getTracks().forEach(track => track.stop());
  }, []);

  const handlePreScan = () => {
    const now = new Date();
    if (checkState === 'OUT' && now.getHours() < 17) {
      setShowConfirmModal(true);
    } else {
      executeScan();
    }
  };

  const executeScan = () => {
    setShowConfirmModal(false);
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      const now = new Date();
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (checkState === 'IN') {
        const isLate = now.getHours() >= 8;
        checkIn({
          id: Date.now(),
          date: todayString,
          in: timeString,
          out: '-',
          status: isLate ? 'Terlambat' : 'Tepat Waktu'
        });
        showToast(isLate ? "Absen Masuk Tercatat (Terlambat)" : "Absen Masuk Berhasil!");
      
      } else if (checkState === 'OUT') {
        const isEarlyOut = now.getHours() < 17;
        let finalStatus = todaysRecord.status;
        
        if (isEarlyOut) {
          finalStatus = finalStatus === 'Terlambat' ? 'Terlambat & Pulang Awal' : 'Pulang Awal';
        }
        
        checkOut(todaysRecord.id, timeString, finalStatus);
        showToast(isEarlyOut ? "Absen Keluar (Pulang Awal Tercatat)" : "Absen Keluar Berhasil!");
      }
      
      setActiveTab('history');
    }, 2500); 
  };

  return (
    <div className="px-6 h-full flex flex-col justify-center pb-8 pt-4 relative">
      
      <style>{`
        @keyframes yoyoScan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: calc(100% - 4px); }
          90% { opacity: 1; }
          100% { top: 0%; opacity: 0; }
        }
      `}</style>

      {showConfirmModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 rounded-[2.5rem]">
          <div className="bg-zinc-900 border border-amber-500/30 p-6 rounded-3xl w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-amber-500 w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Pulang Lebih Awal?</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Saat ini belum pukul 17:00. Melakukan absensi keluar sekarang akan tercatat sebagai pelanggaran <strong>"Pulang Awal"</strong>. Anda yakin?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors">Batal</button>
              <button onClick={executeScan} className="flex-1 bg-amber-600 text-white py-3 rounded-xl text-sm font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-colors">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & DESKRIPSI: Truncate dihapus agar bisa wrap 2 baris */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Verifikasi Wajah</h2>
        <p className="text-[11px] text-zinc-400 px-4 leading-relaxed">
          Posisikan wajah di bingkai (Demo: Wajah Anda aman & tidak disimpan)
        </p>
      </div>

      <div className="relative w-full max-w-[260px] mx-auto aspect-square bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden flex items-center justify-center shadow-2xl">
        {hasPermission ? (
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-50' : 'opacity-100'}`} />
        ) : (
          <div className="flex flex-col items-center text-zinc-600 gap-2"><CameraOff size={40} /><span className="text-xs">Kamera Ditolak</span></div>
        )}
        
        <div className={`absolute inset-6 border-2 border-dashed rounded-[1.5rem] transition-colors duration-300 ${isScanning ? 'border-emerald-400' : 'border-emerald-500/30'}`} />
        
        {isScanning && (
          <div 
            className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,1)] z-10" 
            style={{ animation: 'yoyoScan 1.5s ease-in-out infinite' }}
          />
        )}
        
        {!hasPermission && <ScanFace size={70} className="absolute text-zinc-700" strokeWidth={1} />}
      </div>

      <div className="mt-5 max-w-[260px] mx-auto w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-center gap-2">
        <MapPin size={16} className="text-emerald-400" />
        <span className="text-emerald-400 text-xs font-semibold">Lokasi Valid (Radius 12m)</span>
      </div>

      <div className="mt-5 flex justify-center">
        <button 
          onClick={handlePreScan}
          disabled={!hasPermission || isScanning || checkState === 'DONE'}
          className={`flex items-center gap-2 bg-gradient-to-r ${btnColor} px-8 py-4 rounded-full text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100`}
        >
          {isScanning ? <span className="animate-pulse">Memindai...</span> : <><ScanFace size={20} /> {btnText}</>}
        </button>
      </div>

    </div>
  );
}