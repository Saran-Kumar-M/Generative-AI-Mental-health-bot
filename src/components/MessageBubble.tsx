import React, { useState } from "react";
import { FiHeart, FiThumbsUp, FiSmile, FiZap } from "react-icons/fi";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: string;
  reactions?: string[];
}

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
  onReact?: (messageId: string, reaction: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isDarkMode,
  onReact,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.sender === "user";
  const reactions = ["👍", "❤️", "😊", "🙏", "💡", "🔥"];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      tired: "😴",
      stressed: "😤",
      angry: "😠",
      calm: "😌",
      excited: "🤩",
      grateful: "🙏",
      confident: "💪",
    };
    return mood ? moodEmojis[mood] : null;
  };

  const getMoodColor = (mood?: string) => {
    const moodColors: { [key: string]: string } = {
      happy: "from-yellow-400 to-orange-400",
      sad: "from-blue-400 to-indigo-500",
      anxious: "from-purple-400 to-purple-600",
      tired: "from-gray-400 to-gray-600",
      stressed: "from-red-400 to-red-600",
      angry: "from-red-500 to-red-700",
      calm: "from-green-400 to-teal-500",
      excited: "from-pink-400 to-rose-500",
      grateful: "from-emerald-400 to-green-500",
      confident: "from-orange-400 to-red-500",
    };
    return mood ? moodColors[mood] : "from-gray-400 to-gray-500";
  };

  const handleReaction = (reaction: string) => {
    if (onReact) {
      onReact(message.id, reaction);
    }
    setShowReactions(false);
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } group animate-in slide-in-from-bottom-2 duration-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-end space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Enhanced Avatar */}
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 backdrop-blur-md border border-white/20 transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 hover:scale-110"
              : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 hover:scale-110"
          }`}
        >
          <span className="text-lg filter drop-shadow-sm">
            {isUser ? "👤" : "🤖"}
          </span>
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </div>

        {/* Message Container */}
        <div className="flex flex-col relative">
          {/* Main Message Bubble */}
          <div
            className={`
              relative px-5 py-4 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl
              ${
                isUser
                  ? "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white border-white/20 shadow-purple-500/25 rounded-br-md"
                  : isDarkMode
                  ? "bg-gradient-to-br from-gray-800/90 via-gray-700/80 to-gray-600/70 text-white border-white/10 shadow-gray-700/25 rounded-bl-md"
                  : "bg-gradient-to-br from-white/95 via-gray-50/90 to-white/85 text-gray-800 border-white/30 shadow-gray-300/25 rounded-bl-md"
              }
              overflow-hidden
            `}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

            {/* Mood indicator for user messages */}
            {isUser && message.mood && (
              <div className="relative flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-r ${getMoodColor(
                    message.mood
                  )} flex items-center justify-center shadow-md`}
                >
                  <span className="text-xs">{getMoodEmoji(message.mood)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs opacity-75 font-medium">
                    Feeling
                  </span>
                  <span className="text-xs capitalize font-semibold">
                    {message.mood}
                  </span>
                </div>
              </div>
            )}

            {/* Message Text */}
            <p className="relative text-sm leading-relaxed font-medium">
              {message.text}
            </p>

            {/* Reaction Display */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="relative flex gap-1 mt-3 flex-wrap">
                {message.reactions.map((reaction, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 text-xs bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-sm animate-in zoom-in-50 duration-300"
                  >
                    {reaction}
                  </span>
                ))}
              </div>
            )}

            {/* Floating Reaction Menu */}
            {showReactions && !isUser && (
              <div className="absolute -top-14 left-0 z-10 flex gap-1 bg-black/90 backdrop-blur-xl rounded-2xl px-3 py-2 animate-in slide-in-from-bottom-4 duration-300 border border-white/20 shadow-2xl">
                {reactions.map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className="hover:scale-125 hover:bg-white/10 p-1 rounded-lg transition-all duration-200 text-lg"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Timestamp */}
          <div
            className={`flex items-center gap-2 mt-2 px-2 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-60"
              }`}
            >
              {formatTime(message.timestamp)}
            </span>

            {/* Reaction button for bot messages */}
            {!isUser && (
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                } ${isHovered ? "opacity-100" : "opacity-0"}`}
              >
                <FiHeart className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
