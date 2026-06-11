'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Send, Trash2, QrCode, LayoutDashboard, Settings, LogOut, Copy, BarChart2, Plus, Edit3, Lock, X, Download, Zap, CheckCircle, AlertTriangle, Menu, Link2, Search, SlidersHorizontal, User, KeyRound, Globe } from 'lucide-react';

export default function Dashboard() {
    const [links, setLinks] = useState([]);
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [showCreatePassword, setShowCreatePassword] = useState(false);

    // Dynamic Navigation State
    const [activeTab, setActiveTab] = useState('ringkasan'); // 'ringkasan' | 'kelola' | 'qr' | 'pengaturan'

    // Search and Sort State (Kelola Tautan)
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'clicks' | 'alphabetical'

    // Custom QR Code Generator State
    const [qrText, setQrText] = useState('https://flyku.vercel.app');
    const [qrSize, setQrSize] = useState(256);

    // Profile Settings State
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Toast State
    const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

    // QR Code Modal State
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [activeQrLink, setActiveQrLink] = useState(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeEditLink, setActiveEditLink] = useState(null);
    const [editUrl, setEditUrl] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Mobile Sidebar Drawer State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (user) {
            setNewDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '');
        }
    }, [user]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    };

    const checkUser = async () => {
        // 1. Ambil session secara instan dari localStorage
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            setUser(session.user);
            setLoadingUser(false);
            fetchLinks();
            
            // Periksa apakah ada tautan pending dari beranda
            const pendingUrl = localStorage.getItem('pendingUrl');
            const pendingSlug = localStorage.getItem('pendingSlug');
            if (pendingUrl) {
                setUrl(pendingUrl);
                if (pendingSlug) {
                    setSlug(pendingSlug);
                }
                showToast('Tautan Anda dari beranda berhasil dimuat!', 'success');
                localStorage.removeItem('pendingUrl');
                localStorage.removeItem('pendingSlug');
            }
            
            // Lakukan verifikasi token di background secara aman
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (!user) {
                    supabase.auth.signOut();
                    router.push('/');
                } else {
                    setUser(user);
                }
            });
        } else {
            // Jika tidak ada session instan, coba panggil getUser sekali lagi
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/');
            } else {
                setUser(user);
                setLoadingUser(false);
                fetchLinks();
                
                // Periksa pending link
                const pendingUrl = localStorage.getItem('pendingUrl');
                const pendingSlug = localStorage.getItem('pendingSlug');
                if (pendingUrl) {
                    setUrl(pendingUrl);
                    if (pendingSlug) {
                        setSlug(pendingSlug);
                    }
                    showToast('Tautan Anda dari beranda berhasil dimuat!', 'success');
                    localStorage.removeItem('pendingUrl');
                    localStorage.removeItem('pendingSlug');
                }
            }
        }
    };

    const fetchLinks = async () => {
        setLoadingLinks(true);
        const { data, error } = await supabase.from('links').select('*').order('created_at', { ascending: false });
        if (error) {
            showToast(error.message, 'error');
        } else if (data) {
            setLinks(data);
        }
        setLoadingLinks(false);
    };

    const createLink = async (e) => {
        e.preventDefault();
        if (!url) {
            showToast('Tautan asli wajib diisi!', 'error');
            return;
        }
        setLoadingAction(true);
        let finalSlug = slug || Math.random().toString(36).substring(2, 7);
        
        const payload = {
            user_id: user?.id,
            original_url: url,
            slug: finalSlug
        };

        if (password) {
            payload.password = password;
        }

        const { error } = await supabase.from('links').insert([payload]);

        if (error) {
            showToast("Gagal! Mungkin slug sudah dipakai atau data tidak valid.", "error");
        } else {
            showToast("Tautan baru berhasil dibuat!", "success");
            fetchLinks();
            setUrl('');
            setSlug('');
            setPassword('');
            setShowCreatePassword(false);
        }
        setLoadingAction(false);
    };

    const deleteLink = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus tautan ini?')) {
            setLoadingAction(true);
            const { error } = await supabase.from('links').delete().match({ id });
            if (error) {
                showToast(error.message, 'error');
            } else {
                showToast('Tautan berhasil dihapus!', 'success');
                fetchLinks();
            }
            setLoadingAction(false);
        }
    };

    const handleEditClick = (link) => {
        setActiveEditLink(link);
        setEditUrl(link.original_url);
        setEditSlug(link.slug);
        setEditPassword(link.password || '');
        setIsEditModalOpen(true);
    };

    const saveEditLink = async (e) => {
        e.preventDefault();
        if (!editUrl || !editSlug) {
            showToast('Semua kolom wajib diisi!', 'error');
            return;
        }
        setLoadingAction(true);
        const { error } = await supabase
            .from('links')
            .update({
                original_url: editUrl,
                slug: editSlug,
                password: editPassword || null
            })
            .eq('id', activeEditLink.id);

        if (error) {
            showToast('Gagal mengubah tautan! Slug mungkin sudah digunakan.', 'error');
        } else {
            showToast('Tautan berhasil diperbarui!', 'success');
            setIsEditModalOpen(false);
            fetchLinks();
        }
        setLoadingAction(false);
    };

    const openQrModal = (link) => {
        setActiveQrLink(link);
        setIsQrModalOpen(true);
    };

    const downloadPngQr = () => {
        if (!activeQrLink) return;
        const svgElement = document.getElementById('qr-code-svg');
        if (!svgElement) return;
        
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const blobURL = window.URL.createObjectURL(svgBlob);
        
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, 512, 512);
            context.drawImage(image, 32, 32, 448, 448);
            
            const png = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = png;
            downloadLink.download = `qr-${activeQrLink.slug}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobURL);
        };
        image.src = blobURL;
    };

    // Dedicated custom QR Code Download Function
    const downloadCustomQr = () => {
        const svgElement = document.getElementById('custom-qr-svg');
        if (!svgElement) return;
        
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const blobURL = window.URL.createObjectURL(svgBlob);
        
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const targetDim = qrSize + 64;
            canvas.width = targetDim;
            canvas.height = targetDim;
            const context = canvas.getContext('2d');
            
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, targetDim, targetDim);
            context.drawImage(image, 32, 32, qrSize, qrSize);
            
            const png = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = png;
            downloadLink.download = `custom-qr.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobURL);
        };
        image.src = blobURL;
    };

    // Profile Display Name Update handler
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!newDisplayName.trim()) {
            showToast('Nama profil tidak boleh kosong!', 'error');
            return;
        }
        setLoadingAction(true);
        const { data, error } = await supabase.auth.updateUser({
            data: { display_name: newDisplayName }
        });
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Nama profil berhasil diperbarui!', 'success');
            setUser(data.user);
        }
        setLoadingAction(false);
    };

    // Profile Password Update handler
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            showToast('Semua kolom kata sandi wajib diisi!', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('Kata sandi konfirmasi tidak cocok!', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('Kata sandi harus minimal 6 karakter!', 'error');
            return;
        }
        setLoadingAction(true);
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            showToast(error.message, 'error');
        } else {
            showToast('Kata sandi berhasil diperbarui!', 'success');
            setNewPassword('');
            setConfirmPassword('');
        }
        setLoadingAction(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Tautan disalin ke clipboard!', 'success');
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const executeLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Read Display Name from Supabase User Metadata with fallback
    const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Pengguna';

    // Filters and Search (Kelola Tautan tab)
    const filteredLinks = links
        .filter(link => 
            link.slug.toLowerCase().includes(searchTerm.toLowerCase()) || 
            link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'clicks') {
                return b.clicks - a.clicks;
            }
            if (sortBy === 'alphabetical') {
                return a.slug.localeCompare(b.slug);
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });

    // Loading full page state
    if (loadingUser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-500">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Menyiapkan dasbor Anda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden relative transition-colors duration-500">
            
            {/* Background Decorative Glowing Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-cyan-500/5 dark:bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Toast Notification Component */}
            {toast.visible && (
                <div className="fixed bottom-5 right-5 z-50 animate-slide-in flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all max-w-sm glass" style={{
                    borderColor: toast.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    background: 'var(--card-bg)'
                }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {toast.type === 'success' ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertTriangle className="text-red-500 w-5 h-5" />}
                    </div>
                    <div className="text-xs font-semibold text-foreground max-w-[200px] leading-relaxed">{toast.message}</div>
                    <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="text-slate-400 hover:text-foreground ml-auto transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Sidebar Kiri - Desktop */}
            <aside className="w-68 bg-slate-100/10 dark:bg-[#0a0d18]/40 backdrop-blur-xl border-r border-card-border flex flex-col justify-between hidden md:flex z-20">
                <div>
                    <div 
                        onClick={() => router.push('/')}
                        className="p-6 flex items-center gap-2.5 font-extrabold text-xl text-foreground font-display cursor-pointer select-none group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Send className="text-white w-4 h-4 -rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
                        </div>
                        flyku<span className="text-cyan-500">.vercel.app</span>
                    </div>

                    <div className="px-4 mb-6">
                        <div className="flex items-center gap-3.5 p-3.5 bg-white/[0.02] border border-card-border rounded-2xl shadow-inner">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white capitalize text-lg">
                                {userName.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm text-foreground truncate capitalize">{userName}</p>
                                <p className="text-[10px] text-cyan-500 font-bold tracking-wider uppercase">Fly Pro Plan</p>
                            </div>
                        </div>
                    </div>

                    <nav className="px-4 space-y-1.5">
                        {/* Interactive dynamic tabs with premium vertical left indicators */}
                        <button 
                            onClick={() => setActiveTab('ringkasan')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                activeTab === 'ringkasan'
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Ringkasan
                        </button>
                        <button 
                            onClick={() => setActiveTab('kelola')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                activeTab === 'kelola'
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                            }`}
                        >
                            <Link2 size={18} /> Kelola Tautan
                        </button>
                        <button 
                            onClick={() => setActiveTab('qr')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                activeTab === 'qr'
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                            }`}
                        >
                            <QrCode size={18} /> QR Generator
                        </button>
                        <button 
                            onClick={() => setActiveTab('pengaturan')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                activeTab === 'pengaturan'
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                            }`}
                        >
                            <Settings size={18} /> Pengaturan
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-card-border">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 w-full text-red-500 hover:text-red-400 font-bold hover:bg-red-500/10 rounded-xl text-sm transition-all cursor-pointer">
                        <LogOut size={18} /> Keluar Akun
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay Drawer - WITH BUTTER-SMOOTH CLOSE TRANSITIONS */}
            <div className={`fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <div className={`w-72 bg-[#0a0d18] border-r border-card-border h-full flex flex-col justify-between p-6 transition-transform duration-300 ease-out shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div>
                        {/* Header Drawer */}
                        <div className="flex items-center justify-between mb-8">
                            <div 
                                onClick={() => { setIsSidebarOpen(false); router.push('/'); }}
                                className="flex items-center gap-2.5 font-extrabold text-xl text-foreground font-display cursor-pointer select-none"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                    <Send className="text-white w-4 h-4 -rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
                                </div>
                                flyku<span className="text-cyan-500">.vercel.app</span>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg bg-white/[0.02] border border-card-border text-slate-400 hover:text-foreground cursor-pointer transition">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3.5 p-3.5 bg-white/[0.02] border border-card-border rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white capitalize text-lg">
                                    {userName.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm text-foreground truncate capitalize">{userName}</p>
                                    <p className="text-[10px] text-cyan-500 font-bold tracking-wider uppercase">Fly Pro Plan</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1.5">
                            <button 
                                onClick={() => { setIsSidebarOpen(false); setActiveTab('ringkasan'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                    activeTab === 'ringkasan'
                                    ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                    : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                                }`}
                            >
                                <LayoutDashboard size={18} /> Ringkasan
                            </button>
                            <button 
                                onClick={() => { setIsSidebarOpen(false); setActiveTab('kelola'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                    activeTab === 'kelola'
                                    ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                    : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                                }`}
                            >
                                <Link2 size={18} /> Kelola Tautan
                            </button>
                            <button 
                                onClick={() => { setIsSidebarOpen(false); setActiveTab('qr'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                    activeTab === 'qr'
                                    ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                    : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                                }`}
                            >
                                <QrCode size={18} /> QR Generator
                            </button>
                            <button 
                                onClick={() => { setIsSidebarOpen(false); setActiveTab('pengaturan'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                                    activeTab === 'pengaturan'
                                    ? 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-500 font-bold rounded-r-xl'
                                    : 'text-slate-400 font-semibold hover:bg-white/[0.02] hover:text-slate-200 rounded-xl'
                                }`}
                            >
                                <Settings size={18} /> Pengaturan
                            </button>
                        </nav>
                    </div>

                    {/* Logout Drawer */}
                    <div className="border-t border-card-border pt-4">
                        <button onClick={() => { setIsSidebarOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-3.5 w-full text-red-500 hover:text-red-400 font-bold hover:bg-red-500/10 rounded-xl text-sm transition-all cursor-pointer">
                            <LogOut size={18} /> Keluar Akun
                        </button>
                    </div>
                </div>
                {/* Backdrop Click area */}
                <div className="flex-1 cursor-pointer" onClick={() => setIsSidebarOpen(false)}></div>
            </div>

            {/* Konten Utama Kanan */}
            <main className="flex-1 overflow-y-auto z-10 animate-fade-in-up">
                <div className="p-6 md:p-10 max-w-5xl mx-auto">

                    {/* Header Sapaan */}
                    <div className="mb-8 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3.5">
                            <button 
                                onClick={() => setIsSidebarOpen(true)} 
                                className="md:hidden flex items-center justify-center p-2.5 rounded-xl bg-white/[0.02] border border-card-border text-foreground cursor-pointer transition active:scale-95 shadow-sm"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3.5xl font-extrabold text-foreground capitalize tracking-tight font-display">
                                    Halo, {userName}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">Mari persingkat tautan panjang Anda hari ini.</p>
                            </div>
                        </div>

                        {/* Topbar Right - Mobile logout */}
                        <div className="flex md:hidden items-center">
                            <button onClick={handleLogout} className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition active:scale-95">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>

                    {/* VIEW: RINGKASAN (TAB OVERVIEW) */}
                    {activeTab === 'ringkasan' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Banner Status Pro */}
                            <div className="relative overflow-hidden rounded-[28px] border border-card-border bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-6 md:p-8 text-white shadow-2xl">
                                <div className="absolute top-[-30%] right-[-10%] w-[250px] h-[250px] bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-lg">
                                            <Zap className="w-7 h-7 text-yellow-400 fill-yellow-400 animate-pulse" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold font-display">Paket Fly Pro</h2>
                                            <p className="text-cyan-100 text-xs mt-0.5 font-semibold">Status Lisensi: Aktif Selamanya (Lifetime)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 w-full md:w-auto border-t border-white/10 md:border-t-0 pt-4 md:pt-0">
                                        <div>
                                            <p className="text-[10px] text-cyan-100 flex items-center gap-1 uppercase font-bold tracking-wider"><Link2 size={12} /> Total Tautan</p>
                                            <p className="text-3xl font-extrabold font-display mt-1">{loadingLinks ? '...' : links.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-cyan-100 flex items-center gap-1 uppercase font-bold tracking-wider"><BarChart2 size={12} /> Total Klik</p>
                                            <p className="text-3xl font-extrabold font-display mt-1">
                                                {loadingLinks ? '...' : links.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Buat Link Baru */}
                            <div className="glass p-6 rounded-[24px] border border-card-border shadow-xl">
                                <h3 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-cyan-500" /> Buat Tautan Baru
                                </h3>
                                <form onSubmit={createLink} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                        <div className="md:col-span-6">
                                            <input
                                                type="url"
                                                required
                                                placeholder="Tautan asli (https://...)"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/[0.02] border border-card-border rounded-xl outline-none focus:border-cyan-500/40 focus:bg-[#07090e] text-sm text-foreground placeholder-slate-400 transition"
                                            />
                                        </div>
                                        <div className="md:col-span-4 flex items-center bg-white/[0.02] border border-card-border rounded-xl overflow-hidden focus-within:border-cyan-500/40 focus-within:bg-[#07090e] transition">
                                            <span className="pl-4 text-slate-500 text-xs font-semibold select-none">flyku.vercel.app/</span>
                                            <input
                                                type="text"
                                                placeholder="kustom-slug"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="px-2 py-3 bg-transparent border-none outline-none text-sm text-foreground w-full pl-1"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={loadingAction}
                                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-cyan-500/10 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                {loadingAction ? (
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                ) : 'Buat'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreatePassword(!showCreatePassword)}
                                            className="text-xs font-bold text-slate-500 hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer select-none"
                                        >
                                            <Lock size={12} className={showCreatePassword ? "text-cyan-500" : ""} />
                                            {showCreatePassword ? 'Sembunyikan Proteksi Kata Sandi' : 'Tambahkan Proteksi Kata Sandi (Opsional)'}
                                        </button>
                                        {showCreatePassword && (
                                            <div className="mt-3 max-w-sm relative group animate-slide-in">
                                                <input
                                                    type="password"
                                                    placeholder="Masukkan kata sandi pengunci"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-card-border rounded-xl outline-none focus:border-cyan-500/40 focus:bg-[#07090e] text-xs text-foreground placeholder-slate-400 transition"
                                                />
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Aktivitas Terakhir Overview list */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-foreground text-sm tracking-wide">Aktivitas Terakhir</h3>
                                    <button onClick={() => setActiveTab('kelola')} className="text-xs font-bold text-cyan-500 hover:underline cursor-pointer">Lihat Semua</button>
                                </div>
                                {loadingLinks ? (
                                    <div className="space-y-4">
                                        {[1, 2].map((n) => (
                                            <div key={n} className="bg-white/[0.01] p-5 rounded-2xl border border-card-border animate-pulse flex flex-col md:flex-row justify-between gap-4">
                                                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                                                <div className="w-32 bg-slate-800 h-9 rounded-lg"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : links.length === 0 ? (
                                    <div className="text-center p-12 glass rounded-[24px] border border-card-border text-slate-400 text-sm font-semibold">
                                        <Link2 className="w-8 h-8 mx-auto text-slate-500 mb-2 animate-bounce" />
                                        Belum ada tautan yang dibuat.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {links.slice(0, 3).map((link) => (
                                            <div key={link.id} className="glass p-5 rounded-[24px] border border-card-border shadow-md hover:border-cyan-500/20 hover:bg-white/[0.01] hover:scale-[1.005] transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                                        <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center">
                                                            <Link2 size={12} className="text-cyan-500" />
                                                        </div>
                                                        <a href={`/${link.slug}`} target="_blank" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors text-sm">
                                                            flyku.vercel.app/{link.slug}
                                                        </a>
                                                        <button onClick={() => copyToClipboard(`${window.location.origin}/${link.slug}`)} className="text-slate-500 hover:text-foreground transition-colors p-1 cursor-pointer" title="Salin tautan">
                                                            <Copy size={13} />
                                                        </button>
                                                        {link.password && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[9px] text-yellow-600 dark:text-yellow-400 font-bold uppercase">
                                                                <Lock size={9} /> Sandi
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1 max-w-[300px] md:max-w-[450px]" title={link.original_url}>{link.original_url}</p>
                                                </div>
                                                <div className="flex items-center gap-2 border-t border-card-border md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                                                    <button onClick={() => handleEditClick(link)} className="px-3 py-2 bg-white/5 border border-card-border text-white rounded-xl text-xs font-bold hover:bg-white/10 flex items-center gap-1 transition-all cursor-pointer">
                                                        <Edit3 size={13} /> Edit
                                                    </button>
                                                    <button onClick={() => openQrModal(link)} className="px-3 py-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl text-xs font-bold hover:bg-cyan-500/20 flex items-center gap-1 border border-cyan-500/10 transition-all cursor-pointer">
                                                        <QrCode size={13} /> QR Code
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: KELOLA TAUTAN (DEDICATED MANAGEMENT VIEW) */}
                    {activeTab === 'kelola' && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Search and Filters controls card */}
                            <div className="glass p-5 rounded-[24px] border border-card-border shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:max-w-md group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors w-4.5 h-4.5" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari slug kustom atau URL asli..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground placeholder-slate-500 focus:bg-[#07090e] outline-none focus:border-cyan-500/30 transition-all duration-300"
                                    />
                                </div>
                                <div className="flex gap-3 w-full md:w-auto items-center">
                                    <SlidersHorizontal className="text-slate-400 w-4 h-4" />
                                    <span className="text-xs font-bold text-slate-400 hidden sm:inline uppercase">Urutkan:</span>
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-[#0a0d18] border border-card-border rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-cyan-500/30 cursor-pointer"
                                    >
                                        <option value="latest">Terbaru dibuat</option>
                                        <option value="clicks">Klik terbanyak</option>
                                        <option value="alphabetical">Abjad Slug (A-Z)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Links display grid */}
                            {loadingLinks ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="bg-white/[0.01] p-5 rounded-2xl border border-card-border animate-pulse h-24"></div>
                                    ))}
                                </div>
                            ) : filteredLinks.length === 0 ? (
                                <div className="text-center p-16 glass rounded-[24px] border border-card-border text-slate-400 text-sm font-semibold">
                                    <Link2 className="w-10 h-10 mx-auto text-slate-500 mb-3 animate-bounce" />
                                    Tautan tidak ditemukan. Silakan sesuaikan pencarian Anda.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredLinks.map((link) => (
                                        <div key={link.id} className="glass p-5 rounded-[24px] border border-card-border shadow-md hover:border-cyan-500/20 hover:bg-white/[0.01] hover:scale-[1.002] transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                                    <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center">
                                                        <Link2 size={12} className="text-cyan-500" />
                                                    </div>
                                                    <a href={`/${link.slug}`} target="_blank" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors text-sm">
                                                        flyku.vercel.app/{link.slug}
                                                    </a>
                                                    <button onClick={() => copyToClipboard(`${window.location.origin}/${link.slug}`)} className="text-slate-500 hover:text-foreground transition-colors p-1 cursor-pointer" title="Salin tautan">
                                                        <Copy size={13} />
                                                    </button>
                                                    {link.password && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[9px] text-yellow-600 dark:text-yellow-400 font-bold uppercase">
                                                            <Lock size={9} /> Sandi
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1 max-w-[300px] md:max-w-[500px]" title={link.original_url}>{link.original_url}</p>
                                                <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 font-semibold">
                                                    <span className="flex items-center gap-1.5"><BarChart2 size={13} /> {link.clicks || 0} Klik</span>
                                                    <span>Dibuat: {new Date(link.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 border-t border-card-border md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-end">
                                                <button onClick={() => handleEditClick(link)} className="px-3 py-2 bg-white/5 border border-card-border text-white rounded-xl text-xs font-bold hover:bg-white/10 flex items-center gap-1 transition-all cursor-pointer">
                                                    <Edit3 size={13} /> Edit
                                                </button>
                                                <button onClick={() => openQrModal(link)} className="px-3 py-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl text-xs font-bold hover:bg-cyan-500/20 flex items-center gap-1 border border-cyan-500/10 transition-all cursor-pointer">
                                                    <QrCode size={13} /> QR Code
                                                </button>
                                                <button onClick={() => deleteLink(link.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/20 flex items-center border border-red-500/10 transition-all cursor-pointer">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: QR GENERATOR WORKSPACE (DEDICATED VIEW) */}
                    {activeTab === 'qr' && (
                        <div className="grid md:grid-cols-12 gap-8 items-start animate-fade-in-up">
                            {/* Kiri: Inputs controls */}
                            <div className="md:col-span-7 glass p-6 rounded-[28px] border border-card-border shadow-xl space-y-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                                    <QrCode size={18} className="text-cyan-500" /> Dedicated QR Workspace
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                                    Buat QR Code resolusi tinggi untuk teks, tautan sosial media, kontak, atau URL eksternal secara langsung tanpa harus menyingkat tautan terlebih dahulu.
                                </p>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teks / URL Input</label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={qrText}
                                            onChange={(e) => setQrText(e.target.value)}
                                            placeholder="Masukkan teks atau alamat URL..."
                                            className="w-full pl-4 pr-4 py-3.5 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground focus:bg-[#07090e] outline-none focus:border-cyan-500/30 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                                        <span>Resolusi / Dimensi QR</span>
                                        <span className="text-cyan-500">{qrSize} x {qrSize} px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="128" 
                                        max="512" 
                                        step="16"
                                        value={qrSize}
                                        onChange={(e) => setQrSize(parseInt(e.target.value))}
                                        className="w-full accent-cyan-500 bg-white/5 h-1.5 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                                        <span>Cepat</span>
                                        <span>Resolusi HD</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={downloadCustomQr}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3.5 px-6 rounded-2xl font-bold text-xs shadow-lg shadow-cyan-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
                                >
                                    <Download size={14} /> Unduh QR Code PNG (HD)
                                </button>
                            </div>

                            {/* Kanan: Live Studio Preview */}
                            <div className="md:col-span-5 glass p-6 rounded-[28px] border border-card-border shadow-xl text-center space-y-6 flex flex-col items-center">
                                <h4 className="font-bold text-foreground font-display text-sm tracking-wide self-start">Live QR Preview</h4>
                                
                                {/* SVG Wrapper */}
                                <div className="p-5 bg-white rounded-3xl inline-block shadow-2xl relative group overflow-hidden border border-white/10">
                                    <QRCodeSVG
                                        id="custom-qr-svg"
                                        value={qrText || "https://flyku.vercel.app"}
                                        size={200}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>

                                <div className="w-full bg-white/[0.01] rounded-2xl p-4 border border-card-border text-left">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1 mb-1"><Globe size={11} /> Teks yang Terkandung</div>
                                    <p className="text-xs text-slate-300 break-all font-semibold truncate max-w-[220px]" title={qrText}>
                                        {qrText || "Tuliskan sesuatu..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: PENGATURAN PROFIL & SANDI (DEDICATED VIEW) */}
                    {activeTab === 'pengaturan' && (
                        <div className="grid md:grid-cols-2 gap-8 items-start animate-fade-in-up">
                            {/* Card A: Edit Profil Name */}
                            <div className="glass p-6 rounded-[28px] border border-card-border shadow-xl space-y-5">
                                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                                    <div className="w-9 h-9 bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 rounded-xl">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-sm font-display">Profil Pengguna</h3>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Sesuaikan nama identitas Anda</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Tampilan Baru</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={newDisplayName}
                                            onChange={(e) => setNewDisplayName(e.target.value)}
                                            placeholder="Masukkan nama tampilan baru Anda..."
                                            className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground focus:bg-[#07090e] outline-none focus:border-cyan-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loadingAction}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3.5 px-6 rounded-2xl font-bold text-xs shadow-lg shadow-cyan-500/10 active:scale-95 transition-all flex justify-center items-center cursor-pointer"
                                    >
                                        {loadingAction ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : 'Simpan Nama Profil'}
                                    </button>
                                </form>
                            </div>

                            {/* Card B: Security Password update */}
                            <div className="glass p-6 rounded-[28px] border border-card-border shadow-xl space-y-5">
                                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                                    <div className="w-9 h-9 bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 rounded-xl">
                                        <KeyRound size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-sm font-display">Keamanan Akun</h3>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Perbarui sandi kredensial masuk</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Masukkan kata sandi baru..."
                                            className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground focus:bg-[#07090e] outline-none focus:border-cyan-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Ketik ulang kata sandi baru..."
                                            className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground focus:bg-[#07090e] outline-none focus:border-cyan-500/30 transition-all duration-300"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loadingAction}
                                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white py-3.5 px-6 rounded-2xl font-bold text-xs shadow-lg shadow-red-500/10 active:scale-95 transition-all flex justify-center items-center cursor-pointer"
                                    >
                                        {loadingAction ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : 'Perbarui Kata Sandi'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* MODAL QR CODE */}
            {isQrModalOpen && activeQrLink && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="max-w-sm w-full glass-premium p-6 rounded-3xl border border-card-border relative shadow-2xl animate-scale-in text-center">
                        <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mt-3">
                            <h4 className="font-bold text-foreground font-display text-lg">QR Code Tautan</h4>
                            <p className="text-xs text-slate-400 mt-1 font-semibold">Scan untuk mengakses flyku.vercel.app/{activeQrLink.slug}</p>
                            <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-inner border border-white/10">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={`${window.location.origin}/${activeQrLink.slug}`}
                                    size={180}
                                    level={"H"}
                                    includeMargin={false}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={downloadPngQr}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Download size={14} /> Unduh PNG
                                </button>
                                <button
                                    onClick={() => {
                                        copyToClipboard(`${window.location.origin}/${activeQrLink.slug}`);
                                        setIsQrModalOpen(false);
                                    }}
                                    className="flex-1 bg-white/5 border border-card-border text-foreground dark:text-slate-300 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                    Salin URL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDIT TAUTAN */}
            {isEditModalOpen && activeEditLink && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="max-w-md w-full glass-premium p-6 rounded-3xl border border-card-border relative shadow-2xl animate-scale-in">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mt-2">
                            <h4 className="font-bold text-foreground font-display text-lg mb-1 flex items-center gap-2">
                                <Edit3 size={18} className="text-cyan-500" /> Edit Tautan
                            </h4>
                            <p className="text-xs text-slate-400 font-semibold">Ubah konfigurasi tautan pendek Anda.</p>
                            <form onSubmit={saveEditLink} className="space-y-4 mt-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Tautan Asli</label>
                                    <input
                                        type="url"
                                        required
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-card-border rounded-xl outline-none focus:border-cyan-500/40 focus:bg-[#07090e] text-xs text-foreground placeholder-slate-400 transition"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Custom Slug</label>
                                    <div className="flex items-center bg-white/[0.02] border border-card-border rounded-xl overflow-hidden focus-within:border-cyan-500/40 focus-within:bg-[#07090e] transition">
                                        <span className="pl-4 text-slate-500 text-xs font-semibold select-none">flyku.vercel.app/</span>
                                        <input
                                            type="text"
                                            required
                                            value={editSlug}
                                            onChange={(e) => setEditSlug(e.target.value)}
                                            className="px-2 py-3 bg-transparent border-none outline-none text-xs text-foreground w-full pl-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Proteksi Kata Sandi</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowEditPassword(!showEditPassword)}
                                            className="text-[10px] text-cyan-500 font-bold hover:underline cursor-pointer"
                                        >
                                            {showEditPassword ? 'Sembunyikan' : 'Lihat'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showEditPassword ? "text" : "password"}
                                            placeholder="Kosongkan jika ingin menonaktifkan kata sandi"
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-card-border rounded-xl outline-none focus:border-cyan-500/40 focus:bg-[#07090e] text-xs text-foreground placeholder-slate-400 transition"
                                        />
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 bg-white/5 border border-card-border text-foreground py-3 rounded-xl text-xs font-bold transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingAction}
                                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/10 active:scale-98 flex items-center justify-center cursor-pointer"
                                    >
                                        {loadingAction ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI KELUAR */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="max-w-sm w-full glass-premium p-6 rounded-3xl border border-card-border relative shadow-2xl animate-scale-in text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <LogOut className="text-red-500 w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-foreground font-display text-base">Konfirmasi Keluar</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed font-semibold">
                            Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk kembali untuk mengelola tautan Anda.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 bg-white/5 border border-card-border text-foreground py-3 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={executeLogout}
                                className="flex-1 bg-red-600 hover:bg-red-500 border border-red-600 text-white py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/10 active:scale-95 cursor-pointer"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}