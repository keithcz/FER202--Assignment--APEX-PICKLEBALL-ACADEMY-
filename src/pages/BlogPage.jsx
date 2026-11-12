import React, { useState } from 'react';
import { BookOpen, Clock, User, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function BlogPage() {
  const { blogs, siteContent } = useSiteData();
  const blogContent = siteContent.blog;
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
          {blogContent.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#11181C]">
          {blogContent.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A636A] max-w-xl mx-auto leading-relaxed">
          {blogContent.description}
        </p>
      </div>

      {/* Visual Infographic Banner: Kitchen Rule Cheat-Sheet */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F4F6F2] border border-[#E2E6DF] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#2D5E12] uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>Quy tắc cốt lõi cần nhớ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#11181C]">
            {blogContent.kitchenTitle}
          </h2>
          <p className="text-xs text-[#5A636A] leading-relaxed">
            {blogContent.kitchenDesc}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] text-xs space-y-2 shrink-0 w-full md:w-64 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-[#2D5E12]">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>Bóng nảy ➔ Được vào bếp</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Bóng sống ➔ Cấm chạm vạch</span>
          </div>
          <div className="flex items-center gap-2 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Quán tính trôi vào ➔ Phạm quy</span>
          </div>
        </div>
      </div>

      {/* Blog Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((article) => (
          <div
            key={article.id}
            className="rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all flex flex-col justify-between overflow-hidden group shadow-sm"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-[#F4F6F2]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#11181C] border border-[#E2E6DF]">
                  {article.category}
                </span>
                <span className="absolute top-3 right-3 font-mono text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-[#5A636A] backdrop-blur-sm">
                  {article.readTime}
                </span>
              </div>

              <div className="p-6 space-y-2.5">
                <h3 className="text-sm font-bold text-[#11181C] tracking-tight group-hover:text-[#5A636A] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[#5A636A] leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-[#E2E6DF] flex items-center justify-between text-xs">
              <span className="text-[#88929A] text-[11px]">{article.author}</span>
              <button
                onClick={() => setSelectedArticle(article)}
                className="font-medium text-[#11181C] hover:underline flex items-center gap-1"
              >
                <span>Đọc bài</span>
                <ArrowRight className="w-3 h-3 text-[#11181C]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(17,24,28,0.12)] max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E6DF]">
              <span className="font-mono text-[10px] font-bold text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-0.5 rounded-full">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs text-[#5A636A] hover:text-[#11181C] px-3 py-1.5 rounded-full bg-[#F4F6F2]"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#11181C]">{selectedArticle.title}</h2>
              <div className="flex items-center gap-3 text-xs text-[#88929A] font-mono">
                <span>Tác giả: <strong className="text-[#11181C]">{selectedArticle.author}</strong></span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-56 rounded-2xl object-cover"
            />

            <div className="text-[#5A636A] text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-[#E2E6DF] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-full bg-[#11181C] text-white text-xs font-medium hover:bg-[#232C33]"
              >
                Xong
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
