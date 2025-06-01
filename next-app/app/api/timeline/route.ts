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
             Also provide a list of animal and plant species that are affected by the apocalypse in the given scenario.
             keep the list conscise. Start the list with an asterisk (*). Do not say "Here is a list of species affected by the apocalypse" or anything similar. Do not
             introduce the list in any way, just start with the asterisk. Instead, describe the species affected in the report and describe what they are quickly, then list them. Do not
             just talk about the environment though, also include the events that happened that day. ALL animals and species need to be on one line. Only list the species, dont provide any other information about them.
             it needs to be ONLY on one line, so do not use any new lines or paragraphs. Do not use any bullet points or lists, just a single line with the species.

             Then provide a percent out of
             100 of how well the user is doing in the simulation, based on the decisions made so far. The percent should be based on how well the user is doing in the simulation, and should be a number between 0 and 100.
             The percent should be based on the user's decisions about the environment, the people affected, damanage to the city, and resolving the situation. Seperate this value with an asterix before the percent, like this: "* 85%" Only output the percent, do not say "The user is doing this well" or anything similar, just the percent with the asterisk before it.
             
             Based on each report, generate some advice as to how the user could proceed from the generated report and how they can survive the situation
             better. The advice should be concise and to the point, but also detailed enough to give the user a good understanding of what they can do to improve their situation.
             The advice should be based on the user's decisions about the environment, ethics, the people affected, damage to the city, and resolving the situation. Start this advice with an asterisk (*), and do not say "Here is some advice" or anything similar, just start with the asterisk.
             Keep is short and concise so that the user makes their own decisions, but also give them enough information to make informed decisions.
             
             In addition, provide a list of some supplies that
             that the user should try to find in order to survive the situation. The supplies should be based on the user's decisions about the environment, the people affected, damage to the city, and resolving the situation.
             The supplies should be a list of 3-5 items, and should be separated by commas. Do not say "Here is a list of supplies" or anything similar, just start with the list. Start the list with an asterisk (*).
             
             Each section should be one line each, and there should only be 5 lines in total. Only 5 lines in total, no more, no less.
             The first line should be the report, the second line should be the species affected, the third line should be the percent, the fourth line should be the advice, and the fifth line should be the supplies.
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
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Ensure it's only 5 lines max

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
