import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { SafeIcon } from '@/components/ui/safe-icon';
import { useStore } from '@/store/useStore';
import { compileSketch, uploadSketch, installLibrary } from '@/features/protocode-studio/adapters/executionAdapter';
import {
  Check, ArrowRight, Activity, Search,
  FolderOpen, Library, Cpu, BugOff, User, MoreHorizontal,
  ChevronRight, Trash2,
  Save, RotateCcw, FilePlus, Edit2, X, CheckCircle2, Bot
} from 'lucide-react';

// ==================================================
// EXAMPLE SKETCHES
// ==================================================
const EXAMPLES: Record<string, { name: string; code: string }> = {
  blink: {
    name: 'Blink',
    code: `// Blink - Turns an LED on for one second, then off for one second, repeatedly.

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
`,
  },
  analogRead: {
    name: 'AnalogReadSerial',
    code: `// AnalogReadSerial - Reads an analog input on pin 0, prints the result to the Serial Monitor.

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  delay(1);
}
`,
  },
  fade: {
    name: 'Fade',
    code: `// Fade - Demonstrates the use of analogWrite() for fading an LED.

int led = 9;
int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  analogWrite(led, brightness);
  brightness = brightness + fadeAmount;
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }
  delay(30);
}
`,
  },
  servoSweep: {
    name: 'Servo Sweep',
    code: `// Servo Sweep - Sweeps the shaft of a servo motor back and forth across 180 degrees.

#include <Servo.h>

Servo myservo;
int pos = 0;

void setup() {
  myservo.attach(9);
}

void loop() {
  for (pos = 0; pos <= 180; pos += 1) {
    myservo.write(pos);
    delay(15);
  }
  for (pos = 180; pos >= 0; pos -= 1) {
    myservo.write(pos);
    delay(15);
  }
}
`,
  },
  servoKnob: {
    name: 'Servo Knob',
    code: `// Servo Knob - Controls a servo motor position using a potentiometer.

#include <Servo.h>

Servo myservo;
int potpin = A0;
int val;

void setup() {
  myservo.attach(9);
}

void loop() {
  val = analogRead(potpin);
  val = map(val, 0, 1023, 0, 180);
  myservo.write(val);
  delay(15);
}
`,
  },
};

const DEFAULT_CODE = `void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
`;
const BOARDS = ['Arduino Uno', 'ESP32 Dev Module', 'Arduino Nano', 'Arduino Mega', 'NodeMCU 1.0'];
const PORTS = ['COM3', 'COM4', 'COM5', '/dev/ttyUSB0'];

const FQBN_MAP: Record<string, string> = {
  'Arduino Uno': 'arduino:avr:uno',
  'Arduino Nano': 'arduino:avr:nano',
  'Arduino Mega': 'arduino:avr:mega',
  'ESP32 Dev Module': 'esp32:esp32:esp32',
  'NodeMCU 1.0': 'esp8266:esp8266:nodemcuv2',
};

const ALL_LIBRARIES = [
  { name: 'Servo', version: '1.2.1', author: 'Arduino', desc: 'Allows Arduino boards to control servo motors.', preInstalled: true },
  { name: 'Wire', version: '1.0.0', author: 'Arduino', desc: 'Allows communication with I2C / TWI devices.', preInstalled: true },
  { name: 'SPI', version: '1.0.0', author: 'Arduino', desc: 'Allows communication with SPI devices.', preInstalled: true },
  { name: 'LiquidCrystal', version: '1.0.7', author: 'Arduino', desc: 'Allows communication with alphanumeric LCD displays.', preInstalled: true },
  { name: 'DHT', version: '1.4.4', author: 'Adafruit', desc: 'Arduino library for DHT11/DHT22 temperature & humidity sensors.', preInstalled: true },
  { name: 'EEPROM', version: '2.0.0', author: 'Arduino', desc: 'Allows reading and writing to the permanent storage.', preInstalled: true },
  { name: 'WiFi', version: '1.2.7', author: 'Arduino', desc: 'Enables network connection (local and Internet) using WiFi shield.', preInstalled: false },
  { name: 'SD', version: '1.2.4', author: 'Arduino', desc: 'Enables reading and writing on SD cards.', preInstalled: false },
  { name: 'Stepper', version: '1.1.3', author: 'Arduino', desc: 'Allows Arduino to control unipolar or bipolar stepper motors.', preInstalled: false },
  { name: 'Adafruit NeoPixel', version: '1.12.0', author: 'Adafruit', desc: 'Arduino library for controlling single-wire-based LED pixels and strip.', preInstalled: false },
  { name: 'FastLED', version: '3.6.0', author: 'Daniel Garcia', desc: 'Multi-platform library for controlling dozens of different LED chipsets.', preInstalled: false },
  { name: 'PubSubClient', version: '2.8.0', author: 'Nick O\'Leary', desc: 'A client library for MQTT messaging protocol.', preInstalled: false },
  { name: 'ArduinoJson', version: '6.21.3', author: 'Benoît Blanchon', desc: 'An efficient and elegant JSON library for embedded systems.', preInstalled: false },
  { name: 'Adafruit Sensor', version: '1.1.9', author: 'Adafruit', desc: 'Common sensor interface for general-purpose sensor libraries.', preInstalled: false },
];

