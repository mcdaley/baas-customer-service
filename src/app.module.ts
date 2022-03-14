//-----------------------------------------------------------------------------
// src/app.module.ts
//-----------------------------------------------------------------------------
import { Module }                   from '@nestjs/common'
import { ConfigModule }             from '@nestjs/config'

import { configuration, validate }  from './config/configuration'
import { AppController }            from './app.controller'
import { AppService }               from './app.service'

import { CustomersModule }          from './customers/customers.module'
import { AddressesModule }          from './addresses/addresses.module'
import { WinstonLoggerModule }      from './logger/winston-logger.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:  `./.env.${process.env.NODE_ENV}`,
      isGlobal:     true,
      load:         [configuration],
      validate,
    }), 
    CustomersModule, 
    AddressesModule,
    WinstonLoggerModule,
  ],
  controllers:  [AppController],
  providers:    [AppService],
})
export class AppModule {}
