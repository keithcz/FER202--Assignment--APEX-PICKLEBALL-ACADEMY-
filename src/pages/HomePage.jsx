import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Star, 
  Zap, 
  Video, 
  CheckCircle2, 
  ChevronRight,
  Play,
  Award,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Heart,
  ArrowUpRight,
  Quote,
  Flame,
  CircleDot,
  Dumbbell
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { useSiteData } from '../context/SiteDataContext';
import { toYouTubeEmbedUrl } from '../data/defaultSiteContent';

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

/* ─── Animated Counter Component ─── */
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('vi-VN')}{suffix}</span>;
}

export default function HomePage({ setActiveTab, setSelectedCourseForRegister }) {
  const { courses, coaches, siteContent } = useSiteData();
  const homeContent = siteContent.home;
  const featuredCourses = courses.slice(0, 3);
  const highlightIcons = [Trophy, Video, ShieldCheck];
  // Video section no longer needs click-to-play state

  // Scroll reveal refs
  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [videoRef, videoVisible] = useScrollReveal(0.1);
  const [highlightsRef, highlightsVisible] = useScrollReveal(0.1);
  const [coursesRef, coursesVisible] = useScrollReveal(0.1);
  const [coachesRef, coachesVisible] = useScrollReveal(0.1);
  const [journeyRef, journeyVisible] = useScrollReveal(0.1);
  const [bannerRef, bannerVisible] = useScrollReveal(0.1);
  const [testimonialRef, testimonialVisible] = useScrollReveal(0.1);
  const [ctaRef, ctaVisible] = useScrollReveal(0.1);

  const handleRegisterCourse = (course) => {
    if (setSelectedCourseForRegister) {
      setSelectedCourseForRegister(course.id);
    }
    setActiveTab('booking');
  };

  return (
    <div className="pt-24 pb-20 space-y-0 overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION — Animated Gradient Mesh + Floating Orbs
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#B6F05C]/20 via-[#84CC16]/10 to-transparent blur-3xl animate-float-slow" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#B6F05C]/10 via-[#D3F592]/10 to-transparent blur-3xl animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#F1FCDA]/30 blur-3xl animate-pulse-slow" />
        </div>

        <div className={`text-center max-w-4xl mx-auto space-y-6 pt-10 pb-8 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Top Status Pill: Lime Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F6F2] border border-[#E2E6DF] text-xs text-[#11181C] shadow-sm animate-fade-in-down">
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84CC16]" />
            </span>
            <span className="font-medium">{homeContent.statusPillLabel}</span>
            <span className="text-[#88929A]">/</span>
            <span className="text-[11px] text-[#2D5E12] font-bold tracking-wide">
              {homeContent.statusPillPromo}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#11181C] leading-snug sm:leading-[1.25]">
            <span className="block">{homeContent.heroTitleLine1}</span>
            <span className="relative inline-block mt-2 sm:mt-3">
              <span className="relative z-10">{homeContent.heroTitleHighlight}</span>
              <span className="absolute bottom-1.5 sm:bottom-2 left-0 w-full h-3 sm:h-3.5 bg-[#B6F05C]/35 -z-0 rounded-full" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A636A] max-w-2xl mx-auto font-normal leading-relaxed">
            {homeContent.heroDescription}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('booking')}
              className="group w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold shadow-lg shadow-[#11181C]/10 transition-all flex items-center justify-center gap-2 active:scale-95 hover:shadow-xl hover:shadow-[#11181C]/15"
            >
              <span>Đăng ký khóa học</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B6F05C] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('courts')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-[#F4F6F2] border border-[#E2E6DF] text-[#11181C] text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Calendar className="w-3.5 h-3.5 text-[#5A636A]" />
              <span>Đặt sân trực tuyến</span>
            </button>
          </div>

          {/* Quick Stats Bento Chips */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {homeContent.stats.map((stat, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl bg-white border border-[#E2E6DF] text-center shadow-sm hover:shadow-md hover:border-[#B6F05C]/50 transition-all duration-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${600 + i * 100}ms` }}
              >
                <div className="font-mono text-2xl font-extrabold text-[#11181C]">
                  {stat.isDecimal ? stat.value + stat.suffix : <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="font-mono text-[10px] text-[#88929A] mt-0.5 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. CINEMATIC VIDEO SHOWCASE — Autoplay Loop, Above "Tiêu chuẩn 5 sao"
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={videoRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${videoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative rounded-[2rem] overflow-hidden group shadow-2xl shadow-black/20">
          {/* YouTube Video — Autoplay, Loop, Muted, No Controls */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#0A0E11]">
            
            {/* YouTube iframe — always visible, autoplay + loop */}
            <iframe
              className="absolute inset-0 w-full h-full scale-[1.2] pointer-events-none"
              src={toYouTubeEmbedUrl(homeContent.videoYoutubeUrl)}
              title="Apex Academy Pickleball"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ border: 'none' }}
            />

            {/* Cinematic gradient overlays on top of video */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E11]/80 via-[#0A0E11]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E11]/70 via-transparent to-[#0A0E11]/20 pointer-events-none" />
            
            {/* Scan lines effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
              }}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full px-8 sm:px-12 lg:px-16 gap-6">
                
                {/* Left: Text Info */}
                <div className="space-y-4 text-center sm:text-left max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/80">
                    <Flame className="w-3 h-3 text-[#B6F05C]" />
                    <span>{homeContent.videoTag}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                    {homeContent.videoTitleLine1}
                    <br />
                    <span className="text-[#B6F05C]">{homeContent.videoTitleHighlight}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md hidden sm:block drop-shadow">
                    {homeContent.videoDescription}
                  </p>
                  
                  {/* CTA Buttons on video */}
                  <div className="hidden sm:flex items-center gap-3 pt-2 pointer-events-auto">
                    <button
                      onClick={() => setActiveTab('booking')}
                      className="px-5 py-2 rounded-full bg-[#B6F05C] hover:bg-[#A4E841] text-[#11181C] text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#B6F05C]/20 active:scale-95"
                    >
                      <span>Đăng ký ngay</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setActiveTab('about')}
                      className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium transition-all"
                    >
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>

                {/* Right: Live badge + visual */}
                <div className="relative flex-shrink-0 hidden sm:flex flex-col items-center gap-3">
                  {/* Animated ring */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-[#B6F05C]/20 animate-ping-slow" />
                    <div className="absolute inset-2 rounded-full border border-white/10 animate-ping-slower" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#B6F05C] fill-[#B6F05C] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Now Playing</span>
                </div>
              </div>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0E11] to-transparent pt-12 pb-5 px-8 sm:px-12 lg:px-16 pointer-events-none">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {[
                  { icon: Trophy, text: 'Chuẩn PPA Tour' },
                  { icon: ShieldCheck, text: 'IPTPA Certified' },
                  { icon: Zap, text: 'AI Motion Analysis' },
                  { icon: Users, text: '1,200+ Alumni' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-white/40 text-[11px] font-mono">
                    <item.icon className="w-3.5 h-3.5 text-[#B6F05C]/60" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corner: LIVE indicator */}
            <div className="absolute top-5 right-5 flex items-center gap-2 pointer-events-none">
              <span className="flex h-2 w-2 relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider font-bold">LIVE</span>
            </div>

            {/* Bottom progress bar decorative — animated continuous */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 pointer-events-none">
              <div className="h-full bg-gradient-to-r from-[#B6F05C] to-[#84CC16] rounded-full animate-progress-bar" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. HIGHLIGHTS & FACILITIES (BENTO GRID - Enhanced)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={highlightsRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${highlightsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            {homeContent.highlightsBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#11181C] mt-3">
            {homeContent.highlightsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#5A636A] mt-2">
            {homeContent.highlightsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeContent.highlights.map((card, i) => {
            const IconComponent = highlightIcons[i % highlightIcons.length];
            const gradients = [
              'from-amber-500/10 to-orange-500/5',
              'from-blue-500/10 to-cyan-500/5',
              'from-emerald-500/10 to-green-500/5',
            ];
            return (
            <div
              key={i}
              className={`relative p-7 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all duration-500 flex flex-col justify-between shadow-sm group hover:shadow-lg ${highlightsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradients[i % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#F4F6F2] text-[#11181C] flex items-center justify-center border border-[#E2E6DF] group-hover:bg-[#11181C] group-hover:border-[#11181C] transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-[#11181C] group-hover:text-[#B6F05C] transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-[#11181C] tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5A636A] leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="relative mt-8 pt-4 border-t border-[#E2E6DF] flex items-center justify-between font-mono text-[11px] text-[#5A636A]">
                <span>{card.meta1}</span>
                <span className="text-[#2D5E12] font-semibold bg-[#F1FCDA] px-2 py-0.5 rounded">{card.meta2}</span>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. COACHES SHOWCASE — New Section
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={coachesRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${coachesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            Đội ngũ chuyên gia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#11181C] mt-3">
            Huấn luyện viên đẳng cấp quốc tế
          </h2>
          <p className="text-xs sm:text-sm text-[#5A636A] mt-2">
            100% HLV sở hữu chứng chỉ IPTPA / PPR và kinh nghiệm thi đấu chuyên nghiệp
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coaches.map((coach, i) => (
            <div
              key={coach.id}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all duration-500 shadow-sm hover:shadow-xl ${coachesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Avatar */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11181C]/80 via-transparent to-transparent" />
                
                {/* DUPR badge */}
                <div className="absolute top-3 right-3 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#B6F05C] text-[#11181C]">
                  {coach.dupr}
                </div>

                {/* Name overlay on image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white tracking-tight">{coach.name}</h3>
                  <p className="text-[11px] text-white/70 font-medium">{coach.role}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-2">
                  <Award className="w-3.5 h-3.5 text-[#2D5E12] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-[#5A636A] leading-relaxed">{coach.certification}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-[#2D5E12] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-[#5A636A] leading-relaxed">{coach.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. FEATURED COURSES (Enhanced)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={coursesRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${coursesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
              Lộ trình bài bản
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#11181C] mt-2">
              Các khóa học nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-[#5A636A] mt-1">
              Từ người bắt đầu từ con số 0 đến vận động viên cọ xát giải đấu chuyên nghiệp
            </p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="group self-start sm:self-auto text-xs font-semibold text-[#11181C] hover:text-[#2D5E12] flex items-center gap-1 transition-colors"
          >
            <span className="underline underline-offset-4">Xem tất cả khóa học</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course, i) => (
            <div
              key={course.id}
              className={`rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all duration-500 flex flex-col overflow-hidden shadow-sm group hover:shadow-xl ${coursesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-[#F4F6F2]">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-3 left-3 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#11181C] text-white">
                  {course.badge}
                </span>
                <span className="absolute top-3 right-3 font-mono text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-[#11181C] backdrop-blur-sm border border-[#E2E6DF]">
                  {course.level}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#11181C] tracking-tight group-hover:text-[#2D5E12] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#5A636A] mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 text-xs border-t border-[#E2E6DF]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#88929A]">Thời lượng:</span>
                    <span className="font-medium text-[#11181C]">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#88929A]">Huấn luyện viên:</span>
                    <span className="font-medium text-[#11181C] truncate max-w-[170px]">{course.coach}</span>
                  </div>
                </div>

                {/* Price & Register CTA */}
                <div className="pt-4 border-t border-[#E2E6DF] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-[#88929A] uppercase block">Học phí</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-base font-bold text-[#11181C]">
                        {course.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegisterCourse(course)}
                    className="group/btn px-4 py-2 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-medium transition-all flex items-center gap-1 shadow-sm active:scale-95 hover:shadow-md"
                  >
                    <span>Đăng ký</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B6F05C] group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. JOURNEY / HOW IT WORKS — New Visual Timeline
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={journeyRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            4 bước đơn giản
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#11181C] mt-3">
            Hành trình chinh phục của bạn
          </h2>
          <p className="text-xs sm:text-sm text-[#5A636A] mt-2">
            Từ lần đầu cầm vợt đến khi tự tin bước lên sân thi đấu
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E2E6DF] to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: CircleDot,
                title: 'Đăng ký & Tư vấn',
                desc: 'Liên hệ tư vấn lộ trình học phù hợp với trình độ và mục tiêu cá nhân của bạn.',
                color: 'bg-blue-50 text-blue-600 border-blue-100',
                dot: 'bg-blue-500',
              },
              {
                step: '02',
                icon: Dumbbell,
                title: 'Tập luyện bài bản',
                desc: 'Học theo giáo trình chuẩn IPTPA/PPR với sự hướng dẫn 1:1 từ HLV quốc tế.',
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                dot: 'bg-emerald-500',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Phân tích & Tiến bộ',
                desc: 'Nhận báo cáo video kỹ thuật hàng tuần, theo dõi chỉ số DUPR tăng trưởng.',
                color: 'bg-amber-50 text-amber-600 border-amber-100',
                dot: 'bg-amber-500',
              },
              {
                step: '04',
                icon: Trophy,
                title: 'Thi đấu & Tỏa sáng',
                desc: 'Tự tin tham gia giải đấu nội bộ và các giải chuyên nghiệp toàn quốc.',
                color: 'bg-purple-50 text-purple-600 border-purple-100',
                dot: 'bg-purple-500',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative text-center transition-all duration-500 ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                {/* Step number + icon */}
                <div className="flex flex-col items-center">
                  {/* Dot on timeline */}
                  <div className={`hidden lg:block w-4 h-4 rounded-full ${item.dot} border-4 border-[#FAFBF9] shadow-md mb-6 z-10`} />
                  
                  <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#88929A] uppercase tracking-widest">Bước {item.step}</span>
                  <h3 className="text-sm font-bold text-[#11181C] mt-2 tracking-tight">{item.title}</h3>
                  <p className="text-[11px] text-[#5A636A] mt-2 leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. COURT BOOKING TEASER BANNER (Enhanced)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={bannerRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${bannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative rounded-3xl overflow-hidden border border-[#E2E6DF] shadow-lg">
          {/* Background with image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80"
              alt="Pickleball court"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F6F2] via-[#F4F6F2]/95 to-[#F4F6F2]/80" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B6F05C]/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
                {homeContent.courtBannerBadge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#11181C]">
                {homeContent.courtBannerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#5A636A] leading-relaxed max-w-xl">
                {homeContent.courtBannerDesc}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('courts')}
                  className="group px-6 py-2.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-lg"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B6F05C]" />
                  <span>Xem lịch & giữ sân</span>
                  <ArrowRight className="w-3 h-3 text-[#B6F05C] group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-[#EAECE8] text-[#11181C] text-xs font-medium border border-[#E2E6DF] transition-all shadow-sm"
                >
                  Cửa hàng Pro Shop
                </button>
              </div>
            </div>

            {/* Right side - Quick booking preview */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-[#E2E6DF] p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#11181C]">Sân trống hôm nay</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84CC16]" />
                  </span>
                </div>
                {[
                  { time: '08:00 - 09:30', court: 'Sân Indoor A1', status: 'Còn trống' },
                  { time: '10:00 - 11:30', court: 'Sân Indoor A2', status: 'Còn trống' },
                  { time: '14:00 - 15:30', court: 'Sân Rooftop B1', status: 'Sắp hết' },
                ].map((slot, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#E2E6DF] last:border-0">
                    <div>
                      <p className="font-mono text-[11px] font-bold text-[#11181C]">{slot.time}</p>
                      <p className="text-[10px] text-[#88929A]">{slot.court}</p>
                    </div>
                    <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full ${slot.status === 'Sắp hết' ? 'bg-amber-50 text-amber-600' : 'bg-[#F1FCDA] text-[#2D5E12]'}`}>
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. TESTIMONIALS & REVIEWS (Enhanced)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={testimonialRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-1000 ${testimonialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
            Đánh giá từ học viên
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#11181C] mt-2">
            Kết quả đào tạo thực tế
          </h2>
          <p className="text-xs sm:text-sm text-[#5A636A] mt-2">
            Hơn 1,200 học viên đã tin tưởng và đạt kết quả vượt mong đợi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t, i) => (
            <div
              key={t.id}
              className={`relative p-6 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] flex flex-col justify-between space-y-4 shadow-sm transition-all duration-500 hover:shadow-lg group ${testimonialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Quote className="w-6 h-6 text-[#B6F05C]/40" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#5A636A] leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E6DF] flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E2E6DF] group-hover:border-[#B6F05C] transition-colors"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#11181C]">{t.name}</h4>
                  <p className="text-[11px] text-[#88929A]">{t.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-[#2D5E12]" />
                    <span className="font-mono text-[10px] text-[#2D5E12] font-semibold">
                      {t.levelBefore} ➔ {t.levelAfter}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. TRUST MARQUEE — Partners & Certifications
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-24 overflow-hidden">
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#88929A]">
            Chứng nhận & Đối tác huấn luyện
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAFBF9] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAFBF9] to-transparent z-10" />
          <div className="flex animate-marquee gap-12 items-center py-4 whitespace-nowrap">
            {[
              'USA Pickleball', 'IPTPA Certified', 'PPR Academy', 'PPA Tour', 
              'DUPR Official', 'Selkirk Sport', 'JOOLA', 'CRBN Pickleball',
              'USA Pickleball', 'IPTPA Certified', 'PPR Academy', 'PPA Tour', 
              'DUPR Official', 'Selkirk Sport', 'JOOLA', 'CRBN Pickleball',
            ].map((name, i) => (
              <div key={i} className="flex-shrink-0 px-6 py-3 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
                <span className="font-mono text-xs font-bold text-[#88929A] tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. FINAL CTA — Strong Closing Section
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Dark background with gradient */}
          <div className="absolute inset-0 bg-[#11181C]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#11181C] via-[#1B242A] to-[#11181C]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B6F05C]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B6F05C]/3 rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundSize: '40px 40px',
              backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)'
            }} />
          </div>

          <div className="relative z-10 text-center py-16 sm:py-20 px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/60 mb-6">
              <Sparkles className="w-3 h-3 text-[#B6F05C]" />
              <span>{homeContent.ctaBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {homeContent.ctaTitleLine1}
              <br />
              <span className="text-[#B6F05C]">{homeContent.ctaTitleHighlight}</span> đích thực?
            </h2>
            <p className="text-sm text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
              {homeContent.ctaDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('booking')}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B6F05C] hover:bg-[#A4E841] text-[#11181C] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B6F05C]/20 hover:shadow-xl hover:shadow-[#B6F05C]/30 active:scale-95"
              >
                <span>Đăng ký khóa học ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Liên hệ tư vấn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            {/* Bottom trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/5">
              {[
                { icon: ShieldCheck, text: 'Cam kết đầu ra' },
                { icon: Heart, text: 'Hoàn tiền 100% nếu không hài lòng' },
                { icon: Users, text: 'Cộng đồng 1,200+ thành viên' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/30 text-[11px]">
                  <item.icon className="w-3.5 h-3.5 text-[#B6F05C]/50" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* Note: Eye icon used above doesn't exist in initial imports — we add a simple inline SVG fallback */
function Eye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
