// dashboard/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch recent incidents with agent actions
    // Replaced i.created_at with a fallback/safe selection
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

    // 2. Fetch raw alerts stats
    const alertsRes = await query(`
      SELECT status, COUNT(*) as count 
      FROM alerts 
      GROUP BY status;
    `);

    return NextResponse.json({
      success: true,
      incidents: incidentsRes.rows,
      alertStats: alertsRes.rows,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}