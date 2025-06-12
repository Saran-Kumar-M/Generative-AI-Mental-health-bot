import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiMoon,
  FiSun,
  FiZap,
  FiHeart,
  FiStar,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";
import {
  RiMentalHealthLine,
  RiBrainLine,
  RiHeartPulseLine,
} from "react-icons/ri";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: string;
  reactions?: string[];
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isDarkMode: boolean;
  isLoading?: boolean;
}

// Enhanced MessageBubble component
const MessageBubble: React.FC<{
  message: Message;
  isUser: boolean;
  mood?: string;
  isDarkMode: boolean;
  onReact: (messageId: string, reaction: string) => void;
}> = ({ message, isUser, mood, isDarkMode, onReact }) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactions = ["👍", "❤️", "😊", "🙏", "💡"];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative transform transition-all duration-300 hover:scale-[1.02] ${
          isUser
            ? "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
            : isDarkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white shadow-lg shadow-gray-700/25"
            : "bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 shadow-lg shadow-gray-300/25"
        } backdrop-blur-sm border border-white/10`}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        {mood && (
          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm">
            Mood: {mood}
          </span>
        )}

        {/* Reaction Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {message.reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {reaction}
              </span>
            ))}
          </div>
        )}

        {/* Floating Reaction Menu */}
        {showReactions && !isUser && (
          <div className="absolute -top-12 left-0 flex gap-1 bg-black/80 backdrop-blur-md rounded-full px-2 py-1 animate-in slide-in-from-bottom-2 duration-200">
            {reactions.map((reaction) => (
              <button
                key={reaction}
                onClick={() => onReact(message.id, reaction)}
                className="hover:scale-125 transition-transform duration-200 text-sm"
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const personalityDescriptions: Record<
  string,
  { name: string; emoji: string; gradient: string }
> = {
  motivator: {
    name: "Motivator",
    emoji: "💪",
    gradient: "from-orange-500 to-red-500",
  },
  philosopher: {
    name: "Philosopher",
    emoji: "🧠",
    gradient: "from-blue-500 to-indigo-600",
  },
  minimalist: {
    name: "Minimalist",
    emoji: "🎯",
    gradient: "from-gray-500 to-slate-600",
  },
  "sci-fi": {
    name: "Sci-Fi Jarvis",
    emoji: "🤖",
    gradient: "from-cyan-500 to-blue-600",
  },
};

const suggestions = [
  {
    text: "I feel anxious lately",
    color: "from-yellow-400 to-orange-500",
  },
  {
    text: "Give me a daily affirmation",
    color: "from-purple-400 to-pink-500",
  },
  {
    text: "I'm feeling overwhelmed",
    color: "from-green-400 to-emerald-500",
  },
  {
    text: "What should I do to relax",
    color: "from-blue-400 to-cyan-500",
  },
];

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isDarkMode,
  isLoading = false,
}) => {
  const [input, setInput] = useState("");
  const [botPersonality, setBotPersonality] = useState("motivator");
  const [isOnline, setIsOnline] = useState(true);
  const [meditationMode, setMeditationMode] = useState<null | "calm" | "focus">(
    null
  );
  const [messageReactions, setMessageReactions] = useState<
    Record<string, string[]>
  >({});
  const [typingText, setTypingText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<
    "inhale" | "hold" | "exhale" | "hold2"
  >("inhale");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      setInput("");
      setIsOnline(true);
      try {
        await onSendMessage(userMessage);
      } catch (err) {
        console.error("Failed to send message:", err);
        setIsOnline(false);
      }
    }
  };

  const handleSuggestionClick = async (text: string) => {
    setInput(text);
    // Brief visual feedback before auto-sending
    setTimeout(async () => {
      setInput("");
      setIsOnline(true);
      try {
        await onSendMessage(text);
      } catch (err) {
        console.error("Failed to send message:", err);
        setIsOnline(false);
      }
    }, 150);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction],
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing animation effect
  useEffect(() => {
    if (isLoading) {
      const texts = [
        "Analyzing your message...",
        "Processing thoughts...",
        "Crafting response...",
      ];
      let textIndex = 0;
      let charIndex = 0;

      const typeText = () => {
        if (charIndex < texts[textIndex].length) {
          setTypingText(texts[textIndex].slice(0, charIndex + 1));
          charIndex++;
          setTimeout(typeText, 50);
        } else {
          setTimeout(() => {
            textIndex = (textIndex + 1) % texts.length;
            charIndex = 0;
            setTypingText("");
            setTimeout(typeText, 200);
          }, 1000);
        }
      };

      typeText();
    } else {
      setTypingText("");
    }
  }, [isLoading]);

  // Breathing phase controller
  useEffect(() => {
    if (!meditationMode) return;

    const isCalm = meditationMode === "calm";
    const phases = isCalm
      ? [
          { phase: "inhale", duration: 4000, text: "Breathe In" },
          { phase: "hold", duration: 2000, text: "Hold" },
          { phase: "exhale", duration: 6000, text: "Breathe Out" },
          { phase: "hold2", duration: 2000, text: "Hold" },
        ]
      : [
          { phase: "inhale", duration: 2000, text: "Breathe In" },
          { phase: "hold", duration: 1000, text: "Hold" },
          { phase: "exhale", duration: 3000, text: "Breathe Out" },
          { phase: "hold2", duration: 1000, text: "Hold" },
        ];

    let currentPhaseIndex = 0;

    const cyclePhases = () => {
      const currentPhase = phases[currentPhaseIndex];
      setBreathingPhase(currentPhase.phase as any);

      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        cyclePhases();
      }, currentPhase.duration);
    };

    cyclePhases();
  }, [meditationMode]);

  const getBreathingText = () => {
    const isCalm = meditationMode === "calm";
    switch (breathingPhase) {
      case "inhale":
        return isCalm ? "Breathe In Slowly" : "Quick Inhale";
      case "hold":
        return "Hold";
      case "exhale":
        return isCalm ? "Release Gently" : "Focus Exhale";
      case "hold2":
        return "Rest";
      default:
        return "Breathe";
    }
  };

  const renderBreathingOverlay = () => {
    const isCalm = meditationMode === "calm";
    const gradientClass = isCalm
      ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      : "bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900";

    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-white ${gradientClass}`}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Main Breathing Circle */}
        <div className="relative">
          <div
            className={`rounded-full w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br ${
              isCalm
                ? "from-blue-400/30 to-purple-600/30"
                : "from-green-400/30 to-teal-600/30"
            } shadow-2xl backdrop-blur-xl border border-white/10`}
            style={{
              animation: `breathe ${
                isCalm ? "14s" : "7s"
              } ease-in-out infinite`,
            }}
          />
          <div
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${
              isCalm
                ? "from-blue-300/20 to-purple-500/20"
                : "from-green-300/20 to-teal-500/20"
            } backdrop-blur-md`}
            style={{
              animation: `breathe ${
                isCalm ? "14s" : "7s"
              } ease-in-out infinite 0.5s`,
            }}
          />
        </div>

        {/* Breathing Instruction Text */}
        <div className="text-center mt-8">
          <h3 className="text-4xl md:text-5xl font-light mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent transition-all duration-1000">
            {getBreathingText()}
          </h3>
          <div className="h-6 flex items-center justify-center">
            <div className="flex gap-1">
              {breathingPhase === "inhale" && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              )}
              {(breathingPhase === "hold" || breathingPhase === "hold2") && (
                <div className="w-6 h-2 bg-yellow-400 rounded-full" />
              )}
              {breathingPhase === "exhale" && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 px-6 max-w-md">
          <h2 className="text-2xl md:text-3xl font-light mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {isCalm ? "Deep Relaxation" : "Focused Energy"}
          </h2>
          <p className="text-sm opacity-90 mb-8 leading-relaxed">
            {isCalm
              ? "Let each breath wash away tension and bring inner peace."
              : "Channel your breath to sharpen focus and clarity."}
          </p>
          <button
            onClick={() => setMeditationMode(null)}
            className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-medium transition-all duration-300 hover:scale-105 border border-white/20"
          >
            Complete Session
          </button>
        </div>

        <style jsx>{`
          @keyframes breathe {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {meditationMode && renderBreathingOverlay()}

      {/* Glassmorphism Container - Full height with proper flex layout */}
      <div
        className={`h-full flex flex-col rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-pink-900/20 border-white/10 text-white shadow-2xl shadow-purple-500/10"
            : "bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/30 border-white/20 text-gray-900 shadow-2xl shadow-blue-500/10"
        }`}
      >
        {/* Enhanced Header - Fixed height */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <RiMentalHealthLine className="text-3xl text-purple-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jarvis AI
              </h2>
              <p className="text-sm opacity-70">Mental Wellness Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border ${
                isLoading
                  ? "bg-yellow-500/20 border-yellow-500/30"
                  : isOnline
                  ? "bg-green-500 border-green-500"
                  : "bg-red-500/20 border-red-500/30"
              }`}
            >
              {isLoading ? (
                <RiBrainLine className="animate-spin" />
              ) : isOnline ? (
                <FiWifi />
              ) : (
                <FiWifiOff />
              )}
              <span className="text-sm font-medium">
                {isLoading ? "Processing" : isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <div
              className={`px-4 py-2 rounded-full backdrop-blur-md border bg-gradient-to-r ${personalityDescriptions[botPersonality].gradient} border-white/20`}
            >
              <span className="text-sm font-medium text-white">
                {personalityDescriptions[botPersonality].emoji}{" "}
                {personalityDescriptions[botPersonality].name}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area - Flexible height with internal scrolling */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth min-h-0">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={{ ...msg, reactions: messageReactions[msg.id] }}
              isUser={msg.sender === "user"}
              mood={msg.mood}
              isDarkMode={isDarkMode}
              onReact={handleReaction}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className={`px-6 py-4 rounded-2xl backdrop-blur-md border ${
                  isDarkMode
                    ? "bg-gray-800/60 border-gray-700/50"
                    : "bg-white/60 border-gray-200/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{typingText}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Section - Fixed height, contains suggestions and input */}
        <div className="flex-shrink-0 p-6 pt-4 space-y-4">
          {/* Compact Enhanced Suggestions */}
          <div>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
              <FiZap className="text-yellow-500 w-3 h-3" /> Quick Suggestions
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`group relative flex-shrink-0 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br ${suggestion.color} text-white overflow-hidden active:scale-95 text-sm font-medium whitespace-nowrap`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Share what's on your mind..."
                  className={`w-full p-4 pr-12 rounded-2xl backdrop-blur-md border transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                    isDarkMode
                      ? "bg-black border-gray-700/50 text-white placeholder-gray-400 focus:border-purple-500/50"
                      : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500 focus:border-purple-500/50"
                  }`}
                  disabled={!!meditationMode}
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                >
                  😊
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!!meditationMode || !input.trim()}
                className="group relative p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FiSend className="relative text-xl" />
              </button>
            </div>

            {/* Control Panel */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Meditation Controls */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <RiHeartPulseLine className="text-pink-500" /> Mindfulness
                  Sessions
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMeditationMode("calm")}
                    className="flex-1 group relative p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-2">
                      <FiMoon className="animate-pulse" />
                      <span className="font-medium">Calm</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setMeditationMode("focus")}
                    className="flex-1 group relative p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-2">
                      <FiSun
                        className="animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                      <span className="font-medium">Focus</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personality Selector */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FiStar className="text-yellow-500" /> AI Personality
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(personalityDescriptions).map(
                    ([key, personality]) => (
                      <button
                        key={key}
                        onClick={() => setBotPersonality(key)}
                        className={`group relative p-3 rounded-xl transition-all duration-300 hover:scale-105 border overflow-hidden ${
                          botPersonality === key
                            ? `bg-gradient-to-r ${personality.gradient} text-white border-white/20 shadow-lg`
                            : isDarkMode
                            ? "bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50"
                            : "bg-white/50 text-gray-700 border-gray-300/50 hover:bg-gray-100/50"
                        }`}
                      >
                        {botPersonality === key && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                        )}
                        <div className="relative flex items-center gap-2 text-sm font-medium">
                          <span className="text-lg">{personality.emoji}</span>
                          <span className="truncate">{personality.name}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
