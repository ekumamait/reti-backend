import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ProductsModule } from './products/products.module';
import { JobsModule } from './jobs/jobs.module';
import { InspirationsModule } from './inspirations/inspirations.module';
import { MentorshipSessionsModule } from './mentorship-sessions/mentorship-sessions.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
    NotificationsModule,
    ConversationsModule,
    ProductsModule,
    JobsModule,
    InspirationsModule,
    MentorshipSessionsModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
