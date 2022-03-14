//-----------------------------------------------------------------------------
// src/customers/entities/customer.entity.ts
//-----------------------------------------------------------------------------

/**
 * @class Customer
 */
export class Customer {
  id:         string
  branchId:   string
  firstName:  string
  lastName:   string
  company:    string
  email:      string
  phone:      string
  password:   string
  terms:      boolean
}
