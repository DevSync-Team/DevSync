import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';
import ExecutionResult from '../models/executionResult.model.js';
import type { IExecutionResult } from '../models/executionResult.model.js';
import mongoose from 'mongoose';

const TEMP_DIR = path.resolve(process.cwd(), 'tmp');

fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

const EXECUTION_TIMEOUT_MS = 5000;
const MAX_OUTPUT_LENGTH = 1000; 

export const executeCodeService = async (
  codeContent: string, 
  language: string, 
  sessionId: string, 
  fileId: string, 
  userId: string
): Promise<Partial<IExecutionResult>> => {
    
  const startTime = Date.now();
  const tempFileName = `${sessionId}-${userId}-${Date.now()}`;
  const fileExtension = language === 'typescript' ? '.ts' : '.js';
  const tempFilePath = path.join(TEMP_DIR, tempFileName + fileExtension);
    
  const command = 'node';
  const args = language === 'typescript' 
    ? ['--loader', 'ts-node/esm', tempFilePath] 
    : [tempFilePath];

  let status: IExecutionResult['status'] = 'error';
  let output = '';
  let error_message = '';
  let executionTimeMs = 0;

  try {
    await fs.writeFile(tempFilePath, codeContent);

    const child = spawn(command, args, { 
      cwd: TEMP_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: EXECUTION_TIMEOUT_MS,
    });

    const outputBuffers: Buffer[] = [];
    const errorBuffers: Buffer[] = [];
        
    child.stdout.on('data', (data) => outputBuffers.push(data as Buffer));
    child.stderr.on('data', (data) => errorBuffers.push(data as Buffer));

    const exitPromise = new Promise<number | null>((resolve, reject) => {
      child.on('error', (err) => reject(err)); 
      child.on('exit', (code) => resolve(code)); 
    });

    const exitCode = await exitPromise;
        
    const rawOutput = Buffer.concat(outputBuffers).toString('utf8');
    const rawError = Buffer.concat(errorBuffers).toString('utf8');
        
    if (rawError || exitCode !== 0) {
      status = 'error';
      error_message = rawError.substring(0, MAX_OUTPUT_LENGTH); 
      output = rawOutput.substring(0, MAX_OUTPUT_LENGTH);
    } else {
      status = 'success';
      output = rawOutput.substring(0, MAX_OUTPUT_LENGTH);
    }

  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ETIMEDOUT' || (err as Error).message.includes('timeout')) {
      status = 'timeout';
      error_message = `Execution timed out after ${EXECUTION_TIMEOUT_MS}ms.`;
    } else {
      status = 'error';
      error_message = `Internal Server Error: ${(err as Error).message}`;
    }
  } finally {
    executionTimeMs = Date.now() - startTime;
        
    await fs.unlink(tempFilePath).catch(() => {});
    
    const resultToLog = {
      session_id: new mongoose.Types.ObjectId(sessionId),
      file_id: new mongoose.Types.ObjectId(fileId),
      user_id: new mongoose.Types.ObjectId(userId),
      code_content: codeContent.substring(0, 5000), 
      output: output,
      error_message: error_message,
      execution_time_ms: executionTimeMs,
      status: status,
    };

    await ExecutionResult.create(resultToLog).catch(logErr => {
      console.error("Failed to log execution result:", logErr);
    });
        
    return {
      output,
      error_message,
      status,
      execution_time_ms: executionTimeMs,
    };
  }
};