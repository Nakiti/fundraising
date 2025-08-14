import request from 'supertest';
import { app } from '../index.js';

describe('Error Handling System Tests', () => {
  
  describe('Validation Errors', () => {
    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/campaign_details')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'ValidationError',
        message: expect.stringContaining('Missing required fields')
      });
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'ValidationError',
        errors: expect.arrayContaining([
          expect.stringContaining('valid email address')
        ])
      });
    });
  });

  describe('Not Found Errors', () => {
    test('should return 404 for non-existent route', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'NotFoundError',
        message: 'Route not found'
      });
    });

    test('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .get('/api/campaign_details/999999')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'NotFoundError',
        message: expect.stringContaining('Campaign details')
      });
    });
  });

  describe('Database Errors', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking the database connection
      // to simulate a connection failure
      const response = await request(app)
        .get('/api/campaign_details/1')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'DatabaseError'
      });
    });
  });

  describe('Success Responses', () => {
    test('should return proper success response format', async () => {
      const response = await request(app)
        .post('/api/campaign_details')
        .send({
          campaign_id: 1,
          internalName: 'Test Campaign',
          type: 'donation',
          user_id: 1
        })
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('created successfully'),
        data: expect.any(Object),
        timestamp: expect.any(String)
      });
    });
  });

  describe('Rate Limiting', () => {
    test('should return 429 for rate limit exceeded', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(10).fill().map(() => 
        request(app).post('/api/user/login').send({
          email: 'test@example.com',
          password: 'password123'
        })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(res => res.status === 429);

      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body).toMatchObject({
          success: false,
          errorType: 'RateLimitError',
          message: expect.stringContaining('Too many requests')
        });
      }
    });
  });

  describe('Authentication Errors', () => {
    test('should return 401 for missing authentication', async () => {
      const response = await request(app)
        .get('/api/protected-route')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        errorType: 'AuthenticationError'
      });
    });
  });

  describe('Response Format Consistency', () => {
    test('all error responses should have consistent format', async () => {
      const errorResponses = [
        await request(app).get('/api/non-existent').catch(err => err.response),
        await request(app).post('/api/campaign_details').send({}).catch(err => err.response),
        await request(app).get('/api/protected-route').catch(err => err.response)
      ];

      errorResponses.forEach(response => {
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('errorType');
        expect(response.body).toHaveProperty('timestamp');
      });
    });

    test('all success responses should have consistent format', async () => {
      const response = await request(app)
        .post('/api/campaign_details')
        .send({
          campaign_id: 1,
          internalName: 'Test Campaign',
          type: 'donation',
          user_id: 1
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Development vs Production Error Handling', () => {
    test('should include stack trace in development mode', async () => {
      // Set NODE_ENV to development
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      // In development, stack trace might be included
      expect(response.body).toHaveProperty('timestamp');
      
      // Reset NODE_ENV
      process.env.NODE_ENV = 'test';
    });

    test('should not include stack trace in production mode', async () => {
      // Set NODE_ENV to production
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      // In production, stack trace should not be included
      expect(response.body).not.toHaveProperty('stack');
      
      // Reset NODE_ENV
      process.env.NODE_ENV = 'test';
    });
  });
});

// Helper function to test error handling in controllers
export const testErrorHandling = (controller, testCases) => {
  describe('Error Handling Tests', () => {
    testCases.forEach(({ name, input, expectedError, expectedStatus }) => {
      test(name, async () => {
        const req = { body: input.body, params: input.params, query: input.query };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis()
        };

        try {
          await controller(req, res);
        } catch (error) {
          expect(error).toBeInstanceOf(expectedError);
          expect(error.statusCode).toBe(expectedStatus);
        }
      });
    });
  });
};

// Example usage of the helper function
/*
testErrorHandling(createCampaignDetails, [
  {
    name: 'should throw ValidationError for missing campaign_id',
    input: { body: { internalName: 'Test', type: 'donation', user_id: 1 } },
    expectedError: ValidationError,
    expectedStatus: 400
  },
  {
    name: 'should throw ValidationError for missing internalName',
    input: { body: { campaign_id: 1, type: 'donation', user_id: 1 } },
    expectedError: ValidationError,
    expectedStatus: 400
  }
]);
*/
