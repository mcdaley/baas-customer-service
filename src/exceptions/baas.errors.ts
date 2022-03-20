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
  axios: {
    internalError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       1003,
      name:       'Axios Internal Error',
    }
  },
  customer: {
    invalidRegistration: {
      httpStatus: HttpStatus.BAD_REQUEST,
      code:       2001,
      name:       `Invalid Customer Registration`,
    },
    unauthorized: {
      httpStatus: HttpStatus.UNAUTHORIZED,
      code:       2002,
      name:       `Customer is Unauthorized`,
    },
    forbidden: {
      httpStatus: HttpStatus.FORBIDDEN,
      code:       2003,
      name:       `Customer is Forbidden`,
    },
    notFound: {
      httpStatus: HttpStatus.NOT_FOUND,
      code:       2004,
      name:       `Customer Not Found`,
    },
    internalError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       2010,
      name:       `Internal Customer Error`,
    },
    unknownError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       2011,
      name:       `Unknown Customer Error`,
    },
  },
  resource: {
    unauthorized: {
      httpStatus: HttpStatus.UNAUTHORIZED,
      code:       3002,
      name:       `Unauthorized`,
    },
    forbidden: {
      httpStatus: HttpStatus.FORBIDDEN,
      code:       3003,
      name:       `Forbidden`,
    },
    notFound: {
      httpStatus: HttpStatus.NOT_FOUND,
      code:       3004,
      name:       `Resource Not Found`,
    },
    internalError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       3010,
      name:       `Internal Resource Error`,
    },
    unknownError: {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code:       3011,
      name:       `Unknown Resource Error`,
    },
  },
}