import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { UserStatus } from "../enum/user-status";

export class UserForm {

  @IsString()
  @MaxLength(100)
  name: string;
  
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(100)
  street: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(25)
  street_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(100)
  complement?: string;
  
  @IsString()
  @MaxLength(100)
  @IsOptional()
  city: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  state: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  zip_code: string;

  @IsEnum(UserStatus)
  status: UserStatus;
  
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  created_at?: Date;

}