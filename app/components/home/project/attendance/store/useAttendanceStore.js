import { create } from 'zustand';

// Helper format tanggal lengkap dengan Hari
export const formatFullDate = (date) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Generate 14 riwayat absensi terakhir (Mundur dari kemarin)
const generateHistory = () => {
  const history = [];
  const d = new Date();
  let count = 0;
  
  d.setDate(d.getDate() - 1); // Mulai dari kemarin

  while (count < 14) {
    if (d.getDay() !== 0 && d.getDay() !== 6) { // Lewati Sabtu & Minggu
      
      let status = 'Tepat Waktu';
      let timeIn = '07:50';
      let timeOut = '17:05';

      if (count === 0) {
        status = 'Tepat Waktu';
        timeIn = '07:55';
        timeOut = '17:15';
      } else if (count === 1) {
        status = 'Terlambat';
        timeIn = '08:25'; 
        timeOut = '17:05';
      } else if (count === 2) {
        status = 'Pulang Awal';
        timeIn = '07:45';
        timeOut = '15:30'; 
      } else {
        const isLate = Math.random() > 0.8; 
        status = isLate ? 'Terlambat' : 'Tepat Waktu';
        timeIn = isLate ? '08:15' : '07:50';
        timeOut = '17:05';
      }

      history.push({
        id: d.getTime() + count,
        date: formatFullDate(new Date(d)),
        in: timeIn,
        out: timeOut,
        status: status
      });
      
      count++;
    }
    d.setDate(d.getDate() - 1);
  }
  return history;
};

// Data Dummy Riwayat Cuti/Sakit Awal (Ditambah lampiran)
const initialLeaves = [
  { 
    id: 1, 
    type: 'Sakit',
    startDate: '12 Ags 2026', 
    endDate: '14 Ags 2026', 
    reason: 'Demam Berdarah', 
    detail: 'Berdasarkan hasil lab klinik, diwajibkan istirahat total selama 3 hari pemulihan. Surat dokter terlampir.', 
    status: 'Disetujui',
    attachment: '/surat-sakit.jpg'
  },
  { 
    id: 2, 
    type: 'Cuti',
    startDate: '05 Jul 2026', 
    endDate: '05 Jul 2026', 
    reason: 'Acara Keluarga', 
    detail: 'Meminta izin cuti 1 hari untuk menghadiri acara pernikahan saudara kandung di Yogyakarta.', 
    status: 'Disetujui',
    attachment: '/surat-cuti.jpg'
  },
];

export const useAttendanceStore = create((set) => ({
  history: generateHistory(),
  leaves: initialLeaves,
  
  checkIn: (record) => set((state) => ({ 
    history: [record, ...state.history] 
  })),
  
  checkOut: (id, outTime, newStatus) => set((state) => ({
    history: state.history.map(item => 
      item.id === id ? { ...item, out: outTime, status: newStatus } : item
    )
  })),

  addLeave: (leaveRecord) => set((state) => ({
    leaves: [leaveRecord, ...state.leaves]
  }))
}));