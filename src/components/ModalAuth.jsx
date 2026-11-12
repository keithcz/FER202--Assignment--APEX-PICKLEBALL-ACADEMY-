import React, { useState, useEffect } from 'react';
import { X, User, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { authenticateAdmin, isAdminIdentifier } from '../utils/auth';

export default function ModalAuth({ isOpen, onClose, onLoginSuccess, initialRole = 'student' }) {
  const [authRole, setAuthRole] = useState(initialRole); // 'student' | 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAuthRole(initialRole || 'student');
      setIsRegisterMode(false);
      setErrors({});
      setSuccessMsg('');
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const switchRole = (role) => {
    setAuthRole(role);
    setIsRegisterMode(false);
    setErrors({});
    setSuccessMsg('');
  };

  const validate = () => {
    const errs = {};

    if (authRole === 'admin') {
      if (!formData.email.trim()) {
        errs.email = 'Vui lòng nhập tài khoản hoặc email quản trị';
      }
      if (!formData.password) {
        errs.password = 'Vui lòng nhập mật khẩu quản trị';
      }
      setErrors(errs);
      return Object.keys(errs).length === 0;
    }

    if (isRegisterMode && !formData.name.trim()) {
      errs.name = 'Vui lòng nhập họ và tên';
    }
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!isAdminIdentifier(formData.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Định dạng email không hợp lệ';
    }
    if (isRegisterMode) {
      if (isAdminIdentifier(formData.email)) {
        errs.email = 'Email này thuộc hệ thống quản trị, không thể đăng ký mới';
      }
      if (!formData.phone.trim()) {
        errs.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.replace(/\s+/g, ''))) {
        errs.phone = 'Số điện thoại Việt Nam gồm 10 số (VD: 0912345678)';
      }
    }
    if (!formData.password) {
      errs.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Handle admin login (also enforce admin password if someone types admin@apex.vn in student tab)
    if (authRole === 'admin' || isAdminIdentifier(formData.email)) {
      const authResult = authenticateAdmin(formData.email, formData.password);
      if (!authResult.ok) {
        setErrors({ password: authResult.error });
        return;
      }
      localStorage.setItem('apex_user', JSON.stringify(authResult.user));
      setSuccessMsg('Đăng nhập Quản trị viên thành công');
      setTimeout(() => {
        onLoginSuccess(authResult.user);
        onClose();
        setSuccessMsg('');
      }, 600);
      return;
    }

    const userObj = {
      name: isRegisterMode ? formData.name : formData.email.split('@')[0] || 'Học Viên Apex',
      email: formData.email,
      phone: formData.phone || '0988688999',
      role: 'student',
      duprRating: '3.2',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
    };

    localStorage.setItem('apex_user', JSON.stringify(userObj));
    setSuccessMsg(isRegisterMode ? 'Đăng ký tài khoản thành công' : 'Đăng nhập thành công');

    setTimeout(() => {
      onLoginSuccess(userObj);
      onClose();
      setSuccessMsg('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(17,24,28,0.12)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#5A636A] hover:text-[#11181C] bg-[#F4F6F2] hover:bg-[#EAECE8] transition-all"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#F4F6F2] border border-[#E2E6DF] mb-6">
          <button
            type="button"
            onClick={() => switchRole('student')}
            className={`py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'student'
                ? 'bg-white text-[#11181C] shadow-sm'
                : 'text-[#5A636A] hover:text-[#11181C]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Học viên</span>
          </button>
          <button
            type="button"
            onClick={() => switchRole('admin')}
            className={`py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'admin'
                ? 'bg-[#11181C] text-[#B6F05C] shadow-sm'
                : 'text-[#5A636A] hover:text-[#11181C]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản trị (Admin)</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-3 ${
              authRole === 'admin'
                ? 'bg-[#11181C] border-[#11181C] text-[#B6F05C]'
                : 'bg-[#F4F6F2] border-[#E2E6DF] text-[#11181C]'
            }`}
          >
            {authRole === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <h3 className="text-xl font-bold text-[#11181C] tracking-tight">
            {authRole === 'admin'
              ? 'Cổng Quản Trị Hệ Thống'
              : isRegisterMode
              ? 'Tạo Tài Khoản Học Viên'
              : 'Cổng Học Viên Apex'}
          </h3>
          <p className="text-xs text-[#5A636A] mt-1">
            {authRole === 'admin'
              ? 'Đăng nhập tài khoản Admin để sửa nội dung trang và quản lý sản phẩm Pro Shop'
              : isRegisterMode
              ? 'Đăng ký để quản lý khóa học, lịch đặt sân và tích lũy điểm DUPR'
              : 'Đăng nhập để theo dõi lịch học và mã vé sân của bạn'}
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-[#2D5E12]" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authRole === 'student' && isRegisterMode && (
            <div>
              <label className="block text-xs font-medium text-[#11181C] mb-1.5">Họ và tên học viên *</label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#11181C] mb-1.5">
              {authRole === 'admin' ? 'Email / Tài khoản quản trị *' : 'Email liên hệ *'}
            </label>
            <input
              type={authRole === 'admin' ? 'text' : 'email'}
              placeholder={authRole === 'admin' ? 'admin@apex.vn' : 'hocvien@gmail.com'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
          </div>

          {authRole === 'student' && isRegisterMode && (
            <div>
              <label className="block text-xs font-medium text-[#11181C] mb-1.5">Số điện thoại *</label>
              <input
                type="tel"
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                  errors.phone ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#11181C] mb-1.5">Mật khẩu *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
              }`}
            />
            {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>
              {authRole === 'admin'
                ? 'Đăng nhập Quản trị viên'
                : isRegisterMode
                ? 'Hoàn tất đăng ký'
                : 'Đăng nhập tài khoản'}
            </span>
            <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
          </button>
        </form>

        {authRole === 'student' && (
          <div className="mt-5 text-center text-xs text-[#5A636A]">
            {isRegisterMode ? (
              <span>
                Đã có tài khoản học viên?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrors({});
                  }}
                  className="text-[#11181C] font-semibold underline underline-offset-2"
                >
                  Đăng nhập
                </button>
              </span>
            ) : (
              <span>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrors({});
                  }}
                  className="text-[#11181C] font-semibold underline underline-offset-2"
                >
                  Tạo tài khoản mới
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
