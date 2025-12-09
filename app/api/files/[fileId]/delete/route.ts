import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> },
) {
    try {
        const { fileId } = await params;
    } catch (error) {}
}
