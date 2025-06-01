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
             The user is going to make decisions based on this report, so it should be detailed and informative and should be written in a way that prompts the user to make decisions.
             It is also important to teach the user about the local animal and plant species in the area, so include information about them and how they are affected by the apocalypse.
             Also provide a  list of animal and plant species that are affected by the apocalypse in the given scenario. Each species should be a bullet point.
             keep the list conscise. Start the list with an asterisk (*). Do not say "Here is a list of species affected by the apocalypse" or anything similar. Do not
             introduce the list in any way, just start with the asterisk. Instead, describe the species affected in the report and describe what they are quickly, then list them. Do not
             just talk about the environment though, also include the events that happened that day.
             The report should be concise and to the point, but also detailed enough to give the user a good understanding of what happened that day.
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
      .split("*")
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
