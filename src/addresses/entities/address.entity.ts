//-----------------------------------------------------------------------------
// src/addresses/entities/address.entity.ts
//-----------------------------------------------------------------------------
import { States }   from '../../common/enums/states.enum'

export class Address {
  name:             string
  street_line_1:    string
  street_line_2:    string
  city:             string
  state:            States
  postalCode:       string      
}