import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { EmailOtp } from './entities/email-otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { sendOtpToEmail } from './utils/mailer';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(EmailOtp)
        private otpRepo: Repository<EmailOtp>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async sendOtpEmail(email: string, userName: string) {
        let user = await this.usersService.findByEmail(email);

        if (!user) {
            // Create user with empty password
            user = await this.usersService.createUser(email, '', userName);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.otpRepo.save({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        });

        await sendOtpToEmail(email, otp);

        return { message: 'OTP sent to email' };
    }

    async verifyOtp(email: string, otp: string) {
        const emailOtp = await this.otpRepo.findOne({
            where: { email, otp, used: false },
        });

        if (!emailOtp || emailOtp.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        emailOtp.used = true;
        await this.otpRepo.save(emailOtp);

        let user = await this.usersService.findByEmail(email);
        if (!user) {
            user = await this.usersService.createUser(email, '', ''); // Create user if not exists
        }

        if (!user) {
            throw new UnauthorizedException('User could not be created or found');
        }

        const payload = { email: user.email, userName: user.userName, sub: user.id };
        const token = this.jwtService.sign(payload);

        return { access_token: token, user: payload };
        // If user is not found, create one
    }

    async createWithEmailOnly(email: string): Promise<User> {
        const user = this.userRepository.create({
            email,
            password: '', // optional or null
            userName: email.split('@')[0], // auto-generate username
        });
        return this.userRepository.save(user);
    }


    async register(email: string, userName: string) {
        const user = await this.usersService.findByEmail(email);

        if (user) {
            // User already exists — registration not allowed
            throw new BadRequestException('User already exists. Please log in instead.');
        }

        // If user doesn’t exist, create one with empty password
        const newUser = await this.usersService.createUser(email, '', userName);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.otpRepo.save({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        });

        await sendOtpToEmail(email, otp);

        return { message: 'OTP sent to email for registration' };

    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async login(email: string) {

        const existingUser = await this.usersService.findByEmail(email)

        if (!existingUser) {
            throw new UnauthorizedException('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.otpRepo.save({
            email: email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        });

        await sendOtpToEmail(email, otp);

        return { message: 'OTP sent to email' };
    }
}
