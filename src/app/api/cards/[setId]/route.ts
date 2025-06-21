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
    const apiUrl = `https://api.tcgdex.net/v2/en/sets/${setId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`TCGdex API error: ${response.status}`, errorData);
      return NextResponse.json(
        { error: `Failed to fetch from TCGdex API: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy API route error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
