// Mock execution adapter for ProtoCode Studio
// Replace with real API endpoints when backend is available

export interface CompileResult {
  success: boolean;
  logs: string[];
  errors: string[];
  mode?: string;
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

export async function compileSketch(
  code: string,
  fqbn: string,
  sketchName: string
): Promise<CompileResult> {
  // Simulate compilation delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Basic syntax check mock
  const hasSetup = code.includes('void setup()');
  const hasLoop = code.includes('void loop()');

  if (!hasSetup || !hasLoop) {
    return {
      success: false,
      logs: [
        `> Compiling sketch for ${fqbn}...`,
        `Sketch: ${sketchName}`,
        `Using board: ${fqbn}`,
      ],
      errors: [
        ...(!hasSetup ? ['error: undefined reference to `setup`'] : []),
        ...(!hasLoop ? ['error: undefined reference to `loop`'] : []),
      ],
      mode: 'mock',
    };
  }

  const lines = code.split('\n').length;
  return {
    success: true,
    logs: [
      `> Compiling sketch for ${fqbn}...`,
      `Sketch: ${sketchName}`,
      `Using board: ${fqbn}`,
      `Compiling core...`,
      `Compiling libraries...`,
      `Linking...`,
      `Sketch uses ${Math.floor(lines * 32)} bytes (${Math.floor(lines * 0.1)}%) of program storage space.`,
      `Global variables use ${Math.floor(lines * 8)} bytes (${Math.floor(lines * 0.04)}%) of dynamic memory.`,
    ],
    errors: [],
    mode: 'mock',
  };
}

export async function uploadSketch(
  code: string,
  fqbn: string,
  port: string,
  sketchName: string
): Promise<UploadResult> {
  // First compile
  const compileResult = await compileSketch(code, fqbn, sketchName);
  if (!compileResult.success) {
    return {
      success: false,
      logs: [...compileResult.logs, '✗ Compilation failed. Upload aborted.'],
      errors: compileResult.errors,
    };
  }

  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    success: true,
    logs: [
      ...compileResult.logs,
      `> Uploading to ${port}...`,
      `Writing flash...`,
      `Verifying...`,
      `Reset target board...`,
    ],
    errors: [],
  };
}

export async function installLibrary(name: string): Promise<LibInstallResult> {
  // Simulate install delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    output: `✓ Successfully installed ${name}`,
  };
}
