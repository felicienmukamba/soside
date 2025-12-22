import { Controller } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) { }

  @MessagePattern('register')
  register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('get_profile')
  getProfile(@Payload() userId: string) {
    return this.authService.getProfile(userId);
  }

  @MessagePattern('update_profile')
  updateProfile(@Payload() data: { userId: string; updateProfileDto: UpdateProfileDto }) {
    return this.authService.updateProfile(data.userId, data.updateProfileDto);
  }

  @MessagePattern('get_user_by_id')
  getUserById(@Payload() id: string) {
    return this.authService.getUserById(id);
  }

  @MessagePattern('verify_email')
  verifyEmail(@Payload() data: { email: string; code: string }) {
    return this.authService.verifyEmail(data.email, data.code);
  }

  @MessagePattern('generate_2fa_secret')
  async generate2faSecret(@Payload() userId: string) {
    const user = await this.authService.getUserById(userId);
    if (!user) throw new Error('User not found');
    return this.authService.generateTwoFactorSecret(user);
  }

  @MessagePattern('enable_2fa')
  enable2fa(@Payload() data: { userId: string; code: string }) {
    return this.authService.enableTwoFactor(data.userId, data.code);
  }

  @MessagePattern('login_2fa')
  login2fa(@Payload() data: { userId: string; code: string }) {
    return this.authService.loginTwoFactor(data.userId, data.code);
  }

  @MessagePattern('find_all_users')
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern('update_user_role')
  updateRole(@Payload() data: { id: string; role: string }) {
    return this.authService.updateRole(data.id, data.role);
  }

  @MessagePattern('remove_user')
  remove(@Payload() id: string) {
    return this.authService.remove(id);
  }
}
