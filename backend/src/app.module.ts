import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ExamsModule } from './modules/exams/exams.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TopicsModule } from './modules/topics/topics.module';
import { NotesModule } from './modules/notes/notes.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TestsModule } from './modules/tests/tests.module';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { PlansModule } from './modules/plans/plans.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdsModule } from './modules/ads/ads.module';
import { BlogModule } from './modules/blog/blog.module';
import { MediaModule } from './modules/media/media.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ResultsModule } from './modules/results/results.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ExamsModule,
    SubjectsModule,
    TopicsModule,
    NotesModule,
    QuestionsModule,
    TestsModule,
    AttemptsModule,
    PlansModule,
    OrdersModule,
    CouponsModule,
    BookmarksModule,
    NotificationsModule,
    SupportModule,
    AuditModule,
    AdsModule,
    BlogModule,
    MediaModule,
    DashboardModule,
    ResultsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
