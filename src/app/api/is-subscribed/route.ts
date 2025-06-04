import { db } from "@/db/connection";
import { UserSubscription } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
        return NextResponse.json({ subscribed: false }, { status: 401 });
    }

    const result = await db
        .select()
        .from(UserSubscription)
        .where(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress));

    const isActive = result.length > 0 && result[0].active === true;

    return NextResponse.json({ subscribed: isActive });
}

