import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  ShoppingBag, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function DashboardPage({ currentUser, setActiveTab, initialSubTab = 'courses' }) {
  const { orders: shopOrders, refreshOperations } = useSiteData();
  const [registrations, setRegistrations] = useState([]);
  const [courtBookings, setCourtBookings] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    refreshOperations();
    const savedRegs = JSON.parse(localStorage.getItem('apex_registrations') || '[]');
    const savedCourts = JSON.parse(localStorage.getItem('apex_court_bookings') || '[]');

    if (savedRegs.length === 0) {
      const defaultReg = [
        {
          bookingCode: 'APEX-REG-849201',
          fullName: currentUser ? currentUser.name : 'Nguyễn Văn An',
          phone: '0988688999',
          courseTitle: 'Pickleball Căn Bản & Nền Tảng (Beginner)',
          coursePrice: 2450000,
          preferredSlot: 'Tối Thứ 3 - Thứ 5 (18:30 - 20:30)',
          createdAt: '11/03/2026',
          status: 'Đang Học (Buổi 3/8)'
        }
      ];
      setRegistrations(defaultReg);
      localStorage.setItem('apex_registrations', JSON.stringify(defaultReg));
    } else {
      setRegistrations(savedRegs);
    }

    if (savedCourts.length === 0) {
      const defaultCourt = [
        {
          ticketCode: 'APEX-COURT-918234',
          courtName: 'Sân 01 - Center Court (Indoor Pro)',
          courtType: 'Trong Nhà',
          date: 'Hôm nay',
          slots: '18:00 - 19:00',
          totalAmount: 260000,
          createdAt: '11/03/2026',
          status: 'Sẵn Sàng Sử Dụng'
        }
      ];
      setCourtBookings(defaultCourt);
      localStorage.setItem('apex_court_bookings', JSON.stringify(defaultCourt));
    } else {
      setCourtBookings(savedCourts);
    }
  }, [currentUser, refreshOperations]);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Student Banner - Enode Clean Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E6DF] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#11181C] text-white flex items-center justify-center text-xl font-bold font-mono">
            {currentUser ? currentUser.name[0] : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#11181C] tracking-tight">
                {currentUser ? currentUser.name : 'Học Viên Apex'}
              </h1>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
                DUPR 3.2 ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#5A636A] mt-0.5 font-mono">
              {currentUser ? currentUser.email : 'hocvien.apex@gmail.com'} • ID: APEX-STU-8823
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white text-xs font-medium shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Đăng ký thêm khóa</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B6F05C]" />
          </button>
          <button
            onClick={() => setActiveTab('courts')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F4F6F2] text-xs font-medium text-[#11181C] border border-[#E2E6DF]"
          >
            Đặt thêm giờ sân
          </button>
        </div>
      </div>

      {/* Metrics Row - Enode Style Data chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
          <span className="font-mono text-[10px] uppercase text-[#88929A] tracking-wider block">Khóa học ghi danh</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-2xl font-bold text-[#11181C]">{registrations.length}</span>
            <span className="font-mono text-[10px] text-[#2D5E12] bg-[#F1FCDA] px-2 py-0.5 rounded">HỢP LỆ</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
          <span className="font-mono text-[10px] uppercase text-[#88929A] tracking-wider block">Vé sân đã giữ</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-2xl font-bold text-[#11181C]">{courtBookings.length}</span>
            <span className="font-mono text-[10px] text-[#2D5E12] bg-[#F1FCDA] px-2 py-0.5 rounded">ACTIVE</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
          <span className="font-mono text-[10px] uppercase text-[#88929A] tracking-wider block">Đơn hàng Pro Shop</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono text-2xl font-bold text-[#11181C]">{shopOrders.length}</span>
            <span className="font-mono text-[10px] text-[#5A636A] bg-[#F4F6F2] px-2 py-0.5 rounded">HOÀN TẤT</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-[#E2E6DF] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
            activeSubTab === 'courses'
              ? 'bg-[#11181C] text-white font-medium shadow-sm'
              : 'text-[#5A636A] hover:text-[#11181C] hover:bg-[#F4F6F2]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Khóa học của tôi ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('courts')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
            activeSubTab === 'courts'
              ? 'bg-[#11181C] text-white font-medium shadow-sm'
              : 'text-[#5A636A] hover:text-[#11181C] hover:bg-[#F4F6F2]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Vé sân đã đặt ({courtBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
            activeSubTab === 'orders'
              ? 'bg-[#11181C] text-white font-medium shadow-sm'
              : 'text-[#5A636A] hover:text-[#11181C] hover:bg-[#F4F6F2]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Đơn hàng Pro Shop ({shopOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Course Registrations */}
      {activeSubTab === 'courses' && (
        <div className="space-y-3">
          {registrations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-[#88929A] text-xs">
              Chưa có khóa học nào được đăng ký.
            </div>
          ) : (
            registrations.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#11181C]">
                      {item.bookingCode}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592]">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#11181C] tracking-tight">{item.courseTitle}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-[#5A636A]">
                    <span>Lịch: <strong>{item.preferredSlot}</strong></span>
                    <span>•</span>
                    <span className="font-mono">Ngày đăng ký: {item.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E6DF]">
                  <div className="text-right">
                    <span className="font-mono text-[9px] text-[#88929A] block uppercase">Học phí</span>
                    <span className="font-mono text-sm font-bold text-[#11181C]">
                      {item.coursePrice ? item.coursePrice.toLocaleString('vi-VN') + ' đ' : 'Miễn phí'}
                    </span>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Court Bookings */}
      {activeSubTab === 'courts' && (
        <div className="space-y-3">
          {courtBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-[#88929A] text-xs">
              Chưa có lịch đặt sân nào.
            </div>
          ) : (
            courtBookings.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] hover:border-[#11181C] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#11181C]">
                      {item.ticketCode}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12]">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#11181C] tracking-tight">{item.courtName}</h3>
                  <div className="text-xs text-[#5A636A]">
                    Ngày: <strong className="text-[#11181C]">{item.date}</strong> | Khung giờ:{' '}
                    <strong className="font-mono text-[#11181C]">{item.slots}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2E6DF]">
                  <div className="text-right">
                    <span className="font-mono text-[9px] text-[#88929A] block uppercase">Tiền sân</span>
                    <span className="font-mono text-sm font-bold text-[#11181C]">
                      {item.totalAmount ? item.totalAmount.toLocaleString('vi-VN') + ' đ' : '0 đ'}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-[#11181C] text-white p-1 rounded-lg flex items-center justify-center text-[8px] font-mono font-bold">
                    PASS
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Shop Orders */}
      {activeSubTab === 'orders' && (
        <div className="space-y-3">
          {shopOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E2E6DF] text-center text-[#88929A] text-xs">
              Bạn chưa có đơn đặt hàng nào từ Pro Shop.
            </div>
          ) : (
            shopOrders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                className="p-5 rounded-3xl bg-white border border-[#E2E6DF] space-y-3 shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-[#E2E6DF]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#11181C]">{order.orderId}</span>
                    <span className="font-mono text-xs text-[#88929A] ml-3">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.paymentMethod && (
                      <span className="font-mono text-[10px] text-[#5A636A] bg-[#F4F6F2] px-2.5 py-0.5 rounded-full border border-[#E2E6DF]">
                        {order.paymentMethod}
                      </span>
                    )}
                    <span className="font-mono text-[10px] font-bold text-[#2D5E12] bg-[#F1FCDA] px-2 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>

                {(order.customerName || order.shippingAddress) && (
                  <div className="text-[11px] text-[#5A636A] bg-[#FAFBF9] px-3 py-2 rounded-xl border border-[#E2E6DF] flex flex-wrap gap-x-4 gap-y-1">
                    {order.customerName && (
                      <span>
                        Người nhận: <strong className="text-[#11181C]">{order.customerName}</strong>
                        {order.customerPhone ? ` (${order.customerPhone})` : ''}
                      </span>
                    )}
                    {order.shippingAddress && <span>Giao nhận: {order.shippingAddress}</span>}
                  </div>
                )}

                <div className="space-y-1 text-xs text-[#5A636A]">
                  {(order.items || []).map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.name} (x{it.quantity})</span>
                      <span className="font-mono font-medium text-[#11181C]">{(it.price * it.quantity).toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#2D5E12] font-mono text-[11px]">
                      <span>Mã giảm giá ({order.discountCode})</span>
                      <span>- {order.discountAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E2E6DF] flex justify-between items-baseline">
                  <span className="text-xs text-[#88929A]">Tổng thanh toán:</span>
                  <span className="font-mono text-sm font-bold text-[#11181C]">
                    {(order.totalAmount || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
