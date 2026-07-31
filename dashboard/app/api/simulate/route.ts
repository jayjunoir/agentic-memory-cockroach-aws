// dashboard/app/api/simulate/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const alertType = body.type || 'powershell';

    // 1. Fetch Tenant ID
    const tenantRes = await query(`SELECT tenant_id FROM tenants LIMIT 1;`);
    if (tenantRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'No tenant found in CockroachDB.' }, { status: 400 });
    }
    const tenantId = tenantRes.rows[0].tenant_id;

    let rawPayload = {};
    let title = '';

    if (alertType === 'powershell') {
      title = 'Suspicious PowerShell Execution (Backup Job)';
      rawPayload = {
        event: 'Suspicious PowerShell Execution',
        host: 'srv-finance-02',
        cmd: 'powershell.exe -Enc QmFja3VwU2NyaXB0',
        user: 'SYSTEM'
      };
    } else {
      title = 'Unauthorized SSH Brute Force Attempt';
      rawPayload = {
        event: 'SSH Brute Force',
        host: 'prod-api-gateway',
        source_ip: '192.168.1.105',
        failed_attempts: 42
      };
    }

    // 2. Insert new Alert into CockroachDB Inbox
    const alertInsert = await query(`
      INSERT INTO alerts (tenant_id, source, raw_payload, severity, status)
      VALUES ($1, 'crowdstrike', $2, 'HIGH', 'new')
      RETURNING alert_id;
    `, [tenantId, JSON.stringify(rawPayload)]);

    const alertId = alertInsert.rows[0].alert_id;

    // 3. Triage Alert (Simulating Agent Core Execution)
    // Query Vector Memory for matching past incidents
    const isBenign = alertType === 'powershell';
    const disposition = isBenign ? 'benign' : 'malicious';
    const actionType = isBenign ? 'AUTO_RESOLVE_BENIGN' : 'ESCALATE_HUMAN';
    const reasoningTrace = isBenign 
      ? 'Matched historical PowerShell backup pattern on srv-finance-02 (Distance: 0.0000). Closed as False Positive.'
      : 'No matching false-positive memory found in CockroachDB Vector Index. High severity brute force detected. Escalating to Tier-1 Analyst.';

    // 4. Create Incident & Action in CockroachDB
    const incRes = await query(`
      INSERT INTO incidents (tenant_id, alert_id, title, summary, status, disposition)
      VALUES ($1, $2, $3, $4, 'resolved', $5)
      RETURNING incident_id;
    `, [tenantId, alertId, title, reasoningTrace, disposition]);

    const incidentId = incRes.rows[0].incident_id;

    await query(`
      INSERT INTO agent_actions (incident_id, action_type, reasoning_trace, tool_call, result)
      VALUES ($1, $2, $3, $4, $5);
    `, [
      incidentId, 
      actionType, 
      reasoningTrace, 
      JSON.stringify(rawPayload), 
      JSON.stringify({ status: actionType, distance: isBenign ? 0.0000 : 0.8421 })
    ]);

    // 5. Update Alert status in database
    await query(`UPDATE alerts SET status = 'processed' WHERE alert_id = $1;`, [alertId]);

    return NextResponse.json({
      success: true,
      alertId,
      incidentId,
      actionType,
      disposition
    });

  } catch (error: any) {
    console.error('Error simulating alert:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}