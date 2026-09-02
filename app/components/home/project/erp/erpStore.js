import { create } from 'zustand';

// FUNGSI HELPER: Mendapatkan tanggal relatif dari hari ini
const getRelativeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const useErpStore = create((set) => ({
  currentUser: { 
    name: 'Eka Krisna F.', 
    role: 'Manager Regional Malang', 
    branchId: 'BRN-01', 
    authorizedLocations: ['Cabang Utama Malang', 'Gudang Malang']
  },

  items: [
    { id: 'ITM-001', name: 'Beras Premium 5kg', category: 'Sembako', stock: 1250, price: 75000 },
    { id: 'ITM-002', name: 'Minyak Goreng 2L', category: 'Sembako', stock: 840, price: 34000 },
    { id: 'ITM-003', name: 'Gula Pasir 1kg', category: 'Sembako', stock: 2100, price: 16500 },
    { id: 'ITM-004', name: 'Susu UHT Full Cream 1L', category: 'Dairy', stock: 420, price: 18500 },
    { id: 'ITM-005', name: 'Yogurt Botol 250ml', category: 'Dairy', stock: 150, price: 8500 },
    { id: 'ITM-006', name: 'Wortel Organik 1kg', category: 'Sayuran', stock: 85, price: 22000 },
    { id: 'ITM-007', name: 'Brokoli Hijau 500g', category: 'Sayuran', stock: 60, price: 15000 },
    { id: 'ITM-008', name: 'Daging Sapi Slice 500g', category: 'Daging', stock: 200, price: 65000 },
    { id: 'ITM-009', name: 'Ayam Broiler Utuh 1kg', category: 'Daging', stock: 350, price: 38000 },
    { id: 'ITM-010', name: 'Kantong Belanja Reusable', category: 'Packaging', stock: 5000, price: 4500 },
  ],
  
  vendors: [
    { id: 'VND-001', name: 'PT Surya Pangan (Sidoarjo)', type: 'Distributor Sembako', rating: 4.9 },
    { id: 'VND-002', name: 'PT Dairy Indo (Pasuruan)', type: 'Pabrik Minuman & Susu', rating: 4.7 },
    { id: 'VND-003', name: 'CV Tani Sayur (Batu)', type: 'Pemasok Sayuran', rating: 4.5 },
    { id: 'VND-004', name: 'PT Daging Jaya (Mojokerto)', type: 'Pemasok Daging', rating: 4.8 },
    { id: 'VND-005', name: 'Pabrik Kemasan (Gresik)', type: 'Vendor Kemasan', rating: 4.3 },
  ],
  
  branches: [
    { id: 'BRN-01', name: 'Cabang Utama Malang', type: 'Supermarket Store', address: 'Jl. Soekarno Hatta, Malang' },
    { id: 'BRN-02', name: 'Gudang Malang', type: 'Distribution Center', address: 'Kawasan Industri Singosari, Malang' },
    { id: 'BRN-03', name: 'Cabang Utama Surabaya', type: 'Supermarket Store', address: 'Jl. Pemuda, Surabaya' },
    { id: 'BRN-04', name: 'Gudang Surabaya', type: 'Distribution Center', address: 'Jl. Rungkut Industri, Surabaya' },
    { id: 'BRN-05', name: 'Cabang Utama Pasuruan', type: 'Supermarket Store', address: 'Jl. Panglima Sudirman, Pasuruan' },
    { id: 'BRN-06', name: 'Gudang Pasuruan', type: 'Distribution Center', address: 'Kawasan PIER, Pasuruan' },
    { id: 'BRN-07', name: 'Cabang Utama Mojokerto', type: 'Supermarket Store', address: 'Jl. Gajah Mada, Mojokerto' },
    { id: 'BRN-08', name: 'Gudang Mojokerto', type: 'Distribution Center', address: 'Ngoro Industrial Park, Mojokerto' },
  ],

  // MENGGUNAKAN TANGGAL SEMI-DINAMIS
  orders: [
    {
      id: 'PO-2609-001', itemId: 'ITM-008', vendorId: 'VND-004', branchId: 'BRN-01', qty: 50, status: 'IN_TRANSIT', date: getRelativeDate(0),
      tracking: [
        { id: 1, location: 'PT Daging Jaya (Mojokerto)', status: 'Diproses', desc: 'Daging disiapkan di cold storage.', time: '05:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Cabang Utama Malang.', time: '06:30 WIB', type: 'process' },
        { id: 3, location: 'Cabang Utama Malang', status: 'Menunggu Kedatangan', desc: 'Estimasi tiba pukul 09:00 WIB.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-002', itemId: 'ITM-001', vendorId: 'VND-001', branchId: 'BRN-02', qty: 1000, status: 'DELIVERED', date: getRelativeDate(5),
      tracking: [
        { id: 1, location: 'PT Surya Pangan (Sidoarjo)', status: 'Diproses', desc: 'Beras dimuat ke kontainer.', time: '08:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Gudang Malang.', time: '10:30 WIB', type: 'success' },
        { id: 3, location: 'Gudang Malang', status: 'Diterima', desc: 'Barang masuk ke rak A1.', time: '14:15 WIB', type: 'success' },
      ]
    },
    {
      id: 'PO-2609-003', itemId: 'ITM-006', vendorId: 'VND-003', branchId: 'BRN-03', qty: 200, status: 'IN_TRANSIT', date: getRelativeDate(0),
      tracking: [
        { id: 1, location: 'CV Tani Sayur (Batu)', status: 'Diproses', desc: 'Sayur dipanen dan dikemas.', time: '04:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Menuju Gudang Transit Malang.', time: '06:00 WIB', type: 'process' },
        { id: 3, location: 'Gudang Malang', status: 'Menunggu Transit', desc: 'Truk akan melakukan oper muatan (Cross-docking).', time: 'Pending', type: 'pending' },
        { id: 4, location: 'Cabang Utama Surabaya', status: 'Menunggu Kedatangan', desc: 'Tujuan akhir toko.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-004', itemId: 'ITM-010', vendorId: 'VND-005', branchId: 'BRN-04', qty: 5000, status: 'IN_TRANSIT', date: getRelativeDate(1),
      tracking: [
        { id: 1, location: 'Pabrik Kemasan (Gresik)', status: 'Diproses', desc: 'Kantong dicetak.', time: '09:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Gudang Surabaya.', time: '10:30 WIB', type: 'process' },
        { id: 3, location: 'Gudang Surabaya', status: 'Menunggu Kedatangan', desc: 'Truk dalam perjalanan.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-005', itemId: 'ITM-004', vendorId: 'VND-002', branchId: 'BRN-05', qty: 300, status: 'DELIVERED', date: getRelativeDate(3),
      tracking: [
        { id: 1, location: 'PT Dairy Indo (Pasuruan)', status: 'Diproses', desc: 'Susu dimuat di pabrik Kejayan.', time: '08:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Cabang Utama Pasuruan.', time: '10:00 WIB', type: 'success' },
        { id: 3, location: 'Cabang Utama Pasuruan', status: 'Diterima', desc: 'Susu masuk chiller toko.', time: '16:00 WIB', type: 'success' },
      ]
    },
    {
      id: 'PO-2609-006', itemId: 'ITM-002', vendorId: 'VND-001', branchId: 'BRN-06', qty: 800, status: 'IN_TRANSIT', date: getRelativeDate(0),
      tracking: [
        { id: 1, location: 'PT Surya Pangan (Sidoarjo)', status: 'Diproses', desc: 'Minyak dimuat.', time: '10:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Tertahan / Kendala', desc: 'Macet total akibat banjir. Rute melambat.', time: '12:00 WIB', type: 'warning' },
        { id: 3, location: 'Gudang Pasuruan', status: 'Menunggu Kedatangan', desc: 'Truk akan terlambat.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-007', itemId: 'ITM-009', vendorId: 'VND-004', branchId: 'BRN-07', qty: 150, status: 'IN_TRANSIT', date: getRelativeDate(0),
      tracking: [
        { id: 1, location: 'PT Daging Jaya (Mojokerto)', status: 'Diproses', desc: 'Ayam disiapkan di RPA Ngoro.', time: '07:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Cabang Utama Mojokerto.', time: '11:00 WIB', type: 'process' },
        { id: 3, location: 'Cabang Utama Mojokerto', status: 'Menunggu Kedatangan', desc: 'Tiba siang ini.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-008', itemId: 'ITM-003', vendorId: 'VND-001', branchId: 'BRN-08', qty: 2000, status: 'DELIVERED', date: getRelativeDate(6),
      tracking: [
        { id: 1, location: 'PT Surya Pangan (Sidoarjo)', status: 'Diproses', desc: 'Gula pasir disiapkan.', time: '08:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Gudang Mojokerto.', time: '10:00 WIB', type: 'success' },
        { id: 3, location: 'Gudang Mojokerto', status: 'Diterima', desc: 'Gula masuk rak B2 Gudang NIP.', time: '14:00 WIB', type: 'success' },
      ]
    },
    {
      id: 'PO-2609-009', itemId: 'ITM-005', vendorId: 'VND-002', branchId: 'BRN-03', qty: 100, status: 'IN_TRANSIT', date: getRelativeDate(1),
      tracking: [
        { id: 1, location: 'PT Dairy Indo (Pasuruan)', status: 'Diproses', desc: 'Yogurt dimuat.', time: '08:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Truk logistik menuju Cabang Utama Surabaya.', time: '09:00 WIB', type: 'process' },
        { id: 3, location: 'Cabang Utama Surabaya', status: 'Menunggu Kedatangan', desc: 'Truk menuju toko.', time: 'Pending', type: 'pending' },
      ]
    },
    {
      id: 'PO-2609-010', itemId: 'ITM-007', vendorId: 'VND-003', branchId: 'BRN-04', qty: 200, status: 'IN_TRANSIT', date: getRelativeDate(0),
      tracking: [
        { id: 1, location: 'CV Tani Sayur (Batu)', status: 'Diproses', desc: 'Packing brokoli.', time: '06:00 WIB', type: 'success' },
        { id: 2, location: 'Perjalanan (Ekspedisi)', status: 'Dikirim', desc: 'Menuju Gudang Transit Pasuruan.', time: '07:30 WIB', type: 'process' },
        { id: 3, location: 'Gudang Pasuruan', status: 'Menunggu Transit', desc: 'Transit sortir.', time: 'Pending', type: 'pending' },
        { id: 4, location: 'Gudang Surabaya', status: 'Menunggu Kedatangan', desc: 'Tujuan akhir.', time: 'Pending', type: 'pending' },
      ]
    }
  ],

  addEntity: (entityType, data) => set((state) => {
    const prefix = entityType === 'items' ? 'ITM' : entityType === 'vendors' ? 'VND' : 'BRN';
    const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
    return { [entityType]: [{ ...data, id: newId }, ...state[entityType]] };
  }),
  updateEntity: (entityType, id, data) => set((state) => ({
    [entityType]: state[entityType].map(item => item.id === id ? { ...item, ...data } : item)
  })),
  deleteEntity: (entityType, id) => set((state) => ({
    [entityType]: state[entityType].filter(item => item.id !== id)
  })),
  adjustStock: (id, amount) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, stock: Math.max(0, item.stock + amount) } : item)
  })),
  addOrder: (newOrder) => set((state) => ({
    orders: [newOrder, ...state.orders]
  })),

  updateTrackingStatus: (orderId, newStatus, newDesc, newType) => set((state) => {
    return {
      orders: state.orders.map(order => {
        if (order.id !== orderId) return order;
        const updatedTracking = [...order.tracking];
        const lastNodeIndex = updatedTracking.length - 1;
        updatedTracking[lastNodeIndex] = {
          ...updatedTracking[lastNodeIndex],
          status: newStatus, desc: newDesc,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          type: newType
        };
        const isDelivered = newType === 'success' && newStatus === 'Diterima';
        return { ...order, tracking: updatedTracking, status: isDelivered ? 'DELIVERED' : order.status };
      })
    };
  }),

  approveTransit: (orderId, nodeId) => set((state) => {
    return {
      orders: state.orders.map(order => {
        if (order.id !== orderId) return order;

        const trackingList = [...order.tracking];
        const transitIndex = trackingList.findIndex(t => t.id === nodeId);

        if (transitIndex !== -1) {
          trackingList[transitIndex] = {
            ...trackingList[transitIndex],
            status: 'Transit Selesai',
            desc: 'Barang telah dicek dan diberangkatkan kembali.',
            type: 'success',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };

          const nextNode = trackingList[transitIndex + 1];
          const destinationName = nextNode ? nextNode.location : 'lokasi selanjutnya';

          const journeyNode = {
            id: Date.now(), 
            location: 'Perjalanan (Ekspedisi)',
            status: 'Dikirim',
            desc: `Truk logistik menuju ${destinationName}.`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            type: 'process'
          };

          trackingList.splice(transitIndex + 1, 0, journeyNode);
        }

        return { ...order, tracking: trackingList };
      })
    };
  }),

  rerouteOrder: (orderId, transitLocation, reason) => set((state) => {
    return {
      orders: state.orders.map(order => {
        if (order.id !== orderId) return order;
        const trackingList = [...order.tracking];
        
        const lastNode = trackingList.pop(); 
        
        if(trackingList.length > 0) {
           trackingList[trackingList.length - 1].type = 'warning';
           trackingList[trackingList.length - 1].desc += ` (Rute dialihkan. Catatan: ${reason})`;
        }
        
        trackingList.push({
          id: Date.now(), 
          location: transitLocation, 
          status: 'Menunggu Transit (Darurat)', 
          desc: `Pengalihan rute. Alasan: ${reason}`,
          time: 'Pending',
          type: 'pending'
        });
        
        trackingList.push(lastNode); 
        
        return { ...order, tracking: trackingList };
      })
    };
  })
}));