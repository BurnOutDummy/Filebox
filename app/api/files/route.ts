import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files, InsertFileType, SelectFileType } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ Error: ":Unautherize User" });
    try {
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");
        const parentId = searchParams.get("parentId");
        if (userId !== queryUserId) {
            return NextResponse.json({ Error: "Unautherize" }, { status: 401 });
        }
        if (parentId) {
            const userFiles = await db
                .select()
                .from(files)
                .where(
                    and(eq(files.userId, userId), eq(files.parentId, parentId)),
                );
            return NextResponse.json(userFiles, { status: 200 });
        } else {
            const userFiles = await db
                .select()
                .from(files)
                .where(and(eq(files.userId, userId), isNull(files.parentId)));
            return NextResponse.json(userFiles, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json(
            { Error: "Error While Fetching files" },
            { status: 401 },
        );
    }
}
