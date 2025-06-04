import { Button } from "@/components/ui/button";
import { db } from "@/db/connection";
import { AIOutput } from "@/db/schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import HistoryList from "./_components/HistoryList";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

// ✅ Add this to force runtime data fetching:
export const dynamic = 'force-dynamic';

export default async function Page() {
    const user = await currentUser();
    const history = await db.select().from(AIOutput).orderBy(AIOutput.createdAt).where(
        eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress ?? '')
    );
    if (user === null) {
        redirect("/sign-in")
    }
    return (
        <div className="p-6">
            <Link href="/dashboard">
                <Button className="mb-6 p-5 bg-gray-700 hover:bg-gray-900 transition-all text-white duration-150">
                    <ArrowLeft />Back
                </Button>
            </Link>
            <HistoryList history={history} />
        </div>
    );
}
