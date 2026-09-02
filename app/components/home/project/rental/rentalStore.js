import { create } from 'zustand';

// Fungsi untuk mendapatkan tanggal dinamis (H-X)
const getDynamicDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  
  return {
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    timestamp: `${d.getDate()} ${shortMonths[d.getMonth()]} ${d.getFullYear()}, 19:00 WIB`
  };
};

const past3Days = getDynamicDate(3);
const past10Days = getDynamicDate(10);

export const useRentalStore = create((set) => ({
  history: [
    {
      id: `INV-LJ-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: "Anonymous",
      customerEmail: "anonymous@gmail.com",
      branch: "Malang",
      address: "Jl. Ikan Tombro 21, Malang",
      date: past3Days.date,
      field: "Lapangan 1",
      sessions: ["19:00", "20:00"],
      total: 300000,
      paymentMethod: "Credit Card",
      status: "SELESAI", // Karena sudah lampau
      timestamp: past3Days.timestamp
    },
    {
      id: `INV-LJ-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: "Anonymous",
      customerEmail: "anonymous@gmail.com",
      branch: "Surabaya",
      address: "Jl. Raya Darmo 10, Surabaya",
      date: past10Days.date,
      field: "Lapangan 3",
      sessions: ["15:00", "16:00", "17:00"],
      total: 450000,
      paymentMethod: "GoPay",
      status: "SELESAI", // Karena sudah lampau
      timestamp: past10Days.timestamp
    }
  ],
  addBooking: (newBooking) => set((state) => ({ 
    history: [newBooking, ...state.history] 
  }))
}));