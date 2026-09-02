import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialItems = [
  // Kategori: Laptop
  { id: 'INV-001', name: 'MacBook Pro M3 Max', category: 'Laptop', stock: 15, price: 55000000, description: 'Apple Silicon M3 Max, 36GB RAM, 1TB SSD.' },
  { id: 'INV-002', name: 'ASUS ROG Zephyrus G14', category: 'Laptop', stock: 8, price: 32000000, description: 'AMD Ryzen 9, RTX 4060, Layar OLED 120Hz.' },
  { id: 'INV-003', name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptop', stock: 12, price: 35000000, description: 'Intel Core i7 Gen 13, sangat ringan untuk produktivitas.' },
  
  // Kategori: Monitor
  { id: 'INV-004', name: 'Dell UltraSharp 27"', category: 'Monitor', stock: 4, price: 8900000, description: 'Monitor 4K dengan USB-C Hub bawaan (U2723QE).' },
  { id: 'INV-005', name: 'LG UltraGear 27"', category: 'Monitor', stock: 20, price: 5500000, description: 'Monitor Gaming 1440p 165Hz IPS Panel.' },
  { id: 'INV-006', name: 'Samsung Odyssey G9', category: 'Monitor', stock: 2, price: 24000000, description: '49" Ultrawide Curved Gaming Monitor.' },

  // Kategori: Komponen PC
  { id: 'INV-007', name: 'NVIDIA RTX 4090 24GB', category: 'Komponen PC', stock: 0, price: 38000000, description: 'Gigabyte AORUS Master RTX 4090, GPU Tier Tertinggi.' },
  { id: 'INV-008', name: 'AMD Ryzen 7 7800X3D', category: 'Komponen PC', stock: 25, price: 6500000, description: '8-Core, 16-Thread, Prosesor terbaik untuk gaming.' },
  { id: 'INV-009', name: 'Corsair Vengeance 32GB', category: 'Komponen PC', stock: 40, price: 2200000, description: 'RAM DDR5 2x16GB 6000MHz C36.' },

  // Kategori: Aksesoris
  { id: 'INV-010', name: 'Logitech MX Master 3S', category: 'Aksesoris', stock: 35, price: 1500000, description: 'Wireless Mouse ergonomis dengan silent click.' },
  { id: 'INV-011', name: 'Keychron Q1 Pro', category: 'Aksesoris', stock: 10, price: 3200000, description: 'Wireless Custom Mechanical Keyboard bahan full aluminium.' },
  { id: 'INV-012', name: 'Sony WH-1000XM5', category: 'Aksesoris', stock: 15, price: 5200000, description: 'Headphone Wireless dengan fitur Noise Cancelling terbaik.' },
];

export const useInventoryStore = create(
  persist(
    (set) => ({
      items: initialItems,
      addItem: (item) => set((state) => ({ 
        items: [{ ...item, id: `INV-${String(Date.now()).slice(-4)}` }, ...state.items] 
      })),
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
    }),
    { name: 'inventory-storage' }
  )
);