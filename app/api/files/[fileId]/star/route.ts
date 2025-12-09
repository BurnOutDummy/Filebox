import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> },
) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            {
                Error: "Unauthorize User",
            },
            { status: 401 },
        );
    }
    try {
        const { fileId } = await params;
        const [file] = await db
            .select()
            .from(files)
            .where(and(eq(files.id, fileId), eq(files.userId, userId)));
        if (!file) {
            return NextResponse.json(
                {
                    Error: "File not Found",
                },
                { status: 400 },
            );
        }
        const [updatedfile] = await db
            .update(files)
            .set({ isStarred: !file.isStarred })
            .where(and(eq(files.id, fileId), eq(files.userId, userId)))
            .returning();
        return NextResponse.json(updatedfile);
    } catch (error) {
        return NextResponse.json(
            { Error: "Error while updating the file" },
            { status: 500 },
        );
    }
}
