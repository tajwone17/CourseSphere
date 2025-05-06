import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Wrap the DB query in a Promise to make it async/await compatible
    const result = await new Promise((resolve, reject) => {
      db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
          console.error('Database test query failed:', err.stack);
          reject(err);
          return;
        }
        console.log('Database test query successful:', results);
        resolve(results);
      });
    });

    // Return success response
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      result 
    });
  } catch (error) {
    console.error('Database connection test error:', error);
    
    // Return error response
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}