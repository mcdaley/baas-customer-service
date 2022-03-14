//-----------------------------------------------------------------------------
// src/core-bank-apis/mambu/mambu-customer.service.ts
//-----------------------------------------------------------------------------
import { 
  Injectable,
  HttpException, 
  HttpStatus,
}                                   from '@nestjs/common'
import { 
  plainToClass, 
  plainToClassFromExist 
}                                   from 'class-transformer'

import { CreateCustomerDto }        from '../../customers/dto/create-customer.dto'
import { UpdateCustomerDto }        from '../../customers/dto/update-customer.dto'
import { Customer }                 from '../../customers/entities/customer.entity'
import { WinstonLoggerService }     from '../../logger/winston-logger.service'
import { uuid }                     from '../../common/utils'
import { CustomerErrors }           from '../../exceptions/customer.errors'
import { 
  InvalidRegistrationError,
  InternalError,
  NotFoundError,
}                                   from '../../exceptions/customer-service.exceptions'

/**
 * Define enums, interface, and classes to support the Mambu Customer
 * patch operation which allows one Customer field to be updated at
 * a time. It seems like a weird implementation by Mambu.
 */
 export enum PatchOp {
  'ADD'     = 'ADD',
  'REPLACE' = 'REPLACE',
  'REMOVE'  = 'REMOVE',
  'MOVE'    = 'MOVE',
}

export interface IPatchOperation {
  from:   string,
  op:     PatchOp,
  path:   string,
  value:  any,
}

export class PatchOperation implements IPatchOperation {
  from:   string
  op:     PatchOp
  path:   string
  value:  any
}

/**
 * @class MambuCustomerService
 * 
 * The MambuCustomerService class is a wrapper to call the Mambu Customer APIs 
 * for the Customers microservice.
 */
@Injectable()
export class MambuCustomerService {
  constructor(private readonly logger: WinstonLoggerService) {
    this.customers = new Map<string, Customer>()
  }

  private index:    number    = 0       // TODO: Get rid of the index
  private customers:  Map<string, Customer>

  /**
   * Determine if the customer is already registered by looping through all
   * of the customers. Typically this would be tested using a DB unique
   * constraint on the email field.
   * 
   * @method isRegistered
   * @param  email 
   */
  private isRegistered(email: string) : boolean {
    for(let customer of this.customers.values()) {
      if(customer.email === email) {
        return true
      }
    }
    return false
  }

  /**
   * @method  create
   * @param   createCustomerDto
   * @returns 
   */
  public create(createCustomerDto: CreateCustomerDto) : Promise<Customer> {
    return new Promise( (resolve, reject) => {
      try {
        this.logger.debug(`Create new mambu customer= %o`, createCustomerDto)

        // Verify customer has accepted the terms
        if(!createCustomerDto.terms) {
          return reject(
            new InvalidRegistrationError(
              CustomerErrors.customer.invalidRegistration,
              `Please accept the terms of service`,
            )
          )
        }

        // Reject if email is already registered.
        if(this.isRegistered(createCustomerDto.email)) {
          return reject(
            new InvalidRegistrationError(
              CustomerErrors.customer.invalidRegistration, 
              `Email ${createCustomerDto.email} is already registered`
            )
          )
        }

        let customer: Customer  = plainToClass(Customer, createCustomerDto)
        customer.id           = uuid()
        customer.branchId     = uuid()

        this.customers.set(customer.id, customer)
        resolve(customer)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method  findAll
   */
  public findAll() : Promise<Customer[]> {
    return new Promise( (resolve, reject) => {
      try {
        this.logger.debug('Fetched [%d] customers', this.customers.size)
        let customerList: Customer[] = []
        for(let customer of this.customers.values()) {
          customerList.push(customer)
        }
        resolve(customerList)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method  findOne
   */
   public findOne(customerId: string) : Promise<Customer> | undefined {
    return new Promise( (resolve, reject) => {
      try {
        /////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2020
        // Build and throw resourceNotFound exception
        /////////////////////////////////////////////////////////////////////
        if(!this.customers.has(customerId)) {
          this.logger.error(`Customer w/ id=${customerId} Not Found`)
          return reject(
            new NotFoundError(
              CustomerErrors.customer.notFound, 
              `Customer w/ id=${customerId} Not Found`
            )
          )
        }

        const customer = this.customers.get(customerId)
        this.logger.log(`Fetched customer= %o`, customer)

        resolve(customer)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method update
   */
  public update(customerId: string, updateCustomerDto: UpdateCustomerDto) : Promise<Customer> | undefined {
    return new Promise( (resolve, reject) => {
      try {
        /////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2020
        // Build and throw resourceNotFound exception
        /////////////////////////////////////////////////////////////////////
        if(!this.customers.has(customerId)) {
          this.logger.error(`Customer w/ id=${customerId} Not Found`)
          return reject(
            new NotFoundError(
              CustomerErrors.customer.notFound, 
              `Failed to update customer, customer w/ id=${customerId} Not Found`
            )
          )
        }

        let customer        = this.customers.get(customerId)
        let updatedCustomer = plainToClassFromExist(customer, updateCustomerDto)
        resolve(updatedCustomer)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method updateField
   * 
   * Basic implementation of Mambu Patch Operation. Only support the the 
   * 'REPLACE' operation to replace the value of a field in the Customer 
   * object. 
   */
  public updateField(
    customerId      : string, 
    patchCustomerDto: PatchOperation): Promise<Customer> | undefined 
  {
    return new Promise( (resolve, reject) => {
      try {
        // Reject if customer is not found
        if(!this.customers.has(customerId)) {
          this.logger.error(`Customer w/ id=${customerId} Not Found`)
          return reject(
            new NotFoundError(
              CustomerErrors.customer.notFound, 
              `Failed to update customer, customer w/ id=${customerId} Not Found`
            )
          )
        }

        // Update and replace the customer
        let customer                  = this.customers.get(customerId)
        customer[patchCustomerDto.path] = patchCustomerDto.value
        this.customers.set(customerId,customer)

        resolve(customer)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method remove
   */
  public remove(customerId: string) : Promise<boolean> {
    return new Promise( (resolve, reject) => {
      try {
        // Reject if customer is not found
        if(!this.customers.has(customerId)) {
          this.logger.error(`Customer w/ id=${customerId} Not Found`)
          return reject(
            new NotFoundError(
              CustomerErrors.customer.notFound, 
              `Failed to delete customer, customer w/ id=${customerId} Not Found`
            )
          )
        }

        this.logger.debug(`Remove customer w/ customerId=${customerId}`)
        this.customers.delete(customerId)
        
        resolve(true)       
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          CustomerErrors.customer.internalError, 
          error.message
        )
        this.logger.error(`Failed to create customer, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

}
