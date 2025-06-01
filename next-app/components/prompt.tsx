'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Card from "../components/card"
import { LineChart } from "../components/lineChart";
import { spec } from 'node:test/reporters';


export default function Prompt() {

  //approval rate


  

  function approvalRate(factor1: number, factor2: number, factor3: number) {
    console.log(factor1, factor2, factor3);
  }


  //add calculatepeopleaffected function 
    // random number between 0-1000(0, potentially) - JS function? - 
    // add image of "people"
    const [affectedPeople, setAffectedPeople] = useState(() => Math.floor(Math.random() * 10000));
    function getAffectedPeople(max=100000) {
        console.log("running");
        return Math.floor(Math.random() * max);
      }
      // Generate a number immediately on component mount
      useEffect(() => {
      // Generate a number immediately on mount
      setAffectedPeople(getAffectedPeople());
  
      // Set up interval to update every 30 seconds (30000 ms)
      const interval = setInterval(() => {
        setAffectedPeople(prev => {
          const next = getAffectedPeople();
          return next > prev ? next : prev; // Ensure it only increases
        });
      }, 5000);
  
      // Clean up interval on unmount
      return () => clearInterval(interval);
    }, []);

    function getDataPoints(days: number) {
      const dataPoints = [];
      for (let i = 0; i < days; i++) {
        dataPoints[i] = affectedPeople;
      }
      return dataPoints;
    }

  let nextDayClicked = 0;


  type event = {
    day: number;
    event: string;
    species: string;
    location: string;
  }

  //love me some use states ( i def did way too many)
  // this is so scuffed wow

  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<event[] | null>(null);
  const [eventName, setEventName] = useState('');
  const [day, setDay] = useState(1);
  const [decision, setDecision] = useState('');
  const [storySoFar, setStorySoFar] = useState('');
  const [species, setSpecies] = useState('');
  const [started, setStarted] = useState(false);

  const fetchTimeline = async () => {

    setStarted(true);

    nextDayClicked += 1;

    let completePrompt = '';
    const nextDayButton = document.getElementById('next_day') as HTMLButtonElement;
    const simulateDiv = document.getElementById('prompt_main') as HTMLButtonElement;
    const userDiv = document.getElementById('userInput') as HTMLButtonElement;
    const affected = document.getElementById('people_affected') as HTMLDivElement;

    affected.appendChild({affectedPeople});


    if (day == 1) {
      nextDayButton.classList.remove('hidden');
      simulateDiv.classList.add('hidden');
      userDiv.classList.remove('hidden');
      completePrompt = (`${prompt} in ${location}`);
      setStorySoFar(completePrompt);

    } else {
      const updatedStory = `${storySoFar}. User decision: ${decision}`;
      setStorySoFar(updatedStory);
      completePrompt = `the day after the previous day scenario and location: ${updatedStory} build off of the previous day 
      and the decisions made by the user, but don't repeat yourself too much.: ${decision}.`;
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
      setEventName(data.timeline[0].event);
      setSpecies(data.timeline[1].event + "\n" + data.timeline[2].event + "\n" + data.timeline[3].event + "\n");
      setEvent(data.timeline);
      console.log('Timeline data:', data.timeline);
      console.log(species);
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
            <h3 className='text-white font-bold'>Enter your apocolyptic simulation prompt:</h3>
            <input 
              id="prompt"
              className="bg-stone-900 p-3 m-2 w-full text-white" 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              >
            </input>
            
            <h3 className='text-white font-bold'>Enter the location of the scenario:</h3>

            <input
              id="location"
              className="bg-stone-900 p-3 m-2 w-full text-white" 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}

            >
            </input>
            <button 
              id="simulate"
              onClick={fetchTimeline} 
              className='bg-red-900 hover:bg-red-950 transition duration-300 text-white p-3 w-full m-2'>{loading ? 'Simulating...' : 'Start Simulation'}
            </button>
          </div>
          <div id="userInput" className='hidden'>
            <input
              type="text"
              id="decision"
              value={decision}
              className="bg-stone-900 p-3 m-2 w-full text-white"
              placeholder="Enter your decisions here..."
              onChange={(e) => setDecision(e.target.value)}
            ></input>
          </div>
          <div>
            <button 
              id="next_day"
              className='bg-red-900 text-white p-3 transition duration-300 w-full m-2 hidden hover:bg-red-950'
              onClick={() => {nextDayClicked += 1; fetchTimeline();}} 
              >Continue to Next Day
            </button>
          </div>
        </div>
        <div className='w-1/2 m-3'>
          {eventName && (
            <div>
              <ul className="space-y-2">
                  <div>
                    <h1 className="text-xl font-semibold mb-2 text-white">Day: {day - 1}</h1>
                    <li  className="border p-2 rounded bg-gray-100">
                      <strong>Report:</strong> {eventName}
                    </li>
                  </div>
                
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* cards for each different data point */}
      <div className="grid grid-cols-3 gap-5" w-full>
          <Card 
            id="people_affected"
            className="block text-7xl mt-2 text-red-400 font-mono items-center"
            title="Number of People Affected:"
            body=""
            />

          <Card
            id='species_affected'
            className=""
            title="Affected Species:"
            body={species}
          />

          <Card 
            id="casualties_over_time"
            className="bg-white"
            title="Casualties over Time:"
            body={<LineChart inputData={getDataPoints(day - 1)} day={1} />}
            
          />

          <Card 
            id="approval_rate"
            className=""
            title="Approval Rate:"
            body="placeholder"
          />

          <Card 
            id="advice"
            className=""
            title="Advice:"
            body="placeholder"
          />

          <Card 
            id="supplies"
            className=""
            title="Supplies:"
            body="placeholder"
          />
          
        </div>
    </div>

  );
}
