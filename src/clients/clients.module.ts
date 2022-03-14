//-----------------------------------------------------------------------------
// src/clients/clients.module.ts
//-----------------------------------------------------------------------------
import { Module }             from '@nestjs/common'
import { ClientsService }     from './clients.service'
import { ClientsController }  from './clients.controller'
import { MambuClientService } from '../core-bank-apis/mambu/mambu-client.service'

@Module({
  controllers:  [ClientsController],
  providers:    [ClientsService, MambuClientService]
})
export class ClientsModule {}
