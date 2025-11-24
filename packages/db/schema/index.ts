import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const roomsTable = pgTable("rooms", {
  id: uuid('id').primaryKey().defaultRandom(),
  elements: text('elements').notNull(),
  random_username: text('random_username').notNull(),
  is_shared: boolean('is_shared').notNull().default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Room = typeof roomsTable.$inferSelect;
export type RoomInsert = typeof roomsTable.$inferInsert;
export type RoomUpdate = Partial<RoomInsert>;