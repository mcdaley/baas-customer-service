//-----------------------------------------------------------------------------
// src/main.ts
//-----------------------------------------------------------------------------
import { NestFactory }          from '@nestjs/core'
import { ConfigService }        from '@nestjs/config'
import { 
  ValidationPipe, 
  VersioningType, 
}                               from '@nestjs/common'

import { AppModule }            from './app.module'
import { WinstonLoggerService } from './logger/winston-logger.service'
import { HttpExceptionFilter }  from './common/http-exception.filter'

/**
 * @function bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })

  app.enableVersioning({type: VersioningType.URI })
  app.useLogger(app.get(WinstonLoggerService))

  // Validation pipeline to validate requests
  app.useGlobalPipes(new ValidationPipe({ 
    transform:            true, 
    whitelist:            true,  
    forbidNonWhitelisted: true,
  }))

  // Load app configuration
  const configService = app.get(ConfigService)
  
  // Global filter to catch all HttpExceptions
  const logger        = app.get(WinstonLoggerService)
  app.useGlobalFilters(new HttpExceptionFilter(logger))

  const port = configService.get('port')
  logger.log(`Starting [${configService.get('appName')}] on port=[${port}]`)
  
  await app.listen(port);
}


bootstrap()

