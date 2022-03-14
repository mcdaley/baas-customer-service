//-----------------------------------------------------------------------------
// src/exceptions/client-service.exceptions.ts
//-----------------------------------------------------------------------------
import {
  HttpException,
}                       from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

/**
 * @interface IClientServiceError
 */
export interface IClientServiceError {
  httpStatus: number,
  id?:        string,
  code:       number,
  name:       string,
  path?:      string,
  cause?:     Error,
}

/**
 * @interface IClientServiceErrorOptions
 */
 export interface IClientServiceErrorOptions {
  cause:      Error | undefined,
}

/**
 * @class ClientServiceException
 * 
 * Example exception that extends the HttpException to prove that I can build 
 * an exception hierarchy and also log the exceptions.
 */
export class ClientServiceException extends HttpException {
  id:         string
  code:       number
  name:       string
  timestamp:  string
  path:       string | undefined
  details:    any[]
  cause:      Error | undefined

  constructor(clientServiceError: IClientServiceError, message: string) {
    super(message, clientServiceError.httpStatus)

    this.id         = uuidv4()
    this.code       = clientServiceError.code
    this.name       = clientServiceError.name
    this.timestamp  = new Date().toISOString(),
    this.path       = 'path' in clientServiceError ? clientServiceError.path : undefined
    this.details    = []                          // Array of multiple errors
    this.cause      = clientServiceError.cause    // Stack trace if exists

  }

  toString() {
    return `ClientServiceException, code=${this.code}, message=${this.message}, status=${this.getStatus()}`
  }
}

export class InvalidIdempotencyKeyError extends ClientServiceException {
  constructor(clientServiceError: IClientServiceError, message: string) {
    super(clientServiceError, message)
  }
}

export class BadRequestError extends ClientServiceException {
  constructor(clientServiceError: IClientServiceError, message: string) {
    super(clientServiceError, message)
  }
}

export class InvalidRegistrationError extends ClientServiceException {
  constructor(clientServiceError: IClientServiceError, message: string){
    super(clientServiceError, message)
  }
}

export class InternalError extends ClientServiceException {
  constructor(clientServiceError: IClientServiceError, message: string) {
    super(clientServiceError, message)
  }
}

export class NotFoundError extends ClientServiceException {
  constructor(clientServiceError: IClientServiceError, message: string) {
    super(clientServiceError, message)
  }
}