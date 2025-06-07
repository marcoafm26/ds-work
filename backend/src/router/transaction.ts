import { Router } from 'express';
import TransactionController from '../controller/TransactionController';

const transactionController = new TransactionController();
const transactionRouter = Router();

// Criar uma nova transação
transactionRouter.post(
    '/transaction',
    (req, res) => transactionController.create(req, res) as any
);

// Listar todas as transações
transactionRouter.get(
    '/transactions/:accountId',
    (req, res) => transactionController.findAll(req, res) as any
);

// Obter saldo de uma conta
transactionRouter.get(
    '/account/:accountId/balance',
    (req, res) => transactionController.getAccountBalance(req, res) as any
);

// Transferência
transactionRouter.post(
    '/transaction/transference',
    (req, res) => transactionController.transference(req, res) as any
);

export { transactionRouter };
