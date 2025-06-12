import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Validate input
  if (!userMessage || typeof userMessage !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid input: Message must be a string" });
  }

  // Spawn Ollama process
  const ollama = spawn("ollama", ["run", "llama3"]);

  let responseData = "";
  let errorData = "";

  // Capture standard output
  ollama.stdout.on("data", (data) => {
    responseData += data.toString();
  });

  // Capture errors
  ollama.stderr.on("data", (data) => {
    errorData += data.toString();
    console.error(`stderr: ${data}`);
  });

  // Send the user's message to Ollama
  ollama.stdin.write(`${userMessage}\n`);
  ollama.stdin.end();

  // Handle process completion
  ollama.on("close", (code) => {
    if (code === 0) {
      res.json({ reply: responseData.trim() });
    } else {
      res.status(500).json({
        error: "LLaMA process failed",
        details: errorData.trim() || "Check Ollama installation or logs.",
      });
    }
  });
});

// Start the server
app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
