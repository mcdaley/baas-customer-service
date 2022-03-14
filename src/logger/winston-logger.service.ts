//-----------------------------------------------------------------------------
// src/logger.winston-logger.service.ts
//-----------------------------------------------------------------------------
import { Injectable }     from '@nestjs/common'
import { LoggerService }  from '@nestjs/common'
import { ConfigService }  from '@nestjs/config'
import winston, { 
  createLogger,
  format, 
  transports, 
  Logger, 
}                         from 'winston'


const { combine, timestamp, label, printf } = format
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] [${label}]: ${message}`;
})


/**
 * @class WinstonLoggerService
 */
@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger:   Logger
  private options:  any

  constructor(private readonly configService: ConfigService) {
    // Define logging options.
    this.options = {
      file: {
        level:            configService.get('logLevel'),
        filename:         `${configService.get('appRoot')}/logs/${configService.get('NODE_ENV')}.log`,
        handleExceptions: true,
        json:             true,
        maxsize:          5242880,      // 5MB
        maxFiles:         5,
        colorize:         false,
        format:           combine(
          format.splat(),
          format.json(),
          label({ label: configService.get('appName') }),
          timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          }),
          logFormat,
        ),
      },
      console: {
        level:            configService.get('logLevel'),
        handleExceptions: true,
        exitOnError:      false,
        json:             false,
        colorize:         true,
        format:           combine(
          format.colorize(),
          format.splat(),
          label({ label: configService.get('appName') }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          logFormat,
        )
      },
    }

    this.logger = this.initLogger()
  }

  /**
   * @method initLogger
   */
  private initLogger() {
    return createLogger({
      transports: [
        new transports.File(this.options.file),
        new transports.Console(this.options.console)
      ],
    })
  }

  /**
   * @method log
   */
  public log(message: any, ...optionalParams: any[]) {
    if(typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.info(msg as string, { ...meta })
    }
    return this.logger.info(message, optionalParams)
  }

  /**
   * @method error
   */
  public error(message: any, ...optionalParams: any[]) {
    if(typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, { ...meta })
    }
    return this.logger.error(message, optionalParams)
  }

  /**
   * @method warn
   */
  public warn(message: any, ...optionalParams: any[]) {
    if(typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { ...meta })
    }
    return this.logger.warn(message, optionalParams)
  }

  /**
   * @method debug
   */
  public debug?(message: any, ...optionalParams: any[]) {
    if(typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { ...meta })
    }
    return this.logger.debug(message, optionalParams)
  }

  /**
   * @method verbose
   */
  public verbose?(message: any, ...optionalParams: any[]) {
    if(typeof message === 'object') {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { ...meta })
    }
    return this.logger.verbose(message, optionalParams)
  }
}