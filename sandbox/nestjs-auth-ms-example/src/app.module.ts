import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourceLoopMiddleware } from './sourceloop.middleware';
import { PhonesModule } from './phones/phones.module';

@Module({
  imports: [PhonesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SourceLoopMiddleware)
      .forRoutes(...global.sourceloop.reservedPaths);
  }
}
