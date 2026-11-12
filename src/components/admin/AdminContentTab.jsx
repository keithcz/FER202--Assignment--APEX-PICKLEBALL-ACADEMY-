import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Home, ShoppingBag, Info } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { DEFAULT_SITE_CONTENT } from '../../data/defaultSiteContent';

function Field({ label, value, onChange, multiline = false, placeholder = '' }) {
  const baseClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]';
  return (
    <div>
      <label className="block text-xs font-semibold text-[#11181C] mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function AdminContentTab({ onNotify }) {
  const { siteContent, updateSiteContentSection } = useSiteData();
  const [subTab, setSubTab] = useState('home');

  const [homeForm, setHomeForm] = useState(siteContent.home);
  const [shopForm, setShopForm] = useState(siteContent.shop);
  const [blogForm, setBlogForm] = useState(siteContent.blog);
  const [aboutForm, setAboutForm] = useState(siteContent.about);
  const [contactForm, setContactForm] = useState(siteContent.contact);

  useEffect(() => {
    setHomeForm(siteContent.home);
    setShopForm(siteContent.shop);
    setBlogForm(siteContent.blog);
    setAboutForm(siteContent.about);
    setContactForm(siteContent.contact);
  }, [siteContent]);

  const handleSaveHome = (e) => {
    e.preventDefault();
    updateSiteContentSection('home', homeForm);
    onNotify('Đã lưu nội dung Trang chủ');
  };

  const handleSaveShopBlog = (e) => {
    e.preventDefault();
    updateSiteContentSection('shop', {
      ...shopForm,
      promoPercent: Math.min(90, Math.max(0, Number(shopForm.promoPercent) || 0)),
    });
    updateSiteContentSection('blog', blogForm);
    onNotify('Đã lưu nội dung Pro Shop & Cẩm nang');
  };

  const handleSaveAboutContact = (e) => {
    e.preventDefault();
    updateSiteContentSection('about', aboutForm);
    updateSiteContentSection('contact', contactForm);
    onNotify('Đã lưu nội dung Giới thiệu, Liên hệ & Footer');
  };

  const updateStat = (idx, field, val) => {
    setHomeForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) =>
        i === idx ? { ...s, [field]: field === 'value' ? Number(val) || 0 : val } : s
      ),
    }));
  };

  const updateHighlight = (idx, field, val) => {
    setHomeForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === idx ? { ...h, [field]: val } : h)),
    }));
  };

  const updateTimeline = (idx, field, val) => {
    setAboutForm((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t, i) => (i === idx ? { ...t, [field]: val } : t)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'home', label: 'Trang chủ (Home)', icon: Home },
          { id: 'shopblog', label: 'Trang Pro Shop & Cẩm nang', icon: ShoppingBag },
          { id: 'about', label: 'Giới thiệu, Liên hệ & Footer', icon: Info },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              subTab === tab.id
                ? 'bg-[#11181C] text-white shadow-sm'
                : 'bg-white text-[#5A636A] border border-[#E2E6DF] hover:text-[#11181C]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. HOME CONTENT */}
      {subTab === 'home' && (
        <form onSubmit={handleSaveHome} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] pb-3">
              <h3 className="text-sm font-bold text-[#11181C]">Hero Banner & Tuyển sinh</h3>
              <button
                type="button"
                onClick={() => setHomeForm(DEFAULT_SITE_CONTENT.home)}
                className="text-[11px] text-[#5A636A] hover:text-[#11181C] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Mặc định Trang chủ</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nhãn trạng thái (Status Pill)"
                value={homeForm.statusPillLabel}
                onChange={(v) => setHomeForm({ ...homeForm, statusPillLabel: v })}
              />
              <Field
                label="Nội dung khuyến mãi (Promo)"
                value={homeForm.statusPillPromo}
                onChange={(v) => setHomeForm({ ...homeForm, statusPillPromo: v })}
              />
              <Field
                label="Tiêu đề Hero (Dòng 1)"
                value={homeForm.heroTitleLine1}
                onChange={(v) => setHomeForm({ ...homeForm, heroTitleLine1: v })}
              />
              <Field
                label="Tiêu đề Hero (Phần nhấn mạnh)"
                value={homeForm.heroTitleHighlight}
                onChange={(v) => setHomeForm({ ...homeForm, heroTitleHighlight: v })}
              />
            </div>
            <Field
              label="Mô tả Hero"
              multiline
              value={homeForm.heroDescription}
              onChange={(v) => setHomeForm({ ...homeForm, heroDescription: v })}
            />
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              4 Thẻ Thống Kê (Bento Stats)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {homeForm.stats.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2">
                  <div className="font-mono text-[10px] font-bold text-[#2D5E12]">Thống kê #{idx + 1}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Số liệu"
                      value={String(stat.value)}
                      onChange={(v) => updateStat(idx, 'value', v)}
                    />
                    <Field
                      label="Hậu tố (VD: +, %)"
                      value={stat.suffix}
                      onChange={(v) => updateStat(idx, 'suffix', v)}
                    />
                  </div>
                  <Field
                    label="Nhãn hiển thị"
                    value={stat.label}
                    onChange={(v) => updateStat(idx, 'label', v)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              Video Giới Thiệu & Banner Đặt Sân & CTA Cuối Trang
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Link Video YouTube (Watch hoặc Embed URL)"
                value={homeForm.videoYoutubeUrl}
                onChange={(v) => setHomeForm({ ...homeForm, videoYoutubeUrl: v })}
              />
              <Field
                label="Nhãn Video"
                value={homeForm.videoTag}
                onChange={(v) => setHomeForm({ ...homeForm, videoTag: v })}
              />
              <Field
                label="Tiêu đề Video (Dòng 1)"
                value={homeForm.videoTitleLine1}
                onChange={(v) => setHomeForm({ ...homeForm, videoTitleLine1: v })}
              />
              <Field
                label="Tiêu đề Video (Điểm nhấn)"
                value={homeForm.videoTitleHighlight}
                onChange={(v) => setHomeForm({ ...homeForm, videoTitleHighlight: v })}
              />
            </div>
            <Field
              label="Mô tả Video"
              multiline
              value={homeForm.videoDescription}
              onChange={(v) => setHomeForm({ ...homeForm, videoDescription: v })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {homeForm.highlights.map((h, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2">
                  <div className="font-mono text-[10px] font-bold text-[#2D5E12]">Tiêu chuẩn #{idx + 1}</div>
                  <Field label="Tiêu đề" value={h.title} onChange={(v) => updateHighlight(idx, 'title', v)} />
                  <Field label="Mô tả" multiline value={h.desc} onChange={(v) => updateHighlight(idx, 'desc', v)} />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Meta 1" value={h.meta1} onChange={(v) => updateHighlight(idx, 'meta1', v)} />
                    <Field label="Meta 2" value={h.meta2} onChange={(v) => updateHighlight(idx, 'meta2', v)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E6DF]">
              <Field
                label="Tiêu đề Banner Đặt sân"
                value={homeForm.courtBannerTitle}
                onChange={(v) => setHomeForm({ ...homeForm, courtBannerTitle: v })}
              />
              <Field
                label="Mô tả Banner Đặt sân"
                value={homeForm.courtBannerDesc}
                onChange={(v) => setHomeForm({ ...homeForm, courtBannerDesc: v })}
              />
              <Field
                label="Tiêu đề CTA cuối trang (Dòng 1)"
                value={homeForm.ctaTitleLine1}
                onChange={(v) => setHomeForm({ ...homeForm, ctaTitleLine1: v })}
              />
              <Field
                label="Tiêu đề CTA cuối trang (Nhấn mạnh)"
                value={homeForm.ctaTitleHighlight}
                onChange={(v) => setHomeForm({ ...homeForm, ctaTitleHighlight: v })}
              />
            </div>
            <Field
              label="Mô tả CTA cuối trang"
              multiline
              value={homeForm.ctaDesc}
              onChange={(v) => setHomeForm({ ...homeForm, ctaDesc: v })}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-[#B6F05C]" />
              <span>Lưu nội dung Trang chủ</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. SHOP & BLOG CONTENT */}
      {subTab === 'shopblog' && (
        <form onSubmit={handleSaveShopBlog} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              Header & Khuyến mãi Trang Bán Hàng (Pro Shop)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nhãn đầu trang Pro Shop"
                value={shopForm.badge}
                onChange={(v) => setShopForm({ ...shopForm, badge: v })}
              />
              <Field
                label="Tiêu đề chính Pro Shop"
                value={shopForm.title}
                onChange={(v) => setShopForm({ ...shopForm, title: v })}
              />
              <Field
                label="Mã giảm giá giỏ hàng"
                value={shopForm.promoCode}
                onChange={(v) => setShopForm({ ...shopForm, promoCode: v.toUpperCase() })}
              />
              <Field
                label="Phần trăm giảm (%)"
                value={String(shopForm.promoPercent)}
                onChange={(v) => setShopForm({ ...shopForm, promoPercent: v })}
              />
            </div>
            <Field
              label="Mô tả Pro Shop"
              multiline
              value={shopForm.description}
              onChange={(v) => setShopForm({ ...shopForm, description: v })}
            />
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              Header & Banner Quy Tắc Trang Cẩm Nang (Blog)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nhãn Cẩm nang"
                value={blogForm.badge}
                onChange={(v) => setBlogForm({ ...blogForm, badge: v })}
              />
              <Field
                label="Tiêu đề Cẩm nang"
                value={blogForm.title}
                onChange={(v) => setBlogForm({ ...blogForm, title: v })}
              />
            </div>
            <Field
              label="Mô tả Cẩm nang"
              multiline
              value={blogForm.description}
              onChange={(v) => setBlogForm({ ...blogForm, description: v })}
            />
            <Field
              label="Tiêu đề khung Quy tắc vàng Kitchen"
              value={blogForm.kitchenTitle}
              onChange={(v) => setBlogForm({ ...blogForm, kitchenTitle: v })}
            />
            <Field
              label="Mô tả khung Quy tắc vàng Kitchen"
              multiline
              value={blogForm.kitchenDesc}
              onChange={(v) => setBlogForm({ ...blogForm, kitchenDesc: v })}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-[#B6F05C]" />
              <span>Lưu Pro Shop & Cẩm nang</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. ABOUT & CONTACT CONTENT */}
      {subTab === 'about' && (
        <form onSubmit={handleSaveAboutContact} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              Trang Giới Thiệu & Dấu Mốc Lịch Sử
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nhãn Giới thiệu"
                value={aboutForm.badge}
                onChange={(v) => setAboutForm({ ...aboutForm, badge: v })}
              />
              <Field
                label="Tiêu đề Giới thiệu"
                value={aboutForm.title}
                onChange={(v) => setAboutForm({ ...aboutForm, title: v })}
              />
            </div>
            <Field
              label="Mô tả sứ mệnh học viện"
              multiline
              value={aboutForm.description}
              onChange={(v) => setAboutForm({ ...aboutForm, description: v })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {aboutForm.timeline.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2">
                  <Field label="Năm" value={item.year} onChange={(v) => updateTimeline(idx, 'year', v)} />
                  <Field label="Tiêu đề" value={item.title} onChange={(v) => updateTimeline(idx, 'title', v)} />
                  <Field label="Mô tả" multiline value={item.desc} onChange={(v) => updateTimeline(idx, 'desc', v)} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#11181C] border-b border-[#E2E6DF] pb-3">
              Thông Tin Liên Hệ & Chân Trang (Footer)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Địa chỉ ngắn (Footer)"
                value={contactForm.address}
                onChange={(v) => setContactForm({ ...contactForm, address: v })}
              />
              <Field
                label="Địa chỉ chi tiết (Trang Liên hệ)"
                value={contactForm.addressNote}
                onChange={(v) => setContactForm({ ...contactForm, addressNote: v })}
              />
              <Field
                label="Số Hotline"
                value={contactForm.hotline}
                onChange={(v) => setContactForm({ ...contactForm, hotline: v })}
              />
              <Field
                label="Ghi chú Hotline"
                value={contactForm.hotlineNote}
                onChange={(v) => setContactForm({ ...contactForm, hotlineNote: v })}
              />
              <Field
                label="Email liên hệ"
                value={contactForm.email}
                onChange={(v) => setContactForm({ ...contactForm, email: v })}
              />
              <Field
                label="Giờ mở cửa"
                value={contactForm.hours}
                onChange={(v) => setContactForm({ ...contactForm, hours: v })}
              />
            </div>
            <Field
              label="Giới thiệu ngắn ở Footer"
              multiline
              value={contactForm.footerBio}
              onChange={(v) => setContactForm({ ...contactForm, footerBio: v })}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-[#B6F05C]" />
              <span>Lưu Giới thiệu & Liên hệ</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
