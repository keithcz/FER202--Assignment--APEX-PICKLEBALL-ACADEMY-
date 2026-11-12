import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Star, ExternalLink, Package } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ProductFormModal from '../ProductFormModal';

export default function AdminProductsTab({ onNotify, setActiveTab }) {
  const { products, addProduct, updateProduct, deleteProduct } = useSiteData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const q = search.toLowerCase();
    const matchText =
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchText;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      onNotify(`Đã cập nhật sản phẩm "${data.name}"`);
    } else {
      addProduct(data);
      onNotify(`Đã thêm sản phẩm "${data.name}" vào Pro Shop`);
    }
  };

  const handleDelete = (product) => {
    if (window.confirm(`Xóa sản phẩm "${product.name}" khỏi Pro Shop?`)) {
      deleteProduct(product.id);
      onNotify(`Đã xóa "${product.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                categoryFilter === cat
                  ? 'bg-[#11181C] text-white font-medium'
                  : 'bg-[#FAFBF9] text-[#5A636A] hover:text-[#11181C] border border-[#E2E6DF]'
              }`}
            >
              {cat === 'all' ? `Tất cả (${products.length})` : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#88929A]" />
            <input
              type="text"
              placeholder="Tìm tên, thương hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
            />
          </div>

          <button
            onClick={() => setActiveTab('shop')}
            className="px-3.5 py-2 rounded-full bg-[#F4F6F2] hover:bg-[#EAECE8] text-xs font-medium text-[#11181C] border border-[#E2E6DF] flex items-center gap-1.5"
          >
            <span>Xem trang bán hàng</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#B6F05C]" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Product List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center space-y-2 text-[#88929A]">
          <Package className="w-8 h-8 mx-auto opacity-50" />
          <p className="text-xs font-medium">Không tìm thấy sản phẩm phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-contain bg-[#FAFBF9] border border-[#E2E6DF] p-1 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F6F2] border border-[#E2E6DF] text-[#11181C]">
                      {p.brand}
                    </span>
                    <span className="font-mono text-[10px] text-[#5A636A]">{p.category}</span>
                    {p.isFeatured && (
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#11181C] text-[#B6F05C]">
                        BEST SELLER
                      </span>
                    )}
                    {p.inStock === false && (
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                        HẾT HÀNG
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#11181C] truncate">{p.name}</h4>
                  <p className="text-xs text-[#5A636A] line-clamp-1">{p.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E6DF] shrink-0">
                <div className="text-left md:text-right mr-2">
                  <div className="font-mono text-sm font-extrabold text-[#11181C]">
                    {p.price.toLocaleString('vi-VN')} đ
                  </div>
                  {p.originalPrice > p.price && (
                    <div className="font-mono text-[10px] text-[#88929A] line-through">
                      {p.originalPrice.toLocaleString('vi-VN')} đ
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateProduct(p.id, { inStock: p.inStock === false });
                    onNotify(p.inStock === false ? `Đã mở bán "${p.name}"` : `Đã chuyển "${p.name}" sang Hết hàng`);
                  }}
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                    p.inStock !== false
                      ? 'bg-[#F1FCDA] border-[#D3F592] text-[#2D5E12]'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  {p.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateProduct(p.id, { isFeatured: !p.isFeatured });
                    onNotify(`Đã cập nhật trạng thái nổi bật cho "${p.name}"`);
                  }}
                  title="Bật/Tắt Best Seller"
                  className={`p-2 rounded-full border transition-all ${
                    p.isFeatured
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-[#FAFBF9] border-[#E2E6DF] text-[#88929A] hover:text-[#11181C]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 rounded-full bg-[#FAFBF9] hover:bg-[#11181C] text-[#11181C] hover:text-white border border-[#E2E6DF] text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="p-2 rounded-full bg-[#FAFBF9] hover:bg-red-50 text-[#88929A] hover:text-red-600 border border-[#E2E6DF] transition-all"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
}
