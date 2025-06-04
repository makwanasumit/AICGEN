// app/api/save-subscription/route.ts
import { db } from '@/db/connection';
import { UserSubscription } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { paymentId } = await req.json();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const result = await db.insert(UserSubscription).values({
      email: user.primaryEmailAddress.emailAddress,
      username: user.primaryEmailAddress.emailAddress?.split('@')[0],
      active: true,
      paymentId,
      joinDate: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ error: 'Error saving subscription' }, { status: 500 });
  }
}
