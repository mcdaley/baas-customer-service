//-----------------------------------------------------------------------------
// src/common/http-exceptions.filter.ts
//-----------------------------------------------------------------------------
import { 
  ArgumentsHost,
  ExceptionFilter,
  Injectable,
  HttpException, 
  BadRequestException,
}                                 from '@nestjs/common'
import { Request, Response }      from 'express'

import { WinstonLoggerService }   from '../logger/winston-logger.service'
import { BaaSException }          from '../exceptions/baas.exceptions'
import { BaaSErrors }             from '../exceptions/baas.errors'

/**
 * @class HttpExceptionFilter
 * 
 * Global filter to catch all the HttpExceptions thrown in the APIs. The
 * HttpExceptionFilter returns a formatted error response and also logs
 * the exception.
 */
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  /////////////////////////////////////////////////////////////////////////////
  // TODO: 03/11/2022
  // Figure out how to build and return CustomerService exceptions instead of
  // manually building the error objects here.
  /////////////////////////////////////////////////////////////////////////////
  catch(exception: HttpException | BaaSException, host: ArgumentsHost) {
    const ctx       = host.switchToHttp()
    const response  = ctx.getResponse<Response>()
    const request   = ctx.getRequest<Request>()
    const status    = exception.getStatus()
    const path      = `${request.method} ${request.url}`
    
    let   error: any

    if(exception instanceof BadRequestException) {
      let badRequest: any = exception.getResponse()
      
      error = {
        ...BaaSErrors.request.badRequest,
        path:       path,
        message:    badRequest.message,
        timestamp:  new Date().toISOString()
      }
    }
    else if(exception instanceof BaaSException) {
      error = {
        statusCode: status,
        id:         exception.id,
        code:       exception.code,
        name:       exception.name,
        path:       path,
        timestamp:  exception.timestamp,
        message:    exception.message,
      }
    }
    else {
      // Received unknown error
      error = {
        statusCode: status,
        path:       path,
        message:    exception.message
      }
    }
    this.logger.error(`Caught exception for path=[${path}], error= %o`, error)

    // Return the error
    response.status(status).json(error);
  }
}

