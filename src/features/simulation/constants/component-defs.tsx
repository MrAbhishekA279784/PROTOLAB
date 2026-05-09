import React from "react";

export const COMPONENT_DEFS: Record<string, any> = {
  resistor: {
    name: "Resistor", type: "Basic",
    width: 80, height: 20,
    pins: [ { id: "p1", x: 0, y: 10 }, { id: "p2", x: 80, y: 10 } ],
    render: () => (
      <div className="flex items-center w-[80px] h-[20px] pointer-events-none">
        <div className="w-5 h-1.5 bg-[#a3b1c6] rounded-l-sm border-y border-[#708090]" />
        <div className="flex-1 h-5 bg-[#e0d6b8] rounded-sm flex items-center justify-around border border-[#c5ad75] shadow-sm">
          <div className="w-1.5 h-full bg-red-600" />
          <div className="w-1.5 h-full bg-red-600" />
          <div className="w-1.5 h-full bg-amber-700" />
          <div className="w-1.5 h-full bg-yellow-500" />
        </div>
        <div className="w-5 h-1.5 bg-[#a3b1c6] rounded-r-sm border-y border-[#708090]" />
      </div>
    )
  },
  led: {
    name: "LED", type: "Basic",
    width: 32, height: 60,
    pins: [ { id: "anode", x: 10, y: 60 }, { id: "cathode", x: 22, y: 56 } ],
    render: ({ isRunning }: any) => (
      <div className="flex flex-col items-center w-[32px] h-[60px] pointer-events-none">
        <div className={`w-8 h-8 rounded-full ${isRunning ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.9)]' : 'bg-red-600/90'} border-b-4 border-red-800 shadow-inner z-10`} />
        <div className="flex gap-2 -mt-2">
          <div className="w-1.5 h-12 bg-[#a3b1c6] ml-1 rounded-b-sm border-x border-[#708090]" />
          <div className="w-1.5 h-10 bg-[#a3b1c6] rounded-b-sm border-x border-[#708090]" />
        </div>
      </div>
    )
  },
  button: {
     name: "Pushbutton", type: "Basic",
     width: 40, height: 40,
     pins: [ { id: "1a", x: -2, y: 10 }, { id: "1b", x: 42, y: 10 }, { id: "2a", x: -2, y: 30 }, { id: "2b", x: 42, y: 30 } ],
     render: () => (
       <div className="w-[40px] h-[40px] bg-[#e2e8f0] border-2 border-[#cbd5e1] rounded shadow-sm flex items-center justify-center pointer-events-none relative">
          <div className="w-[20px] h-[20px] rounded-full bg-slate-800 shadow-inner border border-slate-900" />
          <div className="absolute -left-1 top-2 w-2 h-2 bg-[#a3b1c6] rounded-sm" />
          <div className="absolute -right-1 top-2 w-2 h-2 bg-[#a3b1c6] rounded-sm" />
          <div className="absolute -left-1 bottom-2 w-2 h-2 bg-[#a3b1c6] rounded-sm" />
          <div className="absolute -right-1 bottom-2 w-2 h-2 bg-[#a3b1c6] rounded-sm" />
       </div>
     )
  },
  capacitor: {
    name: "Capacitor", type: "Basic",
    width: 30, height: 50,
    pins: [ { id: "p1", x: 10, y: 50 }, { id: "p2", x: 20, y: 50 } ],
    render: () => (
      <div className="flex flex-col items-center w-[30px] h-[50px] pointer-events-none">
        <div className="w-[24px] h-[24px] rounded-full bg-blue-600 border border-blue-800 shadow-inner relative flex items-center justify-center">
           <div className="w-2 h-0.5 bg-white opacity-50 absolute top-1 left-1 rounded-full" />
        </div>
        <div className="flex gap-1.5 -mt-1 z-0">
          <div className="w-1.5 h-8 bg-[#a3b1c6] rounded-b-sm border-x border-[#708090]" />
          <div className="w-1.5 h-8 bg-[#a3b1c6] rounded-b-sm border-x border-[#708090]" />
        </div>
      </div>
    )
  },
  battery: {
    name: "Coin Battery", type: "Power",
    width: 64, height: 64,
    pins: [ { id: "pos", x: 32, y: 0 }, { id: "neg", x: 32, y: 64 } ],
    render: () => (
      <div className="relative w-[64px] h-[64px] rounded-full bg-[#f1f5f9] border-[6px] border-[#cbd5e1] flex flex-col items-center justify-center shadow-lg pointer-events-none">
        <div className="absolute inset-1 rounded-full border border-slate-400/30" />
        <span className="text-slate-500 font-bold tracking-tighter text-xl mt-1 leading-none">+</span>
        <span className="text-[6px] text-slate-500 text-center font-bold font-sans mt-0.5 whitespace-nowrap leading-tight">COIN BATTERY<br/>CR 2032<br/>3V</span>
      </div>
    )
  },
  breadboard: {
     name: "Breadboard Small", type: "Basic",
     width: 380, height: 130,
     pins: [
       ...Array.from({length: 10}).map((_, i) => ({ id: `pwr_${i}`, x: 40 + i*30, y: 15 })),
       ...Array.from({length: 10}).map((_, i) => ({ id: `gnd_${i}`, x: 40 + i*30, y: 25 })),
       ...Array.from({length: 10}).map((_, i) => ({ id: `pwr2_${i}`, x: 40 + i*30, y: 105 })),
       ...Array.from({length: 10}).map((_, i) => ({ id: `gnd2_${i}`, x: 40 + i*30, y: 115 }))
     ],
     render: () => (
       <div className="w-[380px] h-[130px] bg-[#fdfdfd] border border-slate-300 shadow-md rounded px-4 flex flex-col justify-evenly pointer-events-none">
          <div className="w-full h-8 flex flex-col justify-center border-b-[2px] border-slate-200 gap-1.5 relative">
             <div className="absolute -left-2 top-1 bottom-1 w-1 bg-red-400 rounded" />
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
          </div>
          <div className="w-full h-12 flex flex-col justify-center gap-1.5">
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
          </div>
          <div className="w-full h-8 flex flex-col justify-center border-t-[2px] border-slate-200 gap-1.5 relative">
             <div className="absolute -left-2 top-1 bottom-1 w-1 bg-blue-400 rounded" />
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
             <div className="flex justify-between">{Array.from({length: 30}).map((_,i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-[1px] shadow-inner" />)}</div>
          </div>
       </div>
     )
  },
  arduino: {
    name: "Arduino Uno R3", type: "Microcontrollers",
    width: 250, height: 180,
    pins: [
       { id: "5v", x: 125, y: 170 }, { id: "gnd", x: 140, y: 170 }, { id: "13", x: 125, y: 10 }
    ],
    render: () => (
      <div className="w-[250px] h-[180px] bg-[#006468] rounded-xl relative shadow-xl border-b-[6px] border-[#004d50] flex flex-col pointer-events-none">
        <div className="absolute -left-1.5 top-5 w-10 h-14 bg-slate-200 rounded-md p-1 shadow-md border border-slate-400"><div className="w-full h-full bg-slate-100 border border-slate-300" /></div>
        <div className="absolute -left-1 bottom-4 w-7 h-11 bg-[#1e293b] rounded-md shadow-md border border-slate-900" />
        <div className="absolute top-1 left-[70px] flex gap-1.5"><div className="h-4 w-36 bg-[#0f172a] rounded flex justify-evenly px-1 items-center shadow-inner border border-black/50">{Array.from({length: 12}).map((_,i)=><div key={'t'+i} className="w-[4px] h-[4px] bg-[#94a3b8] rounded-sm"/>)}</div></div>
        <div className="absolute bottom-1 right-[30px] flex gap-2"><div className="h-4 w-20 bg-[#0f172a] rounded flex justify-evenly px-0.5 items-center shadow-inner border border-black/50">{Array.from({length: 6}).map((_,i)=><div key={'b1'+i} className="w-[4px] h-[4px] bg-[#94a3b8] rounded-sm"/>)}</div><div className="h-4 w-28 bg-[#0f172a] rounded flex justify-evenly px-1 items-center shadow-inner border border-black/50">{Array.from({length: 8}).map((_,i)=><div key={'b2'+i} className="w-[4px] h-[4px] bg-[#94a3b8] rounded-sm"/>)}</div></div>
        <div className="absolute top-20 right-10 w-28 h-12 bg-[#0f172a] rounded-md flex flex-col justify-between py-0.5 shadow-lg border border-black"><div className="flex justify-evenly px-1">{Array.from({length: 14}).map((_,i)=><div key={'c1'+i} className="w-1.5 h-1.5 bg-[#cbd5e1] rounded-sm"/>)}</div><div className="flex justify-evenly px-1">{Array.from({length: 14}).map((_,i)=><div key={'c2'+i} className="w-1.5 h-1.5 bg-[#cbd5e1] rounded-sm"/>)}</div></div>
        <div className="absolute top-20 left-[70px] text-white/80 font-bold text-[28px] tracking-widest font-sans drop-shadow-sm">UNO</div>
        <div className="absolute top-[110px] left-[70px] text-white/80 font-semibold text-[10px] text-center flex items-center font-sans tracking-wide"><span className="font-extrabold text-lg mr-1.5 leading-none">&infin;</span> ARDUINO</div>
        <div className="absolute top-8 right-[115px] w-4 h-4 rounded-full bg-slate-300 shadow-inner" />
        <div className="absolute bottom-[40px] left-[60px] w-6 h-6 rounded-full bg-slate-200 border border-slate-300 shadow-sm" />
      </div>
    )
  },
  motor: {
    name: "DC Motor",
    type: "Output",
    width: 90, height: 60,
    pins: [ { id: "p1", x: 85, y: 22 }, { id: "p2", x: 85, y: 38 } ],
    render: ({ isRunning }: any) => (
      <div className="flex items-center w-[90px] h-[60px] pointer-events-none">
        <div className="w-[75px] h-full bg-[#e2e8f0] rounded-[24px] border border-slate-300 relative overflow-hidden flex items-center justify-center shadow-md">
           <div className="w-4 h-full bg-[#cbd5e1] absolute left-0" />
           <div className="w-10 h-10 rounded-full border border-slate-300 bg-[#f8fafc] flex items-center justify-center shadow-inner">
              <div className={`w-6 h-6 text-yellow-500 ${isRunning ? 'animate-spin' : ''}`}>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
           </div>
        </div>
        <div className="flex flex-col gap-2 -ml-[2px] z-10">
          <div className="w-4 h-2.5 bg-red-500 rounded-r-sm" />
          <div className="w-4 h-2.5 bg-slate-800 rounded-r-sm" />
        </div>
      </div>
    )
  },
  sensor: {
     name: "Ultrasonic Sensor", type: "Sensors",
     width: 60, height: 30,
     pins: [ { id: "vcc", x: 10, y: 30 }, { id: "trig", x: 23, y: 30 }, { id: "echo", x: 37, y: 30 }, { id: "gnd", x: 50, y: 30 } ],
     render: () => (
       <div className="flex flex-col items-center pointer-events-none">
          <div className="w-[60px] h-[24px] bg-blue-700 rounded shadow-md border-b-2 border-blue-900 flex items-center justify-around px-1 z-10">
             <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center border border-slate-400"><div className="w-2 h-2 rounded-full bg-slate-800" /></div>
             <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center border border-slate-400"><div className="w-2 h-2 rounded-full bg-slate-800" /></div>
          </div>
          <div className="flex gap-1 -mt-1">
             <div className="w-1 h-6 bg-[#a3b1c6]" /><div className="w-1 h-6 bg-[#a3b1c6]" /><div className="w-1 h-6 bg-[#a3b1c6]" /><div className="w-1 h-6 bg-[#a3b1c6]" />
          </div>
       </div>
     )
  }
};
