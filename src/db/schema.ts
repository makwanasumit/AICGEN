import { boolean, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    formData: varchar('formData').notNull(),
    aiResponse: text('aiResponse').notNull(),
    templateSlug: varchar('templateSlug', { length: 255 }).notNull(),
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
    createdAt: varchar('createdAt', { length: 255 }).notNull(),
    updatedAt: varchar('updatedAt', { length: 255 }).notNull(),
});


export const UserSubscription = pgTable('userSubscription', {
    id: serial('id').primaryKey(),
    email: varchar('email'),
    username: varchar('username'),
    active: boolean('active'),
    paymentId: varchar('paymentId'),
    joinDate: varchar('joinDate'),
})

