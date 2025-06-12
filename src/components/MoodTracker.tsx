import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiZap,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import {
  RiMentalHealthLine,
  RiHeartPulseLine,
  RiEmotionLine,
} from "react-icons/ri";

interface MoodTrackerProps {
  onMoodSelect: (message: string, mood: string) => void;
  isDarkMode: boolean;
}

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  message: string;
  intensity: "low" | "medium" | "high";
  category: "positive" | "neutral" | "negative";
  description: string;
}

const moods: Mood[] = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    color: "from-yellow-400 via-orange-400 to-orange-500",
    message: "I'm feeling happy today! ✨",
    intensity: "high",
    category: "positive",
    description: "Feeling joyful and content",
  },
  {
    id: "excited",
    emoji: "🤩",
    label: "Excited",
    color: "from-pink-400 via-rose-400 to-pink-500",
    message: "I'm feeling excited about things!",
    intensity: "high",
    category: "positive",
    description: "Full of energy and anticipation",
  },
  {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    color: "from-green-400 via-teal-400 to-cyan-400",
    message: "I'm feeling calm and peaceful.",
    intensity: "medium",
    category: "positive",
    description: "Peaceful and relaxed state",
  },
  {
    id: "grateful",
    emoji: "🙏",
    label: "Grateful",
    color: "from-emerald-400 via-green-400 to-teal-400",
    message: "I'm feeling grateful today.",
    intensity: "medium",
    category: "positive",
    description: "Appreciative and thankful",
  },
  {
    id: "motivated",
    emoji: "💪",
    label: "Motivated",
    color: "from-orange-400 via-red-400 to-pink-400",
    message: "I'm feeling motivated and ready to tackle anything!",
    intensity: "high",
    category: "positive",
    description: "Energized and determined",
  },
  {
    id: "tired",
    emoji: "😴",
    label: "Tired",
    color: "from-gray-400 via-slate-400 to-gray-500",
    message: "I'm feeling really tired today.",
    intensity: "medium",
    category: "neutral",
    description: "Low energy and need rest",
  },
  {
    id: "confused",
    emoji: "🤔",
    label: "Confused",
    color: "from-purple-400 via-indigo-400 to-purple-500",
    message: "I'm feeling confused about some things.",
    intensity: "low",
    category: "neutral",
    description: "Uncertain and seeking clarity",
  },
  {
    id: "bored",
    emoji: "😑",
    label: "Bored",
    color: "from-gray-500 via-slate-500 to-gray-600",
    message: "I'm feeling bored and need something interesting.",
    intensity: "low",
    category: "neutral",
    description: "Lacking stimulation or interest",
  },
  {
    id: "sad",
    emoji: "😢",
    label: "Sad",
    color: "from-blue-400 via-blue-500 to-indigo-500",
    message: "I'm feeling sad right now.",
    intensity: "high",
    category: "negative",
    description: "Feeling down and melancholy",
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Anxious",
    color: "from-purple-500 via-violet-500 to-purple-600",
    message: "I'm feeling anxious about things.",
    intensity: "high",
    category: "negative",
    description: "Worried and unsettled",
  },
  {
    id: "stressed",
    emoji: "😤",
    label: "Stressed",
    color: "from-red-400 via-orange-500 to-red-500",
    message: "I feel stressed out.",
    intensity: "high",
    category: "negative",
    description: "Overwhelmed and under pressure",
  },
  {
    id: "angry",
    emoji: "😠",
    label: "Angry",
    color: "from-red-500 via-red-600 to-red-700",
    message: "I'm feeling angry right now.",
    intensity: "high",
    category: "negative",
    description: "Frustrated and irritated",
  },
];

const quickActions = [
  {
    text: "I need someone to talk to 💬",
    icon: FiHeart,
    color: "from-pink-500 to-rose-500",
    description: "Let's have a heart-to-heart conversation",
  },
  {
    text: "Can you help me relax? 🧘‍♀️",
    icon: RiHeartPulseLine,
    color: "from-green-500 to-teal-500",
    description: "Guide me through relaxation techniques",
  },
  {
    text: "I want to boost my mood 🚀",
    icon: FiTrendingUp,
    color: "from-blue-500 to-purple-500",
    description: "Help me feel more positive and energized",
  },
  {
    text: "Let's practice mindfulness 🧠",
    icon: RiEmotionLine,
    color: "from-indigo-500 to-purple-500",
    description: "Focus on present moment awareness",
  },
];

