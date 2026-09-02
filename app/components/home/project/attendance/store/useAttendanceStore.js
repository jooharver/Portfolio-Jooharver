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

      // 1. Rekayasa Data 3 Hari Terakhir agar bervariasi
      if (count === 0) {
        // 1 hari kerja lalu: Tepat Waktu (Hijau)
        status = 'Tepat Waktu';
        timeIn = '07:55';
        timeOut = '17:15';
      } else if (count === 1) {
        // 2 hari kerja lalu: Terlambat (Merah)
        status = 'Terlambat';
        timeIn = '08:25'; // Telat
        timeOut = '17:05';
      } else if (count === 2) {
        // 3 hari kerja lalu: Pulang Awal (Orange)
        status = 'Pulang Awal';
        timeIn = '07:45';
        timeOut = '15:30'; // Pulang jam setengah 4 sore
      } else {
        // 2. Sisanya (Acak 20% Terlambat)
        const isLate = Math.random() > 0.8; 
        status = isLate ? 'Terlambat' : 'Tepat Waktu';
        timeIn = isLate ? '08:15' : '07:50';
        timeOut = '17:05';
      }

      history.push({
        id: d.getTime(),
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

export const useAttendanceStore = create((set) => ({
  history: generateHistory(),
  
  checkIn: (record) => set((state) => ({ 
    history: [record, ...state.history] 
  })),
  
  checkOut: (id, outTime, newStatus) => set((state) => ({
    history: state.history.map(item => 
      item.id === id ? { ...item, out: outTime, status: newStatus } : item
    )
  }))
}));