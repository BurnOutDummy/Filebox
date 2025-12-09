import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { image } from "@heroui/theme";

var imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});
export async function PATCH(req: NextRequest) {
    try {
        const { userId } = await auth();
        const { filesObjects } = await req.json();
        const filesId = filesObjects.map(
            (filesObject: { id: string }) => filesObject.id,
        );
        if (filesId === 0) {
            return;
        }
        if (!userId) {
            return NextResponse.json(
                { Error: "Unauthorized access" },
                { status: 401 },
            );
        }
        const imagekitFiles = imagekit.bulkDeleteFiles(filesId);
        if (!imagekitFiles) {
            return;
        }

        const deletedtrashs = await db
            .delete(files)
            .where(and(eq(files.userId, userId), eq(files.isTrash, true)))
            .returning();
        if (deletedtrashs.length === 0) {
            return NextResponse.json(
                { Error: "Files not found" },
                { status: 404 },
            );
        }
        return NextResponse.json(deletedtrashs);
    } catch (error) {
        return NextResponse.json(
            { Error: "Error while deleting files" },
            { status: 500 },
        );
    }
}