// MoodButton Subcomponent
const MoodButton: React.FC<{
  mood: Mood;
  selectedMood: string | null;
  hoveredMood: string | null;
  isAnimating: boolean;
  isDarkMode: boolean;
  onMoodClick: (mood: Mood) => void;
  onMoodHover: (id: string | null) => void;
  enhanced?: boolean;
}> = ({
  mood,
  selectedMood,
  hoveredMood,
  isAnimating,
  isDarkMode,
  onMoodClick,
  onMoodHover,
  enhanced,
}) => {
  const isSelected = selectedMood === mood.id;
  const isHovered = hoveredMood === mood.id;
  return (
    <button
      type="button"
      onClick={() => onMoodClick(mood)}
      onMouseEnter={() => onMoodHover(mood.id)}
      onMouseLeave={() => onMoodHover(null)}
      className={`
        group relative flex flex-col items-center justify-center gap-1 p-4 rounded-xl transition-all duration-300
        border backdrop-blur-md overflow-hidden
        ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50 text-gray-200 hover:bg-gray-700/60"
            : "bg-white/50 border-gray-300/50 text-gray-700 hover:bg-white/70"
        }
        ${isSelected ? "ring-2 ring-purple-500" : ""}
        ${enhanced ? "hover:scale-105" : ""}
      `}
      aria-label={mood.label}
    >
      <div
        className={`text-3xl mb-1 drop-shadow ${
          isSelected ? "scale-110" : isHovered ? "scale-105" : "scale-100"
        } transition-transform duration-200`}
      >
        {mood.emoji}
      </div>
      <span className="text-sm font-medium">{mood.label}</span>
      <span
        className={`text-xs opacity-70 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {mood.description}
      </span>
    </button>
  );
};

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodSelect,
  isDarkMode,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood.id);
    setIsAnimating(true);

    setTimeout(() => {
      onMoodSelect(mood.message, mood.id);
      setIsAnimating(false);
      setSelectedMood(null);
    }, 600);
  };

  const handleQuickAction = (action: string) => {
    onMoodSelect(action, "mixed");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "positive":
        return <FiSun className="w-4 h-4" />;
      case "neutral":
        return <FiZap className="w-4 h-4" />;
      case "negative":
        return <FiMoon className="w-4 h-4" />;
      default:
        return <FiHeart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "positive":
        return "text-green-500";
      case "neutral":
        return "text-yellow-500";
      case "negative":
        return "text-blue-500";
      default:
        return "text-purple-500";
    }
  };

  const groupedMoods = moods.reduce((acc, mood) => {
    if (!acc[mood.category]) acc[mood.category] = [];
    acc[mood.category].push(mood);
    return acc;
  }, {} as Record<string, Mood[]>);

  return (
    <div
      className={`h-full flex flex-col rounded-3xl backdrop-blur-xl border transition-all duration-500 overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-pink-900/20 border-white/10 text-white shadow-2xl shadow-purple-500/10"
          : "bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/30 border-white/20 text-gray-900 shadow-2xl shadow-blue-500/10"
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <RiMentalHealthLine
                className={`text-3xl text-purple-500 ${
                  pulseAnimation ? "animate-pulse" : ""
                }`}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mood Tracker
              </h2>
              <p className="text-sm opacity-70">Emotional Wellness Check-in</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-2 rounded-full backdrop-blur-md border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/50 border-gray-300/50"
              }`}
            >
              <FiCalendar className="w-4 h-4 text-purple-500" />
            </div>
            <div
              className={`px-3 py-2 rounded-full backdrop-blur-md border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-white/50 border-gray-300/50"
              }`}
            >
              <FiActivity className="w-4 h-4 text-pink-500" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            How are you feeling today?
          </h3>
          <p
            className={`text-sm mb-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Select an emotion to start our conversation ✨
          </p>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/60"
                : "bg-white/50 border-gray-300/50 text-gray-700 hover:bg-white/70"
            }`}
          >
            <span className="flex items-center gap-2">
              <FiZap className="w-4 h-4" />
              {showCategories ? "Show All Moods" : "Group by Category"}
            </span>
          </button>
        </div>
      </div>

      {/* Mood Selection Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        {showCategories ? (
          <div className="space-y-6">
            {Object.entries(groupedMoods).map(([category, categoryMoods]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${
                      category === "positive"
                        ? "from-green-500 to-emerald-500"
                        : category === "neutral"
                        ? "from-yellow-500 to-orange-500"
                        : "from-blue-500 to-indigo-500"
                    } text-white shadow-lg`}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold capitalize ${getCategoryColor(
                        category
                      )}`}
                    >
                      {category} Emotions
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {categoryMoods.length} mood
                      {categoryMoods.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {categoryMoods.map((mood) => (
                    <MoodButton
                      key={mood.id}
                      mood={mood}
                      selectedMood={selectedMood}
                      hoveredMood={hoveredMood}
                      isAnimating={isAnimating}
                      isDarkMode={isDarkMode}
                      onMoodClick={handleMoodClick}
                      onMoodHover={setHoveredMood}
                      enhanced={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {moods.map((mood) => (
                <MoodButton
                  key={mood.id}
                  mood={mood}
                  selectedMood={selectedMood}
                  hoveredMood={hoveredMood}
                  isAnimating={isAnimating}
                  isDarkMode={isDarkMode}
                  onMoodClick={handleMoodClick}
                  onMoodHover={setHoveredMood}
                  enhanced={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Quick Actions Footer */}
      <div
        className={`flex-shrink-0 border-t ${
          isDarkMode ? "border-white/10" : "border-gray-200/50"
        }`}
      >
        {showQuickActions ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold flex items-center gap-2">
                <FiZap className="w-4 h-4 text-yellow-500" />
                Quick Actions
              </span>
              <button
                className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
                onClick={() => setShowQuickActions(false)}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, idx) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      handleQuickAction(action.text);
                      setShowQuickActions(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded bg-gradient-to-r ${action.color} text-white font-medium shadow hover:scale-105 transition`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{action.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold hover:scale-105 transition"
            onClick={() => setShowQuickActions(true)}
          >
            <FiZap className="w-4 h-4" />
            Quick Actions
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
