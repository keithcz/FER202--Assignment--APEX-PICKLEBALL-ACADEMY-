import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  FileEdit,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Database,
  CheckCircle2,
  Plus,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { isAdminUser } from '../utils/auth';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminContentTab from '../components/admin/AdminContentTab';
import AdminCoursesTab from '../components/admin/AdminCoursesTab';
import AdminBlogsCoachesTab from '../components/admin/AdminBlogsCoachesTab';
import AdminOperationsTab from '../components/admin/AdminOperationsTab';

const ADMIN_TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'products', label: 'Sản phẩm Pro Shop', icon: ShoppingBag },
  { id: 'content', label: 'Sửa nội dung trang', icon: FileEdit },
  { id: 'courses', label: 'Khóa học', icon: GraduationCap },
  { id: 'blogs', label: 'Bài viết & HLV', icon: BookOpen },
  { id: 'operations', label: 'Đơn hàng & Lịch đặt', icon: ClipboardList },
  { id: 'system', label: 'Sao lưu & Cài đặt', icon: Database },
];

export default function AdminPage({ currentUser, setActiveTab, onOpenAdminLogin }) {
  const {
    products,
    courses,
    blogs,
    coaches,
    orders,
    registrations,
    courtBookings,
    resetAllCmsData,
    exportCmsSnapshot,
    importCmsSnapshot,
  } = useSiteData();

  const [adminTab, setAdminTab] = useState('products');
  const [toastMsg, setToastMsg] = useState('');

  const notify = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  // Protect Admin route
  if (!isAdminUser(currentUser)) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#11181C] text-[#B6F05C] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592]">
              Khu vực Quản trị
            </span>
            <h1 className="text-2xl font-extrabold text-[#11181C] tracking-tight">
              Yêu cầu quyền Quản trị viên (Admin)
            </h1>
            <p className="text-xs text-[#5A636A] leading-relaxed">
              Vui lòng đăng nhập bằng tài khoản Admin để quản lý trang, chỉnh sửa nội dung và thêm/sửa sản phẩm tại Pro Shop.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={onOpenAdminLogin}
              className="px-6 py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#B6F05C]" />
              <span>Đăng nhập tài khoản Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 rounded-full bg-[#F4F6F2] hover:bg-[#EAECE8] text-[#11181C] text-xs font-medium border border-[#E2E6DF]"
            >
              Về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenueOrders = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  const handleExportJson = () => {
    const content = exportCmsSnapshot();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Đã tải xuống file sao lưu JSON');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = importCmsSnapshot(ev.target.result);
      if (res.ok) {
        notify('Đã khôi phục dữ liệu từ file JSON thành công');
      } else {
        notify(res.error || 'Không thể nhập file JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetAll = () => {
    if (window.confirm('Khôi phục toàn bộ sản phẩm, khóa học, bài viết và nội dung trang về mặc định ban đầu?')) {
      resetAllCmsData();
      notify('Đã khôi phục toàn bộ dữ liệu mặc định');
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#11181C] text-white border border-[#232C33] shadow-xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#B6F05C] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11181C] text-white border border-[#232C33] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B6F05C] text-[#11181C] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Apex CMS — Trang Quản Trị Hệ Thống
              </h1>
              <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#B6F05C] text-[#11181C]">
                ADMIN MODE
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 font-mono">
              Tài khoản: {currentUser.email} • Mọi thay đổi được đồng bộ tức thì lên website (LocalStorage)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('shop')}
            className="px-4 py-2 rounded-full bg-[#B6F05C] hover:bg-[#A4E841] text-[#11181C] text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mở Trang Bán Hàng</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 flex items-center gap-1.5"
          >
            <span>Xem Trang Chủ</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E2E6DF]">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
              adminTab === tab.id
                ? 'bg-[#11181C] text-white font-semibold shadow-sm'
                : 'bg-white text-[#5A636A] hover:text-[#11181C] border border-[#E2E6DF]'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${adminTab === tab.id ? 'text-[#B6F05C]' : ''}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
              <span className="font-mono text-[10px] uppercase text-[#88929A] block">Sản phẩm Pro Shop</span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="font-mono text-2xl font-extrabold text-[#11181C]">{products.length}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F1FCDA] text-[#2D5E12]">
                  {products.filter((p) => p.inStock !== false).length} CÒN HÀNG
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
              <span className="font-mono text-[10px] uppercase text-[#88929A] block">Khóa học & Bài viết</span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="font-mono text-2xl font-extrabold text-[#11181C]">
                  {courses.length} / {blogs.length}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F4F6F2] text-[#5A636A]">
                  {coaches.length} HLV
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
              <span className="font-mono text-[10px] uppercase text-[#88929A] block">Đơn hàng Pro Shop</span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="font-mono text-2xl font-extrabold text-[#11181C]">{orders.length}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F1FCDA] text-[#2D5E12]">
                  {totalRevenueOrders.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
              <span className="font-mono text-[10px] uppercase text-[#88929A] block">Ghi danh & Đặt sân</span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="font-mono text-2xl font-extrabold text-[#11181C]">
                  {registrations.length + courtBookings.length}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F4F6F2] text-[#5A636A]">
                  {registrations.length} LỚP • {courtBookings.length} SÂN
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setAdminTab('products')}
              className="p-6 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] text-left space-y-2 transition-all shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#11181C]">Quản lý & Thêm sản phẩm</h3>
              <p className="text-xs text-[#5A636A]">
                Thêm vợt, bóng, giày mới, cập nhật giá bán, tồn kho và nhãn Best Seller cho Pro Shop.
              </p>
            </button>

            <button
              onClick={() => setAdminTab('content')}
              className="p-6 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] text-left space-y-2 transition-all shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4F6F2] text-[#11181C] flex items-center justify-center">
                <FileEdit className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#11181C]">Sửa nội dung các trang</h3>
              <p className="text-xs text-[#5A636A]">
                Chỉnh sửa tiêu đề Hero, thống kê, video YouTube, mã khuyến mãi, giới thiệu và thông tin liên hệ.
              </p>
            </button>

            <button
              onClick={() => setAdminTab('operations')}
              className="p-6 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] text-left space-y-2 transition-all shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4F6F2] text-[#11181C] flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#11181C]">Duyệt đơn hàng & Lịch tập</h3>
              <p className="text-xs text-[#5A636A]">
                Theo dõi và cập nhật trạng thái đơn mua hàng Pro Shop, phiếu ghi danh học viên và vé đặt sân.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Products CMS */}
      {adminTab === 'products' && <AdminProductsTab onNotify={notify} setActiveTab={setActiveTab} />}

      {/* Content CMS */}
      {adminTab === 'content' && <AdminContentTab onNotify={notify} />}

      {/* Courses CMS */}
      {adminTab === 'courses' && <AdminCoursesTab onNotify={notify} />}

      {/* Blogs & Coaches CMS */}
      {adminTab === 'blogs' && <AdminBlogsCoachesTab onNotify={notify} />}

      {/* Operations */}
      {adminTab === 'operations' && <AdminOperationsTab onNotify={notify} />}

      {/* System Backup & Reset */}
      {adminTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C]">Sao lưu & Khôi phục dữ liệu CMS</h3>
            <p className="text-xs text-[#5A636A] leading-relaxed">
              Dữ liệu sản phẩm và nội dung trang được lưu trữ trực tiếp trên trình duyệt (LocalStorage). Bạn có thể xuất bản sao lưu JSON để chuyển sang thiết bị khác hoặc lưu trữ an toàn.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleExportJson}
                className="px-4 py-2.5 rounded-full bg-[#11181C] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#B6F05C]" />
                <span>Xuất file JSON</span>
              </button>

              <label className="px-4 py-2.5 rounded-full bg-[#FAFBF9] hover:bg-[#F4F6F2] border border-[#E2E6DF] text-xs font-semibold text-[#11181C] flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập file JSON</span>
                <input type="file" accept=".json,application/json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C]">Khôi phục dữ liệu mặc định</h3>
            <p className="text-xs text-[#5A636A] leading-relaxed">
              Đưa toàn bộ sản phẩm Pro Shop, nội dung Trang chủ, Khóa học, Bài viết và Hồ sơ HLV về trạng thái gốc ban đầu của hệ thống.
            </p>
            <button
              onClick={handleResetAll}
              className="px-4 py-2.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
