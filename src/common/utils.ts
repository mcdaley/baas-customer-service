//-----------------------------------------------------------------------------
// src/common/utils.ts
//-----------------------------------------------------------------------------
import { v4 as uuidv4 } from 'uuid'

/**
 * @function uuid
 */
export const uuid = (): string => {
  return uuidv4()
}
