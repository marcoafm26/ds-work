import express from 'express';
import cookieJwtAuth from './src/middleware/cookieJwtAuth';
import { authRouter } from './src/router/auth';

// Use the express.json() middleware to parse JSON bodies
const app = express();
app.use(express.json());

app.use('', authRouter);

// Use middleware cookieJwtAuth for all rotes that is not login or register
app.use(cookieJwtAuth);
app.use('', rotasQualquer);

app.listen('8080', () => {
    console.log('Server is running on port 8080');
});
