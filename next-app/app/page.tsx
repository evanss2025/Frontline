import Image from "next/image";
import Prompt from "../components/prompt"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col p-10 bg-stone-800">
      <header className="border border-gray-300 p-4 m-4 rounded-lg shadow-md flex justify-center">
        <img src="frontline_logo.png" alt="Frontline Logo" className="w-1/4" />
        {/* <h1 className="text-4xl font-roboto_mono text-white">Frontline</h1> */}
      </header>
      <Prompt />
      <div className="grid grid-cols-3 gap-5" w-full>
        <div className="flex-1 border p-4  bg-red-500">Number of People Affected:</div>
        <div className="flex-1border p-4 bg-red-200">Affected Species:</div>
        <div className="flex-1border p-4 bg-red-500">Casualties over Time:</div>
        <div className="flex-1border p-4 bg-red-300">Approval Rate:</div>
        <div className= "flex-1 text-white p-4 bg-stone-900">Advice:</div>
        <div className="flex-1border p-4 bg-red-300">Bottom Right</div></div>
        

        {/* <div className="flex flex-col space-y-4 w-1/4"> */}
        
        

      



      {/* <div className="grid grid-cols-3 grid-row-1">
        <div className="bg-red-900 w-4/5 m-2 p-2 min-h-screen font-[Bebas_Neue]">Summary of Crisis</div>
        <div className="bg-red-900 w-9/8 m-2 p-2 min-h-screen font-[Bebas_Neue]">Column 2</div>
        <div className="bg-red-900 w-4/5 m-2 p-2 min-h-screen font-[Bebas_Neue]">Column 3</div>
      </div> */}
    </div>
  );
}
