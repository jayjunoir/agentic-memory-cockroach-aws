import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def inject_test_alert():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        # Fetch existing tenant ID
        cur.execute("SELECT tenant_id FROM tenants LIMIT 1;")
        tenant_row = cur.fetchone()
        
        if not tenant_row:
            print("❌ No tenant found. Run seed_data.py first!")
            return
            
        tenant_id = tenant_row[0]

        # Insert a NEW incoming alert matching our historical PowerShell false-positive pattern
        print("📥 Ingesting incoming CrowdStrike alert into CockroachDB...")
        cur.execute("""
            INSERT INTO alerts (tenant_id, source, raw_payload, severity, status)
            VALUES (
                %s, 
                'crowdstrike', 
                '{"event": "Suspicious PowerShell Execution", "host": "srv-finance-02", "cmd": "powershell.exe -Enc QmFja3VwU2NyaXB0"}', 
                'HIGH', 
                'new'
            )
            RETURNING alert_id;
        """, (tenant_id,))
        
        alert_id = cur.fetchone()[0]
        conn.commit()
        print(f"🚨 New alert logged to database inbox! Alert ID: {alert_id}")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting alert: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    inject_test_alert()