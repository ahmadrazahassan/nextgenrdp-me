// src/pages/api/test.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { runTests } from '../../utils/test-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Run tests and capture console output
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(' ')}`);
      originalConsoleError(...args);
    };
    
    // Run tests
    await runTests();
    
    // Restore console functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    // Return test results
    return res.status(200).json({
      success: true,
      data: {
        message: 'Tests completed',
        logs,
      },
    });
    
  } catch (error) {
    console.error('Test execution error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Error running tests',
        details: error.message,
      },
    });
  }
}
