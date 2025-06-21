import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { setId: string } }
) {
  const { setId } = context.params;

  if (!setId) {
    return NextResponse.json({ error: 'Set ID is required' }, { status: 400 });
  }

  try {
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`;
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // cache for 1 hour

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`pokemontcg.io API error: ${response.status}`, errorData);
      return NextResponse.json(
        { error: `Failed to fetch from pokemontcg.io API: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // The pokemontcg.io API wraps the card list in a 'data' property
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Proxy API route error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
