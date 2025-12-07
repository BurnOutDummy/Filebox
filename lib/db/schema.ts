import {
    pgTable,
    text,
    boolean,
    uuid,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export type Files = {
    name: string;
    path: string;
    size: number;
    type: string;
    fileUrl: string;
    userId: any;
    thumnailUrl: string;
    parentId?: string | null;
    isFolder?: boolean;
    isStarred?: boolean;
    isTrash?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(), // document/project/fils.name
    size: integer("size").notNull(),
    type: text("type").notNull(),

    fileUrl: text("file_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),

    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"), // Parent folder  if (null for root items)

    isfolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),
    // Time
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// cool as shit bruh i didn't ever thing about this,Dam people are smart
// Just my making hirachical structure we are able to do this
/*
 *  ParentID store the parent-> id  if not it could be null
 *  but here code is bit different and quite deceving cause children should have the field where you should define the relations
 *  here parent is one where it ref is define
 */

export const fileRelation = relations(files, ({ one, many }) => ({
    parent: one(files, { fields: [files.parentId], references: [files.id] }),
    children: many(files),
}));
export type SelectFileType = typeof files.$inferSelect;
export type InsertFileType = typeof files.$inferInsert;
