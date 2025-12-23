
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  ChevronRight, 
  BrainCircuit, 
  Mic, 
  ShoppingCart,
  Trash2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { InventoryItem } from './types';
import { analyzeInventory } from './services/geminiService';

// Initial Demo Data
const initialItems: InventoryItem[] = [
  { id: '1', name: 'Rice (Basmati)', category: 'Grains', current_stock: 12, minimum_stock: 20, average_daily_sales: 5, today_sales: 8 },
  { id: '2', name: 'Cooking Oil', category: 'Cooking', current_stock: 45, minimum_stock: 15, average_daily_sales: 3, today_sales: 2 },
  { id: '3', name: 'Dal (Moong)', category: 'Grains', current_stock: 8, minimum_stock: 10, average_daily_sales: 2, today_sales: 4 },
  { id: '4', name: 'Salt', category: 'Spices', current_stock: 50, minimum_stock: 10, average_daily_sales: 1, today_sales: 1 },
];

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stock' | 'ai'>('dashboard');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'General',
    current_stock: 0,
    minimum_stock: 5,
    average_daily_sales: 1,
    today_sales: 0
  });

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeInventory(items);
    setAnalysis(result);
    setIsAnalyzing(false);
    setActiveTab('ai');
  };

  const addItem = () => {
    if (!newItem.name) return;
    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      category: newItem.category || 'General',
      current_stock: Number(newItem.current_stock) || 0,
      minimum_stock: Number(newItem.minimum_stock) || 0,
      average_daily_sales: Number(newItem.average_daily_sales) || 0,
      today_sales: Number(newItem.today_sales) || 0,
    };
    setItems([...items, item]);
    setIsAddingItem(false);
    setNewItem({ name: '', category: 'General', current_stock: 0, minimum_stock: 5, average_daily_sales: 1, today_sales: 0 });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const getStockColor = (item: InventoryItem) => {
    if (item.current_stock <= item.minimum_stock * 0.5) return 'text-red-500';
    if (item.current_stock <= item.minimum_stock) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 relative pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <ShoppingCart size={24} />
            KiranaMitra
          </h1>
          <p className="text-xs text-slate-500">Aapka digital sahayak</p>
        </div>
        <button 
          onClick={() => setIsAddingItem(true)}
          className="bg-orange-100 text-orange-600 p-2 rounded-full hover:bg-orange-200 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-400">
                <p className="text-slate-500 text-sm">Low Stock</p>
                <p className="text-2xl font-bold">{items.filter(i => i.current_stock <= i.minimum_stock).length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-400">
                <p className="text-slate-500 text-sm">Top Sales</p>
                <p className="text-2xl font-bold">{items.sort((a, b) => b.today_sales - a.today_sales)[0]?.name || '-'}</p>
              </div>
            </div>

            {/* AI Assistant Call to Action */}
            <div 
              onClick={runAnalysis}
              className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 rounded-2xl text-white shadow-lg cursor-pointer transform hover:scale-[1.02] transition-all flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">Ask KiranaMitra</h3>
                <p className="text-sm opacity-90">What should I buy today?</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <BrainCircuit size={32} />
              </div>
            </div>

            {/* Recent Items List (Simple View) */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Shop Health</h3>
                <button className="text-orange-600 text-sm font-medium" onClick={() => setActiveTab('stock')}>See All</button>
              </div>
              <div className="space-y-4">
                {items.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-current ${getStockColor(item)}`} />
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getStockColor(item)}`}>{item.current_stock}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Left</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 px-2">Inventory Management</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={`font-bold ${getStockColor(item)}`}>{item.current_stock}</span>
                          <span className="text-[10px] text-slate-400">Min: {item.minimum_stock}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 p-2 rounded-xl text-white">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-800">KiranaMitra Advice</h2>
                  <p className="text-xs text-slate-500">AI analysis of your shop today</p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center py-10 space-y-4">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-500 font-medium animate-pulse">Checking your inventory...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                    {analysis || "Click the 'Ask KiranaMitra' button to see your daily analysis!"}
                  </div>
                  
                  {analysis && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2">
                       <button className="flex-1 bg-orange-100 text-orange-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                         <Mic size={20} />
                         Read Out Loud
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-700 italic">
                Note: This is AI advice. Use your own judgment for business decisions.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-20">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">HOME</span>
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stock' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <Package size={24} />
          <span className="text-[10px] font-bold">STOCK</span>
        </button>
        <button 
          onClick={runAnalysis}
          className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <div className={`p-2 rounded-full -mt-8 shadow-lg border-4 border-white ${activeTab === 'ai' ? 'bg-orange-500 text-white' : 'bg-slate-500 text-white'}`}>
            <BrainCircuit size={28} />
          </div>
          <span className="text-[10px] font-bold">MITRA</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold">SALES</span>
        </button>
      </nav>

      {/* Add Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add New Item</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Sugar"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option>General</option>
                    <option>Grains</option>
                    <option>Spices</option>
                    <option>Cleaning</option>
                    <option>Cooking</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Current Stock</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    value={newItem.current_stock}
                    onChange={e => setNewItem({...newItem, current_stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Min Stock (Alert)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    value={newItem.minimum_stock}
                    onChange={e => setNewItem({...newItem, minimum_stock: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Avg Daily Sales</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    value={newItem.average_daily_sales}
                    onChange={e => setNewItem({...newItem, average_daily_sales: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsAddingItem(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={addItem}
                  className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-200"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
