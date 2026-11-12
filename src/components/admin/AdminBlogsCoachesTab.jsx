import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, BookOpen, Users } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

const DEFAULT_BLOG_IMG =
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80';
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

export default function AdminBlogsCoachesTab({ onNotify }) {
  const { blogs, addBlog, updateBlog, deleteBlog, coaches, addCoach, updateCoach, deleteCoach } =
    useSiteData();

  const [mode, setMode] = useState('blogs'); // 'blogs' | 'coaches'

  // Blog Modal State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    category: 'Luật Thi Đấu',
    readTime: '5 phút đọc',
    date: '',
    author: 'HLV Apex Academy',
    image: DEFAULT_BLOG_IMG,
    content: '',
  });

  // Coach Modal State
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [coachForm, setCoachForm] = useState({
    name: '',
    role: '',
    certification: '',
    experience: '',
    dupr: '5.0 DUPR Rating',
    specialty: '',
    avatar: DEFAULT_AVATAR,
    bio: '',
  });

  // Blog Handlers
  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      summary: '',
      category: 'Luật Thi Đấu',
      readTime: '5 phút đọc',
      date: new Date().toLocaleDateString('vi-VN'),
      author: 'HLV Đặng Minh Hoàng',
      image: DEFAULT_BLOG_IMG,
      content: '### Nội dung bài viết\nViết hướng dẫn chi tiết tại đây...',
    });
    setBlogModalOpen(true);
  };

  const openEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      summary: blog.summary || '',
      category: blog.category || 'Luật Thi Đấu',
      readTime: blog.readTime || '5 phút đọc',
      date: blog.date || '',
      author: blog.author || '',
      image: blog.image || DEFAULT_BLOG_IMG,
      content: blog.content || '',
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return;
    if (editingBlog) {
      updateBlog(editingBlog.id, blogForm);
      onNotify(`Đã cập nhật bài viết "${blogForm.title}"`);
    } else {
      addBlog(blogForm);
      onNotify(`Đã đăng bài viết "${blogForm.title}"`);
    }
    setBlogModalOpen(false);
  };

  // Coach Handlers
  const openAddCoach = () => {
    setEditingCoach(null);
    setCoachForm({
      name: '',
      role: 'Huấn Luyện Viên Cao Cấp',
      certification: 'IPTPA Certified Instructor',
      experience: '5 năm giảng dạy Pickleball',
      dupr: '5.0 DUPR Rating',
      specialty: '',
      avatar: DEFAULT_AVATAR,
      bio: '',
    });
    setCoachModalOpen(true);
  };

  const openEditCoach = (coach) => {
    setEditingCoach(coach);
    setCoachForm({
      name: coach.name || '',
      role: coach.role || '',
      certification: coach.certification || '',
      experience: coach.experience || '',
      dupr: coach.dupr || '',
      specialty: coach.specialty || '',
      avatar: coach.avatar || DEFAULT_AVATAR,
      bio: coach.bio || '',
    });
    setCoachModalOpen(true);
  };

  const handleSaveCoach = (e) => {
    e.preventDefault();
    if (!coachForm.name.trim()) return;
    if (editingCoach) {
      updateCoach(editingCoach.id, coachForm);
      onNotify(`Đã cập nhật hồ sơ HLV "${coachForm.name}"`);
    } else {
      addCoach(coachForm);
      onNotify(`Đã thêm HLV "${coachForm.name}"`);
    }
    setCoachModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('blogs')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              mode === 'blogs'
                ? 'bg-[#11181C] text-white'
                : 'bg-white text-[#5A636A] border border-[#E2E6DF]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bài viết Cẩm nang ({blogs.length})</span>
          </button>
          <button
            onClick={() => setMode('coaches')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              mode === 'coaches'
                ? 'bg-[#11181C] text-white'
                : 'bg-white text-[#5A636A] border border-[#E2E6DF]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Đội ngũ Huấn luyện viên ({coaches.length})</span>
          </button>
        </div>

        <button
          onClick={mode === 'blogs' ? openAddBlog : openAddCoach}
          className="px-4 py-2 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-[#B6F05C]" />
          <span>{mode === 'blogs' ? 'Thêm bài viết' : 'Thêm HLV mới'}</span>
        </button>
      </div>

      {/* Blogs List */}
      {mode === 'blogs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="flex gap-4">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#E2E6DF] shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12]">
                      {b.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#88929A]">{b.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#11181C] line-clamp-2">{b.title}</h4>
                  <p className="text-xs text-[#5A636A] line-clamp-2">{b.summary}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between text-xs">
                <span className="text-[#88929A]">{b.author}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditBlog(b)}
                    className="px-3 py-1.5 rounded-full bg-[#FAFBF9] hover:bg-[#11181C] hover:text-white border border-[#E2E6DF] flex items-center gap-1 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Xóa bài viết "${b.title}"?`)) {
                        deleteBlog(b.id);
                        onNotify('Đã xóa bài viết');
                      }
                    }}
                    className="p-2 rounded-full bg-[#FAFBF9] hover:bg-red-50 text-[#88929A] hover:text-red-600 border border-[#E2E6DF]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coaches List */}
      {mode === 'coaches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coaches.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="flex gap-4">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E2E6DF] shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B6F05C] text-[#11181C]">
                    {c.dupr}
                  </span>
                  <h4 className="text-sm font-bold text-[#11181C]">{c.name}</h4>
                  <p className="text-xs text-[#2D5E12] font-medium">{c.role}</p>
                  <p className="text-xs text-[#5A636A] line-clamp-2">{c.bio}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between text-xs">
                <span className="text-[#88929A] truncate max-w-[200px]">{c.specialty}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditCoach(c)}
                    className="px-3 py-1.5 rounded-full bg-[#FAFBF9] hover:bg-[#11181C] hover:text-white border border-[#E2E6DF] flex items-center gap-1 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Xóa hồ sơ HLV "${c.name}"?`)) {
                        deleteCoach(c.id);
                        onNotify(`Đã xóa HLV "${c.name}"`);
                      }
                    }}
                    className="p-2 rounded-full bg-[#FAFBF9] hover:bg-red-50 text-[#88929A] hover:text-red-600 border border-[#E2E6DF]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Modal */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/45 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border border-[#E2E6DF] rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#E2E6DF] bg-[#FAFBF9] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#11181C]">
                {editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết Cẩm nang'}
              </h3>
              <button
                onClick={() => setBlogModalOpen(false)}
                className="p-1.5 rounded-full bg-white border border-[#E2E6DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Tiêu đề bài viết *</label>
                <input
                  required
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Chuyên mục</label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Thời gian đọc</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">URL Ảnh bìa</label>
                <input
                  type="text"
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Nội dung chi tiết (hỗ trợ ### tiêu đề)</label>
                <textarea
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs font-mono"
                />
              </div>
              <div className="pt-3 border-t border-[#E2E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E2E6DF] text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#11181C] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F05C]" />
                  <span>{editingBlog ? 'Lưu bài viết' : 'Đăng bài'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coach Modal */}
      {coachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/45 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-[#E2E6DF] rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#E2E6DF] bg-[#FAFBF9] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#11181C]">
                {editingCoach ? 'Chỉnh sửa hồ sơ HLV' : 'Thêm Huấn luyện viên mới'}
              </h3>
              <button
                onClick={() => setCoachModalOpen(false)}
                className="p-1.5 rounded-full bg-white border border-[#E2E6DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCoach} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1">Họ và tên HLV *</label>
                  <input
                    required
                    type="text"
                    value={coachForm.name}
                    onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Chức danh</label>
                  <input
                    type="text"
                    value={coachForm.role}
                    onChange={(e) => setCoachForm({ ...coachForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Điểm DUPR</label>
                  <input
                    type="text"
                    value={coachForm.dupr}
                    onChange={(e) => setCoachForm({ ...coachForm, dupr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Chứng chỉ</label>
                  <input
                    type="text"
                    value={coachForm.certification}
                    onChange={(e) => setCoachForm({ ...coachForm, certification: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Sở trường chuyên môn</label>
                  <input
                    type="text"
                    value={coachForm.specialty}
                    onChange={(e) => setCoachForm({ ...coachForm, specialty: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">URL Ảnh đại diện</label>
                  <input
                    type="text"
                    value={coachForm.avatar}
                    onChange={(e) => setCoachForm({ ...coachForm, avatar: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Giới thiệu ngắn (Bio)</label>
                  <textarea
                    rows={3}
                    value={coachForm.bio}
                    onChange={(e) => setCoachForm({ ...coachForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-[#E2E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCoachModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E2E6DF] text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#11181C] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F05C]" />
                  <span>{editingCoach ? 'Lưu HLV' : 'Thêm HLV'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
