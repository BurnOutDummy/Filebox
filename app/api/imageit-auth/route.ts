import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import imageKit from "imagekit";
var imagekit = new imageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});
export async function GET() {
    try {
        const userID = await auth();
        if (!userID) NextResponse.json({ error: "Unautherize user" });
        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error) {
        return NextResponse.json(
            {
                error: "There is an error while auth",
            },
            { status: 500 },
        );
    }
}
