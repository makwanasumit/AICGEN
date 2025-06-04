ALTER TABLE "userSubscription" DROP CONSTRAINT "userSubscription_email_unique";--> statement-breakpoint
ALTER TABLE "userSubscription" DROP CONSTRAINT "userSubscription_username_unique";--> statement-breakpoint
ALTER TABLE "userSubscription" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "userSubscription" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "userSubscription" ALTER COLUMN "username" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "userSubscription" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "userSubscription" ALTER COLUMN "active" DROP NOT NULL;