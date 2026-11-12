import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, GraduationCap } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80';
const DEFAULT_COACH_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

export default function AdminCoursesTab({ onNotify }) {
  const { courses, addCourse, updateCourse, deleteCourse } = useSiteData();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Khóa Mới',
    level: 'Cơ Bản (1.0 - 2.5)',
    duration: '4 tuần (8 buổi)',
    schedule: 'Thứ 3 - Thứ 5 (18:30 - 20:30)',
    price: '',
    originalPrice: '',
    coach: '',
    coachAvatar: DEFAULT_COACH_AVATAR,
    image: DEFAULT_COURSE_IMAGE,
    description: '',
    highlightsText: '',
    curriculumText: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      subtitle: '',
      badge: 'Khóa Mới',
      level: 'Cơ Bản (1.0 - 2.5)',
      duration: '4 tuần (8 buổi - 16 giờ)',
      schedule: 'Thứ 3 - Thứ 5 (18:30 - 20:30)',
      price: '2500000',
      originalPrice: '3200000',
      coach: 'HLV Đặng Minh Hoàng (IPTPA Level 2)',
      coachAvatar: DEFAULT_COACH_AVATAR,
      image: DEFAULT_COURSE_IMAGE,
      description: '',
      highlightsText: 'Miễn phí mượn vợt và bóng\nLớp tối đa 4-6 học viên',
      curriculumText: 'Buổi 1: Làm quen vợt và luật giao bóng\nBuổi 2: Kỹ thuật Dinking và di chuyển bộ chân',
    });
    setIsModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title || '',
      subtitle: course.subtitle || '',
      badge: course.badge || '',
      level: course.level || '',
      duration: course.duration || '',
      schedule: course.schedule || '',
      price: String(course.price || ''),
      originalPrice: String(course.originalPrice || ''),
      coach: course.coach || '',
      coachAvatar: course.coachAvatar || DEFAULT_COACH_AVATAR,
      image: course.image || DEFAULT_COURSE_IMAGE,
      description: course.description || '',
      highlightsText: (course.highlights || []).join('\n'),
      curriculumText: (course.curriculum || []).join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      badge: form.badge.trim(),
      level: form.level.trim(),
      duration: form.duration.trim(),
      schedule: form.schedule.trim(),
      price: Number(form.price) || 0,
      originalPrice: Number(form.originalPrice) || Number(form.price) || 0,
      coach: form.coach.trim(),
      coachAvatar: form.coachAvatar.trim() || DEFAULT_COACH_AVATAR,
      image: form.image.trim() || DEFAULT_COURSE_IMAGE,
      description: form.description.trim(),
      highlights: form.highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      curriculum: form.curriculumText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editing) {
      updateCourse(editing.id, payload);
      onNotify(`Đã cập nhật khóa học "${payload.title}"`);
    } else {
      addCourse(payload);
      onNotify(`Đã thêm khóa học "${payload.title}"`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (course) => {
    if (courses.length <= 1) {
      onNotify('Cần giữ lại ít nhất 1 khóa học trên website');
      return;
    }
    if (window.confirm(`Xóa khóa học "${course.title}"?`)) {
      deleteCourse(course.id);
      onNotify(`Đã xóa khóa học "${course.title}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#11181C]" />
          <span className="text-sm font-bold text-[#11181C]">Danh sách Khóa học ({courses.length})</span>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#B6F05C]" />
          <span>Thêm khóa học mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex gap-4">
              <img
                src={c.image}
                alt={c.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#E2E6DF] shrink-0"
              />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592]">
                    {c.badge}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FAFBF9] border border-[#E2E6DF] text-[#5A636A]">
                    {c.level}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#11181C] line-clamp-1">{c.title}</h4>
                <p className="text-xs text-[#5A636A] line-clamp-2">{c.description}</p>
                <div className="text-[11px] font-mono text-[#88929A]">
                  {c.duration} • {c.coach}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E6DF] flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-extrabold text-[#11181C]">
                  {c.price.toLocaleString('vi-VN')} đ
                </span>
                {c.originalPrice > c.price && (
                  <span className="font-mono text-[10px] text-[#88929A] line-through ml-2">
                    {c.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="px-3 py-1.5 rounded-full bg-[#FAFBF9] hover:bg-[#11181C] text-[#11181C] hover:text-white border border-[#E2E6DF] text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="p-2 rounded-full bg-[#FAFBF9] hover:bg-red-50 text-[#88929A] hover:text-red-600 border border-[#E2E6DF]"
                  aria-label="Xóa khóa học"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/45 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-[#E2E6DF] rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#E2E6DF] bg-[#FAFBF9] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#11181C]">
                {editing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white border border-[#E2E6DF] text-[#5A636A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Tên khóa học *</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Phụ đề ngắn</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Nhãn (Badge)</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Trình độ (Level)</label>
                  <input
                    type="text"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Học phí (VNĐ) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Học phí gốc (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Thời lượng</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Huấn luyện viên</label>
                  <input
                    type="text"
                    value={form.coach}
                    onChange={(e) => setForm({ ...form, coach: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Lịch học</label>
                  <input
                    type="text"
                    value={form.schedule}
                    onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">URL Ảnh khóa học</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Mô tả chi tiết</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Điểm nổi bật (mỗi dòng 1 ý)</label>
                  <textarea
                    rows={3}
                    value={form.highlightsText}
                    onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Giáo trình từng buổi (mỗi dòng 1 buổi)</label>
                  <textarea
                    rows={4}
                    value={form.curriculumText}
                    onChange={(e) => setForm({ ...form, curriculumText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-[#E2E6DF] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E2E6DF] text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#11181C] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F05C]" />
                  <span>{editing ? 'Lưu cập nhật' : 'Thêm khóa học'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
