//-----------------------------------------------------------------------------
// src/clients/clients.service.ts
//-----------------------------------------------------------------------------
import { 
  Injectable
}                               from '@nestjs/common'
import { CreateClientDto }      from './dto/create-client.dto'
import { UpdateClientDto }      from './dto/update-client.dto'
import { 
  MambuClientService, 
  PatchOperation 
}                               from '../core-bank-apis/mambu/mambu-client.service'
import { WinstonLoggerService } from '../logger/winston-logger.service'

@Injectable()
export class ClientsService {
  constructor(
    private readonly logger     : WinstonLoggerService,
    private readonly mambuClient: MambuClientService
  ) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const client    = await this.mambuClient.create(createClientDto)
      const result  = {
        client: client,
      }
      this.logger.log(`Created client, sending response= %o`, result)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  async findAll() {
    try {
      const clients = await this.mambuClient.findAll()
      const result  = {
        clients: clients,
      }
      this.logger.log(`Fetched [%d] clients`, clients.length)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method findOne
   * 
   * Search for a client by Id and return the client. If the client is not found
   * return a 404 Not Found response.
   */
  async findOne(clientId: string) {
    try {
      const client  = await this.mambuClient.findOne(clientId)
      const result  = {
        client: client,
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
   * PUT method to update all of the fields of a client except for the client's 
   * dob and ssn.
   */
  async update(clientId: string, updateClientDto: UpdateClientDto) {
    try {
      const client    = await this.mambuClient.update(clientId, updateClientDto)
      const result  = {
        client: client
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
   * Use the Mambu patch operation to update a single client field.
   */
  async updateField(clientId: string, patchClientDto: PatchOperation) {
    try {
      const client  = await this.mambuClient.updateField(clientId, patchClientDto)
      const result  = {
        client: client
      }
      this.logger.log(`Patched client, response= %o`, result)
      return result
    }
    catch(error) {
      throw(error)
    }
  }

  /**
   * @method remove
   */
  async remove(clientId: string) {
    try {
      /////////////////////////////////////////////////////////////////////////
      // TODO: 03/11/2022
      // Look into how the success message is being built and what the 
      // expected success message should be according to Rest API guidelines.
      /////////////////////////////////////////////////////////////////////////
      const result    = await this.mambuClient.remove(clientId)
      const response  = {
        statusCode: 204,
        clientId:   clientId,
      }
      return response
    }
    catch(error) {
      throw(error)
    }
  }
}
