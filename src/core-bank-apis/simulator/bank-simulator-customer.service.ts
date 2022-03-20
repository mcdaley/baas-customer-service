//-----------------------------------------------------------------------------
// src/core-bank-apis/simulator/bank-simulator-customer.service.ts
//-----------------------------------------------------------------------------
import { HttpService }              from '@nestjs/axios'
import { Injectable }               from '@nestjs/common'
import { map, Observable }          from 'rxjs'
import { AxiosResponse }            from 'axios'
import axios                        from 'axios'
import { plainToClass }             from 'class-transformer'

import { CreateCustomerDto }        from '../../customers/dto/create-customer.dto'
import { Customer }                 from '../../customers/entities/customer.entity'
import { WinstonLoggerService }     from '../../logger/winston-logger.service'
import { BaaSErrors }               from '../../exceptions/baas.errors'
import { 
  BaaSAxiosError, 
  IBaaSError, 
  BaaSExceptionFactory,
}                                   from '../../exceptions/baas.exceptions'
import { UpdateCustomerDto } from 'src/customers/dto/update-customer.dto'

// Define the Core Bank Simulator URLs
const  Simulator            = `http://localhost:5001`
const  SimulatorCustomerUrl = `${Simulator}/customers`

/**
 * @class BankSimulatorCustomerService
 */
@Injectable()
export class BankSimulatorCustomerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger:      WinstonLoggerService
  ) {}

  public create(createCustomerDto: CreateCustomerDto) : Promise<Customer> {
    return new Promise( async (resolve, reject) => {
      try {
        const  url = SimulatorCustomerUrl
        this.logger.debug(`POST ${url}, createCustomerDto= %o`, createCustomerDto)

        let customer = plainToClass(Customer, createCustomerDto)
        let response = await axios.post(url, createCustomerDto)
        
        resolve(response.data)
      }
      catch(error) {
        //* this.logger.error(`Failed to create customer, error= %o`, error)
        reject(BaaSExceptionFactory.create(error, `customer`))
      }
    })
  }

  /////////////////////////////////////////////////////////////////////////////
  // TODO: 3/19/2022
  // Attempt to use rxjs objservables to handle the GET response, I'll 
  // come back to this later when I understand rxjs observables later.
  //
  // Here is a link to stackoverflow w/:
  // - https://www.joshmorony.com/using-providers-and-http-requests-in-a-nestjs-backend/
  // - https://stackoverflow.com/questions/63662285/how-to-get-nested-api-data-using-nestjs-httpservice-axios
  /////////////////////////////////////////////////////////////////////////////
  findAllV2() : Observable<AxiosResponse<Customer[]>> {
    const  url = SimulatorCustomerUrl
    this.logger.log(`Simulator, findAll url= %s`, url)

    const response = this.httpService.get(url)
    const customers = response.pipe(
      map( (customersResponse) => {
        return customersResponse.data
      })
    )
    return customers
  }

  /**
   * @method findAll
   */
  public findAll(): Promise<Customer[]> {
    const  url = SimulatorCustomerUrl
    this.logger.debug(`GET %s`, url)

    return new Promise( async (resolve, reject) => {
      try {
        const response = await axios.get(url)
        this.logger.log(`Fetched customers= %o`, response.data)

        resolve(response.data)
      }
      catch(error) {
        this.logger.error(`Failed to fetch customers, error= %o`, error)
        reject(error)
      }
    })
  }

  /**
   * @method findOne
   */
  public findOne(customerId: string): Promise<Customer> {
    const  url = `${SimulatorCustomerUrl}/${customerId}`
    this.logger.log(`GET %s`, url)

    return new Promise( async (resolve, reject) => {
      try {
        const response  = await axios.get(url)
        const customer  = response.data
        this.logger.log(
          `Fetched customerId=${customerId}, customer= %o`, customer
        )

        resolve(customer)
      }
      catch(error) {
        //* this.logger.error(`Failed to fetch customer, error= %o`, error)
        reject(BaaSExceptionFactory.create(error, `customer`))
      }
    })
  }

  /**
   * @method update
   */
  public update(
    customerId:        string, 
    updateCustomerDto: UpdateCustomerDto) : Promise<Customer> {
      const url = `${SimulatorCustomerUrl}/${customerId}`
      this.logger.log(`PUT ${url}, updateCustomerDto= %o`, updateCustomerDto)

      /////////////////////////////////////////////////////////////////////////
      // 3/19/2022
      // I need to call the patch method on the simulator, so that it only
      // updates the fields that are changing. I was having some issues 
      // originally with the mambu simulator in that I had to use PUT for
      // the PATCH - Just need to make the API consistent eventually.
      /////////////////////////////////////////////////////////////////////////
      return new Promise( async (resolve, reject) => {
        try {
          const response = await axios.patch(url , updateCustomerDto)
          const customer = response.data

          this.logger.log(
            `Updated customerId=%s, customer= %o`, customerId, customer
          )
          resolve(customer)
        }
        catch(error) {
          //* this.logger.error(`Failed to update customers, error= %o`, error)
          reject(BaaSExceptionFactory.create(error, `customer`))
        }
      })
    }

    /**
     * @method remove
     */
    public remove(customerId: string): Promise<boolean> {
      const url = `${SimulatorCustomerUrl}/${customerId}`
      this.logger.log(`Simulator Request, DELETE ${url}`)

      return new Promise( async (resolve, reject) => {
        try {
          const response = await axios.delete(url)

          this.logger.log(`Deleted customerId=%s`, customerId)
          resolve(true)
        }
        catch(error) {
          //* this.logger.error(`Failed to delete customer, error= %o`, error)
          reject(BaaSExceptionFactory.create(error, `customer`))
        }
      })
    }
} // end of class BankSimulatorCustomerService
