import React, { useState, useEffect } from 'react';
import { ShoppingBag, GraduationCap, Ticket, Trash2 } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

const ORDER_STATUSES = ['Chờ thanh toán', 'Đã thanh toán', 'Đã xác nhận', 'Đang giao hàng', 'Hoàn tất', 'Đã hủy'];
const REG_STATUSES = ['Đã Tiếp Nhận', 'Đang Học', 'Hoàn Thành', 'Đã Hủy'];
const COURT_STATUSES = ['Đã Giữ Sân Thành Công', 'Sẵn Sàng Sử Dụng', 'Đã Check-in', 'Đã Hủy'];

export default function AdminOperationsTab({ onNotify }) {
  const {
    orders,
    registrations,
    courtBookings,
    refreshOperations,
    updateOrderStatus,
    deleteOrder,
    updateRegistrationStatus,
    deleteRegistration,
    updateCourtBookingStatus,
    deleteCourtBooking,
  } = useSiteData();

  const [subTab, setSubTab] = useState('orders');

  useEffect(() => {
    refreshOperations();
  }, [refreshOperations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${
            subTab === 'orders'
              ? 'bg-[#11181C] text-white'
              : 'bg-white text-[#5A636A] border border-[#E2E6DF]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Đơn hàng Pro Shop ({orders.length})</span>
        </button>

        <button
          onClick={() => setSubTab('registrations')}
          className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${
            subTab === 'registrations'
              ? 'bg-[#11181C] text-white'
              : 'bg-white text-[#5A636A] border border-[#E2E6DF]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Đăng ký Khóa học ({registrations.length})</span>
        </button>

        <button
          onClick={() => setSubTab('courts')}
          className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${
            subTab === 'courts'
              ? 'bg-[#11181C] text-white'
              : 'bg-white text-[#5A636A] border border-[#E2E6DF]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Lịch đặt sân ({courtBookings.length})</span>
        </button>
      </div>

      {/* Orders */}
      {subTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-xs text-[#88929A]">
              Chưa có đơn hàng Pro Shop nào.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E6DF]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#11181C]">{order.orderId}</span>
                    <span className="font-mono text-xs text-[#88929A] ml-3">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        updateOrderStatus(order.orderId, e.target.value);
                        onNotify(`Đã cập nhật trạng thái đơn ${order.orderId}`);
                      }}
                      className="px-3 py-1 rounded-full bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] font-mono text-[11px] font-semibold"
                    >
                      {[...new Set([...ORDER_STATUSES, order.status].filter(Boolean))].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        deleteOrder(order.orderId);
                        onNotify(`Đã xóa đơn hàng ${order.orderId}`);
                      }}
                      className="p-1.5 rounded-full text-[#88929A] hover:text-red-600 hover:bg-red-50"
                      aria-label="Xóa đơn hàng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {(order.customerName || order.paymentMethod || order.shippingAddress) && (
                  <div className="text-[11px] text-[#5A636A] bg-[#FAFBF9] px-3 py-2 rounded-xl border border-[#E2E6DF] flex flex-wrap gap-x-4 gap-y-1">
                    {order.customerName && (
                      <span>
                        Khách: <strong className="text-[#11181C]">{order.customerName}</strong>
                        {order.customerPhone ? ` (${order.customerPhone})` : ''}
                      </span>
                    )}
                    {order.paymentMethod && (
                      <span>
                        PTTT: <strong className="text-[#11181C]">{order.paymentMethod}</strong>
                      </span>
                    )}
                    {order.shippingAddress && <span>Giao nhận: {order.shippingAddress}</span>}
                  </div>
                )}

                <div className="space-y-1 text-xs text-[#5A636A]">
                  {(order.items || []).map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>
                        {it.name} (x{it.quantity})
                      </span>
                      <span className="font-mono font-medium text-[#11181C]">
                        {(it.price * it.quantity).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ))}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#2D5E12] font-mono text-[11px]">
                      <span>Mã giảm giá ({order.discountCode})</span>
                      <span>- {order.discountAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E2E6DF] flex justify-between items-center text-xs">
                  <span className="text-[#88929A]">Tổng thanh toán:</span>
                  <span className="font-mono font-bold text-sm text-[#11181C]">
                    {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Registrations */}
      {subTab === 'registrations' && (
        <div className="space-y-3">
          {registrations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-xs text-[#88929A]">
              Chưa có phiếu đăng ký khóa học nào.
            </div>
          ) : (
            registrations.map((reg) => (
              <div
                key={reg.bookingCode}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#11181C]">{reg.bookingCode}</span>
                    <span className="font-mono text-[11px] text-[#88929A]">{reg.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#11181C]">{reg.courseTitle}</h4>
                  <p className="text-xs text-[#5A636A]">
                    Học viên: <strong>{reg.fullName}</strong> • SĐT: <span className="font-mono">{reg.phone}</span>
                  </p>
                  {reg.preferredSlot && (
                    <p className="text-xs text-[#88929A]">Lịch: {reg.preferredSlot}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#11181C]">
                    {(reg.coursePrice || 0).toLocaleString('vi-VN')} đ
                  </span>
                  <select
                    value={reg.status}
                    onChange={(e) => {
                      updateRegistrationStatus(reg.bookingCode, e.target.value);
                      onNotify(`Đã cập nhật hồ sơ ${reg.bookingCode}`);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] font-mono text-[11px] font-semibold"
                  >
                    {[...new Set([...REG_STATUSES, reg.status].filter(Boolean))].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      deleteRegistration(reg.bookingCode);
                      onNotify(`Đã xóa phiếu ${reg.bookingCode}`);
                    }}
                    className="p-1.5 rounded-full text-[#88929A] hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Court Bookings */}
      {subTab === 'courts' && (
        <div className="space-y-3">
          {courtBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-xs text-[#88929A]">
              Chưa có lịch đặt sân nào.
            </div>
          ) : (
            courtBookings.map((booking) => (
              <div
                key={booking.ticketCode}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#11181C]">{booking.ticketCode}</span>
                    <span className="font-mono text-[11px] text-[#88929A]">{booking.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#11181C]">{booking.courtName}</h4>
                  <p className="text-xs text-[#5A636A]">
                    Khung giờ: <strong className="font-mono">{booking.slots}</strong>
                    {booking.bookerName ? ` • Người đặt: ${booking.bookerName} (${booking.bookerPhone})` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#11181C]">
                    {(booking.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </span>
                  <select
                    value={booking.status}
                    onChange={(e) => {
                      updateCourtBookingStatus(booking.ticketCode, e.target.value);
                      onNotify(`Đã cập nhật vé sân ${booking.ticketCode}`);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#F1FCDA] border border-[#D3F592] text-[#2D5E12] font-mono text-[11px] font-semibold"
                  >
                    {[...new Set([...COURT_STATUSES, booking.status].filter(Boolean))].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      deleteCourtBooking(booking.ticketCode);
                      onNotify(`Đã xóa vé sân ${booking.ticketCode}`);
                    }}
                    className="p-1.5 rounded-full text-[#88929A] hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
