import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  LoginResponse,
  RegisterRespose,
} from './types/user.type';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
//import { Response } from 'express';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterRespose)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterRespose> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Por favor preencha todos os campos.');
    }

    const { activationToken, response } = await this.userService.register(
      registerDto,
      context.res,
    );
    const activation_token = activationToken.token;

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.userService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }
  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
