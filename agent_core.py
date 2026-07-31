import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def recall_similar_memories(cur, tenant_id, alert_summary_embedding, limit=3):
    """
    Queries CockroachDB's distributed vector index using cosine distance (<=>)
    to recall relevant historical security incidents.
    """
    print("🧠 [CarapaceAI] Querying CockroachDB Vector Memory...")
    
    # Cosine distance operator <=> in CockroachDB vector search
    query = """
        SELECT incident_id, content_summary, outcome, (embedding <=> %s::vector) as distance
        FROM incident_embeddings
        WHERE tenant_id = %s
        ORDER BY distance ASC
        LIMIT %s;
    """
    cur.execute(query, (alert_summary_embedding, tenant_id, limit))
    return cur.fetchall()

def process_unhandled_alerts():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1. Fetch 'new' alerts from CockroachDB durable inbox
        cur.execute("""
            SELECT alert_id, tenant_id, source, raw_payload, severity 
            FROM alerts 
            WHERE status = 'new' 
            LIMIT 1;
        """)
        alert = cur.fetchone()

        if not alert:
            print("🟢 [CarapaceAI] No new security alerts to triage.")
            return

        alert_id, tenant_id, source, raw_payload, severity = alert
        print(f"\n🚨 [CarapaceAI] Triaging Alert: {alert_id} | Source: {source} | Severity: {severity}")

        # 2. Simulate or generate Bedrock embedding (1024 dims) for the alert
        # For testing, we use a vector close to our seeded memory baseline
        sample_alert_embedding = [0.01] * 1024  

        # 3. RECALL: Search CockroachDB Vector Index
        memories = recall_similar_memories(cur, tenant_id, sample_alert_embedding)

        print(f"🔍 [CarapaceAI] Found {len(memories)} matching historical memories:")
        for mem in memories:
            inc_id, summary, outcome, distance = mem
            print(f"   ↳ Memory: '{summary}' | Outcome: {outcome} | Distance: {distance:.4f}")

        # 4. REASON & DECIDE: (In production, Bedrock processes this context)
        # Match decision based on recall memory context
        best_match_outcome = memories[0][2] if memories else None
        
        if best_match_outcome == "Closed as False Positive":
            decision = "AUTO_RESOLVE_BENIGN"
            reasoning = "Matches historical incident: Scheduled backup job running encoded PowerShell command."
            new_status = "resolved"
            disposition = "benign"
        else:
            decision = "ESCALATE_TO_SOC_HUMAN"
            reasoning = "No high-confidence historical resolution found. Escalating for manual review."
            new_status = "escalated"
            disposition = "true_positive"

        # 5. ACT: Transactionally create incident record and record agent action/audit trail
        print(f"⚡ [CarapaceAI] Decision: {decision}")
        
        # Create Incident
        cur.execute("""
            INSERT INTO incidents (tenant_id, alert_id, title, summary, status, disposition)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING incident_id;
        """, (tenant_id, alert_id, f"Triaged Alert from {source}", reasoning, new_status, disposition))
        incident_id = cur.fetchone()[0]

        # Update Alert Status
        cur.execute("UPDATE alerts SET status = %s WHERE alert_id = %s;", (new_status, alert_id))

        # Write Action Audit Trail to agent_actions
        cur.execute("""
            INSERT INTO agent_actions (incident_id, action_type, reasoning_trace, tool_call, result)
            VALUES (%s, 'recall_memory_and_triage', %s, %s, %s);
        """, (incident_id, reasoning, json.dumps({"recalled_memories": len(memories)}), json.dumps({"decision": decision})))

        # Update Agent Checkpoint for resilience / node-fail recovery
        cur.execute("""
            INSERT INTO agent_checkpoints (incident_id, step, state)
            VALUES (%s, 'TRIAGE_COMPLETE', %s);
        """, (incident_id, json.dumps({"status": new_status, "disposition": disposition})))

        conn.commit()
        print(f"✅ [CarapaceAI] Incident {incident_id} processed & persisted to CockroachDB!")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error in triage loop: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    process_unhandled_alerts()