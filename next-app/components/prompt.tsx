'use client';

import React from 'react';
import { useState } from 'react';

export default function Prompt() {

  let nextDayClicked = 0;


  type event = {
    day: number;
    event: string;
    location: string;
  }

  //love me some use states

  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<event[] | null>(null);
  const [day, setDay] = useState(1);
  const [decision, setDecision] = useState('');
  const [storySoFar, setStorySoFar] = useState('');

  const fetchTimeline = async () => {

    nextDayClicked += 1;

    let completePrompt = '';
    const nextDayButton = document.getElementById('next_day') as HTMLButtonElement;
    const simulateDiv = document.getElementById('prompt_main') as HTMLButtonElement;
    const userDiv = document.getElementById('userInput') as HTMLButtonElement;
    const decisionInput = document.getElementById('decision') as HTMLInputElement;


    if (day == 1) {
      nextDayButton.classList.remove('hidden');
      simulateDiv.classList.add('hidden');
      userDiv.classList.remove('hidden');
      completePrompt = (`${prompt} in ${location}`);
      setStorySoFar(completePrompt);

    } else {
      const updatedStory = `${storySoFar}. User decision: ${decision}`;
      setStorySoFar(updatedStory);
      completePrompt = `the day after the previous day scenario and location: ${updatedStory} build off of the previous day and the decisions made by the user: ${decision}.`;
    }


    setPrompt(completePrompt);

    console.log(`storysofar:${storySoFar}completepromt:${completePrompt}decision:${decision}`);

    setLoading(true);
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: completePrompt, day }),
      });

      const data: { timeline: event[] } = await res.json();
      setDay(day + 1);
      setEvent(data.timeline);
    } catch (err) {
      console.error('Error fetching timeline:', err);
    } finally {
      setDecision('');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex m-3 justify-center w-full">
        <div className="flex flex-col m-3 mr-10 w-1/2">
          <div id="prompt_main">
            <h3 className='text-white'>Enter your apocolyptic simulation prompt:</h3>
            <input 
              id="prompt"
              className="bg-stone-900 p-3 rounded-xl m-2 w-full text-white" 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              >
            </input>
            
            <h3 className='text-white'>Enter the location of the scenario:</h3>

            <input
              id="location"
              className="bg-stone-900 p-3 rounded-xl m-2 w-full text-white" 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}

            >
            </input>
            <button 
              id="simulate"
              onClick={fetchTimeline} 
              className='bg-red-900 text-white p-3 rounded-xl w-full m-2'>{loading ? 'Simulating...' : 'Start Simulation'}
            </button>
          </div>
          <div id="userInput" className='hidden'>
            <input
              type="text"
              id="decision"
              value={decision}
              className="bg-stone-900 p-3 rounded-xl m-2 w-full text-white"
              placeholder="Enter your decisions here..."
              onChange={(e) => setDecision(e.target.value)}
            ></input>
          </div>
          <div>
            <button 
              id="next_day"
              className='bg-red-900 text-white p-3 rounded-xl w-full m-2 hidden'
              onClick={() => {nextDayClicked += 1; fetchTimeline();}} 
              >Continue to Next Day
            </button>
          </div>
        </div>
        <div className='w-1/2 m-3'>
          {event && (
            <div>
              <ul className="space-y-2">
                {event.map((event, idx) => (
                  <div>
                    <h1 className="text-xl font-semibold mb-2 text-white">Day: {event.day}</h1>
                    <li key={idx} className="border p-2 rounded bg-gray-100">
                      <strong>Report:</strong> {event.event}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
