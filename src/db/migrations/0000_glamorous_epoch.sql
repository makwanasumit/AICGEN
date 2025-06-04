CREATE TABLE "aiOutput" (
	"id" serial PRIMARY KEY NOT NULL,
	"formData" varchar(2048) NOT NULL,
	"aiResponse" text NOT NULL,
	"templateSlug" varchar(255) NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL
);
