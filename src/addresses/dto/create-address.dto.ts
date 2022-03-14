//-----------------------------------------------------------------------------
// src/addresses/dto/create-address.dto.ts
//-----------------------------------------------------------------------------
import { 
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString, 
  Length,
  Matches,
  MaxLength,
}                             from 'class-validator'

import { States }             from '../../common/enums/states.enum'

/**
 * @class CreateAddressDto
 */
export class CreateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name:     string

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  line1:    string      // maxLength 128
  
  @IsOptional()
  @IsString()
  @MaxLength(128)
  line2:    string      // maxLength 128
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  city:     string      // maxLength 128

  @IsNotEmpty()
  @IsString()
  @IsEnum(States)
  state:    States

  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/)
  zipCode:  string      
}