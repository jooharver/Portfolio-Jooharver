import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ShieldCheck, CreditCard, CheckCircle2, CalendarDays, Clock, Map } from 'lucide-react';
import { useRentalStore } from '../rentalStore';

// Terima props onGoToRiwayat
export default function BookingView({ onGoToRiwayat }) {
  const [step, setStep] = useState(1);
  const containerRef = useRef(null); // KUNCI FIX: Ref untuk container yang di-scroll
  
  const months = [
    { id: 'sep', name: 'September', year: 2026, days: 30, blanks: 2 },
    { id: 'oct', name: 'Oktober', year: 2026, days: 31, blanks: 4 },
    { id: 'nov', name: 'November', year: 2026, days: 30, blanks: 0 },
    { id: 'dec', name: 'Desember', year: 2026, days: 31, blanks: 2 }
  ];

  const [bookingData, setBookingData] = useState({ branch: null, field: 'Lapangan 1', month: months[0], date: 1, sessions: [] });
  
  const branches = [
    { id: 'mlg', name: 'Malang', address: 'Jl. Ikan Tombro 21, Malang', image: '/lapangan1.jpg', active: true },
    { id: 'sby', name: 'Surabaya', address: 'Jl. Raya Darmo 10, Surabaya', image: '/lapangan2.jpg', active: true },
    { id: 'jkt', name: 'Jakarta', address: 'Jl. Kemang Raya 15, Jakarta', image: '/lapangan3.jpg', active: true },
    { id: 'smg', name: 'Semarang', address: 'Cabang Baru Segera Hadir', image: null, active: false }
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // KUNCI FIX: Fungsi untuk memaksa scroll ke atas secara instan
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex flex-col relative overflow-y-auto custom-scrollbar"
    >
      <AnimatePresence mode="wait">
        {step === 1 && <Step1Branch branches={branches} setBookingData={setBookingData} onNext={handleNext} onRender={scrollToTop} key="s1" />}
        {step === 2 && <Step2Detail data={bookingData} setData={setBookingData} months={months} onBack={handleBack} onNext={handleNext} onRender={scrollToTop} key="s2" />}
        {step === 3 && <Step3Invoice data={bookingData} onBack={handleBack} onNext={handleNext} onRender={scrollToTop} key="s3" />}
        {step === 4 && <Step4Payment data={bookingData} onBack={handleBack} onNext={handleNext} onRender={scrollToTop} key="s4" />}
        {step === 5 && (
          <Step5Success 
            onReset={() => { 
              setStep(1); 
              setBookingData({ branch: null, field: 'Lapangan 1', month: months[0], date: 1, sessions: [] }); 
            }} 
            onGoToRiwayat={onGoToRiwayat}
            onRender={scrollToTop}
            key="s5" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Step1Branch({ branches, setBookingData, onNext, onRender }) {
  useEffect(() => { onRender(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full p-6 pb-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 relative overflow-hidden shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Selamat Datang di LJ Futsal</h2>
          <p className="text-blue-100 relative z-10 max-w-lg text-sm">Pusat sewa lapangan futsal standar nasional. Silakan pilih cabang terdekat Anda untuk memulai reservasi.</p>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-6">Silahkan Pilih Cabang:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map(b => (
              <div 
                key={b.id} 
                onClick={() => { if(b.active) { setBookingData(prev => ({ ...prev, branch: b })); onNext(); } }} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 group ${b.active ? 'border-slate-200 hover:border-blue-500 hover:shadow-lg cursor-pointer' : 'border-slate-200 opacity-60 cursor-not-allowed grayscale'}`}
              >
                <div className={`h-32 w-full flex items-center justify-center relative overflow-hidden ${!b.active ? 'bg-slate-200' : 'bg-slate-100'}`}>
                  {b.active && b.image ? (
                    <Image src={b.image} alt={`Futsal ${b.name}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Map size={40} className="text-slate-400 opacity-50" />
                  )}
                  {b.active && b.image && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div>}
                  {!b.active && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px] z-20">
                      <span className="bg-slate-900 text-white font-bold px-4 py-2 rounded-full text-[10px] tracking-wider uppercase">Soon</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className={`font-bold text-base ${b.active ? 'text-slate-900' : 'text-slate-600'}`}>{b.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-start gap-1"><MapPin size={12} className="shrink-0 mt-0.5" /> {b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step2Detail({ data, setData, months, onBack, onNext, onRender }) {
  useEffect(() => { onRender(); }, []);

  const fields = ['Lapangan 1', 'Lapangan 2', 'Lapangan 3'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  
  const calendarBlanks = Array.from({length: data.month.blanks});
  const calendarDays = Array.from({length: data.month.days}, (_, i) => i + 1);

  const getBookedSlots = (branchId, field, date) => {
    const isEven = date % 2 === 0;
    if (branchId === 'mlg') {
      if (field === 'Lapangan 1') return isEven ? ['08:00', '16:00', '19:00', '20:00'] : ['10:00', '15:00', '16:00', '20:00'];
      if (field === 'Lapangan 2') return isEven ? ['09:00', '14:00', '15:00'] : ['07:00', '18:00', '19:00'];
      if (field === 'Lapangan 3') return isEven ? ['11:00', '20:00', '21:00'] : ['08:00', '16:00', '17:00'];
    }
    if (branchId === 'sby') {
      if (field === 'Lapangan 1') return isEven ? ['07:00', '10:00', '20:00'] : ['09:00', '14:00', '21:00'];
      if (field === 'Lapangan 2') return isEven ? ['12:00', '18:00', '19:00'] : ['13:00', '15:00', '16:00'];
      if (field === 'Lapangan 3') return isEven ? ['16:00', '17:00', '19:00'] : ['11:00', '12:00', '13:00'];
    }
    if (branchId === 'jkt') {
      if (field === 'Lapangan 1') return isEven ? ['19:00', '20:00', '21:00'] : ['07:00', '08:00', '09:00'];
      if (field === 'Lapangan 2') return isEven ? ['10:00', '11:00', '12:00'] : ['15:00', '16:00', '17:00'];
      if (field === 'Lapangan 3') return isEven ? ['13:00', '14:00', '15:00'] : ['18:00', '19:00', '20:00'];
    }
    return [];
  };

  const bookedSlots = getBookedSlots(data.branch?.id, data.field, data.date);

  const toggleSession = (time) => {
    if (bookedSlots.includes(time)) return;
    setData(prev => ({
      ...prev,
      sessions: prev.sessions.includes(time) ? prev.sessions.filter(t => t !== time) : [...prev.sessions, time]
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-6 space-y-8 pb-32">
        <div className="flex flex-col gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors w-fit">
            <ChevronLeft size={18} /> Kembali
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">LJ Futsal {data.branch?.name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={16} className="text-blue-500" /> {data.branch?.address}</p>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest"><Map size={18} className="text-blue-600"/> 1. Pilih Lapangan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fields.map(f => (
              <button 
                key={f} onClick={() => setData({...data, field: f, sessions: []})} 
                className={`p-5 rounded-2xl text-sm font-bold border transition-all ${data.field === f ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest"><CalendarDays size={18} className="text-blue-600"/> 2. Pilih Tanggal</h3>
            <select 
              value={data.month.id}
              onChange={(e) => {
                const selected = months.find(m => m.id === e.target.value);
                setData({...data, month: selected, date: 1, sessions: []});
              }}
              className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border-none outline-none cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {months.map(m => <option key={m.id} value={m.id}>{m.name} {m.year}</option>)}
            </select>
          </div>

          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarBlanks.map((_, i) => <div key={`blank-${i}`} className="p-2"></div>)}
              {calendarDays.map(d => (
                <button 
                  key={d} onClick={() => setData({...data, date: d, sessions: []})} 
                  className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${data.date === d ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest"><Clock size={18} className="text-blue-600"/> 3. Pilih Sesi Waktu</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">*1 Sesi = 1 Jam. Anda diperbolehkan memilih lebih dari 1 sesi.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-white border border-slate-300 rounded-md"></div> Tersedia</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-900 rounded-md"></div> Terisi</div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeSlots.map(time => {
              const isBooked = bookedSlots.includes(time);
              const isSelected = data.sessions.includes(time);
              return (
                <button 
                  key={time} onClick={() => toggleSession(time)}
                  className={`py-4 rounded-2xl text-xs font-black transition-all border ${
                    isBooked ? 'bg-slate-900 text-slate-600 cursor-not-allowed border-transparent' :
                    isSelected ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 border-transparent' : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimasi Durasi</p>
            <p className="text-xl font-black text-slate-900">{data.sessions.length} Jam / Sesi</p>
          </div>
          <button 
            disabled={data.sessions.length === 0} onClick={onNext}
            className={`flex-1 sm:max-w-xs py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${data.sessions.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            {data.sessions.length > 0 ? 'Lanjut Tagihan' : 'Pilih Sesi'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Step3Invoice({ data, onBack, onNext, onRender }) {
  useEffect(() => { onRender(); }, []);

  const total = data.sessions.length * 150000;
  const sortedSessions = [...data.sessions].sort();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full flex flex-col p-6 pb-20">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors mb-4 w-fit shrink-0">
          <ChevronLeft size={18} /> Kembali
        </button>

        <div className="text-center mb-6 shrink-0">
          <h2 className="text-3xl font-black text-slate-900">Rincian Tagihan</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Pastikan jadwal reservasi Anda sudah sesuai.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4 mb-6 shrink-0">
          {[
            { label: 'Nama Pemesan', value: 'Anonymous' },
            { label: 'Email', value: 'anonymous@gmail.com' },
            { label: 'Cabang', value: data.branch?.name },
            { label: 'Tanggal', value: `${data.date} ${data.month.name} ${data.month.year}` },
            { label: 'Lapangan', value: data.field },
            { label: 'Durasi', value: `${data.sessions.length} Jam` }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.label}</span>
              <span className="text-slate-900 font-bold">{item.value}</span>
            </div>
          ))}

          <div className="flex justify-between items-start border-b border-slate-50 pb-4">
            <span className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1 shrink-0">Waktu Sesi</span>
            <div className="flex flex-wrap justify-end gap-1.5 ml-4">
              {sortedSessions.map(s => (
                <span key={s} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">{s} WIB</span>
              ))}
            </div>
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <span className="text-slate-900 font-black text-base uppercase tracking-tight">Total Bayar</span>
            <span className="text-2xl font-black text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="mt-auto shrink-0 pt-4 pb-10">
          <button onClick={onNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 transition-all">
            Proses Pembayaran
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Step4Payment({ data, onBack, onNext, onRender }) {
  useEffect(() => { onRender(); }, []);

  const [loading, setLoading] = useState(false);
  const addBooking = useRentalStore(state => state.addBooking);
  const total = data.sessions.length * 150000;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const now = new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      const timeString = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      
      addBooking({
        id: `INV-LJ-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: "Anonymous",
        customerEmail: "anonymous@gmail.com",
        branch: data.branch?.name,
        address: data.branch?.address,
        date: `${data.date} ${data.month.name} ${data.month.year}`,
        field: data.field,
        sessions: [...data.sessions].sort(),
        total: total,
        paymentMethod: "Credit Card",
        status: "TERKONFIRMASI",
        timestamp: timeString
      });

      onNext(); 
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col p-6 pb-20">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors mb-2 w-fit">
          <ChevronLeft size={18} /> Kembali
        </button>

        <div className="text-center mb-6 mt-2 shrink-0">
          <div className="flex justify-center items-center gap-2 mb-1">
            <ShieldCheck size={28} className="text-blue-600" />
            <span className="font-bold text-slate-900 text-2xl tracking-tighter">midtrans</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sandbox Environment</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center mb-5 shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tagihan Reservasi</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">Rp {total.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-sm space-y-1 mb-6 shrink-0">
          {[
            { icon: 'BCA', label: 'BCA Virtual Account', color: 'blue' },
            { icon: 'GPY', label: 'GoPay / QRIS', color: 'emerald' },
            { icon: <CreditCard size={20}/>, label: 'Credit Card', color: 'blue', selected: true }
          ].map((method, idx) => (
            <div key={idx} className={`p-3 flex items-center gap-4 rounded-2xl border transition-all cursor-pointer ${method.selected ? 'bg-blue-50/50 border-blue-500 text-blue-700' : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'}`}>
              <div className={`w-12 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${method.selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{method.icon}</div>
              <span className="text-xs font-bold">{method.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto shrink-0 pt-4 pb-10">
          <button onClick={handlePay} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex justify-center items-center gap-3">
            {loading ? <span className="animate-pulse">Mengautentikasi...</span> : 'Konfirmasi & Bayar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Step5Success({ onReset, onGoToRiwayat, onRender }) {
  useEffect(() => { onRender(); }, []);

  const handleFinish = () => {
    onReset();
    if (onGoToRiwayat) onGoToRiwayat();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center justify-center p-6 pb-20 pt-20">
      <div className="max-w-md mx-auto w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={64} className="text-emerald-500" />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Sukses!</h2>
        <p className="text-base text-slate-500 mb-10 font-medium">Reservasi Anda telah terdaftar. Detail booking dapat dilihat di menu Riwayat.</p>
        
        <button onClick={handleFinish} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all">
          Selesai
        </button>
      </div>
    </motion.div>
  );
}