// Advanced execution adapter for ProtoCode Studio
// Simulates a real Arduino/ESP32 compilation environment

export interface CompileResult {
  success: boolean;
  logs: string[];
  errors: string[];
  mode: string;
  diagnostics: Diagnostic[];
  memoryUsage: {
    program: number;
    programPercent: number;
    dynamic: number;
    dynamicPercent: number;
  };
}

export interface Diagnostic {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface UploadResult {
  success: boolean;
  logs: string[];
  errors: string[];
}

export interface LibInstallResult {
  success: boolean;
  output?: string;
  errors?: string;
}

const BOARD_LIMITS: Record<string, { program: number; dynamic: number }> = {
  'arduino:avr:uno': { program: 32256, dynamic: 2048 },
  'arduino:avr:nano': { program: 30720, dynamic: 2048 },
  'arduino:avr:mega': { program: 253952, dynamic: 8192 },
  'esp32:esp32:esp32': { program: 1310720, dynamic: 327680 },
  'esp8266:esp8266:nodemcuv2': { program: 1048576, dynamic: 81920 },
};

export async function compileSketch(
  code: string,
  fqbn: string,
  sketchName: string
): Promise<CompileResult> {
  // Simulate compilation delay based on code length
  const complexity = code.length / 500;
  await new Promise(resolve => setTimeout(resolve, 800 + complexity * 1000));

  const logs: string[] = [
    `FQBN: ${fqbn}`,
    `Using board '${fqbn.split(':').pop()}' from platform arduino:avr`,
    `> Compiling sketch...`,
  ];
  const errors: string[] = [];
  const diagnostics: Diagnostic[] = [];

  const lines = code.split('\n');

  // 1. Basic Syntax Check (Mocking a real compiler)
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;

    // Semicolon check (very basic)
    if (
      trimmed && 
      !trimmed.endsWith('{') && 
      !trimmed.endsWith('}') && 
      !trimmed.endsWith(';') && 
      !trimmed.includes('if') && 
      !trimmed.includes('for') && 
      !trimmed.includes('while') &&
      !trimmed.startsWith('void')
    ) {
      const msg = `error: expected ';' before end of line`;
      errors.push(`${sketchName}.ino:${index + 1}:5: ${msg}`);
      diagnostics.push({ line: index + 1, message: msg, severity: 'error' });
    }
  });

  // 2. Global Entry Point Checks
  if (!code.includes('void setup()')) {
    const msg = `error: undefined reference to 'setup()'`;
    errors.push(msg);
    diagnostics.push({ line: 1, message: msg, severity: 'error' });
  }
  if (!code.includes('void loop()')) {
    const msg = `error: undefined reference to 'loop()'`;
    errors.push(msg);
    diagnostics.push({ line: 1, message: msg, severity: 'error' });
  }

  // 3. Library Detection
  const includes = code.match(/#include\s+<(.+?)>/g) || [];
  includes.forEach(inc => {
    const libName = inc.match(/<(.+?)\.h>/)?.[1];
    logs.push(`Using library ${libName} at version 1.0.0 in folder: /libraries/${libName}`);
  });

  const success = errors.length === 0;

  // 4. Memory Usage Calculation
  const baseSize = 444; // Arduino overhead
  const perLine = 12;
  const programSize = baseSize + lines.length * perLine + (success ? 0 : -200);
  const dynamicSize = 9 + (code.match(/int|float|char|String/g)?.length || 0) * 4;

  const limits = BOARD_LIMITS[fqbn] || BOARD_LIMITS['arduino:avr:uno'];
  
  const result: CompileResult = {
    success,
    logs: [
      ...logs,
      ...(success ? [
        `Linking everything together...`,
        `Executable segment: ${programSize} bytes`,
        `Data segment: ${dynamicSize} bytes`,
      ] : []),
    ],
    errors,
    mode: 'simulated_compiler_v2',
    diagnostics,
    memoryUsage: {
      program: programSize,
      programPercent: parseFloat(((programSize / limits.program) * 100).toFixed(2)),
      dynamic: dynamicSize,
      dynamicPercent: parseFloat(((dynamicSize / limits.dynamic) * 100).toFixed(2)),
    }
  };

  return result;
}

export async function uploadSketch(
  code: string,
  fqbn: string,
  port: string,
  sketchName: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const compileResult = await compileSketch(code, fqbn, sketchName);
  if (!compileResult.success) {
    return {
      success: false,
      logs: [...compileResult.logs, '✗ Compilation failed. Check the error log for details.'],
      errors: compileResult.errors,
    };
  }

  const logs = [...compileResult.logs, `> Sketch compiled successfully. Starting upload...`];

  // Simulated upload phases
  const phases = [
    { name: 'Connecting to programmer...', time: 400 },
    { name: 'Erasing flash...', time: 800 },
    { name: 'Writing to flash...', time: 1500, progress: true },
    { name: 'Verifying...', time: 600 },
    { name: 'Leaving... Hard resetting via RTS pin...', time: 200 }
  ];

  for (const phase of phases) {
    logs.push(phase.name);
    if (phase.progress && onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        onProgress(i);
        await new Promise(r => setTimeout(r, phase.time / 10));
      }
    } else {
      await new Promise(r => setTimeout(r, phase.time));
    }
  }

  return {
    success: true,
    logs: [...logs, `✓ Upload complete on ${port}`],
    errors: [],
  };
}

export async function installLibrary(name: string): Promise<LibInstallResult> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    output: `✓ Library '${name}' installed successfully.`,
  };
}
