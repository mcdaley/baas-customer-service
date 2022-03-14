//-----------------------------------------------------------------------------
// src/exceptions/customer-service.exceptions.ts
//-----------------------------------------------------------------------------
import {
  HttpException,
}                       from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

/**
 * @interface ICustomerServiceError
 */
export interface ICustomerServiceError {
  httpStatus: number,
  id?:        string,
  code:       number,
  name:       string,
  path?:      string,
  cause?:     Error,
}

/**
 * @interface ICustomerServiceErrorOptions
 */
 export interface ICustomerServiceErrorOptions {
  cause:      Error | undefined,
}

/**
 * @class CustomerServiceException
 * 
 * Example exception that extends the HttpException to prove that I can build 
 * an exception hierarchy and also log the exceptions.
 */
export class CustomerServiceException extends HttpException {
  id:         string
  code:       number
  name:       string
  timestamp:  string
  path:       string | undefined
  details:    any[]
  cause:      Error | undefined

  constructor(customerServiceError: ICustomerServiceError, message: string) {
    super(message, customerServiceError.httpStatus)

    this.id         = uuidv4()
    this.code       = customerServiceError.code
    this.name       = customerServiceError.name
    this.timestamp  = new Date().toISOString(),
    this.path       = 'path' in customerServiceError ? customerServiceError.path : undefined
    this.details    = []                          // Array of multiple errors
    this.cause      = customerServiceError.cause    // Stack trace if exists

  }

  toString() {
    return `CustomerServiceException, code=${this.code}, message=${this.message}, status=${this.getStatus()}`
  }
}

export class InvalidIdempotencyKeyError extends CustomerServiceException {
  constructor(customerServiceError: ICustomerServiceError, message: string) {
    super(customerServiceError, message)
  }
}

export class BadRequestError extends CustomerServiceException {
  constructor(customerServiceError: ICustomerServiceError, message: string) {
    super(customerServiceError, message)
  }
}

export class InvalidRegistrationError extends CustomerServiceException {
  constructor(customerServiceError: ICustomerServiceError, message: string){
    super(customerServiceError, message)
  }
}

export class InternalError extends CustomerServiceException {
  constructor(customerServiceError: ICustomerServiceError, message: string) {
    super(customerServiceError, message)
  }
}

export class NotFoundError extends CustomerServiceException {
  constructor(customerServiceError: ICustomerServiceError, message: string) {
    super(customerServiceError, message)
  }
}