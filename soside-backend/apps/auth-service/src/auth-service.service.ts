import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from './mail/mail.service';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthServiceService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto): Promise<{ user: User }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash,
      role: registerDto.role,
      verificationCode,
    });

    const savedUser = await this.userRepository.save(user);

    const profile = this.profileRepository.create({
      userId: savedUser.id,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    await this.profileRepository.save(profile);

    // Send verification email
    await this.mailService.sendVerificationEmail(savedUser.email, verificationCode);

    return { user: savedUser };
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email, verificationCode: code } });
    if (!user) {
      throw new UnauthorizedException('Invalid verification code');
    }

    user.isVerified = true;
    user.verificationCode = null;
    await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token?: string; twoFactorRequired?: boolean }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (user.isTwoFactorEnabled) {
      return { user, twoFactorRequired: true };
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async generateTwoFactorSecret(user: User): Promise<{ secret: string; qrCode: string }> {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'SOSIDE', secret);
    const qrCode = await qrcode.toDataURL(otpauthUrl);

    user.twoFactorSecret = secret;
    await this.userRepository.save(user);

    return { secret, qrCode };
  }

  async enableTwoFactor(userId: string, code: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA not initialized');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    user.isTwoFactorEnabled = true;
    await this.userRepository.save(user);
  }

  async loginTwoFactor(userId: string, code: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA not enabled');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    let profile = await this.profileRepository.findOne({ where: { userId } });

    if (!profile) {
      profile = this.profileRepository.create({ userId });
    }

    Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
  }
}
