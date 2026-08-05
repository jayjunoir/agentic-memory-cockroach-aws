# notifier_service.py
import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL", "")

def send_soc_webhook(incident_title, summary, disposition):
    """
    Sends a rich notification webhook to Slack or Discord for SOC triage alerts.
    """
    if not DISCORD_WEBHOOK_URL:
        print("ℹ️ Webhook URL not configured. Skipping notification dispatch.")
        return

    payload = {
        "content": f"🚨 **CARAPACE AI SOC ALERT ESCALATED** 🚨\n> **Incident:** {incident_title}\n> **Disposition:** `{disposition.upper()}`\n> **Summary:** {summary}"
    }

    req = urllib.request.Request(
        DISCORD_WEBHOOK_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"✅ SOC Webhook dispatched successfully! Status: {response.status}")
    except Exception as e:
        print(f"⚠️ Failed to dispatch SOC webhook: {e}")

if __name__ == "__main__":
    send_soc_webhook("Test SSH Brute Force", "High severity brute force detected.", "malicious")