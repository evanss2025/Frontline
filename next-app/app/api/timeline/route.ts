import { NextRequest, NextResponse } from 'next/server';

type TimelineEvent = {
  day: number;
  event: string;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, day } = await req.json();

    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You simulate apocalypse timelines in a government-style daily report',
          },
          {
            role: 'user',
            content: `Create a singular report of a 1-day simulation based on this previous day scenario and location: ${prompt}. The report should include
             the time, and a summary of what happened that day. The report should build off of the previous day and the decisions
             made by the user. Format it as "Time: [Event description]". Use 12-hour time format. Include details about the city
            in the summary. The report should include the time, and a summary of what happened. Only output a single sentence in this format:
             "Time: [Event description]". Do NOT include multiple reports or headings. Use the current year and 12-hour time format. No dates or years should be listed.
             `,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Hack Club AI Error:', response.statusText);
      return NextResponse.json({ error: 'Failed to generate timeline' }, { status: 500 });
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || '';

    // Split text into non-empty lines
    const lines: string[] = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const timeline: TimelineEvent[] = lines.map((line: string, index: number) => ({
      day: day,
      event: line,
    }));

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
