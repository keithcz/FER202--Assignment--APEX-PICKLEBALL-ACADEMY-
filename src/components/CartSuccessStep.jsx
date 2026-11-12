import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';

export default function CartSuccessStep({ order, onViewOrders, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const isCod = order.paymentMethodId === 'cod';

  const handleCopyOrderId = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(order.orderId).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between space-y-5">
      <div className="space-y-5">
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-full bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center mx-auto border border-[#D3F592]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-[#11181C]">
            {isCod ? 'Đặt Hàng Thành Công' : 'Thanh Toán & Đặt Hàng Thành Công'}
          </h4>
          <p className="text-xs text-[#5A636A] max-w-xs mx-auto leading-relaxed">
            {order.deliveryMethod === 'pickup'
              ? `Đơn hàng đã được giữ tại cơ sở Apex. Nhân viên sẽ liên hệ qua số ${order.customerPhone} khi sẵn sàng nhận.`
              : `Bộ phận Pro Shop Apex sẽ liên hệ qua số ${order.customerPhone} để xác nhận và giao dụng cụ sớm nhất.`}
          </p>
        </div>

        {/* Receipt Card */}
        <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E6DF]">
            <div>
              <span className="font-mono text-[10px] text-[#88929A] uppercase block">
                Mã đơn hàng
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-sm text-[#11181C]">
                  {order.orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="p-1 rounded-md text-[#88929A] hover:text-[#11181C] hover:bg-[#EAECE8]"
                  title="Sao chép mã đơn hàng"
                  aria-label="Sao chép mã đơn hàng"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#2D5E12]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <span
              className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isCod
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-[#F1FCDA] text-[#2D5E12] border-[#D3F592]'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between gap-3">
              <span className="text-[#88929A] shrink-0">Phương thức:</span>
              <span className="text-[#11181C] font-medium text-right">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#88929A] shrink-0">Người nhận:</span>
              <span className="text-[#11181C] font-medium text-right">
                {order.customerName} • <span className="font-mono">{order.customerPhone}</span>
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[#88929A] shrink-0">Giao nhận:</span>
              <span className="text-[#5A636A] text-right">{order.shippingAddress}</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#E2E6DF] space-y-1 text-[11px] text-[#5A636A]">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono text-[#11181C] shrink-0">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#2D5E12] font-mono">
                <span>Mã giảm giá ({order.discountCode})</span>
                <span>- {order.discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-[#E2E6DF] flex justify-between items-baseline">
            <span className="text-[#5A636A] font-medium">Tổng cộng:</span>
            <span className="font-mono text-base font-extrabold text-[#11181C]">
              {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-2">
        {onViewOrders && (
          <button
            type="button"
            onClick={onViewOrders}
            className="w-full py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Xem đơn hàng tại Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#F4F6F2] hover:bg-[#EAECE8] text-[#11181C] font-medium text-xs transition-all"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
