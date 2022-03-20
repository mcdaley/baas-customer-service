//-----------------------------------------------------------------------------
// src/exceptions/customer-service.exceptions.ts
//-----------------------------------------------------------------------------
import { HttpException }    from '@nestjs/common'
import { AxiosError }       from 'axios'
import { v4 as uuidv4 }     from 'uuid'

import { BaaSErrors } from './baas.errors'

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

  constructor(baasError: IBaaSError, message: string) {
    super(message, baasError.httpStatus)

    this.id         = uuidv4()
    this.code       = baasError.code
    this.name       = baasError.name
    this.timestamp  = new Date().toISOString(),
    this.path       = 'path' in baasError ? baasError.path : undefined
    this.details    = []                          // Array of multiple errors
    this.cause      = baasError.cause    // Stack trace if exists

  }

  toString() {
    return `BaaSException, code=${this.code}, message=${this.message}, status=${this.getStatus()}`
  }
}

/**
 * @class BaasExceptionFactory
 */
export class BaaSExceptionFactory {
  static create(error: any, resource: string = `resource`): BaaSException {
    console.log(`[DEBUG] BaaSExceptionFactory.create()`)
    if(error instanceof BaaSException) {
      return error
    }
    else if(error instanceof HttpException) {
      console.log(`[DEBUG] Received HttpException, error= `, error)
      return new InternalError(BaaSErrors[resource].unknownError, "NEED TO DEBUG THIS ONE - I SHOULD NOT GET HERE")
    }
    else if(error.hasOwnProperty('isAxiosError') && error.isAxiosError) {
      // Axios Error
      let baasErrorType: IBaaSError

      if(error.response) {
        // Request was made and server responded with a Http Status code
        const httpStatus = error.response.status
        switch(httpStatus) {
          case 400:
            baasErrorType = BaaSErrors[resource].badRequest
            break
          case 401:
            baasErrorType = BaaSErrors[resource].unauthorized
            break
          case 403:
            baasErrorType = BaaSErrors[resource].forbidden
          case 404:
            baasErrorType = BaaSErrors[resource].notFound
            break
          case 500:
            baasErrorType = BaaSErrors[resource].internalError
            break
          default:
            baasErrorType = BaaSErrors[resource].unknown
        }

        return new BaaSAxiosError(baasErrorType, error.message)
      }
      else if(error.request) {
        // Request was made, but no response was received.
        return new BaaSAxiosError(BaaSErrors[resource].internalError, error.message)
      }
      else {
        // Unknown error was triggered
        return new BaaSAxiosError(BaaSErrors[resource].unknownError, error.message)
      }
    }
    else if(error instanceof Error) {
      // JavaScript Error
      return new BaaSException(BaaSErrors[resource].unknownError, error.message)
    }
    else {
      // Unknown Error
      return new BaaSException(BaaSErrors[resource].unknownError, `Undefined Error`)
    }
  }
}

export class InvalidIdempotencyKeyError extends BaaSException {
  constructor(baasError: IBaaSError, message: string) {
    super(baasError, message)
  }
}

export class BadRequestError extends BaaSException {
  constructor(baasError: IBaaSError, message: string) {
    super(baasError, message)
  }
}

export class InvalidRegistrationError extends BaaSException {
  constructor(baasError: IBaaSError, message: string){
    super(baasError, message)
  }
}

export class InternalError extends BaaSException {
  constructor(baasError: IBaaSError, message: string) {
    super(baasError, message)
  }
}

export class NotFoundError extends BaaSException {
  constructor(baasError: IBaaSError, message: string) {
    super(baasError, message)
  }
}

export class BaaSAxiosError extends BaaSException {
  constructor(baasError: IBaaSError, message: string) {
    super(baasError, message)
  }
}