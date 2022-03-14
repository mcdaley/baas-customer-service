//-----------------------------------------------------------------------------
// src/customers/customers.module.ts
//-----------------------------------------------------------------------------
import { Module }               from '@nestjs/common'
import { CustomersService }     from './customers.service'
import { CustomersController }  from './customers.controller'
import { MambuCustomerService } from '../core-bank-apis/mambu/mambu-customer.service'

@Module({
  controllers:  [CustomersController],
  providers:    [CustomersService, MambuCustomerService]
})
export class CustomersModule {}
