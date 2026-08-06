import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';

type E2eResponse = {
  readonly body: Record<string, unknown>;
  readonly headers: Record<string, string>;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body, headers }: E2eResponse) => {
        const requestId = body['requestId'];
        const data = body['data'] as Record<string, unknown>;

        expect(headers['x-request-id']).toEqual(expect.any(String));
        expect(body['success']).toBe(true);
        expect(body['statusCode']).toBe('200');
        expect(typeof requestId).toBe('string');
        expect(data['status']).toBe('ok');
        expect(data['service']).toBe('sales-lead-management-api');
      });
  });

  it('/health (GET) echoes a client request id', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .set('x-request-id', 'req-e2e-success-123')
      .expect(200)
      .expect(({ body, headers }: E2eResponse) => {
        expect(headers['x-request-id']).toBe('req-e2e-success-123');
        expect(body['requestId']).toBe('req-e2e-success-123');
      });
  });

  it('/auth/me (GET) returns requestId for error responses', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set('x-request-id', 'req-e2e-error-456')
      .expect(401)
      .expect(({ body, headers }: E2eResponse) => {
        expect(headers['x-request-id']).toBe('req-e2e-error-456');
        expect(body).toEqual(
          expect.objectContaining({
            success: false,
            statusCode: '401',
            requestId: 'req-e2e-error-456',
            error: 'UNAUTHORIZED',
            errorMessage: 'Unauthorized',
          }),
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
