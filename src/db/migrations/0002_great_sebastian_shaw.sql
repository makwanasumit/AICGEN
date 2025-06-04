CREATE TABLE "userSubscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"active" boolean NOT NULL,
	"paymentId" varchar,
	"joinDate" varchar,
	CONSTRAINT "userSubscription_email_unique" UNIQUE("email"),
	CONSTRAINT "userSubscription_username_unique" UNIQUE("username")
);
