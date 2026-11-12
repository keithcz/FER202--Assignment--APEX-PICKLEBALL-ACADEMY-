import React, { useState } from 'react';
import {
  Clock,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import PaymentQrSvg from './PaymentQrSvg';

const SANDBOX_BANK = {
  bankName: 'MB Bank (Demo Sandbox)',
  accountNumber: '999988886868',
  accountHolder: 'APEX PICKLEBALL ACADEMY',
};

function CopyDetailRow({ label, value, copyKey, copiedField, onCopy, mono = true }) {
  const isCopied = copiedField === copyKey;
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-[#E2E6DF] last:border-b-0 text-xs">
      <span className="text-[#5A636A] shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-[#11181C] font-semibold truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={() => onCopy(copyKey, value)}
            className="p-1 rounded-md text-[#5A636A] hover:text-[#11181C] hover:bg-[#EAECE8] transition-colors shrink-0"
            title={`Sao chép ${label.toLowerCase()}`}
            aria-label={`Sao chép ${label}`}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-[#2D5E12]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function detectCardBrand(digits) {
  if (!digits) return 'THẺ THANH TOÁN';
  if (digits.startsWith('4')) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MASTERCARD';
  if (digits.startsWith('9704')) return 'NAPAS / ATM';
  return 'THẺ THANH TOÁN';
}

function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function formatCountdown(seconds) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function CartPaymentStep({
  paymentMethod,
  walletProvider,
  onChangeWalletProvider,
  pendingOrderId,
  total,
  secondsLeft,
  onRegenerateQr,
  cardForm,
  onChangeCardField,
  onFillDemoCard,
  cardErrors,
  isProcessing,
  onConfirmPayment,
  onBackToShipping,
}) {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (key, text) => {
    const clean = String(text).replace(/\s*đ$/, '');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(clean).catch(() => {});
    }
    setCopiedField(key);
    setTimeout(() => setCopiedField((prev) => (prev === key ? null : prev)), 1800);
  };

  const isQrMethod = paymentMethod === 'bank_qr' || paymentMethod === 'ewallet';
  const isExpired = isQrMethod && secondsLeft <= 0;

  const rawCardDigits = cardForm.number.replace(/\D/g, '');
  const cardBrand = detectCardBrand(rawCardDigits);
  const displayCardNumber = rawCardDigits
    ? rawCardDigits.replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Order & Amount Header Box */}
        <div className="p-3.5 rounded-2xl bg-[#11181C] text-white flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase block">
              Mã đơn hàng
            </span>
            <span className="font-mono text-sm font-bold text-[#B6F05C]">
              {pendingOrderId}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase block">
              Số tiền thanh toán
            </span>
            <span className="font-mono text-base font-extrabold text-white">
              {total.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Sandbox Notice + Timer */}
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1FCDA] text-[#2D5E12] border border-[#D3F592] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cổng thanh toán Demo</span>
          </span>

          {isQrMethod && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-semibold border ${
                isExpired
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-[#FAFBF9] text-[#11181C] border-[#E2E6DF]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{isExpired ? 'Đã hết hạn' : formatCountdown(secondsLeft)}</span>
            </span>
          )}
        </div>

        {/* Method 1: VietQR Bank Transfer */}
        {paymentMethod === 'bank_qr' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] flex flex-col items-center text-center space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-[#11181C] uppercase tracking-wide">
                VietQR • Napas 24/7
              </div>

              {isExpired ? (
                <div className="py-8 space-y-3">
                  <p className="text-xs text-red-600 font-medium">
                    Mã QR thanh toán đã hết hiệu lực.
                  </p>
                  <button
                    type="button"
                    onClick={onRegenerateQr}
                    className="px-4 py-2 rounded-full bg-[#11181C] text-white text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#B6F05C]" />
                    <span>Tạo lại mã QR</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
                    <PaymentQrSvg value={`VIETQR|${pendingOrderId}|${total}`} size={148} />
                  </div>
                  <p className="text-[11px] text-[#5A636A] max-w-xs">
                    Quét mã QR mô phỏng bằng ứng dụng ngân hàng hoặc chuyển khoản theo thông tin bên dưới.
                  </p>
                </>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF]">
              <CopyDetailRow
                label="Ngân hàng"
                value={SANDBOX_BANK.bankName}
                mono={false}
              />
              <CopyDetailRow
                label="Số tài khoản"
                value={SANDBOX_BANK.accountNumber}
                copyKey="account"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <CopyDetailRow
                label="Chủ tài khoản"
                value={SANDBOX_BANK.accountHolder}
                mono={false}
              />
              <CopyDetailRow
                label="Số tiền"
                value={`${total.toLocaleString('vi-VN')} đ`}
                copyKey="amount"
                copiedField={copiedField}
                onCopy={() => handleCopy('amount', String(total))}
              />
              <CopyDetailRow
                label="Nội dung CK"
                value={pendingOrderId}
                copyKey="memo"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}

        {/* Method 2: E-Wallet (MoMo / ZaloPay) */}
        {paymentMethod === 'ewallet' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F4F6F2] border border-[#E2E6DF]">
              {[
                { id: 'momo', label: 'Ví MoMo' },
                { id: 'zalopay', label: 'Ví ZaloPay' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onChangeWalletProvider(w.id)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    walletProvider === w.id
                      ? 'bg-[#11181C] text-[#B6F05C] shadow-sm'
                      : 'text-[#5A636A] hover:text-[#11181C]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF] flex flex-col items-center text-center space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-[#11181C] uppercase">
                {walletProvider === 'momo' ? 'QR Thanh toán MoMo (Demo)' : 'QR Thanh toán ZaloPay (Demo)'}
              </div>

              {isExpired ? (
                <div className="py-8 space-y-3">
                  <p className="text-xs text-red-600 font-medium">
                    Mã QR ví điện tử đã hết hiệu lực.
                  </p>
                  <button
                    type="button"
                    onClick={onRegenerateQr}
                    className="px-4 py-2 rounded-full bg-[#11181C] text-white text-xs font-medium inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#B6F05C]" />
                    <span>Tạo lại mã QR</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#E2E6DF] shadow-sm">
                    <PaymentQrSvg
                      value={`${walletProvider.toUpperCase()}|${pendingOrderId}|${total}`}
                      accent={walletProvider === 'momo' ? '#A50064' : '#0068FF'}
                      size={148}
                    />
                  </div>
                  <p className="text-[11px] text-[#5A636A] max-w-xs">
                    Mở ứng dụng {walletProvider === 'momo' ? 'MoMo' : 'ZaloPay'} để quét mã, sau đó bấm xác nhận bên dưới.
                  </p>
                </>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E2E6DF]">
              <CopyDetailRow label="Đơn vị nhận" value="APEX PRO SHOP" mono={false} />
              <CopyDetailRow
                label="Mã giao dịch"
                value={pendingOrderId}
                copyKey="wallet-memo"
                copiedField={copiedField}
                onCopy={handleCopy}
              />
              <CopyDetailRow
                label="Số tiền"
                value={`${total.toLocaleString('vi-VN')} đ`}
                copyKey="wallet-amount"
                copiedField={copiedField}
                onCopy={() => handleCopy('wallet-amount', String(total))}
              />
            </div>
          </div>
        )}

        {/* Method 3: Credit / Debit Card */}
        {paymentMethod === 'card' && (
          <div className="space-y-3.5">
            {/* Virtual Card Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#11181C] to-[#232C33] text-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#B6F05C] font-bold tracking-wider">
                  {cardBrand}
                </span>
                <span className="font-mono text-[10px] text-white/60">APEX PAY</span>
              </div>
              <div className="font-mono text-sm sm:text-base tracking-widest font-semibold">
                {displayCardNumber}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="truncate max-w-[180px] uppercase text-white/90">
                  {cardForm.holder || 'TEN CHU THE'}
                </span>
                <span className="text-white/80">{cardForm.expiry || 'MM/YY'}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onFillDemoCard}
                className="text-[11px] font-medium text-[#2D5E12] bg-[#F1FCDA] hover:bg-[#E4F8BC] px-2.5 py-1 rounded-full border border-[#D3F592] transition-colors"
              >
                Điền thẻ test mẫu
              </button>
            </div>

            {/* Card Form Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                  Số thẻ *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={cardForm.number}
                  onChange={(e) => onChangeCardField('number', formatCardNumber(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border font-mono text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none ${
                    cardErrors.number ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                  }`}
                />
                {cardErrors.number && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {cardErrors.number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                  Tên in trên thẻ (Không dấu) *
                </label>
                <input
                  type="text"
                  placeholder="NGUYEN VAN AN"
                  value={cardForm.holder}
                  onChange={(e) => onChangeCardField('holder', e.target.value.toUpperCase())}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border font-mono text-xs uppercase text-[#11181C] placeholder-[#88929A] focus:outline-none ${
                    cardErrors.holder ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                  }`}
                />
                {cardErrors.holder && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {cardErrors.holder}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                    Hết hạn (MM/YY) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="12/28"
                    value={cardForm.expiry}
                    onChange={(e) => onChangeCardField('expiry', formatExpiry(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border font-mono text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none ${
                      cardErrors.expiry ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                    }`}
                  />
                  {cardErrors.expiry && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {cardErrors.expiry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#11181C] mb-1">
                    Mã CVV / CVC *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) =>
                      onChangeCardField('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFBF9] border font-mono text-xs text-[#11181C] placeholder-[#88929A] focus:outline-none ${
                      cardErrors.cvv ? 'border-red-500' : 'border-[#E2E6DF] focus:border-[#11181C]'
                    }`}
                  />
                  {cardErrors.cvv && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {cardErrors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Payment Action */}
      <div className="p-5 border-t border-[#E2E6DF] bg-[#FAFBF9] space-y-2.5">
        <button
          type="button"
          disabled={isProcessing || isExpired}
          onClick={onConfirmPayment}
          className="w-full py-3 rounded-full bg-[#11181C] hover:bg-[#232C33] disabled:opacity-50 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#B6F05C]" />
              <span>Đang xác thực thanh toán...</span>
            </>
          ) : paymentMethod === 'bank_qr' ? (
            <span>Tôi đã chuyển khoản • Xác nhận</span>
          ) : paymentMethod === 'ewallet' ? (
            <span>
              Xác nhận thanh toán qua {walletProvider === 'momo' ? 'MoMo' : 'ZaloPay'}
            </span>
          ) : (
            <span>Thanh toán {total.toLocaleString('vi-VN')} đ</span>
          )}
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onBackToShipping}
          className="w-full py-2 text-[11px] font-medium text-[#5A636A] hover:text-[#11181C] flex items-center justify-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại đổi phương thức thanh toán</span>
        </button>
      </div>
    </div>
  );
}
