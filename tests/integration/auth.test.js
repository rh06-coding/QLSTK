jest.mock('../../src/config/db', () => ({
  sql: {
    VarChar: jest.fn(), Int: jest.fn(), NVarChar: jest.fn(),
    Decimal: jest.fn(), Date: jest.fn(),
  },
  getPool: jest.fn(),
  connectDB: jest.fn().mockResolvedValue(null),
  closeDB: jest.fn().mockResolvedValue(null),
  checkDBHealth: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../src/services/authService');

const request = require('supertest');
const app = require('../../src/index');
const authService = require('../../src/services/authService');
const HttpError = require('../../src/utils/HttpError');

describe('API Xác thực', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Đăng nhập thành công với thông tin đúng', async () => {
    authService.loginWithCredentials.mockResolvedValue({
      accessToken: 'fake_jwt_token_123',
      tokenType: 'Bearer',
      user: {
        MaNguoiDung: 1,
        TenDangNhap: 'admin',
        MaVaiTro: 1,
        TenVaiTro: 'ADMIN',
        MaKH: null,
      },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user).toHaveProperty('TenDangNhap', 'admin');
  });

  it('Đăng nhập thất bại khi sai mật khẩu', async () => {
    authService.loginWithCredentials.mockRejectedValue(
      new HttpError(401, 'Sai tên đăng nhập hoặc mật khẩu')
    );

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
