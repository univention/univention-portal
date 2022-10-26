import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('NotificationsModule', () => {
    // small script to remove all database entries for cat between tests
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/notifications');
      await Promise.all(
        uncleared.body.map(async (notification) => {
          return request(app.getHttpServer()).delete(`/notifications/${notification.id}`);
        }),
      );
    });

    it('Post notification, get all, get by id, delete', async () => {
      const announcement = {
        id: "announcement_1",
        appId: "ox",
        target: "user_name",
        title: "Beware!",
        sendTime: new Date().toISOString(),
        sticky: false,
        needsConfirmation: false,
        type: "announcement"
      };
      const data = await request(app.getHttpServer())
        .post('/notifications')
        .send(announcement)
        .expect(201);
      const notifications = await request(app.getHttpServer()).get('/notifications').expect(200);
      expect(notifications.body).toEqual(expect.any(Array));
      expect(notifications.body.length).toBe(1);
      expect(notifications.body[0]).toEqual(expect.objectContaining({...announcement}));
      const requested_announcement = await request(app.getHttpServer())
        .get(`/notifications/${data.body.id}`)
        .expect(200);
      expect(requested_announcement.body).toEqual(data.body);
      return request(app.getHttpServer())
        .delete(`/notifications/${data.body.id}`)
        .expect(200);
    });
  });
});
