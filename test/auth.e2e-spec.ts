import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';



describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const email = 'tabriz@yahoo.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password: "tabriz123456"})
      .expect(201)
      .then(res => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email)
      });
  });

  it('signup user and then get me api', async() => {
    const email = 'tabrizii@yahoo.com';
    const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({email, password: "tabriz123456"})
        .expect(201);
        
    const cookie = res.get('Set-Cookie');

    const {body} = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', cookie)
        .expect(200);
        expect(body.email).toEqual(email)
    });

});
