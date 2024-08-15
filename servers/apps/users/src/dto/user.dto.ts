import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'O email deve ser um email válido.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'O numero de telefone é obrigatório.' })
  phone_number: number;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'O token de ativação é obrigatório.' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'O código de ativação é obrigatório.' })
  activationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'O email deve ser um email válido.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;
}

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'O email deve ser um email válido.' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'O token de redefinição de senha é obrigatório.' })
  activationToken: string;
}
