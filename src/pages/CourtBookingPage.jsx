import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Info,
  ArrowRight,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { TIME_SLOTS } from '../data/courtsData';
import { useSiteData } from '../context/SiteDataContext';

export default function CourtBookingPage({ setActiveTab }) {
  const { courts, refreshOperations } = useSiteData();
  // Generate next 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateString: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : `Thứ ${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`,
      formattedDate: `${d.getDate()}/${d.getMonth() + 1}`,
    };
  });

  const [selectedDate, setSelectedDate] = useState(days[0].dateString);
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [selectedSlots, setSelectedSlots] = useState(['18:00']);
  const [bookerName, setBookerName] = useState('');
  const [bookerPhone, setBookerPhone] = useState('');
  const [bookingPass, setBookingPass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Mock pre-booked slots for realism
  const bookedSlotsByCourt = {
    'court-1': ['17:00', '19:00'],
    'court-2': ['18:00', '20:00'],
    'court-3': ['19:00', '21:00'],
    'court-4': ['08:00', '16:00'],
  };

  const selectedCourt = courts.find((c) => c.id === selectedCourtId) || courts[0];

  const handleToggleSlot = (slotId) => {
    const isBooked = (bookedSlotsByCourt[selectedCourtId] || []).includes(slotId);
    if (isBooked) return;

    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId].sort());
    }
    setErrorMsg('');
  };

  // Calculate pricing
  const totalAmount = selectedSlots.reduce((acc, slotId) => {
    const slotObj = TIME_SLOTS.find((s) => s.id === slotId);
    const isPeak = slotObj ? slotObj.isPeak : false;
    return acc + (isPeak ? selectedCourt.hourlyRatePeak : selectedCourt.hourlyRateOffPeak);
  }, 0);

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 khung giờ tập!');
      return;
    }
    if (!bookerName.trim()) {
      setErrorMsg('Vui lòng nhập tên người đặt sân');
      return;
    }
    if (!bookerPhone.trim() || !/^(0[3|5|7|8|9])[0-9]{8}$/.test(bookerPhone.replace(/\s+/g, ''))) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (10 số)');
      return;
    }

    const ticket = {
      ticketCode: 'APEX-COURT-' + Math.floor(100000 + Math.random() * 900000),
      courtName: selectedCourt.name,
      courtType: selectedCourt.type,
      date: selectedDate,
      slots: selectedSlots.join(', '),
      totalHours: selectedSlots.length,
      totalAmount: totalAmount,
      bookerName,
      bookerPhone,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã Giữ Sân Thành Công'
    };

    const existing = JSON.parse(localStorage.getItem('apex_court_bookings') || '[]');
    existing.unshift(ticket);
    localStorage.setItem('apex_court_bookings', JSON.stringify(existing));
    refreshOperations();

    setBookingPass(ticket);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-3 py-1 rounded-full border border-[#D3F592]">
          Hệ thống đặt sân thông minh
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#11181C]">
          Đặt sân tập Pickleball theo giờ
        </h1>
        <p className="text-xs sm:text-sm text-[#5A636A] max-w-xl mx-auto leading-relaxed">
          Theo dõi trạng thái sân thời gian thực, bảng giá minh bạch giữa giờ thường & giờ cao điểm, sân đệm giảm chấn bảo vệ khớp gối.
        </p>
      </div>

      {/* 1. Date Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d) => (
          <button
            key={d.dateString}
            onClick={() => {
              setSelectedDate(d.dateString);
              setSelectedSlots([]);
            }}
            className={`px-5 py-2.5 rounded-2xl border text-center transition-all shrink-0 ${
              selectedDate === d.dateString
                ? 'bg-[#11181C] text-white border-[#11181C] shadow-sm'
                : 'bg-white border-[#E2E6DF] text-[#5A636A] hover:text-[#11181C] hover:bg-[#F4F6F2]'
            }`}
          >
            <div className="text-[11px] font-medium">{d.dayName}</div>
            <div className="font-mono text-sm font-extrabold mt-0.5">{d.formattedDate}</div>
          </button>
        ))}
      </div>

      {/* 2. Court Selector Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#11181C] uppercase tracking-wider font-mono flex items-center gap-2">
          <span>1. Chọn sân tập:</span>
          <span className="text-[#88929A] font-normal">(4 sân tiêu chuẩn quốc tế)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courts.map((court) => {
            const isSelected = selectedCourtId === court.id;
            return (
              <div
                key={court.id}
                onClick={() => setSelectedCourtId(court.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#11181C] shadow-sm'
                    : 'bg-white border-[#E2E6DF] hover:border-[#88929A]'
                }`}
              >
                <div>
                  <img
                    src={court.image}
                    alt={court.name}
                    className="w-full h-32 rounded-2xl object-cover mb-3"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] font-semibold text-[#2D5E12] px-2 py-0.5 rounded-full bg-[#F1FCDA]">
                      {court.type}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[9px] font-bold text-white bg-[#11181C] px-2 py-0.5 rounded-full">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#11181C] mt-1">{court.name}</h4>
                  <p className="text-[11px] text-[#5A636A] mt-1 line-clamp-2">{court.surface}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E6DF] text-xs">
                  <div className="flex justify-between text-[#88929A] text-[11px]">
                    <span>Giờ thường:</span>
                    <span className="font-mono text-[#11181C] font-medium">{court.hourlyRateOffPeak.toLocaleString('vi-VN')} đ/h</span>
                  </div>
                  <div className="flex justify-between text-[#88929A] text-[11px] mt-1">
                    <span>Giờ cao điểm:</span>
                    <span className="font-mono text-[#11181C] font-bold">{court.hourlyRatePeak.toLocaleString('vi-VN')} đ/h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Time Slots Grid & Booking Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Time Slots (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E6DF] rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2E6DF]">
            <div>
              <h3 className="text-sm font-bold text-[#11181C] tracking-tight">2. Khung giờ tập ngày {selectedDate}</h3>
              <p className="text-xs text-[#5A636A] mt-0.5">Nhấp vào khung giờ còn trống để chọn (có thể chọn nhiều giờ)</p>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#5A636A]">
                <span className="w-2.5 h-2.5 rounded bg-white border border-[#E2E6DF]"></span>
                <span>Trống</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#11181C]">
                <span className="w-2.5 h-2.5 rounded bg-[#11181C]"></span>
                <span className="font-semibold">Đang chọn</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#88929A]">
                <span className="w-2.5 h-2.5 rounded bg-[#F4F6F2] border border-[#E2E6DF]"></span>
                <span>Đã kín</span>
              </div>
            </div>
          </div>

          {/* Slots grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const isBooked = (bookedSlotsByCourt[selectedCourtId] || []).includes(slot.id);
              const isSelected = selectedSlots.includes(slot.id);

              return (
                <button
                  key={slot.id}
                  disabled={isBooked}
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isBooked
                      ? 'bg-[#F4F6F2] border-[#E2E6DF] text-[#88929A] cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-[#11181C] border-[#11181C] text-white shadow-sm'
                      : 'bg-white border-[#E2E6DF] text-[#11181C] hover:border-[#11181C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{slot.label}</span>
                    {slot.isPeak && (
                      <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F1FCDA] text-[#2D5E12]'
                      }`}>
                        Peak
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-[#88929A]'}`}>
                    {isBooked ? 'Đã có người đặt' : slot.isPeak ? 'Giờ cao điểm' : 'Giờ thường'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#5A636A] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#11181C] shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Khung giờ cao điểm (17:00 - 22:00) áp dụng mức giá đặc biệt do hệ thống đèn LED 1000 Lux và máy lạnh hoạt động tối đa công suất.
            </span>
          </div>
        </div>

        {/* Right: Booking Summary Form (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E6DF] rounded-3xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#11181C] tracking-tight pb-3 border-b border-[#E2E6DF] flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#11181C]" />
            <span>3. Tóm tắt & Thông tin người đặt</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#88929A]">Sân:</span>
              <span className="text-[#11181C] font-semibold truncate max-w-[170px]">{selectedCourt.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#88929A]">Ngày:</span>
              <span className="font-mono text-[#11181C] font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#88929A]">Khung giờ:</span>
              <span className="font-mono text-[#11181C] font-medium truncate max-w-[170px]">
                {selectedSlots.length > 0 ? selectedSlots.join(', ') : 'Chưa chọn'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#88929A]">Thời lượng:</span>
              <span className="font-mono text-[#11181C] font-bold">{selectedSlots.length} giờ</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E6DF] flex justify-between items-baseline">
            <span className="text-xs text-[#88929A]">Tổng tiền sân:</span>
            <span className="font-mono text-xl font-extrabold text-[#11181C]">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* User contact fields */}
          <form onSubmit={handleConfirmBooking} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs text-[#11181C] font-medium mb-1">Tên người đặt *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#11181C] font-medium mb-1">Số điện thoại nhận vé *</label>
              <input
                type="tel"
                placeholder="0912 345 678"
                value={bookerPhone}
                onChange={(e) => setBookerPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E6DF] text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Xác nhận giữ sân ngay</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B6F05C]" />
            </button>
          </form>
        </div>

      </div>

      {/* Booking Pass Modal */}
      {bookingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11181C]/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-[#E2E6DF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(17,24,28,0.12)] space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#F1FCDA] text-[#2D5E12] flex items-center justify-center mx-auto border border-[#D3F592]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2D5E12] bg-[#F1FCDA] px-2.5 py-0.5 rounded-full">
                Đặt sân thành công
              </span>
              <h3 className="text-xl font-bold text-[#11181C] tracking-tight mt-2">Mã vé sân của bạn</h3>
              <p className="text-xs text-[#5A636A] mt-1">Xuất trình mã này cho lễ tân tại sảnh khi đến sân.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E6DF]">
                <span className="text-[#88929A]">Mã Booking:</span>
                <span className="font-mono font-bold text-[#11181C] text-sm">{bookingPass.ticketCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929A]">Sân:</span>
                <span className="text-[#11181C] font-medium">{bookingPass.courtName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929A]">Ngày & Giờ:</span>
                <span className="font-mono text-[#11181C] font-medium">{bookingPass.date} ({bookingPass.slots})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2E6DF]">
                <span className="text-[#88929A]">Tổng tiền:</span>
                <span className="font-mono text-[#11181C] font-bold">{bookingPass.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBookingPass(null);
                  setActiveTab('dashboard');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#11181C] text-white text-xs font-medium hover:bg-[#232C33] transition-all"
              >
                Xem vé tại Dashboard
              </button>
              <button
                onClick={() => setBookingPass(null)}
                className="px-4 py-2.5 rounded-full bg-[#F4F6F2] hover:bg-[#EAECE8] text-xs font-medium text-[#11181C]"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
