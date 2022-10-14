import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'MiniProject',
      signOptions: { expiresIn: 2 * 60 * 60 },
    }),
  ],
  exports: [JwtStrategy, PassportModule],
  providers: [AuthService, JwtStrategy],

  controllers: [AuthController],
})
export class AuthModule {}
