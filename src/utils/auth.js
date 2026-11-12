export const ADMIN_ACCOUNT = {
  username: 'admin',
  email: 'admin@apex.vn',
  password: 'Admin@123',
  name: 'Admin Apex',
  phone: '0988688999',
  role: 'admin',
  badge: 'SUPER ADMIN',
};

export function isAdminIdentifier(value) {
  const normalized = (value || '').trim().toLowerCase();
  return normalized === ADMIN_ACCOUNT.email.toLowerCase() || normalized === ADMIN_ACCOUNT.username;
}

export function isAdminUser(user) {
  return Boolean(user && user.role === 'admin');
}

export function authenticateAdmin(identifier, password) {
  if (!isAdminIdentifier(identifier)) {
    return { ok: false, error: 'Tài khoản quản trị không tồn tại (dùng admin@apex.vn)' };
  }
  if (password !== ADMIN_ACCOUNT.password) {
    return { ok: false, error: 'Mật khẩu quản trị viên không chính xác' };
  }
  return {
    ok: true,
    user: {
      name: ADMIN_ACCOUNT.name,
      email: ADMIN_ACCOUNT.email,
      phone: ADMIN_ACCOUNT.phone,
      role: 'admin',
      badge: ADMIN_ACCOUNT.badge,
      duprRating: '5.5',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
    },
  };
}
