import cookieParser from 'cookie-parser';
import express from 'express';
import cookieJwtAuth from './middleware/cookieJwtAuth';
import { accountRouter } from './router/account';
import { authRouter } from './router/auth';
import { transactionRouter } from './router/transaction';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRouter);

app.use('/api', cookieJwtAuth);
app.use('/api', accountRouter);
app.use('/api', transactionRouter);

app.listen(8080, () => {
    console.log('✅ Server rodando na porta 8080');
});
