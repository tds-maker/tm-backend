import * as dotenv from 'dotenv';
dotenv.config();

import * as mongoose from 'mongoose';
import config from '../../config';
import { ITokenData } from '../../interfaces';
import { ITemplateModel } from '../../models';
import { TEST_ACCOUNT_ID, TEST_USER_ID } from '../../utils/test.utils';
import templatesService from './templates.service';

describe('Templates service', () => {
    let userTokenData: ITokenData;
    let templateModel:any;

    beforeAll((done) => {
        userTokenData = {
            id: TEST_USER_ID,
            accountId: TEST_ACCOUNT_ID,
            iat: 0
        };

        templateModel = {
            folderId:'fake_folder_id',
            name: 'Test template',
            productNumberOption: 'optional',
            languages: ['en', 'tr'],
            primaryLanguage: 'en',
        }
        mongoose.connect(config.connectionStr, done);
    })

    it('should raise error if required field are null', done => {
        templatesService.create(userTokenData, undefined).then(response => null, err => {
            expect(err.message).toEqual('Template validation failed: primaryLanguage: Path `primaryLanguage` is required., productNumberOption: Path `productNumberOption` is required., name: Path `name` is required., folderId: Path `folderId` is required.');
            done();
        })
    })

    it('should create template if model is valid', done => {
        templatesService.create(userTokenData, templateModel).then(response => {
            expect(response.languages).toBeDefined();
            expect(response.languages.length).toEqual(2);
            expect(response.languages[0]).toEqual('en');
            expect(response.languages[1]).toEqual('tr');
            expect(response.folderId).toEqual('fake_folder_id');
            expect(response.name).toEqual('Test template');
            expect(response.productNumberOption).toEqual('optional');
            expect(response.primaryLanguage).toEqual('en');
            expect(response._id).toEqual('503b204e723dfeafb2879eb986657dd5');
            expect(response.accountId).toEqual('A_TEST');
            expect(response.createdBy).toEqual('testuserid');
            expect(response.modifiedBy).toEqual('testuserid');
            expect(response.createdAt).toBeDefined();
            expect(response.updatedAt).toBeDefined();
            done();
        })
    })

    it('should get all templates for account with limited data', done => {
        templatesService.get(userTokenData.accountId).then(response => {
            expect(response.length).toEqual(1);
            const responseObj = response[0].toObject();
            expect(Object.keys(responseObj).length).toEqual(9);
            expect(responseObj._id).toBeDefined();
            expect(responseObj.folderId).toBeDefined();
            expect(responseObj.name).toBeDefined();
            expect(responseObj.version).toBeDefined();
            expect(responseObj.version).toEqual('v0.1');
            expect(responseObj.updatedAt).toBeDefined();
            expect(responseObj.modifiedBy).toBeDefined();
            expect(responseObj.modifiedBy.fullNameShort).toEqual('Test U.');
            done();
        })
    })

    it('should remove template from database', done => {
        templatesService.remove('503b204e723dfeafb2879eb986657dd5').then(response => {
            expect(response._id).toEqual('503b204e723dfeafb2879eb986657dd5');
            done();
        })
    })

    

    // test('all test templates removed', () => {

    // })
})