import { NextRequest, NextResponse } from 'next/server';
import { resolveChannelId, fetchChannelStats } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 },
    );
  }

  try {
    const channelId = await resolveChannelId(url);
    const channel = await fetchChannelStats(channelId);
    return NextResponse.json(channel);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch channel';
    console.error('Channel resolve error:', message, '| URL:', url);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
