import { NestFactory } from '@nestjs/core'
import { WinstonLoggerService, winstonLogger, winstonStream } from './core/winston'
import * as morgan from 'morgan'

import { AppModule } from './app.module'

async function bootstrap () {
  const port = process.env.PORT
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
  })
  app.use(morgan('tiny', { stream: winstonStream }))
  app.setGlobalPrefix('api/v1')
  await app.listen(port)
  winstonLogger.info("Running on PORT => %s", port)
}
bootstrap()
