import { Request, Response } from 'express';
import { AccountService } from '../service/AccountService';
import { ClientService } from './../service/ClientService';

export class AccountController {
    private accountService: AccountService;
    constructor() {
        this.accountService = new AccountService();
    }
    async create(req: Request, res: Response) {
        try {
            const { clientId } = req.body;
            const clientDTO = await new ClientService().findById(clientId);
            if (!clientDTO) {
                return res.status(400).json({
                    success: false,
                    errors: ['Cliente não encontrado']
                });
            }

            const accountDto = await this.accountService.create(clientDTO);

            return res.status(200).json({
                success: true,
                message: 'Conta criada com sucesso!',
                data: accountDto
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const { clientId } = req.params;

            const clientDTO = await new ClientService().findById(
                parseInt(clientId)
            );
            if (!clientDTO) {
                return res.status(400).json({
                    success: false,
                    errors: ['Cliente não encontrado']
                });
            }

            const accountsDto = await this.accountService.findAll(
                parseInt(clientId)
            );

            return res.status(200).json({
                success: true,
                message: 'Contas encontradas com sucesso!',
                data: accountsDto.map((account) => account.toPrismaData())
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }

    async findAllAccounts(req: Request, res: Response) {
        try {
            const accounts = await this.accountService.findAllAccounts();
            return res.status(200).json({
                success: true,
                message: 'Contas encontradas com sucesso!',
                data: accounts.map((account) => account.toPrismaData())
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }
}
