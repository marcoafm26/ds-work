import { Request, Response } from 'express';
import { ClientRequestDTO } from '../dto/client/ClientRequestDTO';
import { ClientService } from '../service/ClientService';

export class ClientController {
    private clientService: ClientService;
    constructor() {
        this.clientService = new ClientService();
    }

    async create(req: Request, res: Response) {
        const clientDTO = new ClientRequestDTO(req.body);
        try {
            // Validação
            const validation = clientDTO.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            // Criação
            const newClient = await this.clientService.create(clientDTO);

            return res.status(200).json({
                success: true,
                data: newClient
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error.message]
            });
        }
    }
}
