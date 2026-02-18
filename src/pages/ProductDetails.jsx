import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProductData } from '../utils/csvLoader';

const ProductDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProductData();
                const foundProduct = data.find(p => p['品番'] === productId);
                setProduct(foundProduct);
            } catch (error) {
                console.error("Error loading CSV data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [productId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">載入中...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">
                <p className="mb-4">找不到產品資料</p>
                <button onClick={() => navigate(-1)} className="text-primary font-bold">返回列表</button>
            </div>
        );
    }

    // Helper to safely parse numbers
    const parseNumber = (val) => parseFloat(val) || 0;
    const ctTime = parseNumber(product['CT時間(秒)']);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="ios-status-bar bg-background-light dark:bg-background-dark sticky top-0 z-50"></div>
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => navigate(-1)} className="flex items-center text-primary">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                        <span className="hidden sm:inline">返回</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-base font-bold leading-tight">產品數據詳情</h1>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{product['品番']}</span>
                    </div>
                    <button className="flex items-center text-primary">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-4 ios-bottom-nav">
                {/* Product Profile Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                            className="w-full h-full object-cover"
                            alt={product['品番']}
                            src={product['產品圖片'] ? `/raychanproducts/assets/${product['產品圖片']}` : 'https://via.placeholder.com/150?text=No+Image'}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {/* Fallback status if no column */}
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
                            <span className="text-slate-500 text-xs">最後更新: 2023-11-20</span>
                        </div>
                        <h2 className="text-xl font-bold dark:text-white leading-tight">{product['品番']}</h2>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">precision_manufacturing</span>
                            <span className="text-sm font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">{product['生產機台'] || '未知機台'}</span>
                        </div>
                    </div>
                </div>

                {/* Section: Basic Information */}
                <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">info</span>
                        <h3 className="font-bold">基本資訊</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">產品名稱</span>
                            <span className="text-sm font-medium text-right">{product['品名'] || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">模具廠商</span>
                            <span className="text-sm font-medium">{product['模具廠商'] || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">車型</span>
                            <span className="text-sm font-medium font-mono">{product['車型'] || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400">原料編號</span>
                            <span className="text-sm font-medium">{product['原料編號'] || '-'}</span>
                        </div>
                    </div>
                </section>

                {/* Section: Production Parameters (Highlight CT) */}
                <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">settings_input_component</span>
                            <h3 className="font-bold">生產參數</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">UNIT: SEC</span>
                    </div>
                    {/* CT Highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-tight">標準 CT</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">{ctTime || '-'}</span>
                                <span className="text-xs text-slate-400">s</span>
                            </div>
                        </div>
                        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20">
                            <p className="text-[10px] text-primary font-semibold mb-1 uppercase tracking-tight">目標 CT</p>
                            {/* Placeholder logic for target */}
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">{ctTime ? (ctTime * 0.95).toFixed(1) : '-'}</span>
                                <span className="text-xs text-primary/70">s</span>
                            </div>
                            <div className="flex items-center text-[10px] text-emerald-500 font-bold mt-1">
                                <span className="material-symbols-outlined text-xs">trending_down</span>
                                <span>-5% (目標)</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">標準重量</span>
                            <span className="text-sm font-medium">{product['標準重量(g)'] ? `${product['標準重量(g)']}g` : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">重量公差</span>
                            <span className="text-sm font-medium">{product['重量公差'] || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400">標準長度</span>
                            <span className="text-sm font-medium">{product['標準長度'] || '-'}</span>
                        </div>
                    </div>
                </section>

                {/* Section: Material Specifications (Reused logic or simple mapping) */}
                <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">layers</span>
                        <h3 className="font-bold">原料規範</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                <span className="material-symbols-outlined text-slate-500">opacity</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">主要樹脂原料</p>
                                <p className="text-sm font-bold">{product['原料編號'] || '未指定'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Packaging Parameters (Using placeholders as CSV might not have full details) */}
                <section className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                        <h3 className="font-bold">包裝參數</h3>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 w-16 h-16 rounded-lg shadow-sm">
                            <span className="text-2xl font-black text-primary">{product['收容數'] || '-'}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">PCS</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold mb-0.5">出貨容器</h4>
                            <p className="text-xs text-slate-500 leading-tight">{product['出貨容器'] || '未指定'}</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Action Area (iOS style) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 pt-4 pb-8 z-50">
                <div className="max-w-md mx-auto flex gap-3">
                    <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-3 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">history</span>
                        異動日誌
                    </button>
                    <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        編輯數據
                    </button>
                </div>
            </div>
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
};

export default ProductDetails;
