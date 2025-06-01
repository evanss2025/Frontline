'use client';
import React from 'react';
import Prompt from "../components/prompt"
import { LineChart } from "../components/lineChart";
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col p-10 bg-stone-800">
      <header className="border border-gray-300 p-4 m-4 shadow-md flex justify-center">
        <img src="frontline_logo.png" alt="Frontline Logo" className="w-1/4" />
        {/* <h1 className="text-4xl font-roboto_mono text-white">Frontline</h1> */}
      </header>
      <Prompt />

    </div>

        

  );
}
