import { Request, Response } from 'express';
import { AuthRequestDTO } from '../dto/auth/AuthRequestDTO';
import { AuthResponseDTO } from '../dto/auth/AuthResponseDTO';
import { RequestInterface } from '../interface/RequestInterface';
import { ResponseInterface } from '../interface/ResponseInterface';
import { AuthService } from '../service/AuthService';

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }
    async login<T>(
        req: Request<RequestInterface<AuthRequestDTO>>,
        res: Response<ResponseInterface<AuthResponseDTO>>
    ) {
        try {
            const authRequestDto = new AuthRequestDTO(req.body);
            const validation = authRequestDto.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            const authResponseDto = await this.authService.login(
                authRequestDto
            );

            return res
                .status(200)
                .json({
                    success: true,
                    data: authResponseDto
                })
                .cookie('token', authResponseDto.token);
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }
}