const PRE_INSTALLED_NAMES = ALL_LIBRARIES.filter(l => l.preInstalled).map(l => l.name);

type TabId = 'files' | 'libs' | 'boards' | 'debug' | 'search';

export default function ExactArduinoIDEPage() {
  const { 
    theme, 
    loadedProject,
    joinSession,
    leaveSession,
    updatePresence,
    activeSessions,
    currentSessionId 
  } = useStore();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeTab, setActiveTab] = useState<TabId | null>('files');
  const [consoleTab, setConsoleTab] = useState<'output' | 'errors' | 'serial'>('output');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Board & Port state
  const [selectedBoard, setSelectedBoard] = useState('Arduino Uno');
  const [selectedPort, setSelectedPort] = useState('COM3');
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  // Library install states
  const [libStates, setLibStates] = useState<Record<string, 'idle' | 'installing' | 'installed'>>({});
  const [libFilter, setLibFilter] = useState('');
  const [libsReady, setLibsReady] = useState(false);

  // First-load: simulate environment setup and mark pre-installed libraries
  useEffect(() => {
    const initial: Record<string, 'idle' | 'installing' | 'installed'> = {};
    PRE_INSTALLED_NAMES.forEach(name => { initial[name] = 'installed'; });
    setLibStates(initial);
    const timer = setTimeout(() => setLibsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Output & Serial
  const [outputLogs, setOutputLogs] = useState<string[]>(['ProtoCode Studio ready.']);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [serialInput, setSerialInput] = useState('');
  const [serialRunning, setSerialRunning] = useState(false);
  const serialTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Open file dialog mock
  const [showOpenModal, setShowOpenModal] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const toggleTab = useCallback((tab: TabId) => {
    setActiveTab(prev => prev === tab ? null : tab);
  }, []);

  // ==================================================
  // SCROLL TO BOTTOM
  // ==================================================
  const scrollToBottom = useCallback(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [outputLogs, serialLogs, scrollToBottom]);

  // ==================================================
  // TOAST SYSTEM
  // ==================================================
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ==================================================
  // LIBRARY DETECTION & SCANNER
  // ==================================================
  useEffect(() => {
    const includes = code.match(/#include\s+<(.+?)\.h>/g) || [];
    const detectedLibs = includes.map(inc => inc.match(/<(.+?)\.h>/)?.[1] || '');
    
    detectedLibs.forEach(lib => {
      // Find if this library is in our list but not installed
      const match = ALL_LIBRARIES.find(l => l.name.toLowerCase() === lib.toLowerCase());
      if (match && libStates[match.name] !== 'installed') {
        // Just log it for now, could show a notification
        console.log(`Detected include for uninstalled library: ${match.name}`);
      }
    });
  }, [code, libStates]);

  const [missingLibs, setMissingLibs] = useState<string[]>([]);
  const [baudRate, setBaudRate] = useState('9600');
  const [lineEnding, setLineEnding] = useState('Newline');

  useEffect(() => {
    const includes = code.match(/#include\s+<(.+?)\.h>/g) || [];
    const detectedLibs = includes.map(inc => inc.match(/<(.+?)\.h>/)?.[1] || '');
    
    const missing = detectedLibs.filter(lib => {
      const match = ALL_LIBRARIES.find(l => l.name.toLowerCase() === lib.toLowerCase());
      return match && libStates[match.name] !== 'installed';
    });

    setMissingLibs(prev => {
      if (JSON.stringify(prev) === JSON.stringify(missing)) return prev;
      return missing;
    });
  }, [code, libStates]);

  useEffect(() => {
    // Join collaboration session for this project
    const projectId = loadedProject?.id || 'default_code_lab';
    joinSession(projectId);
    
    return () => {
      leaveSession();
    };
  }, [joinSession, leaveSession, loadedProject?.id]);

  useEffect(() => {
    // Update presence with active file
    updatePresence({ activeFile: 'sketch_mar21a.ino' });
  }, [updatePresence]);

  // ==================================================
  // SERIAL AUTO-DATA STREAM
  // ==================================================
  useEffect(() => {
    if (serialRunning && consoleTab === 'serial') {
      const interval = baudRate === '115200' ? 200 : 800;
      serialTimerRef.current = setInterval(() => {
        const val = (Math.random() * 1023).toFixed(0);
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setSerialLogs(prev => [...prev.slice(-200), `[${timestamp}] ${val}`]);
      }, interval);
    }
    return () => {
      if (serialTimerRef.current) clearInterval(serialTimerRef.current);
    };
  }, [serialRunning, consoleTab, baudRate]);

  // ==================================================
  // COPILOT MOCK
  // ==================================================
  const handleEditorDidMount = useCallback((_editor: unknown, monaco: { languages: { registerInlineCompletionsProvider: (language: string, provider: { provideInlineCompletions: (model: { getLineContent: (line: number) => string }, position: { lineNumber: number; column: number }) => Promise<{ items: { insertText: string; range: unknown }[] }>; freeInlineCompletions: () => void }) => void } }) => {
    monaco.languages.registerInlineCompletionsProvider('cpp', {
      provideInlineCompletions: async (model: { getLineContent: (line: number) => string }, position: { lineNumber: number; column: number }) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const text = lineContent.substring(0, position.column - 1);
        let suggestion = '';
        if (text.endsWith('Serial.')) suggestion = 'begin(115200);';
        else if (text.endsWith('digitalWrite(')) suggestion = 'LED_BUILTIN, HIGH);';
        else if (text.endsWith('pinMode(')) suggestion = 'LED_BUILTIN, OUTPUT);';
        else if (text.endsWith('delay(')) suggestion = '1000);';
        else if (text.endsWith('analogRead(')) suggestion = 'A0);';

        if (suggestion) {
          return { items: [{ insertText: suggestion, range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column) }] };
        }
        return { items: [] };
      },
      freeInlineCompletions() {}
    });
  }, []);

  // ==================================================
  // TOOLBAR ACTIONS
  // ==================================================
  const addLog = useCallback((msg: string) => {
    setOutputLogs(prev => [...prev, msg]);
  }, []);

  // Memory usage state
  const [memoryInfo, setMemoryInfo] = useState<{ program: number; programPercent: number; dynamic: number; dynamicPercent: number } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleVerify = useCallback(async () => {
    if (isCompiling || isUploading) return;
    setIsCompiling(true);
    setConsoleTab('output');
    setErrorLogs([]);
    setMemoryInfo(null);
    setOutputLogs([`> Compiling sketch for ${selectedBoard}...`]);

    const fqbn = FQBN_MAP[selectedBoard] || 'arduino:avr:uno';

    try {
      const data = await compileSketch(code, fqbn, 'sketch_mar21a');

      if (data.success) {
        setOutputLogs(prev => [...prev, ...data.logs, `✓ Compilation Successful`]);
        setMemoryInfo(data.memoryUsage);
        showToast('Compilation Successful');
      } else {
        setOutputLogs(prev => [...prev, ...data.logs, `✗ Compilation Failed`]);
        setErrorLogs(data.errors);
        setConsoleTab('errors');
        showToast('Compilation Failed');
        
        // Trigger Proto AI to explain errors
        if (data.errors.length > 0) {
          useStore.getState().triggerAI(`I'm getting these compilation errors in my Arduino code. Can you explain them and suggest a fix?\n\nErrors:\n${data.errors.join('\n')}\n\nCode:\n\`\`\`cpp\n${code}\n\`\`\``);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutputLogs(prev => [...prev, `✗ Compilation error: ${message}`]);
      setErrorLogs([message]);
    } finally {
      setIsCompiling(false);
    }
  }, [code, isCompiling, isUploading, selectedBoard, showToast]);

  const handleUpload = useCallback(async () => {
    if (isCompiling || isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    setConsoleTab('output');
    setErrorLogs([]);
    setOutputLogs([`> Compiling and uploading to ${selectedBoard} on ${selectedPort}...`]);

    const fqbn = FQBN_MAP[selectedBoard] || 'arduino:avr:uno';

    try {
      const data = await uploadSketch(code, fqbn, selectedPort, 'sketch_mar21a', (p) => setUploadProgress(p));

      if (data.success) {
        setOutputLogs(prev => [...prev, ...data.logs, `✓ Upload Successful`]);
        showToast('Upload Successful');
        setSerialRunning(true);
      } else {
        setOutputLogs(prev => [...prev, ...data.logs, `✗ Upload Failed`]);
        setErrorLogs(data.errors);
        setConsoleTab('errors');
        showToast('Upload Failed');
        
        if (data.errors.length > 0) {
          useStore.getState().triggerAI(`My upload failed with these errors. What should I check?\n\nErrors:\n${data.errors.join('\n')}`);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutputLogs(prev => [...prev, `✗ Upload error: ${message}`]);
      setErrorLogs([message]);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [code, isCompiling, isUploading, selectedBoard, selectedPort, showToast]);

  const handleNew = useCallback(() => {
    setCode(DEFAULT_CODE);
    setOutputLogs(['> New sketch created.']);
    showToast('New Sketch Created');
  }, [showToast]);

  const handleSave = useCallback(() => {
    addLog('> Sketch saved.');
    showToast('Saved Successfully');
  }, [addLog, showToast]);

  const handleClearOutput = useCallback(() => {
    setOutputLogs([]);
    setSerialLogs([]);
    setErrorLogs([]);
  }, []);

  // ==================================================
  // LIBRARY INSTALL
  // ==================================================
  const handleInstallLib = useCallback(async (lib: string) => {
    setLibStates(prev => ({ ...prev, [lib]: 'installing' }));
    setConsoleTab('output');
    addLog(`> Requesting installation for library: ${lib}...`);

    try {
      const data = await installLibrary(lib);

      if (data.success) {
        addLog(data.output || `✓ Successfully installed ${lib}`);
        setLibStates(prev => ({ ...prev, [lib]: 'installed' }));
        showToast(`Installed: ${lib}`);
      } else {
        addLog(`✗ Failed to install ${lib}`);
        setErrorLogs(prev => [...prev, data.errors || 'Installation failed']);
        setLibStates(prev => ({ ...prev, [lib]: 'idle' }));
        setConsoleTab('errors');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addLog(`✗ Install error: ${message}`);
      setLibStates(prev => ({ ...prev, [lib]: 'idle' }));
    }
  }, [addLog, showToast]);

  // ==================================================
  // LOAD EXAMPLE
  // ==================================================
  const handleLoadExample = useCallback((key: string) => {
    const ex = EXAMPLES[key];
    if (ex) {
      setCode(ex.code);
      addLog(`> Loaded example: ${ex.name}`);
      showToast(`Loaded: ${ex.name}`);
    }
  }, [addLog, showToast]);

  // ==================================================
  // SERIAL SEND
  // ==================================================
  const handleSerialSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setSerialLogs(prev => [...prev, `> ${serialInput}`]);
    setSerialInput('');
  }, [serialInput]);

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] font-sans overflow-hidden bg-background text-foreground">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-[13px] font-semibold animate-in slide-in-from-right"
          style={{ animation: 'slideInRight 300ms ease forwards' }}>
          <SafeIcon icon={CheckCircle2} size={16} /> {toast}
        </div>
      )}

      {/* Global animation keyframes */}
      <style>{`
        @keyframes slideInRight { from { transform:translateX(100px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>

      {/* ================================================== */}
      {/* 0) SYSTEM MENU BAR */}
      {/* ================================================== */}
      <div className="h-6 bg-card border-b border-border flex items-center px-4 text-[12px] text-muted-foreground gap-4 shrink-0 shadow-sm z-20">
        <span className="font-semibold text-primary flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"/> sketch_mar21a | Arduino IDE 2.3.8</span>
        <div className="flex gap-4 ml-6 cursor-pointer">
          <span className="hover:text-foreground">File</span>
          <span className="hover:text-foreground">Edit</span>
          <span className="hover:text-foreground">Sketch</span>
          <span className="hover:text-foreground">Tools</span>
          <span className="hover:text-foreground">Help</span>
        </div>
      </div>

      {/* ================================================== */}
      {/* 1) TOP TOOLBAR */}
      {/* ================================================== */}
      <div className="h-12 bg-card border-b border-border flex items-center justify-between px-3 shrink-0 shadow-sm z-10">

        <div className="flex items-center gap-2">
          {/* Verify */}
          <button onClick={handleVerify} disabled={isCompiling || isUploading}
            className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex items-center justify-center transition-all shadow-sm active:scale-90 ${
              isCompiling ? 'border-primary text-primary animate-pulse' : 'border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground'
            }`} title="Verify (Compile)">
            <SafeIcon icon={Check} size={15} strokeWidth={2.5} />
          </button>
          {/* Upload */}
          <button onClick={handleUpload} disabled={isCompiling || isUploading}
            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-primary-foreground transition-all shadow-sm active:scale-90 ${
              isUploading ? 'bg-primary/80 animate-pulse' : 'bg-primary hover:bg-primary/90'
            }`} title="Upload">
            <SafeIcon icon={ArrowRight} size={16} strokeWidth={2.5} />
          </button>
          {/* New */}
          <button onClick={handleNew} className="w-[28px] h-[28px] rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-90" title="New Sketch">
            <SafeIcon icon={FilePlus} size={16} />
          </button>
          {/* Open */}
          <button onClick={() => setShowOpenModal(true)} className="w-[28px] h-[28px] rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-90" title="Open">
            <SafeIcon icon={FolderOpen} size={16} />
          </button>
          {/* Save */}
          <button onClick={handleSave} className="w-[28px] h-[28px] rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-90" title="Save">
            <SafeIcon icon={Save} size={16} />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Ask Proto AI */}
          <button 
            onClick={() => {
              useStore.getState().triggerAI(`Can you explain or optimize this code?\n\n\`\`\`cpp\n${code}\n\`\`\``);
            }} 
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all active:scale-95" 
            title="Ask Proto AI"
          >
            <Bot className="w-3.5 h-3.5" />
            ASK PROTO AI
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Board Selector */}
          <div className="relative">
            <button onClick={() => setShowBoardDropdown(!showBoardDropdown)}
              className="flex items-center h-7 border border-primary/50 rounded text-[12px] bg-transparent hover:bg-secondary transition-colors cursor-pointer pr-2">
              <div className="px-3 border-r border-primary/50 h-full flex items-center whitespace-nowrap text-foreground gap-2">
                <SafeIcon icon={Cpu} size={12} className="text-primary" />
                {selectedBoard}
              </div>
              <div className="px-2 flex items-center gap-1">
                <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter animate-pulse">
                  {selectedBoard.includes('ESP') ? 'ESP32' : 'AVR'}
                </span>
                <span className="text-[10px] text-primary">▼</span>
              </div>
            </button>
            {showBoardDropdown && (
              <div className="absolute top-9 left-0 bg-popover border border-border rounded shadow-lg z-50 min-w-[200px]">
                {BOARDS.map(b => (
                  <button key={b} onClick={() => { setSelectedBoard(b); setShowBoardDropdown(false); addLog(`> Board changed to: ${b}`); }}
                    className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-secondary transition-colors ${b === selectedBoard ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {b}
                  </button>
                ))}
                <div className="border-t border-border px-3 py-1">
                  <div className="text-[10px] text-muted-foreground mb-1">PORT</div>
                  {PORTS.map(p => (
                    <button key={p} onClick={() => { setSelectedPort(p); setShowBoardDropdown(false); addLog(`> Port changed to: ${p}`); }}
                      className={`w-full text-left px-2 py-1 text-[11px] hover:bg-secondary rounded transition-colors ${p === selectedPort ? 'text-primary font-bold' : 'text-foreground'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-[12px] text-muted-foreground ml-2 font-medium whitespace-nowrap">
            {isCompiling ? 'Compiling sketch...' : isUploading ? 'Uploading...' : `on ${selectedPort}`}
          </span>
          
          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="ml-4 w-48 h-1.5 bg-secondary/50 rounded-full overflow-hidden border border-border/20">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Right side Icons */}
        <div className="flex items-center gap-2 text-foreground">
          <button title="Serial Plotter" className="hover:text-primary transition-colors"><SafeIcon icon={Activity} size={18} /></button>
          <button onClick={() => { setConsoleTab('serial'); setSerialRunning(true); }} title="Serial Monitor" className="hover:text-primary transition-colors">
            <SafeIcon icon={MoreHorizontal} size={18} />
          </button>
        </div>
      </div>

      {/* Close board dropdown on click outside */}
      {showBoardDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowBoardDropdown(false)} />}

      <div className="flex flex-1 min-h-0 bg-background">

        {/* ================================================== */}
        {/* 2) LEFT SIDEBAR (ICON RAIL) */}
        {/* ================================================== */}
        <div className="w-[48px] bg-card border-r border-border flex flex-col items-center py-2 shrink-0 z-10">
          <div className="flex flex-col w-full">
            {([
              { id: 'files' as TabId, icon: FolderOpen, label: 'Explorer' },
              { id: 'libs' as TabId, icon: Library, label: 'Library Manager' },
              { id: 'boards' as TabId, icon: Cpu, label: 'Boards Manager' },
              { id: 'debug' as TabId, icon: BugOff, label: 'Debug' },
              { id: 'search' as TabId, icon: Search, label: 'Search' },
            ]).map(item => (
              <button key={item.id} onClick={() => toggleTab(item.id)}
                className={`w-full py-4 flex justify-center border-l-2 transition-all duration-150 ${
                  activeTab === item.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`} title={item.label}>
                <SafeIcon icon={item.icon} size={item.id === 'search' ? 20 : 24} strokeWidth={1} />
              </button>
            ))}
          </div>
          <div className="mt-auto w-full pb-2">
            <button className="w-full flex justify-center border-l-2 border-transparent text-muted-foreground hover:text-foreground transition-colors" title="Account">
              <SafeIcon icon={User} size={24} strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* 3) DRAWER PANEL (CSS Slide) */}
        {/* ================================================== */}
        <div className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
          style={{ width: activeTab ? 260 : 0, opacity: activeTab ? 1 : 0, transition: 'width 200ms ease, opacity 200ms ease' }}>
          <div className="h-9 flex items-center justify-between px-3 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary/50 whitespace-nowrap min-w-[260px]">
            <span>
              {activeTab === 'files' && 'Sketchbook'}
              {activeTab === 'libs' && 'Library Manager'}
              {activeTab === 'boards' && 'Boards Manager'}
              {activeTab === 'debug' && 'Debug'}
              {activeTab === 'search' && 'Search'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto w-full no-scrollbar px-2 py-3 text-[13px] min-w-[260px]">

            {/* FILES */}
            {activeTab === 'files' && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1 text-foreground">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-[3px] text-foreground font-medium">
                    <SafeIcon icon={ChevronRight} size={14} className="text-primary transform rotate-90" />
                    <SafeIcon icon={FolderOpen} size={14} className="text-primary" />
                    sketch_mar21a
                  </div>
                  <div className="flex items-center gap-1.5 pl-8 pr-2 py-1 hover:bg-secondary/80 rounded-[3px] cursor-pointer group relative">
                    <span className="text-primary text-[11px] font-bold">ino</span>
                    sketch_mar21a.ino
                    
                    {/* Collaborator Indicators */}
                    <div className="ml-auto flex items-center -space-x-1">
                      {currentSessionId && activeSessions[currentSessionId]?.activeUsers
                        .filter(u => u.userId !== useStore.getState().currentUser?.id && u.activeFile === 'sketch_mar21a.ino')
                        .map(u => (
                          <div 
                            key={u.userId}
                            className="w-4 h-4 rounded-full bg-primary border-2 border-card flex items-center justify-center text-[6px] font-black text-white uppercase"
                            title={`${u.username} is editing`}
                          >
                            {u.username.substring(0, 1)}
                          </div>
                        ))}
                    </div>

                    <button className="opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity ml-2"><SafeIcon icon={Edit2} size={12} /></button>
                  </div>
                </div>
                <div className="mt-4 px-2 text-muted-foreground text-[11px] font-bold uppercase">Examples</div>
                <div className="flex flex-col gap-0.5 pl-2 text-foreground">
                  <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase">01.Basics</div>
                  {['blink', 'analogRead', 'fade'].map(key => (
                    <button key={key} onClick={() => handleLoadExample(key)}
                      className="w-full text-left flex items-center gap-1.5 px-4 py-1 hover:bg-secondary/50 rounded-[3px] cursor-pointer transition-colors">
                      <SafeIcon icon={ChevronRight} size={12} className="text-muted-foreground" />
                      {EXAMPLES[key].name}
                    </button>
                  ))}
                  <div className="px-2 py-1 mt-2 text-[11px] font-bold text-muted-foreground uppercase">Servo</div>
                  {['servoSweep', 'servoKnob'].map(key => (
                    <button key={key} onClick={() => handleLoadExample(key)}
                      className="w-full text-left flex items-center gap-1.5 px-4 py-1 hover:bg-secondary/50 rounded-[3px] cursor-pointer transition-colors">
                      <SafeIcon icon={ChevronRight} size={12} className="text-muted-foreground" />
                      {EXAMPLES[key].name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LIBRARIES */}
            {activeTab === 'libs' && (
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Filter your search..." value={libFilter} onChange={(e) => setLibFilter(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-primary" />

                {!libsReady ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-[12px] text-muted-foreground">Setting up environment...</span>
                  </div>
                ) : (
                  ALL_LIBRARIES
                    .filter(lib => lib.name.toLowerCase().includes(libFilter.toLowerCase()))
                    .map(lib => {
                      const state = libStates[lib.name] || 'idle';
                      return (
                        <div key={lib.name} className="flex flex-col px-3 py-3 bg-card border border-border rounded">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[13px] font-bold text-foreground">{lib.name}</span>
                            {state === 'installed' && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                                <SafeIcon icon={CheckCircle2} size={10} /> Installed
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-primary/80 font-mono mb-1">v{lib.version} by {lib.author}</span>
                          <span className="text-[11px] text-muted-foreground mb-3 leading-tight">{lib.desc}</span>
                          {state !== 'installed' && (
                            <button onClick={() => state === 'idle' && handleInstallLib(lib.name)} disabled={state !== 'idle'}
                              className={`self-end px-3 py-1 rounded text-[11px] font-bold transition-all active:scale-95 ${
                                state === 'installing'
                                  ? 'bg-secondary text-warning animate-pulse cursor-wait'
                                  : 'bg-secondary hover:bg-secondary/80 border border-border text-foreground'
                              }`}>
                              {state === 'installing' ? 'INSTALLING...' : 'INSTALL'}
                            </button>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* BOARDS */}
            {activeTab === 'boards' && (
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Search boards..." className="w-full bg-background border border-border rounded px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-primary" />
                {[
                  { name: 'Arduino AVR Boards', version: '1.8.6', boards: ['Arduino Uno', 'Arduino Nano', 'Arduino Mega'] },
                  { name: 'esp32', version: '2.0.14', boards: ['ESP32 Dev Module', 'ESP32-S3'] },
                  { name: 'esp8266', version: '3.1.2', boards: ['NodeMCU 1.0', 'Wemos D1 Mini'] },
                ].map(pkg => (
                  <div key={pkg.name} className="flex flex-col px-3 py-3 bg-card border border-border rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-foreground">{pkg.name}</span>
                      <span className="text-[10px] text-primary font-mono">{pkg.version}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.boards.map(b => (
                        <span key={b} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                    <button className="self-end px-3 py-1 bg-primary hover:bg-primary/90 rounded text-[11px] font-bold text-primary-foreground transition-colors">INSTALLED</button>
                  </div>
                ))}
              </div>
            )}

            {/* DEBUG */}
            {activeTab === 'debug' && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
                <SafeIcon icon={BugOff} size={36} className="text-muted-foreground/30" />
                <p className="text-[12px] text-muted-foreground leading-relaxed">No debug session active. Connect a board and click <strong className="text-primary">Start Debugging</strong> to begin.</p>
                <button className="mt-2 px-4 py-1.5 bg-primary hover:bg-primary/90 rounded text-[12px] font-bold text-primary-foreground transition-colors active:scale-95">Start Debugging</button>
              </div>
            )}

            {/* SEARCH */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Search in sketch..." className="w-full bg-background border border-border rounded px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:border-primary" />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-primary w-3 h-3" /> Match Case</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-primary w-3 h-3" /> Regex</label>
                </div>
                <div className="text-[12px] text-muted-foreground px-2 mt-4">Type to search across your sketch files.</div>
              </div>
            )}

          </div>
        </div>

        {/* ================================================== */}
        {/* 4) MAIN CODE EDITOR */}
        {/* ================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">

          {/* Editor Tab */}
          <div className="flex h-9 bg-card shrink-0 overflow-x-auto no-scrollbar border-b border-border">
            <div className="flex items-center justify-between w-[160px] px-3 border-t-2 border-primary bg-background text-foreground text-[12px] cursor-pointer relative">
              sketch_mar21a.ino
              <SafeIcon icon={MoreHorizontal} size={14} className="text-muted-foreground hover:text-foreground" />
            </div>
          </div>

          {/* Monaco */}
          <div className="flex-1 relative">
            {/* Library Suggestion Banner */}
            {missingLibs.length > 0 && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-card/90 backdrop-blur-md border border-primary/30 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
                <SafeIcon icon={Library} size={14} className="text-primary" />
                <span className="text-[11px] font-bold text-foreground">
                  MISSING LIBRARIES: <span className="text-primary">{missingLibs.join(', ')}</span>
                </span>
                <div className="flex gap-2">
                  {missingLibs.map(lib => (
                    <button 
                      key={lib}
                      onClick={() => handleInstallLib(lib)}
                      className="px-2 py-0.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-full text-[9px] font-black uppercase transition-all active:scale-95"
                    >
                      Quick Install
                    </button>
                  ))}
                </div>
                <button onClick={() => setMissingLibs([])} className="hover:text-primary transition-colors ml-2">
                  <SafeIcon icon={X} size={12} />
                </button>
              </div>
            )}
            
            <Editor
              height="100%"
              defaultLanguage="cpp"
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              value={code}
              onChange={(val) => setCode(val || '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                padding: { top: 12 },
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorWidth: 2,
                autoIndent: 'full',
                formatOnPaste: true,
                matchBrackets: 'always',
                renderLineHighlight: 'line',
                inlineSuggest: { enabled: true }
              }}
            />
          </div>

          {/* ================================================== */}
          {/* 5) BOTTOM OUTPUT PANEL */}
          {/* ================================================== */}
          <div className="h-[220px] border-t border-border bg-card flex flex-col shrink-0">
            <div className="flex justify-between items-center h-8 bg-muted/30 border-b border-border px-2 text-[12px]">
              <div className="flex h-full">
                {(['output', 'errors', 'serial'] as const).map(t => (
                  <button key={t} onClick={() => { setConsoleTab(t); if (t === 'serial') setSerialRunning(true); }}
                    className={`px-4 flex items-center gap-2 border-b-2 transition-colors capitalize ${
                      consoleTab === t ? 'border-primary text-foreground bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}>
                    {t === 'serial' ? 'Serial Monitor' : t === 'errors' ? `Errors (${errorLogs.length})` : 'Output'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-2 text-muted-foreground">
                <button onClick={handleClearOutput} className="hover:text-foreground transition-colors" title="Clear"><SafeIcon icon={Trash2} size={14} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full p-2">
              {consoleTab === 'output' && (
                <div className="font-mono text-[12px] leading-relaxed text-foreground flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {outputLogs.map((log, i) => (
                      <div key={i} className={log.startsWith('>') ? 'text-primary font-semibold' : log.startsWith('Installed') || log.includes('complete') || log.includes('successful') || log.includes('Successful') ? 'text-success' : ''}>{log}</div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                  
                  {/* Memory Usage Stats */}
                  {memoryInfo && !isCompiling && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex flex-col gap-2 shrink-0 bg-card/50 p-2 rounded-t-lg">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span>Program Storage Space</span>
                          <span>{memoryInfo.program} / {Math.round(memoryInfo.program / (memoryInfo.programPercent / 100))} bytes ({memoryInfo.programPercent}%)</span>
                        </div>
                        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${memoryInfo.programPercent > 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${memoryInfo.programPercent}%` }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span>Dynamic Memory</span>
                          <span>{memoryInfo.dynamic} bytes ({memoryInfo.dynamicPercent}%)</span>
                        </div>
                        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${memoryInfo.dynamicPercent > 90 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${memoryInfo.dynamicPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {consoleTab === 'errors' && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <SafeIcon icon={CheckCircle2} size={30} className="text-success/30" />
                  <span className="text-[12px]">{errorLogs.length === 0 ? 'No errors reported.' : errorLogs.join('\n')}</span>
                </div>
              )}

              {consoleTab === 'serial' && (
                <div className="flex flex-col h-full bg-card">
                  <div className="flex items-center gap-2 px-2 pb-2 text-[11px] border-b border-border shrink-0">
                    <select 
                      value={lineEnding}
                      onChange={(e) => setLineEnding(e.target.value)}
                      className="bg-background border border-border rounded px-2 py-0.5 text-foreground outline-none hover:border-primary transition-colors cursor-pointer"
                    >
                      <option>Newline</option><option>Carriage return</option><option>Both NL &amp; CR</option><option>No line ending</option>
                    </select>
                    <select 
                      value={baudRate}
                      onChange={(e) => setBaudRate(e.target.value)}
                      className="bg-background border border-border rounded px-2 py-0.5 text-foreground outline-none hover:border-primary transition-colors cursor-pointer"
                    >
                      <option value="9600">9600 baud</option>
                      <option value="115200">115200 baud</option>
                      <option value="57600">57600 baud</option>
                    </select>
                    <button onClick={() => setSerialLogs([])}
                      className="ml-auto flex items-center gap-1 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary rounded px-3 py-0.5 text-foreground transition-all active:scale-95 text-[10px] font-bold">
                      <SafeIcon icon={RotateCcw} size={10} /> CLEAR LOGS
                    </button>
                  </div>
                  <div className="flex-1 font-mono text-[11px] leading-relaxed text-cyan-400 overflow-y-auto py-2 custom-scrollbar px-2">
                    {serialLogs.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground/30 italic">No serial data received...</div>
                    ) : (
                      serialLogs.map((log, i) => (<div key={i} className="hover:bg-primary/5 transition-colors">{log}</div>))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                  <form onSubmit={handleSerialSend} className="flex gap-2 shrink-0 border-t border-border pt-2">
                    <input 
                      type="text" 
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                      placeholder="Send command to board..."
                      className="flex-1 bg-background border border-border rounded px-3 py-1 text-[12px] text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                    <button type="submit" className="px-4 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-[11px] font-bold transition-all active:scale-95">
                      SEND
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* OPEN FILE MODAL (MOCK) */}
      {/* ================================================== */}
      {showOpenModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowOpenModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            style={{ animation: 'slideInRight 200ms ease forwards' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-[14px] font-bold text-foreground">Open Sketch</span>
              <button onClick={() => setShowOpenModal(false)} className="text-muted-foreground hover:text-foreground"><SafeIcon icon={X} size={18} /></button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {['sketch_mar21a.ino', 'blink_example.ino', 'motor_control.ino', 'wifi_scanner.ino'].map(f => (
                <button key={f} onClick={() => { setShowOpenModal(false); addLog(`> Opened ${f}`); showToast(`Opened ${f}`); }}
                  className="w-full text-left px-3 py-2 hover:bg-secondary rounded text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <SafeIcon icon={FolderOpen} size={14} className="text-primary" /> {f}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
