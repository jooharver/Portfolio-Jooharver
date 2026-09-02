import { Download, FileText, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useInventoryStore } from '../store/useInventoryStore';

export default function ReportsView() {
  const items = useInventoryStore((state) => state.items);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text("NEXUS INV", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Gedung Cybertech Lt. 9, Jl. Inovasi Digital No. 99, Jakarta 12345", 14, 26);
    doc.text("Telp: +62 811-2233-4455  |  Email: admin@nexusinv.com  |  Web: www.nexusinv.com", 14, 31);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 35, pageWidth - 14, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 20);
    doc.text("LAPORAN STOK BARANG ELEKTRONIK", 14, 47);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 53);

    const mainTableColumn = ["ID", "Nama Barang", "Kategori", "Stok", "Harga Satuan"];
    const mainTableRows = items.map(item => [
      item.id,
      item.name,
      item.category,
      `${item.stock} unit`,
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)
    ]);

    autoTable(doc, {
      head: [mainTableColumn],
      body: mainTableRows,
      startY: 58,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 9, textColor: [40, 40, 40] },
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    const summaryData = {};
    let grandTotalVarian = 0;
    let grandTotalStok = 0;

    items.forEach(item => {
      if (!summaryData[item.category]) summaryData[item.category] = { varian: 0, stok: 0 };
      summaryData[item.category].varian += 1;
      summaryData[item.category].stok += item.stock;
      grandTotalVarian += 1;
      grandTotalStok += item.stock;
    });

    const summaryRows = Object.keys(summaryData).map(cat => [
      cat,
      `${summaryData[cat].varian} jenis`,
      `${summaryData[cat].stok} unit`
    ]);

    summaryRows.push([
      { content: 'TOTAL KESELURUHAN', styles: { fontStyle: 'bold', halign: 'right' } },
      { content: `${grandTotalVarian} jenis`, styles: { fontStyle: 'bold' } },
      { content: `${grandTotalStok} unit`, styles: { fontStyle: 'bold' } }
    ]);

    const finalY = doc.lastAutoTable.finalY + 15;

    if (finalY > doc.internal.pageSize.height - 40) {
      doc.addPage();
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text("Ringkasan Total Per Kategori", 14, finalY);
    }

    autoTable(doc, {
      head: [["Kategori Barang", "Total Jenis/Varian", "Total Stok Fisik"]],
      body: summaryRows,
      startY: finalY > doc.internal.pageSize.height - 40 ? 20 : finalY + 4,
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 10, textColor: [40, 40, 40] },
      headStyles: { fillColor: [70, 70, 70], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
      }
    });

    doc.save(`Laporan-Inventory-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white">Laporan & Analitik</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Card Laporan PDF */}
        <div className="bg-[#18181b] p-5 md:p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-center gap-3 md:gap-4 hover:border-zinc-700 transition-colors">
          <div className="p-3 md:p-4 bg-zinc-900 rounded-full text-[#b300ff]">
            <FileText size={32} className="md:w-10 md:h-10" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Cetak Laporan Stok</h3>
            <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2">Unduh dokumen PDF monokrom lengkap dengan rekapitulasi data per kategori.</p>
          </div>
          <button 
            onClick={generatePDF}
            className="mt-2 flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-white text-black font-semibold rounded-xl border border-transparent hover:border-[#b300ff] hover:shadow-[0_0_25px_rgba(179,0,255,0.4)] hover:scale-105 transition-all duration-300"
          >
            <Download size={18} /> Download Laporan
          </button>
        </div>

        {/* Card Riwayat Arus Barang */}
        <div className="bg-[#18181b] p-5 md:p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-center gap-3 md:gap-4 opacity-50 cursor-not-allowed">
          <div className="p-3 md:p-4 bg-zinc-900 rounded-full text-[#ffa67a]">
            <Calendar size={32} className="md:w-10 md:h-10" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Riwayat Arus Barang</h3>
            <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2">Fitur terkunci: Memerlukan koneksi ke Database Backend (API).</p>
          </div>
        </div>
      </div>
    </div>
  );
}