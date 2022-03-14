//-----------------------------------------------------------------------------
// src/core-bank-apis/mambu/mambu-client.service.ts
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

import { CreateClientDto }          from '../../clients/dto/create-client.dto'
import { UpdateClientDto }          from '../../clients/dto/update-client.dto'
import { Client }                   from '../../clients/entities/client.entity'
import { WinstonLoggerService }     from '../../logger/winston-logger.service'
import { uuid }                     from '../../common/utils'
import { ClientErrors }             from '../../exceptions/client.errors'
import { 
  InvalidRegistrationError,
  InternalError,
  NotFoundError,
}                                   from '../../exceptions/client-service.exceptions'

/**
 * Define enums, interface, and classes to support the Mambu Client
 * patch operation which allows one Client field to be updated at
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
 * @class MambuClientService
 * 
 * The MambuClientService class is a wrapper to call the Mambu Client APIs 
 * for the Clients microservice.
 */
@Injectable()
export class MambuClientService {
  constructor(private readonly logger: WinstonLoggerService) {
    this.clients = new Map<string, Client>()
  }

  private index:    number    = 0       // TODO: Get rid of the index
  private clients:  Map<string, Client>

  /**
   * Determine if the client is already registered by looping through all
   * of the clients. Typically this would be tested using a DB unique
   * constraint on the email field.
   * 
   * @method isRegistered
   * @param  email 
   */
  private isRegistered(email: string) : boolean {
    for(let client of this.clients.values()) {
      if(client.email === email) {
        return true
      }
    }
    return false
  }

  /**
   * @method  create
   * @param   createClientDto
   * @returns 
   */
  public create(createClientDto: CreateClientDto) : Promise<Client> {
    return new Promise( (resolve, reject) => {
      try {
        this.logger.debug(`Create new mambu client= %o`, createClientDto)

        // Verify client has accepted the terms
        if(!createClientDto.terms) {
          return reject(
            new InvalidRegistrationError(
              ClientErrors.client.invalidRegistration,
              `Please accept the terms of service`,
            )
          )
        }

        // Reject if email is already registered.
        if(this.isRegistered(createClientDto.email)) {
          return reject(
            new InvalidRegistrationError(
              ClientErrors.client.invalidRegistration, 
              `Email ${createClientDto.email} is already registered`
            )
          )
        }

        let client: Client  = plainToClass(Client, createClientDto)
        client.id           = uuid()
        client.branchId     = uuid()

        this.clients.set(client.id, client)
        resolve(client)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method  findAll
   */
  public findAll() : Promise<Client[]> {
    return new Promise( (resolve, reject) => {
      try {
        this.logger.debug('Fetched [%d] clients', this.clients.size)
        let clientList: Client[] = []
        for(let client of this.clients.values()) {
          clientList.push(client)
        }
        resolve(clientList)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method  findOne
   */
   public findOne(clientId: string) : Promise<Client> | undefined {
    return new Promise( (resolve, reject) => {
      try {
        /////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2020
        // Build and throw resourceNotFound exception
        /////////////////////////////////////////////////////////////////////
        if(!this.clients.has(clientId)) {
          this.logger.error(`Client w/ id=${clientId} Not Found`)
          return reject(
            new NotFoundError(
              ClientErrors.client.notFound, 
              `Client w/ id=${clientId} Not Found`
            )
          )
        }

        const client = this.clients.get(clientId)
        this.logger.log(`Fetched client= %o`, client)

        resolve(client)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method update
   */
  public update(clientId: string, updateClientDto: UpdateClientDto) : Promise<Client> | undefined {
    return new Promise( (resolve, reject) => {
      try {
        /////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2020
        // Build and throw resourceNotFound exception
        /////////////////////////////////////////////////////////////////////
        if(!this.clients.has(clientId)) {
          this.logger.error(`Client w/ id=${clientId} Not Found`)
          return reject(
            new NotFoundError(
              ClientErrors.client.notFound, 
              `Failed to update client, client w/ id=${clientId} Not Found`
            )
          )
        }

        let client        = this.clients.get(clientId)
        let updatedClient = plainToClassFromExist(client, updateClientDto)
        resolve(updatedClient)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method updateField
   * 
   * Basic implementation of Mambu Patch Operation. Only support the the 
   * 'REPLACE' operation to replace the value of a field in the Client 
   * object. 
   */
  public updateField(
    clientId      : string, 
    patchClientDto: PatchOperation): Promise<Client> | undefined 
  {
    return new Promise( (resolve, reject) => {
      try {
        // Reject if client is not found
        if(!this.clients.has(clientId)) {
          this.logger.error(`Client w/ id=${clientId} Not Found`)
          return reject(
            new NotFoundError(
              ClientErrors.client.notFound, 
              `Failed to update client, client w/ id=${clientId} Not Found`
            )
          )
        }

        // Update and replace the client
        let client                  = this.clients.get(clientId)
        client[patchClientDto.path] = patchClientDto.value
        this.clients.set(clientId,client)

        resolve(client)
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

  /**
   * @method remove
   */
  public remove(clientId: string) : Promise<boolean> {
    return new Promise( (resolve, reject) => {
      try {
        // Reject if client is not found
        if(!this.clients.has(clientId)) {
          this.logger.error(`Client w/ id=${clientId} Not Found`)
          return reject(
            new NotFoundError(
              ClientErrors.client.notFound, 
              `Failed to delete client, client w/ id=${clientId} Not Found`
            )
          )
        }

        this.logger.debug(`Remove client w/ clientId=${clientId}`)
        this.clients.delete(clientId)
        
        resolve(true)       
      }
      catch(error) {
        ///////////////////////////////////////////////////////////////////////
        // TODO: 03/11/2022
        // In real system, I'll need to build a proper exception from error.
        ///////////////////////////////////////////////////////////////////////
        const internalError = new InternalError(
          ClientErrors.client.internalError, 
          error.message
        )
        this.logger.error(`Failed to create client, err= %s`, internalError.message)
        reject(internalError)
      }
    })
  }

}
