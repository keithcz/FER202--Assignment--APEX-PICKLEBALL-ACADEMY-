import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Calendar,
  Sparkles,
  Award,
  Phone,
  BookOpen,
  MapPin,
  ExternalLink,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { isAdminUser } from '../utils/auth';
import { useSiteData } from '../context/SiteDataContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  setIsCartOpen, 
  currentUser, 
  setIsAuthOpen,
  onLogout,
  onSelectCourse,
  setAboutSection
}) {
  const { courses } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleCourseClick = (courseId) => {
    if (onSelectCourse) {
      onSelectCourse(courseId);
    }
    setActiveTab('courses');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleAboutNavClick = (sectionId) => {
    if (setAboutSection) {
      setAboutSection(sectionId);
    }
    setActiveTab('about');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-[#11181C]/95 text-white backdrop-blur-md shadow-lg py-2.5 border-b border-[#232C33]' 
        : 'bg-[#11181C] text-white shadow-md py-3.5 border-b border-[#232C33]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand: APEX ACADEMY */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 group focus:outline-none text-left"
            aria-label="Apex Pickleball Academy - Trang chủ"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B6F05C] to-[#84CC16] text-[#11181C] flex items-center justify-center font-mono font-black text-sm shadow-md transition-transform duration-150 group-hover:scale-105">
              <span>▲</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-white text-lg">APEX</span>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#B6F05C] text-[#11181C]">
                  ACADEMY
                </span>
              </div>
              <p className="font-mono text-[8px] tracking-widest text-[#94A3B8] mt-1 uppercase">Pickleball & Tennis Pro</p>
            </div>
          </button>

          {/* Desktop Navigation: Grouped & Categorized like reference */}
          <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold tracking-wide">
            
            {/* 1. GIỚI THIỆU (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleNavClick('about')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 uppercase ${
                  activeTab === 'about' ? 'text-[#B6F05C]' : 'text-gray-200 hover:text-white'
                }`}
              >
                <span>GIỚI THIỆU</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-[#B6F05C]' : 'opacity-70'}`} />
              </button>

              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-60 pt-2 z-50 animate-fadeIn">
                  <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl py-2 overflow-hidden text-sm">
                    <button
                      onClick={() => handleAboutNavClick('about-academy')}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-[#334155] hover:text-[#B6F05C] transition-colors flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#B6F05C]" />
                      <span>Về Học Viện Apex</span>
                    </button>
                    <button
                      onClick={() => handleAboutNavClick('about-coaches')}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-[#334155] hover:text-[#B6F05C] transition-colors flex items-center gap-2.5"
                    >
                      <Award className="w-4 h-4 text-[#B6F05C]" />
                      <span>Đội ngũ Huấn Luyện Viên</span>
                    </button>
                    <button
                      onClick={() => handleAboutNavClick('about-courts')}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-[#334155] hover:text-[#B6F05C] transition-colors flex items-center gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-[#B6F05C]" />
                      <span>Hệ thống 4 Sân Đạt Chuẩn</span>
                    </button>
                    <button
                      onClick={() => handleAboutNavClick('about-contact')}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-[#334155] hover:text-[#B6F05C] transition-colors flex items-center gap-2.5"
                    >
                      <Phone className="w-4 h-4 text-[#B6F05C]" />
                      <span>Thông tin liên hệ & Hỗ trợ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* KHÓA HỌC PICKLEBALL (Dropdown - Focus Menu Item) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('pickleball')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleNavClick('courses')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 uppercase font-bold ${
                  activeTab === 'courses' || activeTab === 'booking' 
                    ? 'text-[#B6F05C] border-b-2 border-[#B6F05C]' 
                    : 'text-gray-100 hover:text-[#B6F05C]'
                }`}
              >
                <span>KHÓA HỌC PICKLEBALL</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'pickleball' ? 'rotate-180 text-[#B6F05C]' : 'opacity-70'}`} />
              </button>

              {activeDropdown === 'pickleball' && (
                <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-fadeIn">
                  <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl py-2 overflow-hidden text-sm">
                    {courses.map((courseItem, idx) => {
                      const dotColors = ['bg-[#B6F05C]', 'bg-blue-400', 'bg-pink-400', 'bg-amber-400'];
                      return (
                        <button
                          key={courseItem.id}
                          onClick={() => handleCourseClick(courseItem.id)}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-[#334155] hover:text-[#B6F05C] transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[idx % dotColors.length]}`}></span>
                            <span className="font-medium truncate">{courseItem.title.split('(')[0].trim()}</span>
                          </div>
                          {idx === 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">Hot</span>
                          )}
                        </button>
                      );
                    })}
                    <div className="my-1 border-t border-[#334155]"></div>
                    <button
                      onClick={() => handleNavClick('courses')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#B6F05C] hover:bg-[#334155] transition-colors flex items-center justify-between"
                    >
                      <span>Xem toàn bộ chương trình đào tạo & Lịch học →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. TÌM SÂN / ĐẶT SÂN */}
            <button
              onClick={() => handleNavClick('courts')}
              className={`px-3 py-2 rounded-lg transition-colors uppercase ${
                activeTab === 'courts' ? 'text-[#B6F05C]' : 'text-gray-200 hover:text-white'
              }`}
            >
              <span>TÌM SÂN</span>
            </button>

            {/* 5. TIN APEX / CẨM NANG */}
            <button
              onClick={() => handleNavClick('blog')}
              className={`px-3 py-2 rounded-lg transition-colors uppercase ${
                activeTab === 'blog' ? 'text-[#B6F05C]' : 'text-gray-200 hover:text-white'
              }`}
            >
              <span>TIN TỨC</span>
            </button>

            {/* 6. PRO SHOP */}
            <button
              onClick={() => handleNavClick('shop')}
              className={`px-3 py-2 rounded-lg transition-colors uppercase ${
                activeTab === 'shop' ? 'text-[#B6F05C]' : 'text-gray-200 hover:text-white'
              }`}
            >
              <span>PRO SHOP</span>
            </button>

            {/* 7. KHAI GIẢNG LỚP (Highlight Button - Orange/Amber pill like image) */}
            <button
              onClick={() => handleNavClick('courses')}
              className="ml-1 mr-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 animate-pulse"
            >
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              <span>KHAI GIẢNG LỚP</span>
            </button>

          </nav>

          {/* Right Action Controls: Social Icons + Cart + User */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white transition-all shadow-sm"
              title="Giỏ hàng Pro Shop"
              aria-label="Xem giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#B6F05C] text-[#11181C] font-mono text-[10px] font-bold rounded-full flex items-center justify-center border border-[#11181C]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Admin / Dashboard */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdminUser(currentUser) && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'admin'
                        ? 'bg-[#B6F05C] border-[#B6F05C] text-[#11181C]'
                        : 'bg-[#1E293B] border-[#B6F05C]/40 text-[#B6F05C] hover:bg-[#334155]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Quản trị</span>
                  </button>
                )}
                <button
                  onClick={() => handleNavClick(isAdminUser(currentUser) ? 'admin' : 'dashboard')}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2 transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-[#B6F05C] border-[#B6F05C] text-[#11181C]'
                      : 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B6F05C]"></span>
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="font-mono text-[11px] text-gray-400 hover:text-red-400 transition-colors px-1"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-[#B6F05C]" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[#1E293B] border border-[#334155] text-white"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B6F05C] text-[#11181C] font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-[#1E293B] border border-[#334155] text-white"
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 p-4 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-2xl text-white">
            <div className="space-y-1">
              
              {/* Giới thiệu */}
              <button
                onClick={() => handleNavClick('about')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#334155]"
              >
                <span>GIỚI THIỆU HỌC VIỆN</span>
              </button>

              {/* Khóa học Pickleball Dropdown */}
              <div className="py-1 border-y border-[#334155] my-1">
                <div className="px-3.5 py-1.5 text-[11px] font-mono text-[#B6F05C] uppercase font-bold">
                  Khóa học Pickleball
                </div>
                {courses.map((courseItem, idx) => (
                  <button
                    key={courseItem.id}
                    onClick={() => handleCourseClick(courseItem.id)}
                    className="w-full text-left px-4 py-2 rounded-lg text-xs text-gray-200 hover:bg-[#334155] flex items-center justify-between gap-2"
                  >
                    <span className="truncate">• {courseItem.title.split('(')[0].trim()}</span>
                    {idx === 0 && <span className="text-[10px] text-amber-400 font-bold shrink-0">Hot</span>}
                  </button>
                ))}
              </div>

              {/* Tìm sân */}
              <button
                onClick={() => handleNavClick('courts')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#334155]"
              >
                <span>TÌM SÂN / ĐẶT SÂN</span>
              </button>

              {/* Pro Shop */}
              <button
                onClick={() => handleNavClick('shop')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#334155]"
              >
                <span>PRO SHOP VỢT & PHỤ KIỆN</span>
              </button>

              {/* Tin tức */}
              <button
                onClick={() => handleNavClick('blog')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#334155]"
              >
                <span>TIN TỨC & CẨM NANG</span>
              </button>

            </div>

            {/* Mobile CTA Button: Khai giảng lớp */}
            <div className="mt-3 pt-3 border-t border-[#334155] flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('courses')}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                <span>KHAI GIẢNG LỚP MỚI NHẤT</span>
              </button>

              {currentUser ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#334155] mt-1">
                  <div className="text-xs text-white">
                    {isAdminUser(currentUser) ? 'Admin:' : 'Học viên:'} <strong>{currentUser.name}</strong>
                  </div>
                  <div className="flex gap-2">
                    {isAdminUser(currentUser) && (
                      <>
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="text-xs font-semibold text-[#B6F05C] underline"
                        >
                          Quản trị CMS
                        </button>
                        <span className="text-gray-400">|</span>
                      </>
                    )}
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="text-xs font-semibold text-[#B6F05C] underline"
                    >
                      Dashboard
                    </button>
                    <span className="text-gray-400">|</span>
                    <button onClick={onLogout} className="text-xs text-red-400">
                      Thoát
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-full bg-[#334155] text-white text-xs font-medium flex items-center justify-center gap-1.5 mt-1"
                >
                  <User className="w-3.5 h-3.5 text-[#B6F05C]" />
                  <span>Đăng nhập / Quản trị</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
