//-----------------------------------------------------------------------------
// src/config/winston.ts
//-----------------------------------------------------------------------------
import { format, transports } from 'winston'

const { combine, timestamp, label, printf } = format
const connextBankAppFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] [${label}]: ${message}`;
})

// Configure loggin options
let appName = process.env.APP_NAME || 'ConNext Bank'
let appRoot = process.cwd()
let options = {
  file: {
    level:            'debug',
    filename:         `${appRoot}/logs/${process.env.NODE_ENV}.log`,
    handleExceptions: true,
    exitOnError:      false,
    json:             true,
    maxsize:          5242880, // 5MB
    maxFiles:         5,
    colorize:         false,
    format:           combine(
      label({ label: appName }),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.splat(),
      format.json(),
      connextBankAppFormat,
    ),
  },
  console: {
    level:            'debug',
    handleExceptions: true,
    exitOnError:      false,
    json:             false,
    colorize:         true,
    format:           combine(
      format.colorize(),
      format.splat(),
      label({ label: appName }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      connextBankAppFormat,
    )
  },
}

/**
 * Export the winston configuration
 */
export const winstonConfig = {
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
}
