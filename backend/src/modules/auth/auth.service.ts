import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma.service';
import { RegisterDto, LoginDto, ChangePasswordDto, VerifyOtpDto, SendPhoneOtpDto, VerifyPhoneOtpDto, GoogleLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
      },
    });

    return { message: 'Registration successful. Please verify your email.', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetExam: user.targetExam,
        avatar: user.avatar,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, phone: true,
        avatar: true, role: true, targetExam: true, language: true,
        emailVerified: true, createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: 'Password changed successfully' };
  }

  async sendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({ where: { email }, data: { otp, otpExpiry } });
    console.log(`OTP for ${email}: ${otp}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.otp !== dto.otp) throw new BadRequestException('Invalid OTP');
    if (user.otpExpiry && user.otpExpiry < new Date()) throw new BadRequestException('OTP expired');

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { emailVerified: true, otp: null, otpExpiry: null },
    });
    return { message: 'Email verified successfully' };
  }

  async sendPhoneOtp(dto: SendPhoneOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await this.prisma.user.findFirst({ where: { phone: dto.phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone: dto.phone, name: 'User', email: `${dto.phone}@temp.testime.app`, password: '' },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { phoneOtp: otp, phoneOtpExpiry: otpExpiry },
    });
    console.log(`Phone OTP for ${dto.phone}: ${otp}`);
    return { message: 'OTP sent to your phone' };
  }

  async verifyPhoneOtp(dto: VerifyPhoneOtpDto) {
    const user = await this.prisma.user.findFirst({ where: { phone: dto.phone } });
    if (!user || user.phoneOtp !== dto.otp) throw new BadRequestException('Invalid OTP');
    if (user.phoneOtpExpiry && user.phoneOtpExpiry < new Date()) throw new BadRequestException('OTP expired');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, phoneOtp: null, phoneOtpExpiry: null },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    const googlePayload = await this.verifyGoogleToken(dto.idToken);
    if (!googlePayload) throw new UnauthorizedException('Invalid Google token');

    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: googlePayload.sub }, { email: googlePayload.email }] },
    });

    if (user) {
      if (!user.googleId) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: googlePayload.sub, emailVerified: true },
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          email: googlePayload.email,
          name: googlePayload.name || 'Google User',
          password: '',
          googleId: googlePayload.sub,
          emailVerified: true,
          avatar: googlePayload.picture,
        },
      });
    }

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    };
  }

  private async verifyGoogleToken(idToken: string): Promise<{ sub: string; email: string; name: string; picture: string } | null> {
    try {
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!res.ok) return null;
      const payload = await res.json();
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch {
      return null;
    }
  }
}
