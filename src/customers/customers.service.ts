//-----------------------------------------------------------------------------
// src/customers/customers.service.ts
//-----------------------------------------------------------------------------
import { 
  Injectable
}                               from '@nestjs/common'
import { CreateCustomerDto }    from './dto/create-customer.dto'
import { UpdateCustomerDto }    from './dto/update-customer.dto'
import { 
  MambuCustomerService, 
  PatchOperation 
}                               from '../core-bank-apis/mambu/mambu-customer.service'
import { WinstonLoggerService } from '../logger/winston-logger.service'

@Injectable()
export class CustomersService {
  constructor(
    private readonly logger     : WinstonLoggerService,
    private readonly mambuCustomer: MambuCustomerService
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer    = await this.mambuCustomer.create(createCustomerDto)
      const result  = {
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
      const customers = await this.mambuCustomer.findAll()
      const result  = {
        customers: customers,
      }
      this.logger.log(`Fetched [%d] customers`, customers.length)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method findOne
   * 
   * Search for a customer by Id and return the customer. If the customer is not found
   * return a 404 Not Found response.
   */
  async findOne(customerId: string) {
    try {
      const customer  = await this.mambuCustomer.findOne(customerId)
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
      const customer    = await this.mambuCustomer.update(customerId, updateCustomerDto)
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
      const result    = await this.mambuCustomer.remove(customerId)
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
