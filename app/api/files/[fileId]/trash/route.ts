import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> },
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { Error: "Unauthorize User" },
                { status: 401 },
            );
        }
    } catch (error) {}
}
