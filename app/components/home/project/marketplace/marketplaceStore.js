import { create } from 'zustand';

const getRelativeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getRelativeDateTime = (daysAgo, timeString) => {
  return `${getRelativeDate(daysAgo)}, ${timeString} WIB`;
};

const baseProducts = [
  // Pria
  { id: 'PRD-001', name: "Kemeja Casual Pria 'Urban'", category: "Pria", price: 185000, stock: 45, image: '/produk1.jpg', views: 120, likes: 45, cartAdds: 12, sales: 5 },
  { id: 'PRD-002', name: "Kaos Basic Premium 'Aero'", category: "Pria", price: 95000, stock: 120, image: '/produk2.jpg', views: 340, likes: 89, cartAdds: 34, sales: 20 },
  { id: 'PRD-003', name: "Sweater Reguler 'Vanguard'", category: "Pria", price: 210000, stock: 30, image: '/produk3.jpg', views: 80, likes: 20, cartAdds: 5, sales: 2 },
  { id: 'PRD-004', name: "Kemeja Basic 'Rusty'", category: "Pria", price: 350000, stock: 15, image: '/produk4.jpg', views: 500, likes: 150, cartAdds: 40, sales: 18 },
  { id: 'PRD-005', name: "Kemeja Flanel Lengan Pendek", category: "Pria", price: 165000, stock: 60, image: '/produk5.jpg', views: 110, likes: 30, cartAdds: 10, sales: 4 },
  { id: 'PRD-006', name: "Jaket Kulit Bomber", category: "Pria", price: 225000, stock: 25, image: '/produk6.jpg', views: 210, likes: 75, cartAdds: 22, sales: 8 },
  { id: 'PRD-007', name: "Jaket Pria 'Breeze'", category: "Pria", price: 120000, stock: 80, image: '/produk7.jpg', views: 150, likes: 40, cartAdds: 15, sales: 7 },
  { id: 'PRD-008', name: "Celana Cargo Pria", category: "Pria", price: 450000, stock: 10, image: '/produk8.jpg', views: 420, likes: 110, cartAdds: 25, sales: 5 },
  { id: 'PRD-009', name: "Celana Jeans Heavyweight", category: "Pria", price: 115000, stock: 90, image: '/produk9.jpg', views: 280, likes: 65, cartAdds: 18, sales: 12 },
  { id: 'PRD-010', name: "Celana Chinos Pria Modern", category: "Pria", price: 145000, stock: 35, image: '/produk10.jpg', views: 90, likes: 25, cartAdds: 8, sales: 3 },
  // Wanita
  { id: 'PRD-011', name: "Kemeja Biru 'Lumiere'", category: "Wanita", price: 215000, stock: 40, image: '/produk11.jpg', views: 320, likes: 140, cartAdds: 35, sales: 15 },
  { id: 'PRD-012', name: "Kemeja Blouse", category: "Wanita", price: 285000, stock: 20, image: '/produk12.jpg', views: 450, likes: 210, cartAdds: 45, sales: 22 },
  { id: 'PRD-013', name: "Kemeja Slim Fit Premium", category: "Wanita", price: 135000, stock: 85, image: '/produk13.jpg', views: 180, likes: 60, cartAdds: 20, sales: 10 },
  { id: 'PRD-014', name: "Kemeja Kantor Wanita Halus", category: "Wanita", price: 175000, stock: 50, image: '/produk14.jpg', views: 240, likes: 85, cartAdds: 28, sales: 14 },
  { id: 'PRD-015', name: "Kemeja SlimFit Wanita", category: "Wanita", price: 195000, stock: 30, image: '/produk15.jpg', views: 160, likes: 55, cartAdds: 15, sales: 6 },
  { id: 'PRD-016', name: "Atasan Longgar Wanita", category: "Wanita", price: 155000, stock: 65, image: '/produk16.jpg', views: 290, likes: 95, cartAdds: 30, sales: 18 },
  { id: 'PRD-017', name: "Rok Panjang Modern Motif", category: "Wanita", price: 220000, stock: 25, image: '/produk17.jpg', views: 130, likes: 45, cartAdds: 12, sales: 5 },
  { id: 'PRD-018', name: "Rok Panjang Wanita Kekinian", category: "Wanita", price: 265000, stock: 15, image: '/produk18.jpg', views: 380, likes: 160, cartAdds: 42, sales: 16 },
  { id: 'PRD-019', name: "Kaos Kantor Hitam Pendek", category: "Wanita", price: 85000, stock: 110, image: '/produk19.jpg', views: 210, likes: 70, cartAdds: 25, sales: 12 },
  { id: 'PRD-020', name: "Mini Skirt Premium", category: "Wanita", price: 550000, stock: 8, image: '/produk20.jpg', views: 600, likes: 250, cartAdds: 50, sales: 9 },
  // Sepatu
  { id: 'PRD-021', name: "Sneakers Kasual Pria 'Dash'", category: "Sepatu", price: 450000, stock: 25, image: '/produk21.jpg', views: 410, likes: 120, cartAdds: 35, sales: 12 },
  { id: 'PRD-022', name: "Sepatu Kasual Putih Strip Hitam", category: "Sepatu", price: 650000, stock: 12, image: '/produk22.jpg', views: 220, likes: 65, cartAdds: 15, sales: 6 },
  { id: 'PRD-023', name: "Sepatu Pantofel Dr.Brokklin", category: "Sepatu", price: 550000, stock: 30, image: '/produk23.jpg', views: 350, likes: 95, cartAdds: 28, sales: 14 },
  { id: 'PRD-024', name: "Sepatu Pantofel Tanpa Tali Pria", category: "Sepatu", price: 380000, stock: 18, image: '/produk24.jpg', views: 180, likes: 50, cartAdds: 12, sales: 4 },
  { id: 'PRD-025', name: "Sepatu Gunung Tinggi High Quality", category: "Sepatu", price: 210000, stock: 45, image: '/produk25.jpg', views: 290, likes: 110, cartAdds: 30, sales: 16 },
  { id: 'PRD-026', name: "HighHeels Hitam Premium", category: "Sepatu", price: 420000, stock: 15, image: '/produk26.jpg', views: 340, likes: 140, cartAdds: 25, sales: 8 },
  { id: 'PRD-027', name: "Heels Wanita 3cm Putih", category: "Sepatu", price: 250000, stock: 55, image: '/produk27.jpg', views: 150, likes: 45, cartAdds: 18, sales: 9 },
  { id: 'PRD-028', name: "HighHeels Maroon Premium", category: "Sepatu", price: 185000, stock: 80, image: '/produk28.jpg', views: 480, likes: 165, cartAdds: 45, sales: 25 },
  { id: 'PRD-029', name: "Sandal Wanita Premium", category: "Sepatu", price: 320000, stock: 22, image: '/produk29.jpg', views: 370, likes: 155, cartAdds: 38, sales: 15 },
  { id: 'PRD-030', name: "High Heels Premium Fashion", category: "Sepatu", price: 490000, stock: 10, image: '/produk30.jpg', views: 520, likes: 190, cartAdds: 42, sales: 18 },
  // Aksesoris
  { id: 'PRD-031', name: "Gelang Rantai Pria Titanium", category: "Aksesoris", price: 350000, stock: 15, image: '/produk31.jpg', views: 260, likes: 85, cartAdds: 20, sales: 7 },
  { id: 'PRD-032', name: "Jam Tangan Pria BOLEX", category: "Aksesoris", price: 150000, stock: 40, image: '/produk32.jpg', views: 140, likes: 35, cartAdds: 10, sales: 5 },
  { id: 'PRD-033', name: "Kacamata Hitam Unisex", category: "Aksesoris", price: 85000, stock: 100, image: '/produk33.jpg', views: 310, likes: 95, cartAdds: 35, sales: 22 },
  { id: 'PRD-034', name: "Topi New York Unisex", category: "Aksesoris", price: 195000, stock: 30, image: '/produk34.jpg', views: 210, likes: 70, cartAdds: 18, sales: 8 },
  { id: 'PRD-035', name: "Topi Brooklyn Unisex", category: "Aksesoris", price: 125000, stock: 60, image: '/produk35.jpg', views: 180, likes: 80, cartAdds: 25, sales: 12 },
  { id: 'PRD-036', name: "Tas Elegan Wanita", category: "Aksesoris", price: 95000, stock: 75, image: '/produk36.jpg', views: 120, likes: 45, cartAdds: 15, sales: 6 },
  { id: 'PRD-037', name: "Syal Wanita Lupyo", category: "Aksesoris", price: 175000, stock: 25, image: '/produk37.jpg', views: 340, likes: 110, cartAdds: 28, sales: 14 },
  { id: 'PRD-038', name: "Jam Tangan Sporty Wanita", category: "Aksesoris", price: 225000, stock: 35, image: '/produk38.jpg', views: 290, likes: 90, cartAdds: 24, sales: 11 },
  { id: 'PRD-039', name: "Gelang Motif Bunga Wanita", category: "Aksesoris", price: 110000, stock: 45, image: '/produk39.jpg', views: 150, likes: 55, cartAdds: 12, sales: 4 },
  { id: 'PRD-040', name: "Anting Motif Bunga Wanita", category: "Aksesoris", price: 285000, stock: 20, image: '/produk40.jpg', views: 420, likes: 160, cartAdds: 40, sales: 19 },
];

