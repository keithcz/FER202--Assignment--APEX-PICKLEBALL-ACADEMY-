import React, { useState } from 'react';
import {
  Star,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Pencil,
  Trash2,
  Settings,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { isAdminUser } from '../utils/auth';
import ProductFormModal from '../components/ProductFormModal';

export default function ShopPage({ addToCart, setIsCartOpen, currentUser, setActiveTab }) {
  const { products, siteContent, addProduct, updateProduct, deleteProduct } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemNotification, setAddedItemNotification] = useState(null);
  const [adminToast, setAdminToast] = useState('');

  // Quick Add/Edit modal right inside ShopPage for Admin
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const isAdmin = isAdminUser(currentUser);
  const shopHeader = siteContent.shop;

  const categories = [
    { id: 'all', label: 'Tất cả sản phẩm' },
    { id: 'Vợt Pickleball', label: 'Vợt thi đấu' },
    { id: 'Bóng Pickleball', label: 'Bóng chuẩn USA' },
    { id: 'Giày & Thời Trang', label: 'Giày cushion' },
    { id: 'Phụ Kiện', label: 'Balo & phụ kiện' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    if (product.inStock === false) return;
    addToCart(product);
    setAddedItemNotification(product.name);
    setTimeout(() => setAddedItemNotification(null), 2000);
  };

  const showAdminNotice = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 2500);
  };

  const handleSaveProduct = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      showAdminNotice(`Đã cập nhật "${data.name}"`);
    } else {
      addProduct(data);
      showAdminNotice(`Đã thêm sản phẩm "${data.name}"`);
    }
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Xóa sản phẩm "${product.name}" khỏi Pro Shop?`)) {
      deleteProduct(product.id);
      showAdminNotice(`Đã xóa "${product.name}"`);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
          {shopHeader.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#11181C]">
          {shopHeader.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A636A] max-w-xl mx-auto leading-relaxed">
          {shopHeader.description}
        </p>
      </div>

      {/* Admin Direct Shop Toolbar */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#11181C] text-white border border-[#232C33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B6F05C] text-[#11181C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>Chế độ Quản trị viên (Admin)</span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#B6F05C]">
                  {products.length} sản phẩm
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Bạn có thể thêm sản phẩm mới hoặc chỉnh sửa/xóa trực tiếp ngay tại trang bán hàng.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#B6F05C] hover:bg-[#A4E841] text-[#11181C] text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm sản phẩm</span>
            </button>
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Trang Quản trị CMS</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Admin Toast */}
      {adminToast && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#11181C] text-white border border-[#232C33] shadow-xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#B6F05C]" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Floating Added Notification Toast */}
      {addedItemNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-white border border-[#E2E6DF] shadow-[0_8px_30px_rgba(17,24,28,0.12)] flex items-center gap-3 animate-fadeIn">
          <div className="w-7 h-7 rounded-full bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-[#11181C] font-semibold block truncate max-w-[180px]">
              {addedItemNotification}
            </span>
            <span className="text-[#2D5E12] text-[11px]">Đã thêm vào giỏ hàng</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1.5 rounded-full bg-[#11181C] text-white font-medium text-xs hover:bg-[#232C33]"
          >
            Xem giỏ
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#11181C] text-white font-medium shadow-sm'
                  : 'text-[#5A636A] hover:text-[#11181C] hover:bg-[#F4F6F2]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#88929A]" />
          <input
            type="text"
            placeholder="Tìm vợt, thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all flex flex-col justify-between overflow-hidden group shadow-sm"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-56 bg-[#FAFBF9] overflow-hidden flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute top-3 left-3 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#11181C] border border-[#E2E6DF]">
                  {product.brand}
                </span>
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  {product.isFeatured && (
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#11181C] text-white">
                      BEST SELLER
                    </span>
                  )}
                  {product.inStock === false && (
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      HẾT HÀNG
                    </span>
                  )}
                </div>

                {/* Inline Admin Controls on Card */}
                {isAdmin && (
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-[#11181C] text-[#11181C] hover:text-white border border-[#E2E6DF] text-[10px] font-semibold flex items-center gap-1 shadow-sm transition-all"
                      title="Sửa sản phẩm"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                      className="p-1.5 rounded-full bg-white/95 hover:bg-red-600 text-red-600 hover:text-white border border-[#E2E6DF] shadow-sm transition-all"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-[#11181C]">{product.rating}</span>
                    <span className="text-[#88929A]">({product.reviewsCount} review)</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#11181C] tracking-tight group-hover:text-[#5A636A] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#5A636A] mt-1 line-clamp-2">{product.description}</p>
                </div>

                {/* Specs Pill List */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-1 font-mono text-[10px] text-[#5A636A]">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="capitalize text-[#88929A]">{k}:</span>
                        <span className="text-[#11181C] font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Add to Cart button */}
            <div className="p-6 border-t border-[#E2E6DF] bg-[#FAFBF9] flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] text-[#88929A] uppercase block">Giá niêm yết</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-extrabold text-[#11181C]">
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="font-mono text-[11px] text-[#88929A] line-through">
                      {product.originalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.inStock === false}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 shadow-sm ${
                  product.inStock === false
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#11181C] hover:bg-[#232C33] text-white active:scale-95'
                }`}
              >
                {product.inStock === false ? (
                  <span>Tạm hết</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-[#B6F05C]" />
                    <span>Thêm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
