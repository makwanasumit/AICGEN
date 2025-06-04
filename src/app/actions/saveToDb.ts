'use server';
import { db } from '@/db/connection';
import { AIOutput } from '@/db/schema';
import { eq } from 'drizzle-orm';
import moment from 'moment';

export async function SaveToDb({
  formData,
  templateSlug,
  aiResponse,
  createdBy,
}: {
  formData: string;
  templateSlug: string;
  aiResponse: string;
  createdBy: string;
}) {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  // Insert the new row
  await db.insert(AIOutput).values({
    formData,
    templateSlug,
    aiResponse,
    createdBy,
    createdAt: now,
    updatedAt: now,
  });

  // Select back the latest matching row (optional: filter by createdBy + templateSlug if needed)
  const result = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, createdBy))
    .orderBy(AIOutput.createdAt) // or another unique column
    .limit(1);

  // Safely serialize the result to avoid Next.js errors
  return JSON.parse(JSON.stringify(result[0]));
}
