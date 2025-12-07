import { db } from "@/lib/db";
import { files, File, Files, InsertFileType } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const userID = await auth();
        if (!userID)
            NextResponse.json({ Error: "User not autherize" }, { status: 500 });
        const body = await request.json();
        const { imagekit, userId } = body;

        const date = new Date();
        if (!imagekit && !imagekit.url) {
            return NextResponse.json({
                Error: "No imagekit data",
            });
        }
        // const userKit = {
        //     name: imagekit.name || `Untitled-${date.getTime()}`,
        //     size: imagekit.size || 0,
        //     type: imagekit.fileType || "image",
        //     fileUrl: imagekit.url,
        //     path: imagekit.path || `/droply/${userId}/${imagekit.name}`,
        //     thumnailUrl: imagekit.thumnailUrl || null,
        //     userId: userId,
        //     parentId: null,
        //     isStarred: false,
        //     isfolder: false,
        //     isTrash: false,
        // };
        const fileData: InsertFileType = {
            name: imagekit.name || "Untitled",
            path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null, // Root level by default
            isfolder: false,
            isStarred: false,
            isTrash: false,
        };
        const [newfile] = await db.insert(files).values(fileData).returning();
        return NextResponse.json(newfile);
    } catch (erro) {
        return NextResponse.json({
            ERROR: "There is an error while saving the data",
        });
    }
}
