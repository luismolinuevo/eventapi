import request from 'supertest';
import app from "../../src/app.js" // Adjust the path to your app

// Mocking the dependencies
jest.mock('../../src/services/authService', () => ({
  loginService: jest.fn(),
}));

const { loginService } = require('../../src/services/authService');

describe('Auth Controller', () => {
  describe('POST /auth/login', () => {
    it('should return 200 and set cookies when credentials are valid', async () => {
      // Mocking successful loginService response
      loginService.mockResolvedValue({
        access_token: 'fakeAccessToken',
        refresh_token: 'fakeRefreshToken',
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User login success');
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access_token=fakeAccessToken'),
          expect.stringContaining('refresh_token=fakeRefreshToken'),
        ])
      );
    });

    it('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: '', // Invalid email
          password: '', // Invalid password
        });

      expect(response.status).toBe(400); // Adjust based on your validation
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password or Email invalid');
    });

    it('should return 401 if authentication fails', async () => {
      // Mocking failed loginService response
      loginService.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword',
        });

      expect(response.status).toBe(401); // Adjust based on your error handling
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password or Email invalid');
    });
  });
});
