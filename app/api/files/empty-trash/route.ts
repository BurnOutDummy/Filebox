import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { file } from "zod";
import { data } from "framer-motion/client";
import { user } from "@heroui/theme";
var imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});
export async function PATCH(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                {
                    Error: "Unauthrozie User",
                },
                {
                    status: 401,
                },
            );
        }
        const trashfiles = await db
            .select()
            .from(files)
            .where(and(eq(files.userId, userId), eq(files.isTrash, true)));
        if (trashfiles.length === 0) {
            return NextResponse.json(
                {
                    Error: "No trash files found",
                },
                { status: 404 },
            );
        }
        const trashfilesId = trashfiles.map((trashfile) => {
            return trashfile.;
        });
        const deletedfilesImageKit =
            // Do it better 
            await imagekit;
        if (!deletedfilesImageKit) {
            return NextResponse.json(
                {
                    Error: "Fail to delete the files ",
                },
                { status: 500 },
            );
        }
        const finallDelete = await db
            .delete(files)
            .where(and(eq(files.userId, userId), eq(files.isTrash, true)));
        if (!finallDelete) {
            return NextResponse.json({ Error: "Fail to delete files " });
        }
        return NextResponse.json(
            {
                Success: "The delete Process was successful",
                delete: finallDelete,
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ Error: error });
    }
}
