import { useMemo } from 'react';
import { X, Download, DollarSign, FileSpreadsheet } from 'lucide-react';

const storePrices: Record<string, number> = {
   arduino: 24.99,
   esp32: 12.99,
   led: 0.15,
   resistor: 0.05,
   battery: 1.50,
   switch: 0.45,
   wire: 0.02,
   ic: 1.25,
   sensor: 3.50,
   motor: 4.50
};

export function BOMEstimator({ isOpen, onClose, components }: { isOpen: boolean, onClose: () => void, components: { type: string, id: string }[] }) {
   const counts = useMemo(() => {
      return components.reduce((acc, c) => {
         acc[c.type] = (acc[c.type] || 0) + 1;
         return acc;
      }, {} as Record<string, number>);
   }, [components]);

   const totalCost = useMemo(() => {
      return Object.entries(counts).reduce((total, [type, count]) => {
         return total + (storePrices[type] || 0.50) * count;
      }, 0);
   }, [counts]);

   if (!isOpen) return null;

   const handleExportCSV = () => {
      const rows = [["Component Type", "Quantity", "Unit Price (Est)", "Total Price"]];
      Object.entries(counts).forEach(([type, qty]) => {
         const price = storePrices[type] || 0.50;
         rows.push([type, qty.toString(), `$${price.toFixed(2)}`, `$${(price * qty).toFixed(2)}`]);
      });
      rows.push(["TOTAL", "", "", `$${totalCost.toFixed(2)}`]);
      
      const csv = rows.map(r => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ProtoLab-BOM.csv';
      a.click();
   };

   return (
      <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
         <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
               <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Bill of Materials (BOM)
               </div>
               <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
               </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                     <tr>
                        <th className="px-3 py-2 rounded-l-md">Component</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Unit Est.</th>
                        <th className="px-3 py-2 text-right rounded-r-md">Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.entries(counts).length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No components in workspace</td></tr>
                     ) : (
                        Object.entries(counts).map(([type, qty]) => {
                           const price = storePrices[type] || 0.50;
                           return (
                              <tr key={type} className="border-b last:border-0 border-border/50">
                                 <td className="px-3 py-2.5 font-medium capitalize">{type}</td>
                                 <td className="px-3 py-2.5 text-center">{qty}</td>
                                 <td className="px-3 py-2.5 text-right text-muted-foreground">${price.toFixed(2)}</td>
                                 <td className="px-3 py-2.5 text-right font-medium">${(price * qty).toFixed(2)}</td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>

            <div className="px-4 py-3 bg-secondary/30 border-t border-border flex items-center justify-between">
               <div className="text-sm font-medium">
                  Estimated Total: <span className="text-lg font-bold text-emerald-600 ml-1">${totalCost.toFixed(2)}</span>
               </div>
               <button 
                  onClick={handleExportCSV}
                  disabled={totalCost === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
               >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export CSV
               </button>
            </div>
         </div>
      </div>
   );
}
