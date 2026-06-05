// Bỏ qua kiểm tra biến môi trường trong index.js khi test
process.env.JWT_SECRET = 'test_secret';
process.env.DB_USER = 'test_user';
process.env.DB_NAME = 'test_db';

const request = require('supertest');
const app = require('../../src/index');

describe('App Integration Tests', () => {
  describe('GET /', () => {
    it('should return service status', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('service', 'QuanLySoTietKiem API');
      expect(res.body).toHaveProperty('status', 'running');
    });
  });
});
