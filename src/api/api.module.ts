import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    UserModule,
    HealthModule,
    AuthModule,
    HomeModule,
    PostModule,
    AuditLogModule,
  ],
})
export class ApiModule {}
