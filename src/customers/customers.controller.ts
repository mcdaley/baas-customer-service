//-----------------------------------------------------------------------------
// src/customers/customers.controller.ts
//-----------------------------------------------------------------------------
import { 
  Body,
  Controller, 
  Delete,
  Get, 
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,  
  Post, 
  Put, 
}                                 from '@nestjs/common'

import { CustomersService }       from './customers.service'
import { CreateCustomerDto }      from './dto/create-customer.dto'
import { UpdateCustomerDto }      from './dto/update-customer.dto'
import { PatchOperation }         from '../core-bank-apis/mambu/mambu-customer.service'
import { WinstonLoggerService }   from '../logger/winston-logger.service'
import { IdempotencyKey }         from '../common/idempotency-key.decorator'

@Controller({path: 'customers', version: '1'})
export class CustomersController {
  constructor(
    private readonly customersService:  CustomersService, 
    private readonly logger:          WinstonLoggerService,
  ) {}

  @Post()
  createV1(
    @IdempotencyKey() idempotencyKey: string,
    @Body() createCustomerDto: CreateCustomerDto ) 
  {
    this.logger.log(`POST /v1/customers, createCustomerDto= %o`, createCustomerDto)
    this.logger.log(`IdempotencyKey= %s`, idempotencyKey)

    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAllV1() {
    this.logger.log(`GET /v1/customers`)
    return this.customersService.findAll();
  }

  @Get(':customerId')
  findOneV1(@Param('customerId', ParseUUIDPipe) customerId: string) {
    this.logger.log(`GET /v1/customers/${customerId}`)
    return this.customersService.findOne(customerId);
  }

  @Put(':customerId')
  updateV1(
    @Param('customerId', ParseUUIDPipe) customerId: string, @Body() 
    updateCustomerDto: UpdateCustomerDto) 
  {
    this.logger.log(`PUT /v1/customers/${customerId}, updateCustomerDto= %o`, updateCustomerDto)
    return this.customersService.update(customerId, updateCustomerDto);
  }

  @Patch(':customerId')
  updateFieldV1(
    @Param('customerId', ParseUUIDPipe) customerId: string, @Body() 
    patchCustomerDto: PatchOperation) 
  {
    this.logger.log(`PATCH /v1/customers/${customerId}, patchCustomerDto= %o`, patchCustomerDto)
    return this.customersService.updateField(customerId, patchCustomerDto)
  }

  @Delete(':customerId')
  @HttpCode(204)
  removeV1(@Param('customerId', ParseUUIDPipe) customerId: string) {
    this.logger.log(`DELETE /v1/customers/${customerId}`)
    return this.customersService.remove(customerId);
  }
}
