import { db } from "@/db/connection";
import { AIOutput } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, user.primaryEmailAddress.emailAddress));

    const totalUsage = result.reduce((total, item) => {
      return total + (item.aiResponse?.length || 0);
    }, 0);

    return NextResponse.json({ totalUsage });
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}