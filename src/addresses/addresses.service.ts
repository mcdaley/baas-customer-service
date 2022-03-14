//-----------------------------------------------------------------------------
// src/addresses/addresses.service.ts
//-----------------------------------------------------------------------------
import { 
  Injectable, 
}                           from '@nestjs/common'
import { CreateAddressDto } from './dto/create-address.dto'

@Injectable()
export class AddressesService {
  create(clientId: number, createAddressDto: CreateAddressDto) {
    console.log(`[debug] Create address for clientId=[${clientId}], address= `, createAddressDto)

    return ({
      address: createAddressDto,
    })
  }

  findOne(clientId: number, addressId: number) {
    console.log(`[debug] Fetch address for clientId=${clientId}, addressId=${addressId}`)

    return ({
      address: {
        line1:    "1640 Saybrook Ave.",
        city:     "Cincinnatti",
        state:    "OH",
        zipCode:  "45208"
      }
    })
  }
}