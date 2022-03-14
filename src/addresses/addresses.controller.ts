//-----------------------------------------------------------------------------
// src/addresses/addresses.controller.ts
//-----------------------------------------------------------------------------
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe,
  Put,
  Delete,
}                           from '@nestjs/common'

import { AddressesService } from './addresses.service'
import { CreateAddressDto } from './dto/create-address.dto'

/**
 * @class AddressesController
 * 
 * Example class to show how to implement a nested route.
 */
@Controller('clients/:clientId/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @Param('clientId', ParseIntPipe) clientId: string, 
    @Body() createAddressDto: CreateAddressDto) 
  {
    return this.addressesService.create(+clientId, createAddressDto)
  }

  @Get(':addressId')
  findOne(
    @Param('clientId',  ParseIntPipe) clientId: string, 
    @Param('addressId', ParseIntPipe) addressId: string
  ) {
    return this.addressesService.findOne(+clientId, +addressId)
  }
}
