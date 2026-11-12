import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function Footer({ setActiveTab, onOpenAdmin }) {
  const { siteContent } = useSiteData();
  const contact = siteContent.contact;
  const brands = [
    { name: 'JOOLA', sub: 'Official Partner' },
    { name: 'SELKIRK', sub: 'Premium Paddles' },
    { name: 'FRANKLIN', sub: 'USA Approved' },
    { name: 'HEAD', sub: 'Pro Equipment' },
    { name: 'ONIX', sub: 'Tournament Series' },
    { name: 'ENGAGE', sub: 'Pursuit Series' },
    { name: 'PADDLETEK', sub: 'Carbon Fiber' },
    { name: 'GAMMA', sub: 'Sports Gear' },
    { name: 'NIKE', sub: 'Court Apparel' },
    { name: 'ADIDAS', sub: 'Performance Wear' },
    { name: 'FILA', sub: 'Sports Fashion' },
    { name: 'YONEX', sub: 'Precision Tech' },
  ];

  return (
    <>
      {/* Brand Partners Marquee */}
      <div className="bg-[#FAFBF9] border-t border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-[#88929A] mb-4">
            Đối tác thương hiệu đồng hành
          </p>
          <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E6DF] py-4">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-2.5 px-2 select-none">
                  <div className="w-9 h-9 rounded-xl bg-[#F4F6F2] border border-[#E2E6DF] flex items-center justify-center">
                    <span className="font-extrabold text-[10px] text-[#11181C] tracking-tight">{brand.name.charAt(0)}</span>
                  </div>
                  <div className="leading-none">
                    <span className="font-bold text-xs text-[#11181C] tracking-tight block">{brand.name}</span>
                    <span className="font-mono text-[9px] text-[#88929A]">{brand.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F4F6F2] border-t border-[#E2E6DF] text-[#5A636A] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#11181C] text-white flex items-center justify-center font-mono font-bold text-xs">
                <span className="text-[#B6F05C]">▲</span>
              </div>
              <span className="font-extrabold tracking-tight text-[#11181C] text-sm">
                APEX PICKLEBALL ACADEMY
              </span>
            </div>
            <p className="text-[#5A636A] text-xs leading-relaxed max-w-sm">
              {contact.footerBio}
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#2D5E12]">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>Cụm 4 sân đạt chuẩn kiểm định USA Pickleball</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[#11181C] font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Chương trình học
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C] transition-colors">
                  Pickleball Căn bản (1.0 - 2.5)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C] transition-colors">
                  Chiến thuật Nâng cao (3.0 - 4.0)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C] transition-colors">
                  VIP 1 Kèm 1 Huấn luyện riêng
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C] transition-colors">
                  Khóa Trẻ em (Junior Academy)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#11181C] transition-colors">
                  Luyện thi đấu Tournament Prep
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Services */}
          <div>
            <h4 className="text-[#11181C] font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Dịch vụ & Tiện ích
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('courts')} className="hover:text-[#11181C] transition-colors flex items-center gap-1">
                  <span>Đặt sân trực tuyến theo giờ</span>
                  <ArrowUpRight className="w-3 h-3 text-[#11181C]" />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#11181C] transition-colors">
                  Apex Pro Shop (Vợt & Phụ kiện)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#11181C] transition-colors">
                  Cẩm nang Kitchen & Kỹ thuật
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('booking')} className="hover:text-[#11181C] transition-colors">
                  Đăng ký thẩm định DUPR
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#11181C] transition-colors">
                  Vị trí sân & Google Maps
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div>
            <h4 className="text-[#11181C] font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Trụ sở & Liên hệ
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#11181C] shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#11181C] shrink-0" />
                <span className="font-medium text-[#11181C]">{contact.hotlineNote}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#11181C] shrink-0" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#11181C] shrink-0" />
                <span>{contact.hours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#E2E6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#88929A] text-[11px]">
          <p>© 2026 APEX Pickleball Academy. Thiết kế lấy cảm hứng từ Enode Clean Energy Style.</p>
          <div className="flex items-center gap-3 font-mono">
            {onOpenAdmin && (
              <>
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 text-[#11181C] hover:text-[#2D5E12] font-semibold transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Quản trị (Admin)</span>
                </button>
                <span>•</span>
              </>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
              <span>SYSTEM ALL SYSTEMS NORMAL</span>
            </span>
            <span>•</span>
            <span>RESPONSIVE 320PX-4K</span>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
