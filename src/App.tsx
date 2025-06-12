import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import MoodTracker from "./components/MoodTracker";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css"; // Assuming you have some global CSS or Tailwind setup

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! 👋 How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string, mood?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      mood,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map((msg) =>
        msg.mood
          ? `User (feeling ${msg.mood}): ${msg.text}`
          : `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`
      );

      // IMPORTANT: For local development, ensure your backend server is running on http://localhost:8000
      // For deployment, this URL will need to be configured for your production API endpoint.
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data.reply || "I'm sorry, I couldn't process that. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("API error:", error);

      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please make sure the backend server is running.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer-most container: Ensures full viewport height and width
    // Added `relative` for potential absolute positioning of modals/overlays
    <div
      className={`relative h-screen w-screen overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Inner container: Flex column, padding, and ensures its children fill remaining height */}
      <div className="w-full h-full p-4 lg:p-6 flex flex-col">
        {/* Header (fixed height, won't shrink) */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          {/* Branding */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <span className="text-2xl">🌙</span>
            </div>
            <div>
              <h1
                className={`text-3xl font-extrabold tracking-wide ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Neura
              </h1>
              <p
                className={`text-sm italic ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your Mental Wellness Assistant
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
        </div>

        {/* Main Content Area: Takes remaining height, uses grid layout */}
        {/* `flex-1` ensures this section grows to fill available vertical space */}
        {/* `overflow-hidden` is important here as it's the parent of the scrollable chatbox/moodtracker */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Mood Tracker Wrapper */}
          {/* `h-full` makes MoodTracker fill its grid cell height */}
          <div className="h-full overflow-auto pb-4">
            <MoodTracker
              onMoodSelect={handleSendMessage}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* ChatBox Wrapper */}
          {/* `h-full` here is critical; it passes down the full available height of its grid cell to ChatBox */}
          <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
            <ChatBox
              messages={messages}
              onSendMessage={(msg) => handleSendMessage(msg)}
              isDarkMode={isDarkMode}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
