import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Vợt Pickleball',
  'Bóng Pickleball',
  'Giày & Thời Trang',
  'Phụ Kiện',
];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80';

function compressImageFile(file, maxSize = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Không thể đọc ảnh'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Không thể tải tệp ảnh'));
    reader.readAsDataURL(file);
  });
}

export default function ProductFormModal({ isOpen, onClose, editingProduct, onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Vợt Pickleball',
    brand: '',
    price: '',
    originalPrice: '',
    rating: '5.0',
    reviewsCount: '0',
    image: DEFAULT_IMAGE,
    description: '',
    inStock: true,
    isFeatured: false,
  });

  const [specsList, setSpecsList] = useState([
    { key: 'weight', value: '225g' },
    { key: 'thickness', value: '16mm' },
  ]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Vợt Pickleball',
        brand: editingProduct.brand || '',
        price: String(editingProduct.price ?? ''),
        originalPrice: String(editingProduct.originalPrice ?? editingProduct.price ?? ''),
        rating: String(editingProduct.rating ?? '5.0'),
        reviewsCount: String(editingProduct.reviewsCount ?? '0'),
        image: editingProduct.image || DEFAULT_IMAGE,
        description: editingProduct.description || '',
        inStock: editingProduct.inStock !== false,
        isFeatured: Boolean(editingProduct.isFeatured),
      });
      const entries = Object.entries(editingProduct.specs || {});
      setSpecsList(entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : [{ key: 'weight', value: '' }]);
    } else {
      setForm({
        name: '',
        category: 'Vợt Pickleball',
        brand: '',
        price: '',
        originalPrice: '',
        rating: '5.0',
        reviewsCount: '0',
        image: DEFAULT_IMAGE,
        description: '',
        inStock: true,
        isFeatured: false,
      });
      setSpecsList([
        { key: 'weight', value: '225g' },
        { key: 'thickness', value: '16mm' },
      ]);
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageFile(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: 'Không thể xử lý tệp ảnh này' }));
    } finally {
      setUploading(false);
    }
  };

  const handleSpecChange = (idx, field, val) => {
    setSpecsList((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));
  };

  const addSpecRow = () => {
    setSpecsList((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpecRow = (idx) => {
    setSpecsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập tên sản phẩm';
    if (!form.brand.trim()) errs.brand = 'Vui lòng nhập thương hiệu';
    if (!form.category.trim()) errs.category = 'Vui lòng chọn danh mục';
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Giá bán phải lớn hơn 0';
    }
    if (!form.description.trim()) errs.description = 'Vui lòng nhập mô tả sản phẩm';
    if (!form.image.trim()) errs.image = 'Vui lòng nhập URL ảnh hoặc tải ảnh lên';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const specsObj = {};
    specsList.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        specsObj[key.trim()] = value.trim();
      }
    });

    const priceNum = Number(form.price);
    const origNum = form.originalPrice ? Number(form.originalPrice) : priceNum;

    onSave({
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: form.name.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: priceNum,
      originalPrice: origNum >= priceNum ? origNum : priceNum,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5.0)),
      reviewsCount: Math.max(0, Number(form.reviewsCount) || 0),
      image: form.image.trim(),
      description: form.description.trim(),
      inStock: form.inStock,
      isFeatured: form.isFeatured,
      specs: Object.keys(specsObj).length > 0 ? specsObj : { status: 'Chính hãng Apex' },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E6DF] rounded-3xl shadow-[0_16px_48px_rgba(17,24,28,0.16)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E6DF] bg-[#FAFBF9] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#2D5E12] bg-[#F1FCDA] px-2 py-0.5 rounded-full border border-[#D3F592]">
              Pro Shop CMS
            </span>
            <h3 className="text-base font-bold text-[#11181C] mt-1">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới vào Pro Shop'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#5A636A] hover:text-[#11181C] bg-white border border-[#E2E6DF] hover:bg-[#F4F6F2]"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                placeholder="VD: Vợt Carbon CRBN 1X Power Series 16mm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Danh mục *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-[11px] text-red-600 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Thương hiệu *</label>
              <input
                type="text"
                placeholder="VD: Joola, Selkirk, CRBN, Apex Pro..."
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
              {errors.brand && <p className="text-[11px] text-red-600 mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Giá bán (VNĐ) *</label>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="4500000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
              {errors.price && <p className="text-[11px] text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Giá gốc (VNĐ - tuỳ chọn)</label>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="5200000"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Điểm đánh giá (1.0 - 5.0)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#11181C] mb-1">Số lượt đánh giá</label>
              <input
                type="number"
                min="0"
                value={form.reviewsCount}
                onChange={(e) => setForm({ ...form, reviewsCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              />
            </div>
          </div>

          {/* Image URL + File Upload + Preview */}
          <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-3">
            <label className="block text-xs font-semibold text-[#11181C]">Hình ảnh sản phẩm *</label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="w-20 h-20 rounded-xl bg-white border border-[#E2E6DF] flex items-center justify-center overflow-hidden shrink-0">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#88929A]" />
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  placeholder="Dán đường dẫn ảnh (https://...)"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F4F6F2] border border-[#E2E6DF] text-[11px] font-medium text-[#11181C] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Đang xử lý ảnh...' : 'Hoặc tải ảnh từ máy tính'}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
            {errors.image && <p className="text-[11px] text-red-600">{errors.image}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#11181C] mb-1">Mô tả chi tiết *</label>
            <textarea
              rows={3}
              placeholder="Mô tả chất liệu, công nghệ mặt vợt, cảm giác đánh..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
            />
            {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Dynamic Specs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#11181C]">Thông số kỹ thuật</label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-[11px] font-semibold text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-1 rounded-full border border-[#D3F592] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm thông số</span>
              </button>
            </div>
            <div className="space-y-2">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tên thông số (VD: weight)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 px-3 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] font-mono text-xs text-[#11181C]"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (VD: 227g (8.0 oz))"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C]"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="p-2 rounded-xl text-[#88929A] hover:text-red-600 hover:bg-red-50"
                    aria-label="Xóa thông số"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#11181C]">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="rounded border-[#E2E6DF] text-[#11181C]"
              />
              <span className="font-medium">Còn hàng (Cho phép đặt mua)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#11181C]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded border-[#E2E6DF] text-[#11181C]"
              />
              <span className="font-medium">Gắn nhãn BEST SELLER</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#E2E6DF] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F4F6F2] border border-[#E2E6DF] text-xs font-medium text-[#5A636A]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#B6F05C]" />
              <span>{editingProduct ? 'Lưu cập nhật' : 'Thêm sản phẩm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
