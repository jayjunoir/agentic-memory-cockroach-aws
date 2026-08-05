// dashboard/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const incidentsRes = await query(`
      SELECT 
        i.incident_id,
        i.title,
        i.summary,
        i.status,
        i.disposition,
        COALESCE(a.created_at, NOW()) as created_at,
        a.action_type,
        a.reasoning_trace,
        a.tool_call,
        a.result
      FROM incidents i
      LEFT JOIN agent_actions a ON i.incident_id = a.incident_id
      ORDER BY a.created_at DESC
      LIMIT 10;
    `);

    return NextResponse.json({
      success: true,
      incidents: incidentsRes.rows,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}