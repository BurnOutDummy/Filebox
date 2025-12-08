import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files, InsertFileType } from "@/lib/db/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { GalleryThumbnails } from "lucide-react";
var imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { Error: "Unautherize access" },
                { status: 401 },
            );
        }

        const formdata = await req.formData();
        const file = formdata.get("file") as File;
        const formUserId = formdata.get("userId") as string;
        const formParentId = (formdata.get("parentId") as string) || null;
        if (!formUserId || formUserId !== userId) {
            return NextResponse.json(
                {
                    Error: "Unautherize User",
                },
                { status: 401 },
            );
        }
        if (!file) {
            return NextResponse.json(
                { Error: "File not provided" },
                { status: 400 },
            );
        }
        if (formParentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, formParentId),
                        eq(files.isfolder, true),
                        eq(files.userId, userId),
                    ),
                );
            if (!parentFolder) {
                return NextResponse.json(
                    { Error: "ParentId not found" },
                    { status: 401 },
                );
            }
        }
        if (!formParentId) {
            const [userData] = await db
                .select()
                .from(files)
                .where(and(eq(files.userId, userId)));
        }
        if (
            !file.type.startsWith("image/") &&
            file.type !== "application/pdf"
        ) {
            return NextResponse.json({ error: "Wrong file type" });
        }

        const buffer = await file.arrayBuffer(); // get a array of raw data or we can say buffer from browers
        const fileBuffer = Buffer.from(buffer); // convert into buffer which node js can parse
        const folderPath = formParentId
            ? `/filebox/${userId}/folder/${formParentId}`
            : `/filebox/${userId}`;
        const originalname = file.name;
        //Checking file extension
        const fileExtension = originalname.split(".").pop() || "";
        if (
            fileExtension !== "png" &&
            fileExtension !== "jpeg" &&
            fileExtension !== "jpg" &&
            fileExtension !== "pdf"
        ) {
            return NextResponse.json(
                {
                    Error: "Wrong file type",
                },
                { status: 401 },
            );
        }
        const uniquefileName = `${v4()}.${fileExtension}`;
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniquefileName,
            folder: folderPath,
            useUniqueFileName: false,
        });

        const fileData: InsertFileType = {
            name: originalname,
            path: uploadResponse.filePath,
            type: file.type,
            size: file.size,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            userId: userId,
            parentId: formParentId,
        };
        const [dbresponeFile] = await db
            .insert(files)
            .values(fileData)
            .returning();
        return NextResponse.json(dbresponeFile);
    } catch (err) {
        return NextResponse.json({ Error: "Problem during storing file" });
    }
}
