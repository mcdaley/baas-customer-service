//-----------------------------------------------------------------------------
// src/exceptions/customer-service.exceptions.ts
//-----------------------------------------------------------------------------
import {
  HttpException,
}                       from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

/**
 * @interface IBaaSError
 */
export interface IBaaSError {
  httpStatus: number,
  id?:        string,
  code:       number,
  name:       string,
  path?:      string,
  cause?:     Error,
}

/**
 * @interface IBaaSErrorOptions
 */
 export interface IBaaSErrorOptions {
  cause:      Error | undefined,
}

/**
 * @class BaaSException
 * 
 * Example exception that extends the HttpException to prove that I can build 
 * an exception hierarchy and also log the exceptions.
 */
export class BaaSException extends HttpException {
  id:         string
  code:       number
  name:       string
  timestamp:  string
  path:       string | undefined
  details:    any[]
  cause:      Error | undefined

  constructor(customerServiceError: IBaaSError, message: string) {
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
    return `BaaSException, code=${this.code}, message=${this.message}, status=${this.getStatus()}`
  }
}

export class InvalidIdempotencyKeyError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string) {
    super(customerServiceError, message)
  }
}

export class BadRequestError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string) {
    super(customerServiceError, message)
  }
}

export class InvalidRegistrationError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string){
    super(customerServiceError, message)
  }
}

export class InternalError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string) {
    super(customerServiceError, message)
  }
}

export class NotFoundError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string) {
    super(customerServiceError, message)
  }
}

export class BaaSAxiosError extends BaaSException {
  constructor(customerServiceError: IBaaSError, message: string) {
    super(customerServiceError, message)
  }
}