import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProductData } from '../utils/csvLoader';

const StandardDocuments = () => {
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

    const controlPoints = [
        product['重點管制1'],
        product['重點管制2'],
        product['重點管制3']
    ].filter(Boolean);

    const historyImages = [
        product['異常履歷寫真1'],
        product['異常履歷寫真2'],
        product['異常履歷寫真3']
    ].filter(Boolean);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
                    <div
                        onClick={() => navigate(-1)}
                        className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">標準書類與品質預警</h2>
                </header>

                {/* Product Basic Info Section */}
                <div className="flex p-4 @container border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
                    <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
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
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <p className="text-slate-900 dark:text-white text-2xl font-black leading-tight tracking-tight">{product['品番']}</p>
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase">Digital Master</span>
                                </div>
                                <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium mt-1">品番名稱: {product['品名'] || '未命名'}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal">車型: <span className="text-slate-900 dark:text-slate-200 font-semibold">{product['車型']}</span></p>
                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                    <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal">機台: <span className="text-slate-900 dark:text-slate-200 font-semibold">{product['生產機台']}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documentation Section (核心三表) */}
                <div className="px-4 pt-6 pb-2 flex justify-between items-end">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">核心三表 (最新版本)</h3>
                    <span className="text-primary text-xs font-semibold cursor-pointer">查看歷史版本</span>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                    {/* QC Chart */}
                    <a
                        href={product['檢查手順書'] ? `/raychanproducts/assets/${product['檢查手順書']}` : '#'}
                        target={product['檢查手順書'] ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`flex flex-1 gap-2 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-3 flex-col items-center text-center shadow-sm transition-colors ${product['檢查手順書'] ? 'hover:bg-slate-50 dark:hover:bg-slate-800' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-slate-900 dark:text-white text-xs font-bold">檢查手順書</h2>
                            <p className="text-slate-500 dark:text-[#9dabb9] text-[10px] font-medium">{product['檢查手順書'] ? 'Available' : 'N/A'}</p>
                        </div>
                    </a>
                    {/* SOP */}
                    <a
                        href={product['作業標準書'] ? `/raychanproducts/assets/${product['作業標準書']}` : '#'}
                        target={product['作業標準書'] ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`flex flex-1 gap-2 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-3 flex-col items-center text-center shadow-sm transition-colors ${product['作業標準書'] ? 'hover:bg-slate-50 dark:hover:bg-slate-800' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-slate-900 dark:text-white text-xs font-bold">作業標準書</h2>
                            <p className="text-slate-500 dark:text-[#9dabb9] text-[10px] font-medium">{product['作業標準書'] ? 'Available' : 'N/A'}</p>
                        </div>
                    </a>
                    {/* Molding Conditions */}
                    <a
                        href={product['成形條件表'] ? `/raychanproducts/assets/${product['成形條件表']}` : '#'}
                        target={product['成形條件表'] ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`flex flex-1 gap-2 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-3 flex-col items-center text-center shadow-sm transition-colors ${product['成形條件表'] ? 'hover:bg-slate-50 dark:hover:bg-slate-800' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">settings_input_component</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-slate-900 dark:text-white text-xs font-bold">成形條件表</h2>
                            <p className="text-slate-500 dark:text-[#9dabb9] text-[10px] font-medium">{product['成形條件表'] ? 'Available' : 'N/A'}</p>
                        </div>
                    </a>
                </div>

                {/* Quality Alert Section (Red Tag) */}
                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-warning animate-pulse">report</span>
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">品質重點管制 (Key Control Points)</h3>
                </div>
                <div className="mx-4 mb-8 flex flex-col gap-4">
                    {/* Anomaly Summary Card */}
                    <div className="bg-warning/5 dark:bg-warning/10 border border-warning/30 rounded-xl overflow-hidden">
                        <div className="bg-warning/20 px-4 py-2 flex justify-between items-center border-b border-warning/20">
                            <div className="flex items-center gap-2">
                                <span className="text-warning font-black text-xs">重點項目 Total: {controlPoints.length}</span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="p-3 bg-white/50 dark:bg-black/30 rounded-lg border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">管制項目清單</span>
                                <ul className="mt-2 space-y-2">
                                    {controlPoints.length > 0 ? (
                                        controlPoints.map((point, index) => (
                                            <li key={index} className="flex gap-2 text-xs text-slate-700 dark:text-slate-300">
                                                <span className="text-primary font-bold">{index + 1}.</span>
                                                {point}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-slate-500 italic">無特定重點管制項目</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Visual Aid & Hotspots */}
                    {historyImages.length > 0 ? (
                        <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h4 className="text-slate-900 dark:text-white text-sm font-bold">異常履歷寫真</h4>
                                <span className="material-symbols-outlined text-slate-400 text-sm">zoom_in</span>
                            </div>
                            <div className="relative aspect-video bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center p-4">
                                <div className="w-full h-full rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Displaying first image only for now as main visual */}
                                    <img
                                        className="absolute inset-0 w-full h-full object-contain"
                                        alt="Defect History"
                                        src={`/raychanproducts/assets/${historyImages[0]}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.parentNode.innerHTML = '<span class="text-slate-400 text-xs">圖片載入失敗</span>';
                                        }}
                                    />
                                </div>
                            </div>
                            {historyImages.length > 1 && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex gap-2 overflow-x-auto">
                                    {historyImages.slice(1).map((img, idx) => (
                                        <div key={idx} className="w-16 h-16 rounded border border-slate-200 shrink-0 overflow-hidden">
                                            <img src={`/raychanproducts/assets/${img}`} alt={`History ${idx + 2}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Quick Action Footer Button */}
                    <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <span className="material-symbols-outlined">edit_square</span>
                        <span>異常履歷簽核 / 紀錄</span>
                    </button>
                </div>
                {/* Spacer for iOS indicator */}
                <div className="h-8 bg-background-light dark:bg-background-dark"></div>
            </div>
        </div>
    );
};

export default StandardDocuments;
