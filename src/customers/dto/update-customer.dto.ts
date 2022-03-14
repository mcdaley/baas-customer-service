//-----------------------------------------------------------------------------
// src/customers/dto/update-customer.dto.ts
//-----------------------------------------------------------------------------
import { PartialType, OmitType }  from '@nestjs/mapped-types'
import { CreateCustomerDto }      from './create-customer.dto'

/**
 * @class UpdateCustomerDto
 */
export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ['company'] as const)
) {}
