import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ //we create a testing module for the application
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => { //we test the root endpoint of the application
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });


  it('/auth/login (POST) should reject invalid credentials', () => { //we test the login endpoint of the application with invalid credentials

  return request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: 'fake@test.com',
      password: 'wrongpassword',
    })
    .expect(401);
  });

  
  afterEach(async () => {
    await app.close();
  });
});
