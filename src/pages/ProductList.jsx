import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductData } from '../utils/csvLoader';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProductData();
                setProducts(data);
            } catch (error) {
                console.error("Error loading CSV data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            (product['品番'] && product['品番'].toLowerCase().includes(term)) ||
            (product['品名'] && product['品名'].toLowerCase().includes(term))
        );
    });

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Top AppBar Container */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">menu</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 px-3">數位產品主檔</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </div>
                {/* Search Bar Section */}
                <div className="px-4 py-3">
                    <label className="flex flex-col min-w-40 h-11 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                            <div className="text-slate-400 flex border-none bg-white dark:bg-[#1c2631] items-center justify-center pl-4 rounded-l-xl">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-[#1c2631] h-full placeholder:text-slate-400 pl-2 text-base font-normal leading-normal"
                                placeholder="搜尋品番、品名..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </label>
                </div>
                {/* Filter Chips Section */}
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto custom-scrollbar">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-primary text-white px-4 shadow-sm">
                        <span className="text-sm font-medium">全部產品</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-white dark:bg-[#1c2631] px-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">車型</p>
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-white dark:bg-[#1c2631] px-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">客戶</p>
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-white dark:bg-[#1c2631] px-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">噸數</p>
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                </div>
            </header>

            <main className="p-4 space-y-4 max-w-md mx-auto w-full flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        產品清單 (顯示 {filteredProducts.length} 筆)
                    </h3>
                    <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer">filter_list</span>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-500">載入中...</div>
                ) : (
                    filteredProducts.map((product, index) => (
                        <div key={index} className="bg-white dark:bg-[#1c2631] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 transition-active active:scale-[0.98]">
                            <div className="flex p-4">
                                <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt={product['品名']}
                                        src={product['產品圖片'] ? `/raychanproducts/assets/${product['產品圖片']}` : 'https://via.placeholder.com/150?text=No+Image'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-primary font-bold text-sm tracking-tight leading-none mb-1 uppercase">品番: {product['品番']}</p>
                                        {/* Status badge - logic can be improved if status is added to CSV */}
                                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">生產中</span>
                                    </div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-tight mb-2">{product['品名'] || '未命名產品'}</h4>
                                    <div className="flex flex-wrap gap-y-1 text-slate-500 dark:text-slate-400 text-xs">
                                        {product['車型'] && (
                                            <div className="flex items-center mr-3">
                                                <span className="material-symbols-outlined text-[14px] mr-1">directions_car</span>
                                                <span>{product['車型']}</span>
                                            </div>
                                        )}
                                        {product['生產機台'] && (
                                            <div className="flex items-center">
                                                <span className="material-symbols-outlined text-[14px] mr-1">precision_manufacturing</span>
                                                <span>{product['生產機台']}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-t border-slate-100 dark:border-slate-800 p-2 gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                                <button
                                    onClick={() => navigate(`/details?id=${encodeURIComponent(product['品番'])}`)}
                                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                                    數據詳情
                                </button>
                                <button
                                    onClick={() => navigate(`/documents?id=${encodeURIComponent(product['品番'])}`)}
                                    className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">description</span>
                                    標準書類
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="py-10 text-center">
                        <p className="text-slate-400 text-sm">找不到符合的產品</p>
                    </div>
                )}

                {!loading && filteredProducts.length > 0 && (
                    <div className="py-10 text-center">
                        <p className="text-slate-400 text-sm">已顯示所有搜尋結果</p>
                    </div>
                )}

            </main>

            {/* Bottom Navigation (Mobile Friendly) */}
            <nav className="fixed bottom-0 w-full bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pb-safe-area">
                <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button className="flex flex-col items-center justify-center gap-1 text-primary">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold">產品主檔</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined">settings_input_component</span>
                        <span className="text-[10px] font-bold">機台狀態</span>
                    </button>
                    <div className="relative -top-4">
                        <button className="bg-primary text-white size-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </button>
                    </div>
                    <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined">description</span>
                        <span className="text-[10px] font-bold">文件中心</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="text-[10px] font-bold">系統通知</span>
                    </button>
                </div>
                {/* Safe area spacer for iOS */}
                <div className="h-4"></div>
            </nav>
            {/* Scroll Spacer */}
            <div className="h-24"></div>
        </div>
    );
};

export default ProductList;
