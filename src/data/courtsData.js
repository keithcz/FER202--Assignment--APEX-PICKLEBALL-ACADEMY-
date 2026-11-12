export const COURTS_DATA = [
  {
    id: "court-1",
    name: "Sân 01 - Center Court (Indoor Pro)",
    type: "Trong Nhà - Máy Lạnh",
    surface: "Thảm Acrylic 8 lớp giảm chấn DecoTurf",
    lighting: "Hệ thống đèn LED 1000 Lux chuẩn truyền hình PPA",
    camera: "Camera AI ghi lại diễn biến & phát lại tức thì",
    hourlyRateOffPeak: 180000,
    hourlyRatePeak: 260000,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
    description: "Sân trung tâm với khán đài mini 100 chỗ, màn hình phân tích trực tiếp và thảm giảm chấn cao cấp nhất."
  },
  {
    id: "court-2",
    name: "Sân 02 - Pro Performance Court",
    type: "Trong Nhà",
    surface: "Thảm Acrylic tiêu chuẩn USA Pickleball",
    lighting: "Đèn LED chống chói 800 Lux",
    camera: "Hỗ trợ máy bắn bóng Spinfire Pro",
    hourlyRateOffPeak: 160000,
    hourlyRatePeak: 240000,
    image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80",
    description: "Không gian thoáng mát trang bị đầy đủ máy bắn bóng tự động phục vụ học viên tập d drills."
  },
  {
    id: "court-3",
    name: "Sân 03 - Sky View Rooftop",
    type: "Ngoài Trời (Có Mái Che Thông Minh)",
    surface: "Mặt sân Cushion Sportmaster chống trơn trượt",
    lighting: "Hệ thống đèn chiếu sáng ban đêm",
    camera: "Gió tự nhiên mát rượi tầng thượng",
    hourlyRateOffPeak: 140000,
    hourlyRatePeak: 220000,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
    description: "View toàn cảnh thành phố cực chill, lý tưởng cho các buổi giao lưu câu lạc bộ và thi đấu chiều tối."
  },
  {
    id: "court-4",
    name: "Sân 04 - Tactical Drill Court",
    type: "Khu Vực Tập Luyện Kỹ Thuật",
    surface: "Vạch kẻ phân tích vùng Kitchen, Erne Zone chuyên sâu",
    lighting: "Đèn LED 800 Lux",
    camera: "Bảng bia mục tiêu dinking điện tử",
    hourlyRateOffPeak: 120000,
    hourlyRatePeak: 180000,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    description: "Được kẻ vạch đặc biệt giúp học viên luyện cảm giác bóng rơi, độ xoáy và vị trí Third Shot chính xác."
  }
];

export const TIME_SLOTS = [
  { id: "06:00", label: "06:00 - 07:00", isPeak: false },
  { id: "07:00", label: "07:00 - 08:00", isPeak: false },
  { id: "08:00", label: "08:00 - 09:00", isPeak: false },
  { id: "09:00", label: "09:00 - 10:00", isPeak: false },
  { id: "10:00", label: "10:00 - 11:00", isPeak: false },
  { id: "14:00", label: "14:00 - 15:00", isPeak: false },
  { id: "15:00", label: "15:00 - 16:00", isPeak: false },
  { id: "16:00", label: "16:00 - 17:00", isPeak: false },
  { id: "17:00", label: "17:00 - 18:00", isPeak: true },
  { id: "18:00", label: "18:00 - 19:00", isPeak: true },
  { id: "19:00", label: "19:00 - 20:00", isPeak: true },
  { id: "20:00", label: "20:00 - 21:00", isPeak: true },
  { id: "21:00", label: "21:00 - 22:00", isPeak: true }
];
