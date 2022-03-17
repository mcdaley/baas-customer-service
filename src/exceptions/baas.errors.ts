//-----------------------------------------------------------------------------
// src/exceptions/baas.errors.ts
//-----------------------------------------------------------------------------
import { HttpStatus } from "@nestjs/common";

/**
 * Define all of the customer-service errors that can occur in the microservice.
 * For each error define the httpStatus, integer code and name of the error.
 * The errors should be grouped by the resource or a common theme.
 */
export const BaaSErrors = {
  headers: {
    invalidIdempotencyKey: {
      httpStatus: HttpStatus.BAD_REQUEST,
      code:       1001,
      name:       `Invalid Idempotency-Key`
    },
  },
  request: {
    badRequest: { 
      httpStatus: HttpStatus.BAD_REQUEST,
      code:       1002,
      name:       'Bad Request',
    }
  },
  customer: {
    invalidRegistration: {
      httpStatus: HttpStatus.BAD_REQUEST,
      code:       2001,
      name:       `Invalid Customer Registration`,
    },
    internalError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       2002,
      name:       `Internal Customer Error`,
    },
    notFound: {
      httpStatus: HttpStatus.NOT_FOUND,
      code:       2003,
      name:       `Customer Not Found`,
    },
  }
}