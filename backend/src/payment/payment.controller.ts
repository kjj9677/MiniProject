import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { EntityNotFoundError } from 'typeorm';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createPayment(
    @Req() { user }: { user: User },
    @Body() createPaymentDto,
  ): Promise<Payment> {
    return this.paymentService
      .createPayment(user, createPaymentDto)
      .catch((error) => {
        console.log(error);
        if (error instanceof HttpException) {
          throw error;
        }
        if (error instanceof EntityNotFoundError) {
          throw new BadRequestException(
            '존재하지 않는 스케줄 혹은 유저입니다.',
          );
        }
        throw new InternalServerErrorException(
          '생성 중 오류가 발생하였습니다.',
        );
      });
  }
}
