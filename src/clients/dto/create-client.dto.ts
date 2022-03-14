//-----------------------------------------------------------------------------
// src/clients/dto/create-client.dto.ts
//-----------------------------------------------------------------------------
import { 
  Equals,
  isBoolean,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString, 
  Length, 
  Matches,
  MaxLength,
  ValidateNested,
}                             from 'class-validator'
import { CreateAddressDto }   from '../../addresses/dto/create-address.dto'

/**
 * @class CreateClientDto
 */
export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128, {message: 'First name is too long'})
  firstName:  string

  @IsNotEmpty()
  @IsString()
  @MaxLength(128, {message: 'Last name is too long'})
  lastName:   string

  @IsNotEmpty()
  @IsString()
  @MaxLength(128, {message: 'Company name is too long'})
  company:   string

  @IsNotEmpty()
  @IsEmail()
  email:      string

  @Matches(/^\d{3}-\d{3}-\d{4}$/)
  phone:     string
  
  @IsNotEmpty()
  @IsString()
  @Length(6, 64)
  password:   string

  @IsNotEmpty({message: 'Please accept the terms'})
  @IsBoolean()
  terms:      boolean
  
  //* @ValidateNested()
  //* @Type(() => CreateAddressDto)
  //* address:    CreateAddressDto
}
