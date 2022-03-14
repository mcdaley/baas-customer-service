//-----------------------------------------------------------------------------
// src/clients/dto/update-client.dto.ts
//-----------------------------------------------------------------------------
import { PartialType, OmitType }    from '@nestjs/mapped-types';
import { CreateClientDto }  from './create-client.dto';

/**
 * @class UpdateClientDto
 */
export class UpdateClientDto extends PartialType(
  OmitType(CreateClientDto, ['company'] as const)
) {}
