import * as jwt from 'jsonwebtoken';
import config from '../config';

export const TEST_USER_ID = 'testuserid';
export const TEST_ACCOUNT_ID = 'A_TEST'

export const createSampleToken = () => {
    return jwt.sign({ id: TEST_USER_ID, accountId : TEST_ACCOUNT_ID }, config.jwtSecret);
}