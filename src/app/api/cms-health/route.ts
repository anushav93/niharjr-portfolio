import { NextResponse } from 'next/server';
import { getEntry } from '@/lib/contentful';
import { CONTENTFUL_ENTRIES } from '@/config/contentful';
import type { SiteSettingsFields } from '@/types/contentful';

export async function GET() {
  const entry = await getEntry<SiteSettingsFields>(CONTENTFUL_ENTRIES.siteSettings);
  return NextResponse.json({ ok: !!entry });
}
