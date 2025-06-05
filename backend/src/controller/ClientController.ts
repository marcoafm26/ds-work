import { Request, Response } from 'express';
import { ClientRequestDTO } from '../dto/client/ClientRequestDTO';
import { ClientResponseDTO } from '../dto/client/ClientResponseDTO';
import { ResponseInterface } from '../interface/ResponseInterface';
import { ClientService } from '../service/ClientService';

export class ClientController {
    private clientService: ClientService;
    constructor() {
        this.clientService = new ClientService();
    }

    async create(
        req: Request<ResponseInterface<ClientRequestDTO>>,
        res: Response<ResponseInterface<ClientResponseDTO>>
    ) {
        try {
            const clientDTO = new ClientRequestDTO(req.body);

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

            return res.status(201).json({
                success: true,
                data: newClient
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                errors: [error.message || 'Internal server error']
            });
        }
    }
}
