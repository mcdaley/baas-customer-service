//-----------------------------------------------------------------------------
// src/common/idempotency-key.decorator.ts
//-----------------------------------------------------------------------------
import { 
  createParamDecorator, 
  ExecutionContext,
}                               from '@nestjs/common'
import { 
  validate as uuidValidate,
}                               from 'uuid'

import { ClientErrors }         from '../exceptions/client.errors'
import { 
  InvalidIdempotencyKeyError, 
}                               from '../exceptions/client-service.exceptions'

/**
 * @function isValidUUID
 * @param    {string} uuid
 * @returns  {boolean} - Returns true if string is a valid UUID else returns false
 */
const isValidUUID = (uuid: string) : boolean => {
  return uuidValidate(uuid)
}

/**
 * Custom decorator to extract the Idempotency-Key from the request header amd
 * to return it. If the idempotency key is not valid then it throws a Bad
 * Request exception.
 * 
 * Implementing the IdempotencyKey decorator so that I can send a custom
 * error message to the caller.
 */
export const IdempotencyKey = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request         = ctx.switchToHttp().getRequest()
  const { headers }     = request

  const idempotencyKey  = headers['idempotency-key']
  if(!idempotencyKey) {
    throw new InvalidIdempotencyKeyError(
      ClientErrors.headers.invalidIdempotencyKey, 
      `Idempotency-Key is required`
    )
  }

  if(!isValidUUID(idempotencyKey)) {
    throw new InvalidIdempotencyKeyError(
      ClientErrors.headers.invalidIdempotencyKey, 
      `Invalid Idempotency-Key=[${idempotencyKey}]`
    )
  }

  return idempotencyKey
})