import * as crypto from 'crypto';
import * as request from 'supertest';

import app from '../../app';
import config from '../../config';
import { createSampleToken, TEST_ACCOUNT_ID, TEST_USER_ID } from '../../utils/test.utils';

describe('Templates route', () => {

    let userToken:string;

    beforeAll((done) => {
        userToken = createSampleToken();
        done();
    })

    test('it should return unauthorized response if token is null', done => {
        request(app)
        .get('/templates')
        .then((response:any) => {
            expect(response.statusCode).toBe(403);
            done();
        }, err =>done());
    });

    test('it should return unauthorized response if token is wrong', done => {
        request(app)
        .get('/templates')
        .set({ Authorization: `Bearer fake-token` })
        .then((response:any) => {
            expect(response.statusCode).toBe(403);
            done();
        }, err => done());
    });

    test('should get templates for account', done => {
        request(app)
        .get('/templates')
        .set({ Authorization: `Bearer ${userToken}` })
        .then((response:any) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    })
})