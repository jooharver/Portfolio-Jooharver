import { useState, useEffect, useRef } from 'react';
import { useMarketplaceStore } from '../marketplaceStore';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, Share2, Plus, Minus, ShoppingCart, Truck, ShieldCheck, Box, CheckCircle2, Trash2, Map, CreditCard, QrCode, Banknote, Store, ArrowRight, SearchX, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientView() {
  const { clientView } = useMarketplaceStore();

  if (clientView === 'detail') return <ProductDetail />;
  if (clientView === 'cart') return <CartView />;
  if (clientView === 'checkout') return <CheckoutView />;
  if (clientView === 'success') return <SuccessView />;
  if (clientView === 'orders') return <MyOrders />;
  if (clientView === 'orderDetail') return <OrderDetailView />;
  return <ClientHome />;
}

// 1. HOME & CAROUSEL =================================
function ClientHome() {
  const { products, toggleWishlist, wishlist, setClientView, searchQuery, activeCategory, setActiveCategory } = useMarketplaceStore();

  // FILTER PRODUK GABUNGAN (SEARCH BAR + KATEGORI)
  const filteredProducts = products.filter(p => {
    const matchSearch = searchQuery ? (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchCategory = activeCategory === 'Semua' ? true : p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const banners = [
    { id: 1, title: "NATURE'S THREAD.", desc: "Koleksi eksklusif bernuansa bumi. Temukan kedamaian dalam balutan warna organik dan material premium.", bg: "bg-[#1C2C24]", accent: "bg-[#4A7559]", textTitle: "text-[#F4F1EA]", textDesc: "text-[#C2BBAF]" }, 
    { id: 2, title: "URBAN ESSENTIALS.", desc: "Tampil stand-out setiap hari dengan gaya kasual modern untuk kaum urban yang aktif.", bg: "bg-[#9B7E5D]", accent: "bg-[#E8D3B3]", textTitle: "text-white", textDesc: "text-[#FCFAF2]" },
    { id: 3, title: "BLACK FRIDAY SALE.", desc: "Diskon terbesar tahun ini hingga 70% untuk semua koleksi. Waktu sangat terbatas!", bg: "bg-[#121212]", accent: "bg-[#6B6B6B]", textTitle: "text-[#F4F1EA]", textDesc: "text-[#C2BBAF]" } 
  ];

  // DATA KATEGORI (Menambahkan "Semua" di awal dengan icon)
  const categories = [
    { name: 'Semua', value: 'Semua', isIcon: true },
    { name: 'Pakaian Pria', value: 'Pria', image: '/produk6.jpg' },
    { name: 'Pakaian Wanita', value: 'Wanita', image: '/produk11.jpg' },
    { name: 'Sepatu', value: 'Sepatu', image: '/produk22.jpg' },
    { name: 'Aksesoris', value: 'Aksesoris', image: '/produk32.jpg' }
  ];
  
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (searchQuery) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [searchQuery, banners.length]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10 pb-24">
      
      {/* TAMPILKAN BANNER & KATEGORI HANYA JIKA TIDAK SEDANG KETIK DI SEARCH BAR */}
      {!searchQuery && (
        <>
          <div className="relative">
            <div className={`w-full h-48 md:h-80 ${banners[currentBanner].bg} transition-colors duration-700 rounded-2xl shadow-md flex flex-col justify-center px-8 md:px-16 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
              <div className={`absolute -right-10 -bottom-10 md:-right-20 md:-bottom-20 w-48 h-48 md:w-72 md:h-72 ${banners[currentBanner].accent} transition-colors duration-700 rounded-full blur-[60px] md:blur-[80px] opacity-90`}></div>
              
              <AnimatePresence mode="wait">
                <motion.div key={currentBanner} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="relative z-10 w-[85%] md:w-full">
                  <h2 className={`text-3xl md:text-5xl font-black mb-2 md:mb-3 tracking-tight ${banners[currentBanner].textTitle}`}>{banners[currentBanner].title}</h2>
                  <p className={`text-[11px] sm:text-sm md:text-base font-medium max-w-[220px] md:max-w-md leading-snug ${banners[currentBanner].textDesc}`}>{banners[currentBanner].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-sm hover:bg-white/40 transition-colors z-20">
              <ChevronRight size={20}/>
            </button>
            
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1.5 md:h-2 rounded-full transition-all ${currentBanner === i ? 'bg-white w-4' : 'bg-white/50 w-1.5 md:w-2'}`}></button>
              ))}
            </div>
          </div>

          {/* KATEGORI FILTER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EBEAE5]">
            <h3 className="text-[#1C2C24] font-bold text-sm uppercase tracking-widest mb-6">Jelajahi Kategori</h3>
            <div className="flex gap-4 md:gap-8 overflow-x-auto custom-scrollbar pb-2">
              {categories.map((cat, i) => {
                const isActive = activeCategory === cat.value;
                return (
                  <div key={i} onClick={() => setActiveCategory(cat.value)} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[80px]">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-all ${isActive ? 'border-[3px] border-[#1C2C24] shadow-md' : 'bg-[#F4F1EA] border border-[#EBEAE5] group-hover:border-[#9B7E5D] group-hover:shadow-md'}`}>
                      {cat.isIcon ? (
                        <LayoutGrid size={28} className={isActive ? 'text-[#1C2C24]' : 'text-[#5C6E63] group-hover:text-[#1C2C24]'} />
                      ) : (
                        <img src={cat.image} alt={cat.name} className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      )}
                    </div>
                    <span className={`text-xs font-bold text-center transition-colors ${isActive ? 'text-[#1C2C24]' : 'text-[#5C6E63] group-hover:text-[#1C2C24]'}`}>{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div>
        <div className="flex items-center justify-between mb-6 border-b border-[#EBEAE5] pb-4">
          <h3 className="text-xl font-bold text-[#1C2C24] uppercase tracking-tight">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : activeCategory !== 'Semua' ? `Kategori: ${activeCategory}` : 'Rekomendasi Terbaru'}
          </h3>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#9BA8A1]">
            <SearchX size={48} className="mb-4 text-[#EBEAE5]"/>
            <p className="text-lg font-bold text-[#5C6E63]">Produk tidak ditemukan</p>
            <p className="text-sm">Coba ubah filter kategori atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const isLiked = wishlist.includes(product.id);
              return (
                <div key={product.id} onClick={() => setClientView('detail', product)} className="bg-white rounded-2xl border border-[#EBEAE5] hover:shadow-lg transition-all duration-300 group relative flex flex-col overflow-hidden cursor-pointer">
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} className={isLiked ? "fill-[#C86B6B] text-[#C86B6B]" : "text-[#9BA8A1]"} />
                  </button>
                  <div className="w-full aspect-[4/5] bg-[#F7F6F2] relative overflow-hidden border-b border-[#F0EFEA]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" />
                    {product.sales > 15 && <div className="absolute top-2 left-2 bg-[#9B7E5D] text-white text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-widest rounded-sm z-10">Terlaris</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm font-bold text-[#35433C] line-clamp-2 leading-snug mb-3 min-h-[2.5rem] group-hover:text-[#1C2C24]">{product.name}</p>
                    <div className="mt-auto">
                      <p className="text-[#1C2C24] font-black text-lg">Rp {product.price.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-2 mt-3 text-[11px] text-[#78857E] font-bold">
                        <div className="flex items-center gap-1 text-[#CBA153]"><Star size={12} className="fill-[#CBA153] text-[#CBA153]" /> 4.9</div>
                        <span className="text-[#EBEAE5]">|</span><span>Terjual {product.sales}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. DETAIL PRODUK ========================
function ProductDetail() {
  const { selectedProduct: product, setClientView, addToCart, products, wishlist, toggleWishlist } = useMarketplaceStore();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    setQty(1);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [product?.id]);

  if (!product) return null;
  const recommendations = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
  
  const isLiked = wishlist.includes(product.id);
  const displayLikes = isLiked ? product.likes + 1 : product.likes;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div ref={topRef} className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-24 relative">
      <button onClick={() => setClientView('home')} className="flex items-center gap-2 text-[#5C6E63] hover:text-[#1C2C24] font-bold text-sm mb-6"><ChevronLeft size={18}/> Kembali</button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 shrink-0">
              <div className="w-full aspect-square bg-[#F7F6F2] rounded-xl overflow-hidden border border-[#EBEAE5]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex items-center justify-center gap-6 mt-6">
                <button onClick={() => toggleWishlist(product.id)} className={`flex items-center gap-2 text-sm font-bold transition-colors ${isLiked ? 'text-[#C86B6B]' : 'text-[#5C6E63] hover:text-[#C86B6B]'}`}>
                  <Heart size={18} className={isLiked ? "fill-[#C86B6B]" : ""} /> 
                  Favoritkan ({displayLikes})
                </button>
                <div className="w-[1px] h-4 bg-[#EBEAE5]"></div>
                <button className="flex items-center gap-2 text-[#5C6E63] hover:text-[#1C2C24] text-sm font-bold transition-colors"><Share2 size={18}/> Bagikan</button>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center pt-2">
              <h1 className="text-2xl md:text-3xl font-black text-[#1C2C24] leading-tight mb-3">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#78857E] mb-6">
                <span className="flex items-center gap-1 text-[#CBA153]"><Star size={16} className="fill-[#CBA153]"/> 4.9 <span className="text-[#9BA8A1] text-xs ml-1">(120 Penilaian)</span></span>
                <span className="w-1 h-1 rounded-full bg-[#EBEAE5]"></span>
                <span>Terjual {product.sales}</span>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#9B7E5D]">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#EBEAE5] shadow-sm">
            <h3 className="text-lg font-black text-[#1C2C24] mb-6 uppercase tracking-tight bg-[#F7F6F2] py-2 px-4 rounded-lg inline-block">Spesifikasi & Deskripsi</h3>
            <div className="bg-[#F9F8F6] rounded-xl p-5 mb-8 border border-[#EBEAE5] space-y-4 text-sm">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2"><span className="text-[#9BA8A1] font-medium">Pengiriman</span><span className="col-span-2 md:col-span-3 text-[#1C2C24] font-bold flex items-center gap-2"><MapPin size={16} className="text-[#5C6E63]"/> Dikirim dari {product.origin}</span></div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2"><span className="text-[#9BA8A1] font-medium">Material</span><span className="col-span-2 md:col-span-3 text-[#1C2C24] font-bold">{product.material}</span></div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2"><span className="text-[#9BA8A1] font-medium">Sisa Stok</span><span className="col-span-2 md:col-span-3 text-[#1C2C24] font-bold">{product.stock} Unit</span></div>
            </div>
            <p className="text-[#5C6E63] text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm sticky top-28 space-y-6">
            <h3 className="font-black text-[#1C2C24]">Atur Jumlah Pembelian</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#EBEAE5] rounded-lg p-1 bg-[#F7F6F2]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-[#5C6E63] hover:text-[#1C2C24] bg-white rounded-md shadow-sm"><Minus size={16}/></button>
                <input type="text" value={qty} readOnly className="w-12 text-center bg-transparent font-bold text-[#1C2C24] outline-none" />
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2 text-[#5C6E63] hover:text-[#1C2C24] bg-white rounded-md shadow-sm"><Plus size={16}/></button>
              </div>
              <span className="text-xs text-[#9BA8A1] font-medium">Stok: {product.stock}</span>
            </div>
            <div className="flex items-center justify-between border-t border-b border-[#EBEAE5] py-4">
              <span className="text-[#78857E] font-medium">Subtotal</span>
              <span className="text-xl font-black text-[#1C2C24]">Rp {(product.price * qty).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleAddToCart} className="w-full py-3.5 rounded-xl border-2 border-[#1C2C24] text-[#1C2C24] font-bold text-sm flex justify-center items-center gap-2 hover:bg-[#F4F1EA] transition-colors"><ShoppingCart size={18}/> Masukkan Keranjang</button>
              <button onClick={() => { addToCart(product, qty); setClientView('cart'); }} className="w-full py-3.5 rounded-xl bg-[#1C2C24] text-white font-bold text-sm hover:bg-[#2A4034] transition-colors shadow-md">Beli Sekarang</button>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#78857E] bg-[#F7F6F2] p-3 rounded-xl justify-center">
              <ShieldCheck size={16} className="text-[#9B7E5D]"/> Garansi Retur 7 Hari
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t-2 border-[#EBEAE5]">
        <h3 className="text-xl font-bold text-[#1C2C24] uppercase tracking-tight mb-6">Mungkin Anda Suka</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {recommendations.map((rec) => (
             <div key={rec.id} onClick={() => setClientView('detail', rec)} className="bg-white rounded-xl border border-[#EBEAE5] hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
               <div className="w-full aspect-square bg-[#F7F6F2]"><img src={rec.image} alt={rec.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" /></div>
               <div className="p-3">
                 <p className="text-xs font-bold text-[#35433C] line-clamp-2 mb-2">{rec.name}</p>
                 <p className="text-[#1C2C24] font-black text-sm">Rp {rec.price.toLocaleString('id-ID')}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1C2C24] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-[#2A4034]">
            <CheckCircle2 size={18} className="text-[#D1C3A5]" />
            <span className="text-sm font-bold tracking-wide">Ditambahkan ke keranjang!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3. KERANJANG (CART) =====================
function CartView() {
  const { cart, updateCartQty, toggleCartSelection, removeCartItem, setClientView } = useMarketplaceStore();
  
  const selectedItems = cart.filter(i => i.selected);
  const totalItems = selectedItems.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = selectedItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

  if(cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#5C6E63]">
        <ShoppingCart size={64} className="mb-4 text-[#D1C3A5]"/>
        <h2 className="text-2xl font-black text-[#1C2C24] mb-2">Keranjang Kosong</h2>
        <button onClick={() => setClientView('home')} className="mt-4 px-6 py-2.5 bg-[#1C2C24] text-white rounded-lg font-bold">Mulai Belanja</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-32 relative h-full">
      <h2 className="text-2xl font-black text-[#1C2C24] mb-6">Keranjang Belanja</h2>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-[#EBEAE5] flex items-center gap-3 md:gap-4">
            <input type="checkbox" checked={item.selected} onChange={() => toggleCartSelection(item.id)} className="w-5 h-5 accent-[#1C2C24] cursor-pointer shrink-0" />
            <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover bg-[#F7F6F2] mix-blend-multiply border border-[#EBEAE5] shrink-0"/>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1C2C24] text-sm md:text-base leading-tight truncate">{item.name}</h3>
              <p className="text-[#9B7E5D] font-black mt-1 text-sm md:text-base">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button onClick={() => removeCartItem(item.id)} className="text-[#C86B6B] hover:bg-[#FDF3E3] p-1 md:p-1.5 rounded-md transition-colors"><Trash2 size={16}/></button>
              <div className="flex items-center border border-[#EBEAE5] rounded-lg p-0.5 md:p-1 bg-[#F7F6F2]">
                <button onClick={() => updateCartQty(item.id, -1)} className="p-1 text-[#5C6E63] hover:text-[#1C2C24] bg-white rounded-md"><Minus size={14}/></button>
                <input type="text" value={item.qty} readOnly className="w-6 md:w-8 text-center bg-transparent font-bold text-[#1C2C24] text-xs md:text-sm outline-none" />
                <button onClick={() => updateCartQty(item.id, 1)} className="p-1 text-[#5C6E63] hover:text-[#1C2C24] bg-white rounded-md"><Plus size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#EBEAE5] p-3 md:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[#78857E] font-medium text-xs md:text-sm truncate">Total ({totalItems} Produk)</p>
            <p className="text-lg md:text-2xl font-black text-[#1C2C24] whitespace-nowrap">Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
          <button 
            disabled={selectedItems.length === 0} 
            onClick={() => setClientView('checkout')} 
            className="px-5 md:px-8 py-3 md:py-3.5 bg-[#1C2C24] text-white rounded-xl font-bold text-sm md:text-base disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. CHECKOUT =============================
function CheckoutView() {
  const { cart, processCheckout, setClientView } = useMarketplaceStore();
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  
  const selectedItems = cart.filter(i => i.selected);
  const subtotal = selectedItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const shippingCost = 15000;

  if(selectedItems.length === 0) return setClientView('cart');

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-32">
      <button onClick={() => setClientView('cart')} className="flex items-center gap-2 text-[#5C6E63] hover:text-[#1C2C24] font-bold text-sm mb-6"><ChevronLeft size={18}/> Kembali ke Keranjang</button>
      <h2 className="text-2xl font-black text-[#1C2C24] mb-6">Checkout</h2>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm">
          <div className="flex items-center gap-2 text-[#9B7E5D] font-bold mb-4"><Map size={18}/> Alamat Pengiriman</div>
          <p className="font-bold text-[#1C2C24]">Eka Krisna F. (+62 812-3456-7890)</p>
          <p className="text-[#5C6E63] text-sm mt-1">Jl. Soekarno Hatta No. 9, Lowokwaru, Kota Malang, Jawa Timur</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm space-y-4">
          <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2">Informasi Pengiriman</h3>
          <div className="flex gap-4 items-start pt-2">
             <Truck className="text-[#9B7E5D] mt-1 shrink-0" size={20}/>
             <div>
                <p className="font-bold text-[#1C2C24] text-sm">Reguler - Ekspedisi Cepat</p>
                <p className="text-[#5C6E63] text-sm mt-1">Dikirim dari {selectedItems[0]?.origin || 'Jakarta'}, estimasi tiba dalam waktu 2 hari kerja.</p>
             </div>
          </div>
          <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#EBEAE5] mt-4">
             <p className="text-xs font-bold text-[#78857E] mb-3 uppercase tracking-widest">Estimasi Timeline</p>
             <div className="grid grid-cols-2 gap-y-2 text-sm">
               <span className="text-[#5C6E63]">Waktu Pemesanan</span><span className="font-bold text-[#1C2C24] text-right">{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</span>
               <span className="text-[#5C6E63]">Estimasi Barang Tiba</span><span className="font-bold text-[#1C2C24] text-right">{(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) })()}</span>
             </div>
          </div>

          <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2 mt-6">Produk Dipesan</h3>
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <img src={item.image} className="w-12 h-12 rounded bg-[#F7F6F2] border border-[#EBEAE5] mix-blend-multiply shrink-0"/>
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-[#1C2C24] text-sm truncate">{item.name}</p>
                  <p className="text-[#78857E] text-xs">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className="font-bold text-[#1C2C24] text-sm whitespace-nowrap">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm space-y-4">
          <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2">Metode Pembayaran</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button onClick={() => setPaymentMethod('QRIS')} className={`flex items-center gap-3 p-3 rounded-xl border ${paymentMethod === 'QRIS' ? 'border-[#1C2C24] bg-[#F7F6F2]' : 'border-[#EBEAE5] hover:border-[#C4CACA]'} transition-all`}>
              <QrCode size={20} className={paymentMethod === 'QRIS' ? 'text-[#1C2C24]' : 'text-[#9BA8A1]'} />
              <span className={`text-sm font-bold ${paymentMethod === 'QRIS' ? 'text-[#1C2C24]' : 'text-[#5C6E63]'}`}>QRIS</span>
            </button>
            <button onClick={() => setPaymentMethod('COD')} className={`flex items-center gap-3 p-3 rounded-xl border ${paymentMethod === 'COD' ? 'border-[#1C2C24] bg-[#F7F6F2]' : 'border-[#EBEAE5] hover:border-[#C4CACA]'} transition-all`}>
              <Banknote size={20} className={paymentMethod === 'COD' ? 'text-[#1C2C24]' : 'text-[#9BA8A1]'} />
              <span className={`text-sm font-bold ${paymentMethod === 'COD' ? 'text-[#1C2C24]' : 'text-[#5C6E63]'}`}>Cash on Delivery</span>
            </button>
            <button onClick={() => setPaymentMethod('Kredit')} className={`flex items-center gap-3 p-3 rounded-xl border ${paymentMethod === 'Kredit' ? 'border-[#1C2C24] bg-[#F7F6F2]' : 'border-[#EBEAE5] hover:border-[#C4CACA]'} transition-all`}>
              <CreditCard size={20} className={paymentMethod === 'Kredit' ? 'text-[#1C2C24]' : 'text-[#9BA8A1]'} />
              <span className={`text-sm font-bold ${paymentMethod === 'Kredit' ? 'text-[#1C2C24]' : 'text-[#5C6E63]'}`}>Kartu Kredit</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EBEAE5] shadow-sm">
          <div className="flex justify-between text-sm mb-2"><span className="text-[#78857E]">Subtotal Produk</span><span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between text-sm mb-4"><span className="text-[#78857E]">Biaya Pengiriman</span><span className="font-bold">Rp {shippingCost.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between border-t border-[#EBEAE5] pt-4"><span className="font-bold text-[#1C2C24]">Total Pembayaran</span><span className="text-xl font-black text-[#9B7E5D]">Rp {(subtotal + shippingCost).toLocaleString('id-ID')}</span></div>
        </div>

        <button onClick={() => processCheckout({ name: 'Eka Krisna F.', address: 'Malang', payment: paymentMethod })} className="w-full py-4 bg-[#1C2C24] text-white rounded-xl font-bold hover:bg-[#2A4034] transition-colors shadow-md">
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}

// 5. SUCCESS ==============================
function SuccessView() {
  const { setClientView } = useMarketplaceStore();
  
  useEffect(() => {
    const timer = setTimeout(() => setClientView('orders'), 2500);
    return () => clearTimeout(timer);
  }, [setClientView]);

  return (
    <div className="flex flex-col items-center justify-center py-32">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-[#E3F2ED] text-[#2A4034] rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={40} />
      </motion.div>
      <h2 className="text-2xl font-black text-[#1C2C24]">Pesanan Berhasil!</h2>
      <p className="text-[#5C6E63] mt-2">Mengalihkan ke halaman pesanan Anda...</p>
    </div>
  );
}

// 6. PESANAN SAYA =========================
function MyOrders() {
  const { myOrders, setClientView } = useMarketplaceStore();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24">
      <div className="flex items-center gap-4 mb-8 border-b border-[#EBEAE5] pb-4">
        <button onClick={() => setClientView('home')} className="text-[#5C6E63] hover:text-[#1C2C24]"><ChevronLeft size={24}/></button>
        <h2 className="text-2xl font-black text-[#1C2C24]">Pesanan Saya</h2>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-center text-[#9BA8A1] py-12 font-medium">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-[#EBEAE5] shadow-sm overflow-hidden hover:border-[#C4CACA] transition-colors cursor-pointer" onClick={() => setClientView('orderDetail', order)}>
              <div className="bg-[#F7F6F2] px-6 py-4 flex justify-between items-center border-b border-[#EBEAE5]">
                <div className="flex items-center gap-4 text-sm font-bold text-[#1C2C24]">
                  <Store size={16} className="text-[#5C6E63]"/> Nexus Fashion
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${order.status === 'Selesai' ? 'bg-[#E3F2ED] text-[#2A4034]' : 'bg-[#FDF3E3] text-[#9B7E5D]'}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-20 h-20 rounded-xl bg-[#F4F1EA] border border-[#EBEAE5] overflow-hidden shrink-0">
                  <img src={order.item.image} alt={order.item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 text-center md:text-left w-full">
                  <h3 className="font-bold text-[#1C2C24] text-lg leading-tight">{order.item.name}</h3>
                  <p className="text-[#78857E] text-sm mt-1">{order.qty} Produk x Rp {order.item.price.toLocaleString('id-ID')}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-medium text-[#9BA8A1] mt-3">
                    <Box size={14}/> No. Pesanan: {order.id}
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-[#EBEAE5] pt-4 md:pt-0 md:pl-6 w-full md:w-auto shrink-0">
                  <p className="text-xs font-medium text-[#78857E] mb-1">Total Pesanan</p>
                  <p className="text-xl font-black text-[#9B7E5D]">Rp {order.total.toLocaleString('id-ID')}</p>
                  <button className="mt-3 text-xs font-bold text-[#1C2C24] flex items-center gap-1 hover:text-[#9B7E5D]">Lihat Rincian <ArrowRight size={12}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 7. RINCIAN PESANAN (ORDER DETAIL) ========
function OrderDetailView() {
  const { selectedOrder: order, setClientView } = useMarketplaceStore();
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-24">
      <button onClick={() => setClientView('orders')} className="flex items-center gap-2 text-[#5C6E63] hover:text-[#1C2C24] font-bold text-sm mb-6"><ChevronLeft size={18}/> Kembali ke Daftar Pesanan</button>
      
      <div className="bg-white rounded-2xl border border-[#EBEAE5] shadow-sm overflow-hidden mb-6">
        <div className="bg-[#1C2C24] text-white px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-[#9BA8A1] font-medium mb-1">Nomor Pesanan</p>
            <p className="font-black text-sm md:text-lg tracking-wider">{order.id}</p>
          </div>
          <span className={`text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest ${order.status === 'Selesai' ? 'bg-[#2A4034] text-[#E3F2ED] border border-[#5C6E63]' : 'bg-[#D1C3A5] text-[#1C2C24]'}`}>
            {order.status}
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="bg-[#F7F6F2] p-5 rounded-xl border border-[#EBEAE5]">
             <h3 className="text-xs font-bold text-[#78857E] mb-3 uppercase tracking-widest">Informasi Waktu</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><p className="text-[#9BA8A1]">Waktu Pemesanan</p><p className="font-bold text-[#1C2C24]">{order.date}</p></div>
                <div><p className="text-[#9BA8A1]">Waktu Pembayaran</p><p className="font-bold text-[#1C2C24]">{order.paymentTime}</p></div>
                <div><p className="text-[#9BA8A1]">Metode Pembayaran</p><p className="font-bold text-[#1C2C24]">{order.shipping.payment}</p></div>
                <div><p className="text-[#9BA8A1]">Estimasi Kedatangan</p><p className="font-bold text-[#9B7E5D]">{order.estimatedArrival}</p></div>
             </div>
          </div>

          <div>
             <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2 mb-4">Alamat Pengiriman</h3>
             <p className="font-bold text-[#1C2C24]">{order.shipping.name}</p>
             <p className="text-[#5C6E63] text-sm mt-1">Jl. Soekarno Hatta No. 9, Lowokwaru, Kota {order.shipping.address}, Jawa Timur</p>
          </div>

          <div>
             <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2 mb-4">Rincian Produk</h3>
             <div className="flex items-center gap-4">
                <img src={order.item.image} className="w-16 h-16 rounded-lg bg-[#F7F6F2] border border-[#EBEAE5] mix-blend-multiply shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1C2C24] truncate">{order.item.name}</p>
                  <p className="text-[#78857E] text-sm mt-0.5">{order.qty} Produk x Rp {order.item.price.toLocaleString('id-ID')}</p>
                </div>
                <p className="font-bold text-[#1C2C24] whitespace-nowrap">Rp {(order.item.price * order.qty).toLocaleString('id-ID')}</p>
             </div>
          </div>

          <div>
             <h3 className="font-bold text-[#1C2C24] border-b border-[#EBEAE5] pb-2 mb-4">Rincian Pembayaran</h3>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#78857E]">Subtotal Produk</span><span className="font-bold text-[#1C2C24]">Rp {(order.item.price * order.qty).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span className="text-[#78857E]">Subtotal Pengiriman</span><span className="font-bold text-[#1C2C24]">Rp 15.000</span></div>
                <div className="flex justify-between pt-3 mt-3 border-t border-[#EBEAE5]"><span className="font-bold text-[#1C2C24]">Total Pesanan</span><span className="text-xl font-black text-[#9B7E5D]">Rp {order.total.toLocaleString('id-ID')}</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}