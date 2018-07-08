import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

import * as mongoose from 'mongoose';

import config from '../../config';
import {ITokenData} from '../../interfaces';
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
            rootFolderId = crypto.createHash('md5').update(`${userTokenData.accountId}-template`).digest('hex');
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
                expect(response[0].createdAt).toBeDefined();
                expect(response[0].updatedAt).toBeDefined();
                expect(response[0].createdBy).toEqual('testuserid');
                expect(response[0].modifiedBy).toEqual('testuserid');
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
                expect(response.createdAt).toBeDefined();
                expect(response.updatedAt).toBeDefined();
                expect(response.createdBy).toEqual('testuserid');
                expect(response.modifiedBy).toEqual('testuserid');
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
                const rootFolder = response.find(x => x.parentId === undefined);
                expect(rootFolder._id).toEqual(rootFolderId);
                expect(rootFolder.accountId).toEqual(TEST_ACCOUNT_ID);
                expect(rootFolder.name).toEqual('My Templates');
                expect(rootFolder.folders.length).toEqual(1);

                const subFolder = response.find(x => x.parentId !== undefined);
                expect(subFolder.accountId).toEqual(TEST_ACCOUNT_ID);
                expect(subFolder.name).toEqual('Test Sub Folder');
                expect(subFolder.folders.length).toEqual(0);
                expect(subFolder.parentId).toEqual(rootFolderId);

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