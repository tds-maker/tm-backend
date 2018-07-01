import * as crypto from 'crypto';
import * as request from 'supertest';

import app from '../../app';
import config from '../../config';
import { createSampleToken, TEST_ACCOUNT_ID, TEST_USER_ID } from '../../utils/test.utils';

describe('Folders route', () => {

    let userToken:string;

    beforeAll((done) => {
        userToken = createSampleToken();
        done();
    })

    describe('Template folders', () => {
        test('it should return unauthorized response if token is null', done => {
            request(app)
            .get('/folders/template')
            .then((response:any) => {
                expect(response.statusCode).toBe(403);
                done();
            }, err =>done());
        });

        test('it should return unauthorized response if token is wrong', done => {
            request(app)
            .get('/folders/template')
            .set({ Authorization: `Bearer fake-token` })
            .then((response:any) => {
                expect(response.statusCode).toBe(403);
                done();
            }, err => done());
        });

        xtest('should get template folders for account', done => {
            request(app)
            .get('/folders/template')
            .set({ Authorization: `Bearer ${userToken}` })
            .then((response:any) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        })
    })
})