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

jest.mock('../../src/services/reportService');

const request = require('supertest');
const app = require('../../src/index');
const reportService = require('../../src/services/reportService');

describe('API Báo cáo', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Lấy báo cáo doanh thu ngày thành công', async () => {
    reportService.getDailyRevenue.mockResolvedValue([
      {
        MaLTK: 1,
        TenLTK: 'Không kỳ hạn',
        TongThu: 10000000,
        TongChi: 3000000,
        ChenhLech: 7000000,
      },
      {
        MaLTK: 2,
        TenLTK: '3 tháng',
        TongThu: 5000000,
        TongChi: 0,
        ChenhLech: 5000000,
      },
    ]);

    const res = await request(app)
      .get('/api/reports/daily-revenue')
      .query({ date: '2026-05-10' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty('TongThu');
    expect(res.body.data[0]).toHaveProperty('TongChi');
    expect(res.body.data[0]).toHaveProperty('ChenhLech');
  });
});
