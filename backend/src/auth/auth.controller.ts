import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import e from 'express';
import { ApiKeyGuard } from './api-key.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,) {
    }

    @UseGuards(ApiKeyGuard)
    @Post('register')
    async register(@Body() body: { email: string; userName: string }) {
        return this.authService.register(body.email, body.userName);
    }
    
    @UseGuards(ApiKeyGuard)
    @Post('login')
    async login(@Body() body: { email: string;}) {
        return this.authService.login(body.email);
    }

    // @Post('send-otp')
    // async sendOtp(@Body() body: { email: string; userName: string }) {
    //     return this.authService.sendOtpEmail(body.email, body.userName);
    // }


    @UseGuards(ApiKeyGuard)
    @Post('verify-otp')
    async verifyOtp(@Body() body: { email: string; otp: string }) {
        return this.authService.verifyOtp(body.email, body.otp);
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('protected')
    // getSecret(@Req() req: Request) {
    //     return req.user;
    // }
}
