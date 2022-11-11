import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorator/role.decorator';
import { USER_ROLE } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(RoleGuard)
@Roles(USER_ROLE.ADMIN)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user).then(() => 'Creates Success');
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<string> {
    return this.userService.deleteUser(id).then(() => 'Delete Success');
  }

  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
