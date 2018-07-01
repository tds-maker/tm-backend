import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

import config from '../../config';
import {ITokenData,} from '../../interfaces';
import { TEST_ACCOUNT_ID, TEST_USER_ID} from '../../utils/test.utils';
import folderService from './folder.service';


describe('Folder service', () =>{
    describe('Template folders', () => {

        let userTokenData:ITokenData;
        let rootFolderId:string;
        let subFolderId:string;

        beforeAll((done) => {
            userTokenData = {
                id : TEST_USER_ID,
                accountId : TEST_ACCOUNT_ID,
                iat : 0
            };
            rootFolderId = crypto.createHash('md5').update(`${TEST_ACCOUNT_ID}-template`).digest('hex');
            subFolderId = crypto.createHash('md5').update(`${userTokenData.accountId}-template-${rootFolderId}-Test Sub Folder`).digest('hex');
            mongoose.connect(config.connectionStr, done);
        })

        test('it should get root folder event any it has not created yet', done => {
            folderService.getFolders(userTokenData, 'template').then(response => {
                expect(response.length).toEqual(1);
                expect(response[0]._id).toEqual(rootFolderId);
                expect(response[0].accountId).toEqual(TEST_ACCOUNT_ID);
                expect(response[0].name).toEqual('My Templates');
                expect(response[0].folders.length).toEqual(0);
                done();
            })
        })

        test('it should create new folder', done => {
            folderService.createFolder(userTokenData, 'Test Sub Folder', rootFolderId, 'template').then(response => {
                expect(response.name).toEqual('Test Sub Folder');
                expect(response.parentId).toEqual(rootFolderId);
                expect(response.folderType).toEqual('template');
                expect(response.folders.length).toEqual(0);
                expect(response.accountId).toEqual(TEST_ACCOUNT_ID);
                done();
            })
        })

        test('it should raise error if user try to create same folder under same parent', done => {
            folderService.createFolder(userTokenData, 'Test Sub Folder', rootFolderId, 'template').then(response => null, err => {
                expect(err.message).toEqual('You have already folder named Test Sub Folder under current folder.');
                done();
            })
        })

        test('it shoulde get folders', done => {
            folderService.getFolders(userTokenData, 'template').then(response => {
                expect(response.length).toEqual(2);

                expect(response[0]._id).toEqual(rootFolderId);
                expect(response[0].accountId).toEqual(TEST_ACCOUNT_ID);
                expect(response[0].name).toEqual('My Templates');
                expect(response[0].folders.length).toEqual(1);

                expect(response[1].accountId).toEqual(TEST_ACCOUNT_ID);
                expect(response[1].name).toEqual('Test Sub Folder');
                expect(response[1].folders.length).toEqual(0);
                expect(response[1].parentId).toEqual(rootFolderId);

                done();
            })
        })

        test('it shoul delete selected folder', done => {
            folderService.removeFolder(subFolderId).then(response => {
                expect(response._id).toEqual(subFolderId);
                done();
            })
        })

        test('it should delete all test folders from database', done => {
            folderService.remoteAllFolders(userTokenData, 'template').then(response => {
                expect(response.ok).toBeTruthy();
                expect(response.n).toBeGreaterThan(0);
                done();
            })
        })

        afterAll((done) => {
            mongoose.disconnect().then(done);
        })
    })
})