import { Request, Response } from 'express';
import { AuthRequestDTO } from '../dto/auth/AuthRequestDTO';
import { AuthService } from '../service/AuthService';

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }
    async login(req: Request, res: Response) {
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

            return res.cookie('token', authResponseDto.token).redirect('/menu');
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }
}
