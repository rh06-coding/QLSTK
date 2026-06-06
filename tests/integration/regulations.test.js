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
    req.user = { MaNguoiDung: 1, MaVaiTro: 3, TenVaiTro: 'CEO', MaKH: null };
    next();
  },
  checkRole: () => (req, res, next) => next(),
}));

jest.mock('../../src/services/regulationService');

const request = require('supertest');
const app = require('../../src/index');
const regulationService = require('../../src/services/regulationService');

describe('API Quy định', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tạo loại tiết kiệm mới thành công', async () => {
    regulationService.createRegulation.mockResolvedValue({
      MaLTK: 5,
      loai: 'co_ky_han',
      KyHan: 6,
      TenLTK: 'Tiết kiệm 6 tháng',
      LaiSuat: 0.065,
      SoTienGuiToiThieu: 1000000,
      ThoiGianGuiToiThieu: 180,
    });

    const res = await request(app)
      .post('/api/regulations')
      .send({
        loai: 'co_ky_han',
        KyHan: 6,
        TenLTK: 'Tiết kiệm 6 tháng',
        LaiSuat: 0.065,
        SoTienGuiToiThieu: 1000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('MaLTK', 5);
    expect(res.body.data).toHaveProperty('TenLTK', 'Tiết kiệm 6 tháng');
  });
});
