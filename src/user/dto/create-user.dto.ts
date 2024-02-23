
import { IsString, IsEmail, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    dni?: string;

    @IsEnum(UserRole)
    role: UserRole;
}
