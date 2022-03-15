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
  branchId:         string            // Identifies customer's bank
  status:           CustomerStatus
  firstName:        string
  middleName:       string
  lastName:         string
  suffix:           string
  email:            string
  phoneNumber:      string
  ssn:              string
  metatdata:        string
  physical_address: Address
  mailing_address:  Address
}