const hydratedProducts = baseProducts.map(p => ({
  ...p,
  origin: p.category === 'Pria' ? 'Kota Malang' : 'Kota Jakarta Selatan',
  material: p.category === 'Sepatu' ? 'Premium Faux Leather & Rubber' : p.category === 'Aksesoris' ? 'Stainless Steel & Canvas' : '100% Cotton Organic Premium',
  description: `Koleksi esensial ${p.name} yang dirancang khusus untuk kenyamanan dan gaya maksimal. Dibuat dengan presisi menggunakan material premium, memastikan sirkulasi udara yang baik dan durabilitas tinggi untuk penggunaan jangka panjang.\n\nDetail Spesifikasi:\n• Kategori: Fashion ${p.category}\n• Material: Bahan ramah lingkungan yang lembut di kulit\n• Kondisi: 100% Baru (Quality Control Passed)\n• Pengiriman: Dilengkapi kemasan eco-friendly yang aman.\n\nCara Perawatan:\nCuci perlahan dengan air bersuhu ruangan. Hindari penggunaan pemutih dan setrika pada suhu rendah agar tekstur bahan tetap terjaga.`
}));

export const useMarketplaceStore = create((set, get) => ({
  currentUser: { name: 'Anonymous', role: 'Seller', shopName: 'Nexus Fashion Official' },
  
  clientView: 'home', 
  selectedProduct: null,
  selectedOrder: null, 
  
  // STATE FILTER PENCARIAN & KATEGORI (DIPISAH)
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeCategory: 'Semua',
  setActiveCategory: (cat) => set({ activeCategory: cat }),

  setClientView: (view, payload = null) => set((state) => {
    if (view === 'detail') return { clientView: view, selectedProduct: payload };
    if (view === 'orderDetail') return { clientView: view, selectedOrder: payload };
    if (view === 'home') return { clientView: view }; // Jangan reset filter jika hanya kembali ke home
    return { clientView: view, searchQuery: '' };
  }),

  cart: [],
  wishlist: [],
  products: hydratedProducts,

  myOrders: [
    { 
      id: `INV-${Date.now().toString().slice(-6)}-001`, 
      date: getRelativeDateTime(1, '14:30'), 
      paymentTime: getRelativeDateTime(1, '14:35'),
      estimatedArrival: getRelativeDate(-1), 
      status: 'Selesai', 
      item: hydratedProducts[0], 
      qty: 1, 
      total: 185000 + 15000,
      shipping: { name: 'Anonymous', address: 'Malang', payment: 'QRIS' }
    }
  ],

  addToCart: (product, qty = 1) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, qty: Math.min(product.stock, item.qty + qty) } : item) };
    }
    return { cart: [...state.cart, { ...product, qty, selected: true }] };
  }),

  updateCartQty: (id, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.qty + delta));
        return { ...item, qty: newQty };
      }
      return item;
    })
  })),

  toggleCartSelection: (id) => set((state) => ({
    cart: state.cart.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
  })),

  removeCartItem: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  processCheckout: (shippingDetails) => set((state) => {
    const selectedItems = state.cart.filter(i => i.selected);
    const unselectedItems = state.cart.filter(i => !i.selected);
    
    const updatedProducts = state.products.map(p => {
      const cartItem = selectedItems.find(i => i.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty, sales: p.sales + cartItem.qty } : p;
    });

    const now = new Date();
    const orderTime = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    
    const estDate = new Date(now);
    estDate.setDate(estDate.getDate() + 2);
    const estimatedArrival = estDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newOrders = selectedItems.map(item => ({
      id: `INV-${Date.now().toString().slice(-6)}-${item.id.slice(-3)}`,
      date: orderTime,
      paymentTime: orderTime,
      estimatedArrival: estimatedArrival,
      status: 'Dikemas',
      item: item,
      qty: item.qty,
      total: (item.qty * item.price) + 15000, 
      shipping: shippingDetails
    }));

    return { 
      cart: unselectedItems, 
      products: updatedProducts, 
      myOrders: [...newOrders, ...state.myOrders],
      clientView: 'success'
    };
  }),
  
  toggleWishlist: (productId) => set((state) => ({
    wishlist: state.wishlist.includes(productId) ? state.wishlist.filter(id => id !== productId) : [...state.wishlist, productId]
  })),
}));