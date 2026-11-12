import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Copy
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function RegistrationPage({ selectedCourseId, setActiveTab }) {
  const { courses, refreshOperations } = useSiteData();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: selectedCourseId || courses[0]?.id || '',
    preferredSlot: 'Tối Thứ 3 - Thứ 5 (18:30 - 20:30)',
    levelNote: 'Người mới bắt đầu (Chưa từng chơi Pickleball)',
    notes: '',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (selectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: selectedCourseId }));
    }
  }, [selectedCourseId]);

  const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];

  const validateForm = () => {
    const errs = {};

    // 1. Full name validation
    if (!formData.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên của bạn';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
    }

    // 2. Phone validation (10 digits starting with 03, 05, 07, 08, 09)
    const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(cleanPhone)) {
      errs.phone = 'Số điện thoại không hợp lệ (Phải là 10 chữ số VN, VD: 0912345678)';
    }

    // 3. Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Định dạng email không chính xác (VD: hocvien@gmail.com)';
    }

    // 4. Course validation
    if (!formData.courseId) {
      errs.courseId = 'Vui lòng chọn khóa học muốn đăng ký';
    }

    // 5. Agree terms
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'Bạn cần đồng ý với nội quy học viện và bảo mật thông tin';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    const bookingRef = 'APEX-REG-' + Math.floor(100000 + Math.random() * 900000);
    const newRegistration = {
      bookingCode: bookingRef,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      courseTitle: selectedCourse.title,
      coursePrice: selectedCourse.price,
      preferredSlot: formData.preferredSlot,
      levelNote: formData.levelNote,
      notes: formData.notes,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã Tiếp Nhận'
    };

    const existing = JSON.parse(localStorage.getItem('apex_registrations') || '[]');
    existing.unshift(newRegistration);
    localStorage.setItem('apex_registrations', JSON.stringify(existing));
    refreshOperations();

    setSubmittedBooking(newRegistration);
  };

  const handleCopyCode = () => {
    if (submittedBooking) {
      navigator.clipboard.writeText(submittedBooking.bookingCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
          Ghi danh trực tuyến
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#11181C]">
          Đăng ký khóa học Pickleball
        </h1>
        <p className="text-xs sm:text-sm text-[#5A636A] max-w-xl mx-auto leading-relaxed">
          Điền thông tin bên dưới để giữ chỗ trong lớp học giới hạn. Ban chuyên môn sẽ gọi điện xác nhận và gửi lịch khai giảng cụ thể trong vòng 2 giờ.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: The Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E6DF]">
            <h2 className="text-base font-bold text-[#11181C] tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#11181C]" />
              <span>Phiếu thông tin học viên</span>
            </h2>
            <span className="font-mono text-[11px] text-[#88929A]">* Bắt buộc nhập đầy đủ</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* 1. Full name */}
            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1.5 flex items-center justify-between">
                <span>1. Họ và tên học viên *</span>
                {errors.fullName && (
                  <span className="text-red-600 text-[11px] font-normal flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </span>
                )}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#88929A]" />
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Tuấn"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                  }`}
                />
              </div>
            </div>

            {/* 2. Phone & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                  2. Số điện thoại (Zalo) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#88929A]" />
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                      errors.phone ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                  3. Email nhận tài liệu *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#88929A]" />
                  <input
                    type="email"
                    placeholder="tuan.nguyen@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Course selection dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                4. Khóa học muốn đăng ký *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3.5 top-3.5 text-[#88929A]" />
                <select
                  value={formData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — {c.price.toLocaleString('vi-VN')} đ
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Preferred Time Slot & Current Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                  5. Khung giờ học mong muốn
                </label>
                <select
                  value={formData.preferredSlot}
                  onChange={(e) => handleInputChange('preferredSlot', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                >
                  <option value="Tối Thứ 3 - Thứ 5 (18:30 - 20:30)">Tối Thứ 3 - Thứ 5 (18:30 - 20:30)</option>
                  <option value="Tối Thứ 2 - Thứ 4 - Thứ 6 (19:00 - 21:00)">Tối Thứ 2 - Thứ 4 - Thứ 6 (19:00 - 21:00)</option>
                  <option value="Sáng Thứ 7 - Chủ Nhật (08:00 - 10:00)">Sáng Thứ 7 - Chủ Nhật (08:00 - 10:00)</option>
                  <option value="Chiều Thứ 7 - Chủ Nhật (16:30 - 18:30)">Chiều Thứ 7 - Chủ Nhật (16:30 - 18:30)</option>
                  <option value="Khung giờ riêng (1 kèm 1 theo yêu cầu)">Khung giờ riêng (1 kèm 1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                  6. Trình độ hiện tại
                </label>
                <select
                  value={formData.levelNote}
                  onChange={(e) => handleInputChange('levelNote', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                >
                  <option value="Người mới bắt đầu (Chưa từng chơi Pickleball)">Người mới bắt đầu (Chưa từng chơi)</option>
                  <option value="Đã từng chơi Tennis / Cầu lông chuyển sang">Đã từng chơi Tennis / Cầu lông</option>
                  <option value="Đã chơi phong trào 3-6 tháng (DUPR ~2.5 - 3.0)">Đã chơi phong trào 3-6 tháng</option>
                  <option value="Trung cấp muốn luyện thi đấu giải (DUPR 3.5+)">Trung cấp muốn thi đấu giải</option>
                </select>
              </div>
            </div>

            {/* 5. Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1.5">
                7. Ghi chú thêm
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Tôi muốn học chung cùng 1 người bạn, nhờ học viện bố trí cùng lớp..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
              />
            </div>

            {/* 6. Terms Checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#11181C] border-[#E2E6DF] focus:ring-[#11181C]"
                />
                <span className="text-xs text-[#5A636A]">
                  Tôi cam kết thông tin cung cấp là chính xác và đồng ý với{' '}
                  <span className="text-[#11181C] underline font-medium">quy chế đào tạo & bảo lưu buổi học</span> của Apex Academy.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-600 text-[11px] mt-1">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button: Pill Shape */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Xác nhận & gửi hồ sơ đăng ký</span>
              <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
            </button>

          </form>
        </div>

        {/* Right Col: Course Summary & Guarantee Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Selected Course Preview Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-0.5 rounded-full border border-[#D3F592]">
              Khóa học đã chọn
            </span>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#11181C] tracking-tight">{selectedCourse.title}</h3>
              <p className="text-xs text-[#5A636A]">{selectedCourse.subtitle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#88929A]">HLV Phụ trách:</span>
                <span className="text-[#11181C] font-medium">{selectedCourse.coach}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929A]">Thời lượng:</span>
                <span className="text-[#11181C] font-medium">{selectedCourse.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929A]">Cấp độ:</span>
                <span className="text-[#11181C] font-medium">{selectedCourse.level}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] text-[#88929A] uppercase block">Tổng học phí</span>
                <div className="font-mono text-xl font-extrabold text-[#11181C]">
                  {selectedCourse.price.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-[#88929A] line-through block">
                  {selectedCourse.originalPrice.toLocaleString('vi-VN')} đ
                </span>
                <span className="font-mono text-[10px] font-bold text-[#2D5E12] bg-[#F1FCDA] px-2 py-0.5 rounded">
                  Tiết kiệm 20%
                </span>
              </div>
            </div>
          </div>

          {/* Academy Guarantees */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] space-y-3 text-xs shadow-sm">
            <h4 className="font-bold text-[#11181C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#11181C]" />
              <span>Cam kết chất lượng Apex Academy</span>
            </h4>

            <ul className="space-y-2.5 text-[#5A636A]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5E12] shrink-0 mt-0.5" />
                <span>Bảo hành kết quả: Được học lại miễn phí nếu chưa đánh được trận chuẩn luật.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5E12] shrink-0 mt-0.5" />
                <span>Hỗ trợ mượn vợt chính hãng Joola / Selkirk suốt toàn bộ khóa học.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5E12] shrink-0 mt-0.5" />
                <span>Bảo lưu buổi học linh hoạt khi có lịch bận đột xuất (báo trước 12h).</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Confirmation Modal when Registration is submitted */}
      {submittedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(17,24,28,0.12)] space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center mx-auto border border-[#D3F592]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-0.5 rounded-full">
                Ghi danh thành công
              </span>
              <h3 className="text-xl font-bold text-[#11181C] tracking-tight mt-2">
                Chào mừng {submittedBooking.fullName}
              </h3>
              <p className="text-xs text-[#5A636A] mt-1">
                Hồ sơ đã được chuyển tới Ban Giáo Vụ. Huấn luyện viên phụ trách sẽ gọi điện xác nhận trong ngày.
              </p>
            </div>

            {/* Pass / Receipt Card */}
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] text-left space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E6DF]">
                <div>
                  <span className="font-mono text-[9px] text-[#88929A] uppercase block">Mã hồ sơ</span>
                  <div className="text-sm font-mono font-bold text-[#11181C] flex items-center gap-2">
                    <span>{submittedBooking.bookingCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 text-[#88929A] hover:text-[#11181C]"
                      title="Sao chép"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {isCopied && <span className="font-mono text-[10px] text-[#2D5E12]">Đã copy</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#88929A]">Khóa học:</span>
                  <span className="text-[#11181C] font-medium">{submittedBooking.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929A]">Học phí:</span>
                  <span className="font-mono text-[#11181C] font-bold">{submittedBooking.coursePrice.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#88929A]">Lịch học:</span>
                  <span className="text-[#5A636A]">{submittedBooking.preferredSlot}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setActiveTab('dashboard');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#11181C] text-white text-xs font-medium hover:bg-[#232C33] transition-all"
              >
                Xem hồ sơ tại Dashboard
              </button>
              <button
                onClick={() => setSubmittedBooking(null)}
                className="px-4 py-2.5 rounded-full bg-[#F4F6F2] hover:bg-[#EAECE8] text-xs font-medium text-[#11181C]"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
