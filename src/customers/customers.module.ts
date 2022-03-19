//-----------------------------------------------------------------------------
// src/customers/customers.module.ts
//-----------------------------------------------------------------------------
import { Module }               from '@nestjs/common'
import { HttpModule }           from '@nestjs/axios'

import { CustomersService }     from './customers.service'
import { CustomersController }  from './customers.controller'
import { 
  BankSimulatorCustomerService 
}                               from '../core-bank-apis/simulator/bank-simulator-customer.service'
import { MambuCustomerService } from '../core-bank-apis/mambu/mambu-customer.service'

@Module({
  imports:      [HttpModule],
  controllers:  [CustomersController],
  providers:    [CustomersService, BankSimulatorCustomerService, MambuCustomerService]
})
export class CustomersModule {}
