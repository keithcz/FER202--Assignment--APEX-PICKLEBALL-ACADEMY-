import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ShieldCheck, 
  Users,
  Sparkles
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { COURTS_DATA } from '../data/courtsData';

export default function AboutContactPage({ scrollToSection, clearScrollSection }) {
  const { coaches, siteContent } = useSiteData();
  const aboutContent = siteContent.about;
  const contactContent = siteContent.contact;
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn khóa học đào tạo',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll to section when navigated from navbar dropdown
  useEffect(() => {
    if (scrollToSection) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollToSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (clearScrollSection) {
          clearScrollSection();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection, clearScrollSection]);

  const validate = () => {
    const errs = {};
    if (!contactForm.name.trim()) errs.name = 'Vui lòng nhập họ và tên';
    if (!contactForm.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errs.email = 'Email không đúng định dạng';
    }
    if (!contactForm.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(contactForm.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại gồm 10 số (VD: 0912345678)';
    }
    if (!contactForm.message.trim()) {
      errs.message = 'Vui lòng nhập nội dung cần giải đáp';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSuccess(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Tư vấn khóa học đào tạo',
        message: ''
      });
      setIsSuccess(false);
    }, 3500);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* 1. Header & Academy History */}
      <div id="about-academy" className="text-center max-w-3xl mx-auto space-y-3 scroll-mt-24">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
          {aboutContent.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#11181C]">
          {aboutContent.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A636A] max-w-2xl mx-auto leading-relaxed">
          {aboutContent.description}
        </p>
      </div>

      {/* Story Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aboutContent.timeline.map((item, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white border border-[#E2E6DF] space-y-2.5 shadow-sm">
            <div className="font-mono text-2xl font-black text-[#11181C]">{item.year}</div>
            <h3 className="text-sm font-bold text-[#11181C] tracking-tight">{item.title}</h3>
            <p className="text-xs text-[#5A636A] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Coaches Roster */}
      <div id="about-coaches" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            Đội ngũ chuyên môn
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#11181C]">
            Huấn luyện viên chứng chỉ quốc tế
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="p-5 rounded-3xl bg-white border border-[#E2E6DF] flex flex-col justify-between space-y-4 hover:border-[#11181C] transition-all shadow-sm"
            >
              <div>
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="w-full h-44 rounded-2xl object-cover mb-3"
                />
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FAFBF9] text-[#11181C] border border-[#E2E6DF]">
                  {coach.dupr}
                </span>
                <h3 className="text-sm font-bold text-[#11181C] tracking-tight mt-2">{coach.name}</h3>
                <p className="text-xs text-[#5A636A]">{coach.role}</p>
                <p className="text-[11px] text-[#88929A] mt-2 line-clamp-3 leading-relaxed">{coach.bio}</p>
              </div>

              <div className="pt-3 border-t border-[#E2E6DF] text-[11px] text-[#5A636A]">
                <span className="text-[#11181C] font-semibold block">Sở trường:</span>
                <span>{coach.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Courts System */}
      <div id="about-courts" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            Cơ sở vật chất
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#11181C]">
            Hệ thống 4 Sân Đạt Chuẩn Quốc Tế
          </h2>
          <p className="text-xs sm:text-sm text-[#5A636A] max-w-lg mx-auto leading-relaxed">
            Được đầu tư theo tiêu chuẩn USA Pickleball với mặt sân giảm chấn, hệ thống chiếu sáng LED chuyên nghiệp và camera phân tích AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {COURTS_DATA.map((court) => (
            <div
              key={court.id}
              className="rounded-3xl bg-white border border-[#E2E6DF] overflow-hidden hover:border-[#11181C] transition-all shadow-sm"
            >
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-2">
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592]">
                  {court.type}
                </span>
                <h3 className="text-sm font-bold text-[#11181C] tracking-tight">{court.name}</h3>
                <p className="text-[11px] text-[#5A636A] leading-relaxed">{court.description}</p>
                <div className="pt-2 border-t border-[#E2E6DF] text-[11px] text-[#5A636A] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#11181C]">Mặt sân:</span>
                    <span>{court.surface}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#11181C]">Ánh sáng:</span>
                    <span>{court.lighting}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Map & Contact Form */}
      <div id="about-contact" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 scroll-mt-24">
        
        {/* Left: Contact Form (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-0.5 rounded-full">
              Hỗ trợ 24/7
            </span>
            <h3 className="text-lg font-bold text-[#11181C] tracking-tight mt-2">Gửi thắc mắc đến Ban Quản Lý</h3>
            <p className="text-xs text-[#5A636A] mt-0.5">
              Phản hồi nhanh chóng qua Zalo hoặc điện thoại trong vòng 30 phút.
            </p>
          </div>

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D5E12]" />
              <span>Cảm ơn bạn! Ban Quản Lý đã tiếp nhận thông tin và sẽ liên hệ lại ngay.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#11181C] mb-1">Họ và tên *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
              />
              {errors.name && <p className="text-red-600 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#11181C] mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
                />
                {errors.phone && <p className="text-red-600 text-[11px] mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#11181C] mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
                />
                {errors.email && <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#11181C] mb-1">Chủ đề quan tâm</label>
              <select
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              >
                <option value="Tư vấn khóa học đào tạo">Tư vấn khóa học đào tạo</option>
                <option value="Hợp tác thuê sân tổ chức giải">Hợp tác thuê sân tổ chức giải</option>
                <option value="Mua vợt & dụng cụ số lượng lớn">Mua vợt & dụng cụ số lượng lớn</option>
                <option value="Góp ý chất lượng dịch vụ">Góp ý chất lượng dịch vụ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#11181C] mb-1">Nội dung tin nhắn *</label>
              <textarea
                rows={3}
                placeholder="Để lại câu hỏi hoặc yêu cầu của bạn..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
              />
              {errors.message && <p className="text-red-600 text-[11px] mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Gửi tin nhắn</span>
              <Send className="w-3.5 h-3.5 text-[#B6F05C]" />
            </button>
          </form>
        </div>

        {/* Right: Map & Location Details (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Google Maps Iframe */}
          <div className="rounded-3xl overflow-hidden border border-[#E2E6DF] shadow-sm h-80 sm:h-96 relative bg-[#F4F6F2]">
            <iframe
              title="Apex Pickleball Academy Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.288258380295!2d105.82361667591322!3d21.021149787042577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab769e59d48b%3A0xe103e30f135bfa3a!2zSG_DoG5nIEPhuqd1LCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Quick contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] text-xs space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-[#11181C] font-bold">
                <MapPin className="w-4 h-4 text-[#11181C]" />
                <span>Trụ sở chính</span>
              </div>
              <p className="text-[#5A636A]">{contactContent.addressNote}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] text-xs space-y-1 shadow-sm">
              <div className="flex items-center gap-2 text-[#11181C] font-bold">
                <Phone className="w-4 h-4 text-[#11181C]" />
                <span>Hotline đặt sân & học</span>
              </div>
              <p className="font-mono text-[#11181C] font-bold">{contactContent.hotlineNote}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
