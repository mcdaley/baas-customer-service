//-----------------------------------------------------------------------------
// src/clients/clients.controller.ts
//-----------------------------------------------------------------------------
import { 
  Controller, 
  Get, 
  Post, 
  Body,
  Patch, 
  Param, 
  Put,
  Delete,
  ParseUUIDPipe, 
}                               from '@nestjs/common'

import { ClientsService }         from './clients.service'
import { CreateClientDto }        from './dto/create-client.dto'
import { UpdateClientDto }        from './dto/update-client.dto'
import { PatchOperation }         from '../core-bank-apis/mambu/mambu-client.service'
import { WinstonLoggerService }   from '../logger/winston-logger.service'
import { IdempotencyKey }         from '../common/idempotency-key.decorator'

@Controller({path: 'clients', version: '1'})
export class ClientsController {
  constructor(
    private readonly clientsService:  ClientsService, 
    private readonly logger:          WinstonLoggerService,
  ) {}

  @Post()
  createV1(
    @IdempotencyKey() idempotencyKey: string,
    @Body() createClientDto: CreateClientDto ) 
  {
    this.logger.log(`POST /v1/clients, createClientDto= %o`, createClientDto)
    this.logger.log(`IdempotencyKey= %s`, idempotencyKey)

    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAllV1() {
    this.logger.log(`GET /v1/clients`)
    return this.clientsService.findAll();
  }

  @Get(':clientId')
  findOneV1(@Param('clientId', ParseUUIDPipe) clientId: string) {
    this.logger.log(`GET /v1/clients/${clientId}`)
    return this.clientsService.findOne(clientId);
  }

  @Put(':clientId')
  updateV1(
    @Param('clientId', ParseUUIDPipe) clientId: string, @Body() 
    updateClientDto: UpdateClientDto) 
  {
    this.logger.log(`PUT /v1/clients/${clientId}, updateClientDto= %o`, updateClientDto)
    return this.clientsService.update(clientId, updateClientDto);
  }

  @Patch(':clientId')
  updateFieldV1(
    @Param('clientId', ParseUUIDPipe) clientId: string, @Body() 
    patchClientDto: PatchOperation) 
  {
    this.logger.log(`PATCH /v1/clients/${clientId}, patchClientDto= %o`, patchClientDto)
    return this.clientsService.updateField(clientId, patchClientDto)
  }

  @Delete(':clientId')
  removeV1(@Param('clientId', ParseUUIDPipe) clientId: string) {
    this.logger.log(`DELETE /v1/clients/${clientId}`)
    return this.clientsService.remove(clientId);
  }
}
