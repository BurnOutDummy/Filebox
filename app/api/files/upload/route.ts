import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
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
            const userFolder = await db
                .select()
                .from(files)
                .where(
                    and(eq(files.id, formParentId), eq(files.isfolder, true)),
                );
        }
    } catch (err) {}
}
