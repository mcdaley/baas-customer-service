//-----------------------------------------------------------------------------
// src/customers/entities/customer.entity.ts
//-----------------------------------------------------------------------------
import { CustomerStatus } from '../../common/enums/customer-status.enum'
import { Address }        from '../../addresses/entities/address.entity'

/**
 * @class Customer
 */
export class Customer {
  id:               string            // Unique customer identifier
  branch_id:        string            // Identifies customer's bank
  status:           CustomerStatus
  first_name:       string
  middle_name:      string
  last_name:        string
  suffix:           string
  email:            string
  phone_number:     string
  ssn:              string
  metatdata:        string
  physical_address: Address
  mailing_address:  Address
}
