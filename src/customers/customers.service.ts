//-----------------------------------------------------------------------------
// src/customers/customers.service.ts
//-----------------------------------------------------------------------------
import { 
  Injectable
}                               from '@nestjs/common'
import { CreateCustomerDto }    from './dto/create-customer.dto'
import { UpdateCustomerDto }    from './dto/update-customer.dto'
import {
  BankSimulatorCustomerService
}                               from '../core-bank-apis/simulator/bank-simulator-customer.service'
import { 
  MambuCustomerService, 
  PatchOperation 
}                               from '../core-bank-apis/mambu/mambu-customer.service'
import { WinstonLoggerService } from '../logger/winston-logger.service'

@Injectable()
export class CustomersService {
  constructor(
    private readonly logger       : WinstonLoggerService,
    private readonly mambuCustomer: MambuCustomerService,
    private readonly bankCustomer : BankSimulatorCustomerService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer  = await this.bankCustomer.create(createCustomerDto)
      const result    = {
        customer: customer,
      }
      this.logger.log(`Created customer, sending response= %o`, result)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  async findAll() {
    try {
      const customers = await this.bankCustomer.findAll()
      const result  = {
        customers: customers,
      }
      this.logger.log(`Fetched [%d] customers`, customers)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // TODO: 3/19/2022
  // Attempt to use rxjs observables to handle the response from the
  // httpService. I'm going to come back to this later when I have a basic
  // understanding of rxjs and observables.
  //
  // This returns the Customers[] but I'm unable to create the object 
  // { customers: customers[] } that I want in the response.
  /////////////////////////////////////////////////////////////////////////////
  findAllV2() {
    const  response = this.bankCustomer.findAllV2()
    return response
  }

  /**
   * @method findOne
   * 
   * Search for a customer by Id and return the customer. If the customer is not found
   * return a 404 Not Found response.
   */
  async findOne(customerId: string) {
    try {
      const customer  = await this.bankCustomer.findOne(customerId)
      const result  = {
        customer: customer,
      }
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method update
   * 
   * PUT method to update all of the fields of a customer except for the customer's 
   * dob and ssn.
   */
  async update(customerId: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer    = await this.bankCustomer.update(customerId, updateCustomerDto)
      const result  = {
        customer: customer
      }
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method updateField
   * 
   * Use the Mambu patch operation to update a single customer field.
   */
  async updateField(customerId: string, patchCustomerDto: PatchOperation) {
    try {
      const customer  = await this.mambuCustomer.updateField(customerId, patchCustomerDto)
      const result  = {
        customer: customer
      }
      this.logger.log(`Patched customer, response= %o`, result)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method remove
   */
  async remove(customerId: string) {
    try {
      /////////////////////////////////////////////////////////////////////////
      // TODO: 03/11/2022
      // Look into how the success message is being built and what the 
      // expected success message should be according to Rest API guidelines.
      /////////////////////////////////////////////////////////////////////////
      const result    = await this.bankCustomer.remove(customerId)
      const response  = {
        statusCode: 204,
        customerId:   customerId,
      }
      return response
    }
    catch(error) {
      throw(error)
    }
  }
}
