import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def seed_database():
    print("🔌 Connecting to CockroachDB...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    try:
        # 1. Create Default Tenant
        print("🏢 Creating default tenant...")
        cur.execute("""
            INSERT INTO tenants (name, crdb_region)
            VALUES ('Enterprise-SOC-Alpha', 'eu-central-1')
            RETURNING tenant_id;
        """)
        tenant_id = cur.fetchone()[0]
        print(f"✅ Created Tenant ID: {tenant_id}")

        # 2. Insert Historical Alert & Incident for Recall Context
        print("🚨 Seeding historical incident memory...")
        cur.execute("""
            INSERT INTO alerts (tenant_id, source, raw_payload, severity, status)
            VALUES (%s, 'crowdstrike', '{"event": "Suspicious PowerShell Execution", "host": "srv-finance-01"}', 'HIGH', 'resolved')
            RETURNING alert_id;
        """, (tenant_id,))
        alert_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO incidents (tenant_id, alert_id, title, summary, status, disposition)
            VALUES (%s, %s, 'Encoded PowerShell Command Executed', 'Encoded command executed by scheduled backup task. Identified as false positive.', 'resolved', 'benign')
            RETURNING incident_id;
        """, (tenant_id, alert_id))
        incident_id = cur.fetchone()[0]

        # 3. Create Vector Embedding baseline (1024 dims)
        dummy_embedding = [0.01] * 1024  
        
        cur.execute("""
            INSERT INTO incident_embeddings (tenant_id, incident_id, content_summary, embedding, outcome)
            VALUES (%s, %s, 'PowerShell execution on finance host confirmed as scheduled backup job.', %s, 'Closed as False Positive');
        """, (tenant_id, incident_id, dummy_embedding))

        conn.commit()
        print("🎉 Database successfully seeded with baseline memory!")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error seeding database: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    seed_database()