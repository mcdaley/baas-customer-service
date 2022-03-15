//-----------------------------------------------------------------------------
// src/customers/dto/update-customer.dto.ts
//-----------------------------------------------------------------------------
import { PartialType, OmitType }  from '@nestjs/mapped-types'
import { CreateCustomerDto }      from './create-customer.dto'

/**
 * @class UpdateCustomerDto
 */
///////////////////////////////////////////////////////////////////////////////
// BUG: 03/15/2022
// The OmitType does not make all of the fields optional.
///////////////////////////////////////////////////////////////////////////////
export class UpdateCustomerDto extends PartialType( 
  OmitType(CreateCustomerDto, ['ssn'] as const)
) {}

//* export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

