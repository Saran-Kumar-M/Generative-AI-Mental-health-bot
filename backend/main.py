from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os

app = FastAPI()

# Enable CORS for frontend on localhost:5173 (Vite default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Mental Health Chatbot API. Use POST /api/chat to chat."}

class ChatRequest(BaseModel):
    message: list[str]  # full conversation history

def run_ollama_safely(command_args, timeout=60):
    """
    Run ollama command with proper encoding handling for Windows
    """
    try:
        # Set environment to ensure UTF-8 encoding
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        env['PYTHONUTF8'] = '1'  # Force UTF-8 mode
        
        result = subprocess.run(
            command_args,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding='utf-8',          # Explicitly set UTF-8 encoding
            errors='replace',          # Replace problematic characters instead of failing
            env=env,
            shell=False                # Don't use shell to avoid additional encoding issues
        )
        return result
    except subprocess.TimeoutExpired as e:
        print(f"⏰ Command timed out after {timeout} seconds: {' '.join(command_args)}")
        raise e
    except Exception as e:
        print(f"❌ Error running command {' '.join(command_args)}: {str(e)}")
        raise e

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    print(f"📨 Received request: {request.message}")  # Debug print
    
    try:
        # First, let's test if ollama is accessible
        print("🔍 Testing ollama list command...")
        test_result = run_ollama_safely(["ollama", "list"], timeout=10)
        
        if test_result.returncode != 0:
            print(f"❌ Ollama list failed: {test_result.stderr}")
            return {
                "reply": "Ollama is not running. Please start 'ollama serve' in your terminal and make sure Llama 3 is installed."
            }
        
        print("✅ Ollama is running, attempting to generate response...")
        
        # Get the last user message from conversation history
        user_message = "Hello"  # Default fallback
        if request.message:
            # Extract just the user's actual message from the conversation format
            last_message = request.message[-1]
            if "User:" in last_message:
                user_message = last_message.split("User:", 1)[-1].strip()
                # Handle mood context
                if "(feeling" in user_message:
                    user_message = user_message.split(":", 1)[-1].strip()
            else:
                user_message = last_message
        
        print(f"💭 Processing message: {user_message}")
        
        # Create a focused mental health prompt for Llama 3
        mental_health_prompt = f"""You are Jarvis, a compassionate mental health assistant. Provide helpful, supportive advice. Keep responses concise (2-3 sentences), warm, and encouraging.

User: {user_message}

Jarvis:"""
        
        print(f"🚀 Sending prompt to Llama 3...")
        
        # Try different model names that might be available
        model_names = ["llama3", "llama3:latest", "llama3:8b", "llama3:70b"]
        
        result = None
        model_used = None
        
        for model_name in model_names:
            try:
                print(f"🔄 Trying model: {model_name}")
                result = run_ollama_safely(
                    ["ollama", "run", model_name, mental_health_prompt],
                    timeout=90  # Increased timeout for better reliability
                )
                
                if result.returncode == 0 and result.stdout.strip():
                    model_used = model_name
                    print(f"✅ Successfully used model: {model_name}")
                    break
                else:
                    print(f"⚠️ Model {model_name} failed or returned empty response")
                    
            except Exception as e:
                print(f"⚠️ Failed to use model {model_name}: {str(e)}")
                continue
        
        if not result or result.returncode != 0:
            print(f"❌ All Llama 3 models failed")
            return {
                "reply": "I'm having trouble accessing Llama 3 right now. Please make sure it's properly installed and running."
            }
        
        # Clean up the response
        reply = result.stdout.strip()
        
        # Remove any residual prompt text that might have been echoed
        if "Jarvis:" in reply:
            reply = reply.split("Jarvis:")[-1].strip()
        
        # Remove any system prompts that might have leaked through
        if "You are Jarvis" in reply:
            lines = reply.split('\n')
            clean_lines = [line for line in lines if not line.startswith("You are") and not line.startswith("User:")]
            reply = '\n'.join(clean_lines).strip()
        
        if not reply:
            return {
                "reply": "I'm here to help! Could you tell me more about what's on your mind?"
            }
        
        print(f"💬 Sending reply: {reply[:100]}..." if len(reply) > 100 else f"💬 Sending reply: {reply}")
        return {"reply": reply}
        
    except subprocess.TimeoutExpired:
        print("⏰ Ollama request timed out")
        return {
            "reply": "I'm taking a bit longer to think about your message. Please try again in a moment."
        }
    except FileNotFoundError:
        print("❌ Ollama command not found")
        return {
            "reply": "Ollama is not installed or not in PATH. Please install Ollama first and make sure it's running."
        }
    except Exception as e:
        print(f"💥 Unexpected error: {str(e)}")
        return {
            "reply": "I encountered an unexpected issue. Please try again or check if Ollama is running properly."
        }

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Test if Ollama is responsive
        result = run_ollama_safely(["ollama", "list"], timeout=5)
        if result.returncode == 0:
            return {
                "status": "healthy", 
                "ollama": "running", 
                "models": result.stdout.strip()
            }
        else:
            return {
                "status": "unhealthy", 
                "ollama": "not responding", 
                "error": result.stderr.strip()
            }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Mental Health Chatbot API...")
    print("🔗 Frontend should connect to: http://localhost:8000")
    print("🏥 Health check available at: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000)