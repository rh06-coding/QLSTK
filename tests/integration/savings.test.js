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

jest.mock('../../src/middlewares/authMiddleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { MaNguoiDung: 1, MaVaiTro: 2, TenVaiTro: 'STAFF', MaKH: null };
    next();
  },
  checkRole: () => (req, res, next) => next(),
}));

jest.mock('../../src/services/savingsService');

const request = require('supertest');
const app = require('../../src/index');
const savingsService = require('../../src/services/savingsService');
const HttpError = require('../../src/utils/HttpError');

describe('API Sổ tiết kiệm', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Mở sổ tiết kiệm mới thành công', async () => {
    savingsService.openSavings.mockResolvedValue({
      MaSTK: 100,
      MaKH: 50,
      MaLTK: 1,
      TenLTK: 'Không kỳ hạn',
      loai: 'khong_ky_han',
      KyHan: 0,
      LaiSuat: 0.005,
      SoDu: 5000000,
    });

    const res = await request(app)
      .post('/api/savings')
      .send({
        HoTen: 'Nguyen Van A',
        CMND: '012345678901',
        DiaChi: '123 ABC',
        MaLTK: 1,
        SoTienGui: 5000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('MaSTK', 100);
    expect(res.body.data).toHaveProperty('SoDu', 5000000);
  });

  it('Gửi tiền thành công', async () => {
    savingsService.depositMoney.mockResolvedValue({
      MaSTK: 100,
      SoTienGui: 500000,
      SoDu: 5500000,
    });

    const res = await request(app)
      .post('/api/savings/100/deposits')
      .send({ SoTienGui: 500000 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('SoDu', 5500000);
  });

  it('Rút tiền thành công', async () => {
    savingsService.withdrawMoney.mockResolvedValue({
      MaSTK: 100,
      SoTienRut: 300000,
      SoDu: 5200000,
    });

    const res = await request(app)
      .post('/api/savings/100/withdrawals')
      .send({ SoTienRut: 300000 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('SoDu', 5200000);
  });

  it('Từ chối rút tiền khi vượt quá số dư', async () => {
    savingsService.withdrawMoney.mockRejectedValue(
      new HttpError(400, 'Số dư không đủ')
    );

    const res = await request(app)
      .post('/api/savings/100/withdrawals')
      .send({ SoTienRut: 99999999 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
