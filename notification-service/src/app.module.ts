import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [NotificationsModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'notifications',
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
