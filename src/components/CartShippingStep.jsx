import React from 'react';
import {
  User,
  Phone,
  MapPin,
  Truck,
  Store,
  QrCode,
  Wallet,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const PAYMENT_METHODS = [
  {
    id: 'bank_qr',
    label: 'Chuyển khoản QR (VietQR)',
    desc: 'Quét mã QR hoặc chuyển khoản ngân hàng 24/7',
    badge: 'Khuyên dùng',
    icon: QrCode,
  },
  {
    id: 'ewallet',
    label: 'Ví điện tử (MoMo / ZaloPay)',
    desc: 'Thanh toán nhanh bằng mã QR ví điện tử',
    icon: Wallet,
  },
  {
    id: 'card',
    label: 'Thẻ ATM / Visa / Mastercard',
    desc: 'Nhập thông tin thẻ nội địa & thẻ quốc tế',
    icon: CreditCard,
  },
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Kiểm tra dụng cụ chính hãng trước khi trả tiền mặt',
    icon: Banknote,
  },
];

export const PICKUP_BRANCHES = [
  '18 Hoàng Cầu, Đống Đa, Hà Nội',
  'Cụm 4 Sân Apex Thảo Điền (TP. Thủ Đức)',
  'Cụm Sân Apex Phú Mỹ Hưng (Quận 7)',
];

export default function CartShippingStep({
  cartItems,
  total,
  discountAmount,
  appliedPromoCode,
  shippingInfo,
  onChangeShipping,
  shippingErrors,
  paymentMethod,
  onSelectPaymentMethod,
  isProcessing,
  onSubmit,
}) {
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <form onSubmit={onSubmit} noValidate className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Compact Order Summary */}
        <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#11181C]">
              Tóm tắt đơn hàng ({totalCount} món)
            </span>
            <span className="font-mono font-bold text-[#11181C]">
              {total.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className="space-y-1 max-h-20 overflow-y-auto text-[11px] text-[#5A636A]">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono shrink-0 text-[#11181C]">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>
          {discountAmount > 0 && (
            <div className="pt-1.5 border-t border-[#E2E6DF] flex justify-between text-[11px] font-mono text-[#2D5E12]">
              <span>Ưu đãi ({appliedPromoCode})</span>
              <span>- {discountAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          )}
        </div>

        {/* Section 1: Delivery Mode & Recipient Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#11181C] uppercase tracking-wider font-mono">
            1. Thông tin nhận hàng
          </h4>

          {/* Delivery Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F4F6F2] border border-[#E2E6DF]">
            <button
              type="button"
              onClick={() => onChangeShipping('deliveryMethod', 'delivery')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                shippingInfo.deliveryMethod === 'delivery'
                  ? 'bg-white text-[#11181C] shadow-sm'
                  : 'text-[#5A636A] hover:text-[#11181C]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Giao tận nơi</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeShipping('deliveryMethod', 'pickup')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                shippingInfo.deliveryMethod === 'pickup'
                  ? 'bg-white text-[#11181C] shadow-sm'
                  : 'text-[#5A636A] hover:text-[#11181C]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Nhận tại sân</span>
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
              Họ và tên người nhận *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#88929A]" />
              <input
                type="text"
                placeholder="Nguyễn Văn An"
                value={shippingInfo.fullName}
                onChange={(e) => onChangeShipping('fullName', e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                  shippingErrors.fullName ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                }`}
              />
            </div>
            {shippingErrors.fullName && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {shippingErrors.fullName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
              Số điện thoại liên hệ *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#88929A]" />
              <input
                type="tel"
                placeholder="0912 345 678"
                value={shippingInfo.phone}
                onChange={(e) => onChangeShipping('phone', e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                  shippingErrors.phone ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                }`}
              />
            </div>
            {shippingErrors.phone && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {shippingErrors.phone}
              </p>
            )}
          </div>

          {/* Address or Pickup Branch */}
          {shippingInfo.deliveryMethod === 'delivery' ? (
            <div>
              <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                Địa chỉ giao hàng *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#88929A]" />
                <input
                  type="text"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                  value={shippingInfo.address}
                  onChange={(e) => onChangeShipping('address', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAFBF9] border text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none transition-all ${
                    shippingErrors.address ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                  }`}
                />
              </div>
              {shippingErrors.address && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {shippingErrors.address}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                Chọn cơ sở Apex nhận hàng *
              </label>
              <select
                value={shippingInfo.pickupBranch}
                onChange={(e) => onChangeShipping('pickupBranch', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] focus:outline-none focus:border-[#11181C]"
              >
                {PICKUP_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
              Ghi chú (không bắt buộc)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Giao giờ hành chính, quấn thêm cán vợt..."
              value={shippingInfo.notes}
              onChange={(e) => onChangeShipping('notes', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
            />
          </div>
        </div>

        {/* Section 2: Payment Method Selection */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#11181C] uppercase tracking-wider font-mono">
            2. Chọn phương thức thanh toán
          </h4>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onSelectPaymentMethod(method.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#FAFBF9] border-[#11181C] shadow-sm'
                      : 'bg-white border-[#E2E6DF] hover:border-[#88929A]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#11181C] text-[#B6F05C]'
                        : 'bg-[#F4F6F2] text-[#5A636A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#11181C]">{method.label}</span>
                      {method.badge && (
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592] shrink-0">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5A636A] mt-0.5">{method.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {paymentMethod === 'cod' && (
            <div className="p-3 rounded-xl bg-[#F1FCDA] border border-[#D3F592] text-[11px] text-[#2D5E12] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Miễn phí thu hộ COD. Bạn được mở hộp kiểm tra tem chính hãng và tình trạng vợt trước khi thanh toán.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 border-t border-[#E2E6DF] bg-[#FAFBF9] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#5A636A]">Tổng thanh toán</span>
          <span className="font-mono text-base font-extrabold text-[#11181C]">
            {total.toLocaleString('vi-VN')} đ
          </span>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] disabled:opacity-60 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#B6F05C]" />
              <span>Đang tạo đơn hàng...</span>
            </>
          ) : paymentMethod === 'cod' ? (
            <>
              <span>Hoàn tất đặt hàng (COD)</span>
              <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
            </>
          ) : (
            <>
              <span>Tiếp tục thanh toán</span>
              <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
