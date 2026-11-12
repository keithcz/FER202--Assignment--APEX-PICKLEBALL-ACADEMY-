import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import CartShippingStep, { PICKUP_BRANCHES } from './CartShippingStep';
import CartPaymentStep from './CartPaymentStep';
import CartSuccessStep from './CartSuccessStep';

const QR_TTL_SECONDS = 15 * 60;

const EMPTY_CARD = {
  number: '',
  holder: '',
  expiry: '',
  cvv: '',
};

function generateOrderCode() {
  return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
  clearCart,
  currentUser,
  onViewOrders,
}) {
  const { siteContent, refreshOperations } = useSiteData();

  const [step, setStep] = useState('cart'); // 'cart' | 'shipping' | 'payment' | 'success'
  const [discountCode, setDiscountCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    deliveryMethod: 'delivery',
    address: '',
    pickupBranch: PICKUP_BRANCHES[0],
    notes: '',
  });
  const [shippingErrors, setShippingErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('bank_qr');
  const [walletProvider, setWalletProvider] = useState('momo');
  const [pendingOrderId, setPendingOrderId] = useState(generateOrderCode);

  const [cardForm, setCardForm] = useState(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState({});

  const [secondsLeft, setSecondsLeft] = useState(QR_TTL_SECONDS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const processingTimerRef = useRef(null);

  // Pre-fill customer contact info when logged in
  useEffect(() => {
    if (!currentUser) return;
    setShippingInfo((prev) => ({
      ...prev,
      fullName: prev.fullName || currentUser.name || '',
      phone: prev.phone || currentUser.phone || '',
    }));
  }, [currentUser]);

  // If cart is emptied externally while in checkout, return to cart view
  useEffect(() => {
    if (cartItems.length === 0 && (step === 'shipping' || step === 'payment')) {
      setStep('cart');
    }
  }, [cartItems.length, step]);

  // Countdown timer for QR payment step
  useEffect(() => {
    if (!isOpen || step !== 'payment') return undefined;
    if (paymentMethod !== 'bank_qr' && paymentMethod !== 'ewallet') return undefined;
    if (secondsLeft <= 0) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step, paymentMethod, secondsLeft]);

  // Cleanup simulated payment timer on unmount
  useEffect(() => {
    return () => {
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const activePromoCode = (siteContent.shop?.promoCode || 'APEXPRO').trim().toUpperCase();
  const activePromoPercent = Number(siteContent.shop?.promoPercent ?? 10);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = isDiscountApplied ? Math.round((subtotal * activePromoPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleClose = () => {
    if (processingTimerRef.current) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    setIsProcessing(false);

    if (step === 'success') {
      setCompletedOrder(null);
      setDiscountCode('');
      setAppliedPromoCode('');
      setIsDiscountApplied(false);
      setVoucherError('');
      setCardForm(EMPTY_CARD);
      setCardErrors({});
    }
    setStep('cart');
    onClose();
  };

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    const entered = discountCode.trim().toUpperCase();
    if (!entered) {
      setVoucherError('Vui lòng nhập mã giảm giá.');
      return;
    }
    if (entered === activePromoCode || entered === 'PICKLEBALL') {
      setIsDiscountApplied(true);
      setAppliedPromoCode(entered);
      setVoucherError('');
    } else {
      setVoucherError(`Mã không hợp lệ. Thử mã ${activePromoCode} (giảm ${activePromoPercent}%).`);
    }
  };

  const handleRemoveVoucher = () => {
    setIsDiscountApplied(false);
    setAppliedPromoCode('');
    setDiscountCode('');
    setVoucherError('');
  };

  const handleChangeShipping = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateShipping = () => {
    const errs = {};
    if (!shippingInfo.fullName.trim() || shippingInfo.fullName.trim().length < 2) {
      errs.fullName = 'Vui lòng nhập họ tên người nhận (tối thiểu 2 ký tự)';
    }
    const cleanPhone = shippingInfo.phone.replace(/[\s.-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(cleanPhone)) {
      errs.phone = 'Số điện thoại VN gồm 10 số (VD: 0912345678)';
    }
    if (shippingInfo.deliveryMethod === 'delivery') {
      if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 6) {
        errs.address = 'Vui lòng nhập địa chỉ giao hàng chi tiết';
      }
    }
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCard = () => {
    const errs = {};
    const digits = cardForm.number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19 || /^0+$/.test(digits)) {
      errs.number = 'Số thẻ không hợp lệ (13-19 chữ số)';
    }
    if (!cardForm.holder.trim() || cardForm.holder.trim().length < 2) {
      errs.holder = 'Vui lòng nhập tên chủ thẻ';
    }
    const expMatch = cardForm.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expMatch) {
      errs.expiry = 'Định dạng MM/YY (VD: 12/28)';
    } else {
      const month = Number(expMatch[1]);
      const year = 2000 + Number(expMatch[2]);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      if (month < 1 || month > 12) {
        errs.expiry = 'Tháng hết hạn không hợp lệ (01-12)';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errs.expiry = 'Thẻ đã hết hạn sử dụng';
      }
    }
    if (!/^\d{3,4}$/.test(cardForm.cvv)) {
      errs.cvv = 'Mã CVV gồm 3-4 số';
    }
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'bank_qr') return 'Chuyển khoản VietQR';
    if (paymentMethod === 'ewallet') {
      return walletProvider === 'momo' ? 'Ví MoMo' : 'Ví ZaloPay';
    }
    if (paymentMethod === 'card') {
      const last4 = cardForm.number.replace(/\D/g, '').slice(-4) || '****';
      return `Thẻ thanh toán •••• ${last4}`;
    }
    return 'Thanh toán khi nhận hàng (COD)';
  };

  const finalizeOrder = () => {
    const isCod = paymentMethod === 'cod';
    const orderRecord = {
      orderId: pendingOrderId,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      discountCode: isDiscountApplied ? appliedPromoCode : null,
      discountAmount,
      totalAmount: total,
      date: new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date().toLocaleString('vi-VN'),
      customerName: shippingInfo.fullName.trim(),
      customerPhone: shippingInfo.phone.replace(/[\s.-]/g, ''),
      deliveryMethod: shippingInfo.deliveryMethod,
      shippingAddress:
        shippingInfo.deliveryMethod === 'pickup'
          ? `Nhận tại ${shippingInfo.pickupBranch}`
          : shippingInfo.address.trim(),
      notes: shippingInfo.notes.trim(),
      paymentMethod: getPaymentMethodLabel(),
      paymentMethodId: paymentMethod,
      paymentStatus: isCod ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán',
      status: isCod ? 'Đã xác nhận' : 'Đã thanh toán',
    };

    const existingOrders = JSON.parse(localStorage.getItem('apex_orders') || '[]');
    existingOrders.unshift(orderRecord);
    localStorage.setItem('apex_orders', JSON.stringify(existingOrders));
    refreshOperations();

    clearCart();
    setCardForm(EMPTY_CARD);
    setCardErrors({});
    setCompletedOrder(orderRecord);
    setIsProcessing(false);
    setStep('success');
  };

  const handleProceedToCheckout = () => {
    setPendingOrderId(generateOrderCode());
    setShippingErrors({});
    setCardErrors({});
    setStep('shipping');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!validateShipping()) return;

    if (paymentMethod === 'cod') {
      setIsProcessing(true);
      processingTimerRef.current = setTimeout(() => {
        finalizeOrder();
      }, 450);
      return;
    }

    setSecondsLeft(QR_TTL_SECONDS);
    setCardErrors({});
    setStep('payment');
  };

  const handleConfirmOnlinePayment = () => {
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }
    setIsProcessing(true);
    processingTimerRef.current = setTimeout(() => {
      finalizeOrder();
    }, 850);
  };

  const handleChangeCardField = (field, value) => {
    setCardForm((prev) => ({ ...prev, [field]: value }));
    if (cardErrors[field]) {
      setCardErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFillDemoCard = () => {
    setCardForm({
      number: '4242 4242 4242 4242',
      holder: 'NGUYEN VAN AN',
      expiry: '12/28',
      cvv: '123',
    });
    setCardErrors({});
  };

  const handleRegenerateQr = () => {
    setPendingOrderId(generateOrderCode());
    setSecondsLeft(QR_TTL_SECONDS);
  };

  const handleViewOrdersAndClose = () => {
    handleClose();
    if (onViewOrders) {
      onViewOrders();
    }
  };

  const headerTitle =
    step === 'cart'
      ? 'Giỏ hàng Pro Shop'
      : step === 'shipping'
      ? 'Thông tin & Phương thức'
      : step === 'payment'
      ? 'Thanh toán đơn hàng'
      : 'Xác nhận đơn hàng';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#11181C]/30 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white border-l border-[#E2E6DF] h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.08)]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E6DF] bg-[#FAFBF9] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {(step === 'shipping' || step === 'payment') && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                  className="p-1.5 rounded-full text-[#5A636A] hover:text-[#11181C] hover:bg-[#EAECE8] disabled:opacity-40"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h3 className="font-bold text-[#11181C] text-sm tracking-tight truncate">
                {headerTitle}
              </h3>
              {step === 'cart' && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592] font-semibold shrink-0">
                  {totalCount} món
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleClose}
              className="p-1.5 rounded-full text-[#5A636A] hover:text-[#11181C] hover:bg-[#EAECE8] disabled:opacity-40"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator during checkout */}
          {(step === 'shipping' || step === 'payment') && (
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded-full bg-[#F1FCDA] text-[#2D5E12] font-semibold">
                1. Giỏ hàng
              </span>
              <span className="text-[#B0B8C0]">/</span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  step === 'shipping'
                    ? 'bg-[#11181C] text-[#B6F05C]'
                    : 'bg-[#F1FCDA] text-[#2D5E12]'
                }`}
              >
                2. Giao hàng & PTTT
              </span>
              <span className="text-[#B0B8C0]">/</span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  step === 'payment'
                    ? 'bg-[#11181C] text-[#B6F05C]'
                    : 'bg-[#F4F6F2] text-[#88929A]'
                }`}
              >
                3. Thanh toán
              </span>
            </div>
          )}
        </div>

        {/* Step 1: Cart Items & Summary */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-[#88929A] space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto stroke-[1.2] text-[#B0B8C0]" />
                  <p className="text-xs font-medium text-[#5A636A]">Giỏ hàng đang trống</p>
                  <p className="text-[11px]">Chọn vợt hoặc bóng thi đấu tại Pro Shop</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] flex gap-3 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white border border-[#E2E6DF] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-[#11181C] truncate">
                        {item.name}
                      </h5>
                      <p className="font-mono text-[10px] text-[#88929A] mt-0.5">{item.brand}</p>
                      <p className="font-mono text-xs font-bold text-[#11181C] mt-1">
                        {item.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center border border-[#E2E6DF] rounded-full bg-white px-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-[#11181C] text-[#88929A]"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-semibold text-[#11181C]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-[#11181C] text-[#88929A]"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[#88929A] hover:text-red-600"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#E2E6DF] bg-[#FAFBF9] space-y-4">
                {/* Coupon Input */}
                <div className="space-y-1.5">
                  <form onSubmit={handleApplyVoucher} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3 h-3 absolute left-3 top-3 text-[#88929A]" />
                      <input
                        type="text"
                        placeholder={`MÃ GIẢM: ${activePromoCode}`}
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value);
                          if (voucherError) setVoucherError('');
                        }}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2E6DF] font-mono text-[11px] text-[#11181C] placeholder-[#88929A] focus:outline-none focus:border-[#11181C] uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#11181C] hover:bg-[#232C33] text-[11px] font-medium text-white"
                    >
                      Áp dụng
                    </button>
                  </form>

                  {voucherError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {voucherError}
                    </p>
                  )}
                </div>

                {isDiscountApplied && (
                  <div className="font-mono text-[11px] text-[#2D5E12] flex items-center justify-between bg-[#F1FCDA] p-2 rounded-lg border border-[#D3F592]">
                    <span>
                      Mã {appliedPromoCode} giảm {activePromoPercent}%
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        - {discountAmount.toLocaleString('vi-VN')} đ
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="p-0.5 hover:text-red-700"
                        aria-label="Hủy mã giảm giá"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-[#5A636A]">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-mono font-medium text-[#11181C]">
                      {subtotal.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vận chuyển</span>
                    <span className="font-medium text-[#2D5E12]">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#11181C] pt-2 border-t border-[#E2E6DF]">
                    <span>Tổng thanh toán</span>
                    <span className="font-mono text-[#11181C] text-base">
                      {total.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Thanh toán đơn hàng</span>
                  <ArrowRight className="w-4 h-4 text-[#B6F05C]" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Shipping Info & Payment Method */}
        {step === 'shipping' && (
          <CartShippingStep
            cartItems={cartItems}
            total={total}
            discountAmount={discountAmount}
            appliedPromoCode={appliedPromoCode}
            shippingInfo={shippingInfo}
            onChangeShipping={handleChangeShipping}
            shippingErrors={shippingErrors}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            isProcessing={isProcessing}
            onSubmit={handleShippingSubmit}
          />
        )}

        {/* Step 3: Online Payment Gateway (VietQR / E-Wallet / Card) */}
        {step === 'payment' && (
          <CartPaymentStep
            paymentMethod={paymentMethod}
            walletProvider={walletProvider}
            onChangeWalletProvider={setWalletProvider}
            pendingOrderId={pendingOrderId}
            total={total}
            secondsLeft={secondsLeft}
            onRegenerateQr={handleRegenerateQr}
            cardForm={cardForm}
            onChangeCardField={handleChangeCardField}
            onFillDemoCard={handleFillDemoCard}
            cardErrors={cardErrors}
            isProcessing={isProcessing}
            onConfirmPayment={handleConfirmOnlinePayment}
            onBackToShipping={() => setStep('shipping')}
          />
        )}

        {/* Step 4: Order Receipt & Success */}
        {step === 'success' && (
          <CartSuccessStep
            order={completedOrder}
            onViewOrders={onViewOrders ? handleViewOrdersAndClose : null}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}
