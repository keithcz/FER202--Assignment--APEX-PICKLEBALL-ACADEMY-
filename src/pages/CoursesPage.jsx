import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Info,
  QrCode
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function CoursesPage({ 
  selectedCourseId, 
  setSelectedCourseForRegister, 
  setActiveTab 
}) {
  const { courses, coaches, refreshOperations } = useSiteData();
  // Current active course
  const [currentCourseId, setCurrentCourseId] = useState(selectedCourseId || courses[0]?.id || 'course-beginner');
  
  useEffect(() => {
    if (selectedCourseId) {
      setCurrentCourseId(selectedCourseId);
    }
  }, [selectedCourseId]);

  const course = courses.find((c) => c.id === currentCourseId) || courses[0];

  // Booking selection states matching the reference UI
  const [selectedBranch, setSelectedBranch] = useState('tp-thu-duc');
  const [studyMode, setStudyMode] = useState('nhom-4');
  const [ageGroup, setAgeGroup] = useState('nguoi-lon');
  const [level, setLevel] = useState('co-ban');
  const [coachSelect, setCoachSelect] = useState('default');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Student quick form fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Active tab in lower section
  const [detailTab, setDetailTab] = useState('curriculum');

  // Dynamic pricing calculation based on study mode
  const getDynamicPrice = () => {
    let basePrice = course.price;
    if (studyMode === 'ca-nhan') {
      return basePrice * 2.2;
    } else if (studyMode === 'nhom-2') {
      return basePrice * 1.5;
    } else if (studyMode === 'nhom-3') {
      return basePrice * 1.2;
    }
    return basePrice;
  };

  const dynamicPrice = getDynamicPrice();

  const handleCourseSwitch = (id) => {
    setCurrentCourseId(id);
    if (setSelectedCourseForRegister) {
      setSelectedCourseForRegister(id);
    }
    setBookingSuccess(null);
    setFormError('');
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setFormError('Vui lòng điền Họ tên và Số điện thoại liên hệ');
      return;
    }
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneNumber.replace(/[\s.-]/g, ''))) {
      setFormError('Số điện thoại không đúng định dạng VN (10 chữ số)');
      return;
    }

    setFormError('');
    const bookingCode = 'APEX-' + Math.floor(100000 + Math.random() * 900000);
    const totalPrice = dynamicPrice * quantity;
    const studyModeLabel = studyMode === 'ca-nhan' ? 'Cá nhân (1-1)' : studyMode === 'nhom-2' ? 'Nhóm 02 người' : studyMode === 'nhom-3' ? 'Nhóm 03 người' : 'Nhóm 04 người';
    const branchLabel = selectedBranch === 'tp-thu-duc' ? 'Sân Apex Thảo Điền (TP. Thủ Đức)' : selectedBranch === 'q7' ? 'Sân Apex Phú Mỹ Hưng (Quận 7)' : 'Sân Apex Cầu Giấy (Hà Nội)';

    const savedRegs = JSON.parse(localStorage.getItem('apex_registrations') || '[]');
    savedRegs.unshift({
      bookingCode,
      fullName,
      phone: phoneNumber,
      courseTitle: course.title,
      coursePrice: totalPrice,
      preferredSlot: `${studyModeLabel} • ${branchLabel}`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      status: 'Đã Tiếp Nhận',
    });
    localStorage.setItem('apex_registrations', JSON.stringify(savedRegs));
    refreshOperations();

    setBookingSuccess({
      code: bookingCode,
      courseTitle: course.title,
      fullName,
      phoneNumber,
      quantity,
      studyMode: studyModeLabel,
      branch: branchLabel,
      totalPrice,
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb matching the reference */}
        <nav className="flex items-center gap-2 text-xs text-[#5A636A] font-medium">
          <button onClick={() => setActiveTab('home')} className="hover:text-[#11181C]">Trang chủ</button>
          <span>/</span>
          <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C]">Khóa Học Pickleball</button>
          <span>/</span>
          <span className="text-[#11181C] font-semibold truncate max-w-xs">{course.title}</span>
        </nav>

        {/* Quick Course Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono font-bold text-[#5A636A] uppercase whitespace-nowrap">Chọn khóa:</span>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCourseSwitch(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                currentCourseId === c.id
                  ? 'bg-[#11181C] text-[#B6F05C] shadow-sm font-semibold'
                  : 'bg-white text-[#5A636A] hover:bg-[#F4F6F2] hover:text-[#11181C] border border-[#E2E6DF]'
              }`}
            >
              {c.badge && <span className="mr-1.5 text-[10px]">●</span>}
              {c.title.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Main Combined Course & Registration Section (2 Columns Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-5 sm:p-8 rounded-3xl border border-[#E2E6DF] shadow-sm">
          
          {/* LEFT COLUMN: Media Showcase Banner (like reference image) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Visual Poster */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-[#E2E6DF] shadow-md group">
              
              {/* Media Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Top Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40"></div>
                
                {/* Top Badge: GOOD DAY TO PLAY PICKLEBALL */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#11181C]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#334155] flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#B6F05C] animate-ping"></span>
                    <span className="text-[11px] font-extrabold tracking-wider text-white uppercase">
                      GOOD DAY TO PLAY PICKLEBALL
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#B6F05C] text-[#11181C] font-mono text-[10px] font-bold">
                    {course.badge || 'TIÊU CHUẨN IPTPA'}
                  </span>
                </div>

                {/* Center Coach Tag */}
                <div className="absolute bottom-16 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                  <div>
                    <div className="font-mono text-[11px] text-[#B6F05C] font-bold">GIẢNG VIÊN ĐÀO TẠO</div>
                    <div className="text-base font-extrabold drop-shadow-md">{course.coach}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#B6F05C] overflow-hidden shadow-lg">
                    <img src={course.coachAvatar} alt={course.coach} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Bottom Bar: Academy Contact & QR Info (Matching reference image) */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-md px-4 py-2.5 border-t border-[#334155] flex items-center justify-between text-white text-[11px]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[#94A3B8]">
                      <span>🌐</span>
                      <span className="font-mono text-gray-200">apexpickleball.vn</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <span>📞</span>
                      <span>090.888.APEX</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#B6F05C] font-mono">
                    <QrCode className="w-4 h-4" />
                    <span>Zalo OA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery & Video Highlights */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { title: 'Tập luyện kỹ thuật', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=300&q=80' },
                { title: 'Cụm sân chuẩn thi đấu', img: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=300&q=80' },
                { title: 'Huấn luyện 1-1', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=300&q=80' },
                { title: 'Lớp học trẻ em', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80' },
              ].map((thumb, idx) => (
                <div 
                  key={idx} 
                  className="relative aspect-video rounded-xl overflow-hidden border border-[#E2E6DF] cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-sm"
                >
                  <img src={thumb.img} alt={thumb.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>
                </div>
              ))}
            </div>

            {/* Key Course Highlights */}
            <div className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#E2E6DF] space-y-2">
              <div className="text-xs font-bold text-[#11181C] uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2D5E12]" />
                <span>Quyền lợi & Cam kết khóa học</span>
              </div>
              <ul className="text-xs text-[#5A636A] space-y-1.5">
                {course.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Configuration & Registration Box (Exact match to reference image) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Header: Title, Stars, Price */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11181C] tracking-tight uppercase">
                {course.title}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#11181C]">5.0</span>
                <span className="text-xs text-[#88929A]">(128 đánh giá học viên)</span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#11181C]">
                  ₫{dynamicPrice.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm font-mono text-[#88929A] line-through">
                  ₫{(course.originalPrice * (studyMode === 'ca-nhan' ? 2 : 1)).toLocaleString('vi-VN')}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F1FCDA] text-[#2D5E12] font-mono text-xs font-bold border border-[#D3F592]">
                  Tiết kiệm 20%
                </span>
              </div>
            </div>

            <hr className="border-[#E2E6DF]" />

            {/* Option Selectors Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* 1. QUẬN/HUYỆN (Cơ sở tập) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#11181C] uppercase tracking-wider">
                  QUẬN / CƠ SỞ TẬP LUYỆN
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E6DF] bg-white text-xs text-[#11181C] focus:outline-none focus:border-[#11181C] shadow-sm font-medium"
                >
                  <option value="tp-thu-duc">TP. Thủ Đức - Cụm 4 Sân Apex Thảo Điền (Quốc Hương)</option>
                  <option value="q7">Quận 7 - Cụm Sân Apex Phú Mỹ Hưng (Nguyễn Văn Linh)</option>
                  <option value="cau-giay">Hà Nội - Cụm Sân Apex Cầu Giấy (Trần Thái Tông)</option>
                </select>
              </div>

              {/* 2. HÌNH THỨC HỌC (Pill Buttons) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#11181C] uppercase tracking-wider">
                  HÌNH THỨC HỌC
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ca-nhan', label: 'Cá nhân (1-1)' },
                    { id: 'nhom-2', label: 'Nhóm 02 học viên' },
                    { id: 'nhom-3', label: 'Nhóm 03 học viên' },
                    { id: 'nhom-4', label: 'Nhóm 04 học viên' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setStudyMode(mode.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        studyMode === mode.id
                          ? 'border-[#11181C] bg-[#11181C] text-white shadow-sm'
                          : 'border-[#E2E6DF] bg-white text-[#5A636A] hover:border-gray-400'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. ĐỘ TUỔI (Pill Buttons) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#11181C] uppercase tracking-wider">
                  ĐỘ TUỔI
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'nguoi-lon', label: 'Người lớn (16 - 45+ tuổi)' },
                    { id: 'tre-em', label: 'Trẻ em & Thiếu niên (6 - 15 tuổi)' },
                  ].map((age) => (
                    <button
                      key={age.id}
                      type="button"
                      onClick={() => setAgeGroup(age.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        ageGroup === age.id
                          ? 'border-[#11181C] bg-[#11181C] text-white'
                          : 'border-[#E2E6DF] bg-white text-[#5A636A] hover:border-gray-400'
                      }`}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. CẤP ĐỘ */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#11181C] uppercase tracking-wider">
                  CẤP ĐỘ
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'co-ban', label: 'Cơ bản (1.0 - 2.5)' },
                    { id: 'nang-cao', label: 'Nâng cao (3.0 - 4.0)' },
                    { id: 'thi-dau', label: 'Chiến thuật thi đấu' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        level === lvl.id
                          ? 'border-[#11181C] bg-[#11181C] text-white'
                          : 'border-[#E2E6DF] bg-white text-[#5A636A] hover:border-gray-400'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. HUẤN LUYỆN VIÊN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#11181C] uppercase tracking-wider">
                  HUẤN LUYỆN VIÊN
                </label>
                <select
                  value={coachSelect}
                  onChange={(e) => setCoachSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E6DF] bg-white text-xs text-[#11181C] focus:outline-none focus:border-[#11181C] shadow-sm font-medium"
                >
                  <option value="default">Mặc định (Coach Apex Academy)</option>
                  <option value="hoang">HLV Đặng Minh Hoàng (Chứng chỉ IPTPA Level 2)</option>
                  <option value="sarah">HLV Sarah Henderson (PPR Head Coach)</option>
                  <option value="huy">HLV Trưởng Nguyễn Quốc Huy (Cựu tuyển thủ quốc gia)</option>
                </select>
              </div>

              {/* Quick Contact Input Fields (Tên & Số điện thoại học viên) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A636A] mb-1">
                    HỌ VÀ TÊN HỌC VIÊN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn An"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5A636A] mb-1">
                    SỐ ĐIỆN THOẠI (ZALO) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0912 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                  />
                </div>
              </div>

              {formError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* 6. SỐ LƯỢNG HỌC VIÊN & NÚT ĐĂNG KÝ (Matching exact buttons in reference) */}
              <div className="flex items-center gap-3 pt-2">
                
                {/* Quantity Counter */}
                <div className="flex items-center border border-[#E2E6DF] rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-[#5A636A] hover:bg-[#F4F6F2] font-mono text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 font-mono text-xs font-bold text-[#11181C] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-[#5A636A] hover:bg-[#F4F6F2] font-mono text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA Button: ĐĂNG KÝ KHÓA HỌC NÀY */}
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-[#11181C] hover:bg-[#232C33] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-center"
                >
                  ĐĂNG KÝ KHÓA HỌC NÀY
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-xl border transition-all ${
                    isLiked 
                      ? 'border-red-400 bg-red-50 text-red-500' 
                      : 'border-[#E2E6DF] bg-white text-[#5A636A] hover:bg-[#F4F6F2]'
                  }`}
                  title="Lưu vào danh sách yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* 7. HỘP GHI CHÚ VÀNG NHẠT (Exact replica of the note box in reference image) */}
              <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-1 relative">
                <div className="font-bold flex items-center justify-between">
                  <span>Ghi chú</span>
                  <span className="text-[10px] text-[#B45309] font-mono">Chính sách Apex Academy</span>
                </div>
                <ul className="text-[11px] leading-relaxed space-y-0.5">
                  <li>• Học phí / 1 học viên trọn gói suốt lộ trình {course.duration}.</li>
                  <li>• Đã bao gồm toàn bộ chi phí thuê sân tập tiêu chuẩn và người nhặt bóng.</li>
                  <li>• Hỗ trợ mượn vợt thi đấu chuẩn USAPA & nước uống bù khoáng miễn phí.</li>
                </ul>
              </div>

              {/* Quick Chat Zalo & Hotline Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#0068FF] hover:bg-[#0055D4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo</span>
                </a>
                <a
                  href="tel:0908882739"
                  className="py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hotline Tư Vấn</span>
                </a>
              </div>
            </form>

            {/* Registration Success Notification Banner */}
            {bookingSuccess && (
              <div className="p-4 rounded-2xl bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Đăng ký giữ chỗ thành công!</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>Mã đăng ký: <strong>{bookingSuccess.code}</strong></div>
                  <div>Học viên: <strong>{bookingSuccess.fullName}</strong> - {bookingSuccess.phoneNumber}</div>
                  <div>Khóa học: <strong>{bookingSuccess.courseTitle}</strong> ({bookingSuccess.studyMode})</div>
                  <div>Cơ sở: <strong>{bookingSuccess.branch}</strong></div>
                  <div>Tổng học phí dự kiến: <strong>₫{bookingSuccess.totalPrice.toLocaleString('vi-VN')}</strong></div>
                </div>
                <p className="text-[11px] text-[#3D7B1C]">
                  Ban tuyển sinh Apex Academy sẽ gọi điện trực tiếp qua số {bookingSuccess.phoneNumber} trong vòng 15 phút để xác nhận lịch học của bạn.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SECTION: Detailed Curriculum & Related Info Tabs */}
        <div className="bg-white rounded-3xl border border-[#E2E6DF] p-6 sm:p-8 space-y-6">
          <div className="flex border-b border-[#E2E6DF] gap-4">
            <button
              onClick={() => setDetailTab('curriculum')}
              className={`pb-3 text-sm font-bold uppercase transition-all ${
                detailTab === 'curriculum'
                  ? 'border-b-2 border-[#11181C] text-[#11181C]'
                  : 'text-[#88929A] hover:text-[#11181C]'
              }`}
            >
              Lộ trình giáo trình ({course.curriculum.length} buổi học)
            </button>
            <button
              onClick={() => setDetailTab('schedule')}
              className={`pb-3 text-sm font-bold uppercase transition-all ${
                detailTab === 'schedule'
                  ? 'border-b-2 border-[#11181C] text-[#11181C]'
                  : 'text-[#88929A] hover:text-[#11181C]'
              }`}
            >
              Lịch khai giảng trong tháng
            </button>
            <button
              onClick={() => setDetailTab('coaches')}
              className={`pb-3 text-sm font-bold uppercase transition-all ${
                detailTab === 'coaches'
                  ? 'border-b-2 border-[#11181C] text-[#11181C]'
                  : 'text-[#88929A] hover:text-[#11181C]'
              }`}
            >
              Đội ngũ HLV giảng dạy
            </button>
          </div>

          {/* Tab 1: Curriculum */}
          {detailTab === 'curriculum' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.curriculum.map((lesson, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#E2E6DF] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#11181C] text-[#B6F05C] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#11181C]">
                      {lesson.split(':')[0]}
                    </div>
                    <div className="text-xs text-[#5A636A] mt-0.5">
                      {lesson.split(':')[1] || lesson}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Class Schedule */}
          {detailTab === 'schedule' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-[#E2E6DF] bg-[#FAFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#2D5E12] font-bold">LỚP BUỔI TỐI (THỨ 3 - THỨ 5)</div>
                  <div className="text-sm font-bold text-[#11181C]">Khóa Căn Bản Khai Giảng Ngày 15 Hàng Tháng</div>
                  <div className="text-xs text-[#5A636A]">18:30 - 20:30 • Sân Apex Thảo Điền Q2 • Còn 2 chỗ trống</div>
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })}
                  className="px-4 py-2 rounded-full bg-[#11181C] text-white text-xs font-bold"
                >
                  Đăng ký lớp này
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-[#E2E6DF] bg-[#FAFBF9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#2D5E12] font-bold">LỚP CUỐI TUẦN (THỨ 7 - CHỦ NHẬT)</div>
                  <div className="text-sm font-bold text-[#11181C]">Khóa Căn Bản & Nâng Cao Buổi Sáng</div>
                  <div className="text-xs text-[#5A636A]">08:00 - 10:00 • Sân Apex Phú Mỹ Hưng Q7 • Còn 3 chỗ trống</div>
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })}
                  className="px-4 py-2 rounded-full bg-[#11181C] text-white text-xs font-bold"
                >
                  Đăng ký lớp này
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Coaches */}
          {detailTab === 'coaches' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coaches.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-[#E2E6DF] bg-[#FAFBF9] space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover border" />
                    <div>
                      <div className="text-xs font-bold text-[#11181C]">{c.name}</div>
                      <div className="text-[11px] font-mono text-[#2D5E12]">{c.role}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#5A636A] line-clamp-2">{c.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RELATED COURSES CAROUSEL / GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#11181C] uppercase tracking-wide">
              Các khóa học Pickleball khác bạn có thể quan tâm
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {courses.filter((c) => c.id !== currentCourseId).slice(0, 3).map((item) => (
              <div 
                key={item.id}
                onClick={() => handleCourseSwitch(item.id)}
                className="group cursor-pointer rounded-2xl bg-white border border-[#E2E6DF] overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#11181C]/80 text-[#B6F05C] font-mono text-[10px] font-bold">
                    {item.level}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-sm text-[#11181C] group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E6DF]">
                    <span className="font-mono font-bold text-[#11181C]">₫{item.price.toLocaleString('vi-VN')}</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
