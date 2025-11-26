const request = require('supertest');
const { app, server } = require('../src/server');
const axios = require('axios');

jest.mock('axios');

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints', () => {
  describe('GET /metrics', () => {
    it('should return metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toMatch(/text\/plain/);
    });
  });

  describe('POST /api/uploads', () => {
    it('should return 400 if channelId is not provided', async () => {
      const res = await request(app).post('/api/uploads').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('channelId (URL or ID) is required');
    });

    it('should return data from n8n when a valid channel ID is provided', async () => {
      const n8nData = [{ id: '123', title: 'Test Video' }];
      axios.post.mockResolvedValue({ data: n8nData });

      const res = await request(app)
        .post('/api/uploads')
        .send({ channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(n8nData);
    });

    it('should extract channel ID from URL and return data from n8n', async () => {
      const n8nData = [{ id: '123', title: 'Test Video from URL' }];
      axios.post.mockResolvedValue({ data: n8nData });
      axios.get.mockResolvedValue({ data: '<html><head></head><body>"browseId":"UC-lHJZR3Gqxm24_Vd_AJ5Yw"</body></html>' });

      const res = await request(app)
        .post('/api/uploads')
        .send({ channelId: 'https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(n8nData);
    });

    it('should return 400 for an invalid YouTube channel URL', async () => {
      axios.get.mockResolvedValue({ data: '<html><head></head><body></body></html>' });

      const res = await request(app)
        .post('/api/uploads')
        .send({ channelId: 'https://www.youtube.com/not-a-channel' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Invalid or unsupported YouTube channel URL. Could not extract channel ID.');
    });
  });

  describe('Undefined routes', () => {
    it('should return 404 for an undefined route', async () => {
      const res = await request(app).get('/some/undefined/route');
      expect(res.statusCode).toEqual(404);
    });
  });
});
