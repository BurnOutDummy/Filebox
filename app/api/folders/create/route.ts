import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, InsertFileType } from "@/lib/db/schema";
import { v4 } from "uuid";

export default async function POST(req: NextRequest) {
    try {
        const userID = await auth();
        if (!userID.userId) NextResponse.json({ Error: "Unauth user " });
        const body = await req.json();
        const { userId, foldername, filePath, fileUrl, parentId } = body;
        const [parentFolder] = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.id, parentId),
                    eq(files.userId, userId),
                    eq(files.isfolder, true),
                ),
            );
        if (!parentFolder) {
            return NextResponse.json({
                Error: "No parentId found",
            });
        }
        const folder: InsertFileType = {
            name: foldername || "Untitled",
            path: `/folders/${userId}/${v4()}`,
            size: 0,
            type: "folder",
            fileUrl: fileUrl,
            thumbnailUrl: null,
            userId: userId,
            parentId: parentId, // Root level by default
            isfolder: true,
            isStarred: false,
            isTrash: false,
        };

        const [newFolder] = await db.insert(files).values(folder).returning();
        return NextResponse.json(newFolder);
    } catch (err) {
        return NextResponse.json(
            {
                Error: "There is an erro",
            },
            { status: 500 },
        );
    }
}
