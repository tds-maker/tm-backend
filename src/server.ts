import * as dotenv from 'dotenv';
dotenv.config();

import app from "./app";
import config from './config';

app.listen(config.port, () => {
    console.log('Express server listening on port ' + config.port);
})