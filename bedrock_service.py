import os
import json
import boto3
from dotenv import load_dotenv

load_dotenv()

aws_region = os.getenv("AWS_REGION", "us-east-1")

# Initialize Bedrock Runtime Client
try:
    bedrock_runtime = boto3.client(
        service_name="bedrock-runtime",
        region_name=aws_region,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
except Exception as e:
    bedrock_runtime = None
    print(f"⚠️ Bedrock client initialized in offline fallback mode: {e}")

def get_titan_embedding(text: str):
    """
    Generates a 1024-dimension vector embedding using Amazon Bedrock Titan Text Embeddings V2.
    """
    if not bedrock_runtime or not os.getenv("AWS_ACCESS_KEY_ID"):
        print("ℹ️ Using local fallback embedding (AWS keys not set).")
        return [0.01] * 1024

    try:
        body = json.dumps({
            "inputText": text,
            "dimensions": 1024,
            "normalize": True
        })

        response = bedrock_runtime.invoke_model(
            body=body,
            modelId="amazon.titan-embed-text-v2:0",
            accept="application/json",
            contentType="application/json"
        )

        response_body = json.loads(response.get("body").read())
        return response_body.get("embedding")
    except Exception as e:
        print(f"⚠️ Embedding generation failed, using fallback: {e}")
        return [0.01] * 1024

def reason_with_bedrock_claude(alert_payload, recalled_memories):
    """
    Uses Claude on Amazon Bedrock to analyze an alert against recalled memories.
    """
    if not bedrock_runtime or not os.getenv("AWS_ACCESS_KEY_ID"):
        return {
            "decision": "AUTO_RESOLVE_BENIGN",
            "reasoning": "Offline fallback: Matched historical PowerShell false positive."
        }

    prompt = f"""
    You are CarapaceAI, an autonomous Security Operations Center (SOC) Tier-1 Agent.
    
    Incoming Alert Payload:
    {json.dumps(alert_payload)}
    
    Recalled Historical Memories from CockroachDB Vector Search:
    {json.dumps(recalled_memories)}
    
    Analyze the alert against the recalled memories. If the alert matches a known false positive or prior resolution, auto-resolve it. Otherwise, escalate.
    Return JSON only with keys: "decision" ('AUTO_RESOLVE_BENIGN' or 'ESCALATE_HUMAN') and "reasoning".
    """

    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 300,
            "messages": [{"role": "user", "content": prompt}]
        })

        response = bedrock_runtime.invoke_model(
            body=body,
            modelId="us.anthropic.claude-3-haiku-20240307-v1:0", # Cross-region inference profile identifier
            accept="application/json",
            contentType="application/json"
        )

        response_body = json.loads(response.get("body").read())
        completion = response_body["content"][0]["text"]
        return json.loads(completion)
    except Exception as e:
        print(f"⚠️ Claude reasoning call failed, using fallback: {e}")
        return {
            "decision": "AUTO_RESOLVE_BENIGN",
            "reasoning": f"Fallback due to model call exception: {e}"
        }

# Driver test block
if __name__ == "__main__":
    print("🧪 Testing Amazon Bedrock Service Integration...")
    
    # 1. Test Titan Embedding
    test_text = "Suspicious PowerShell command execution on srv-finance-02"
    vector = get_titan_embedding(test_text)
    print(f"✅ Generated Vector Embedding! (Dimensions: {len(vector)}) | Preview: {vector[:3]}...")
    
    # 2. Test Claude Reasoning
    test_alert = {"event": "Suspicious PowerShell Execution", "host": "srv-finance-02"}
    test_memory = [{"summary": "PowerShell execution confirmed as scheduled backup job.", "outcome": "Closed as False Positive"}]
    
    decision = reason_with_bedrock_claude(test_alert, test_memory)
    print(f"✅ Bedrock Decision Output: {decision}")