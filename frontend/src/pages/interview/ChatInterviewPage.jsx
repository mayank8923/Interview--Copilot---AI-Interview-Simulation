import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { startChatInterview, sendChatMessage, getChatSession } from '../../api/chatApi';
import { Send, User, Bot, Loader2, Target, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ChatInterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  // Setup state for new interviews
  const [topic, setTopic] = useState('');
  const [starting, setStarting] = useState(false);

  // Voice AI States
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Speak AI messages when they arrive
  useEffect(() => {
    if (isVoiceOutputEnabled && session?.messages?.length > 0) {
      const lastMessage = session.messages[session.messages.length - 1];
      if (lastMessage.role === 'AI') {
        speakText(lastMessage.content);
      }
    }
  }, [session, isVoiceOutputEnabled]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: Set voice properties here (e.g. rate, pitch, voice)
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel(); // Stop AI from talking while user talks
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleVoiceOutput = () => {
    if (isVoiceOutputEnabled) {
      window.speechSynthesis?.cancel();
    }
    setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        if (id) {
          const data = await getChatSession(id);
          setSession(data);
          setInitializing(false);
        } else {
          setInitializing(false);
        }
      } catch (err) {
        console.error("Failed to initialize chat", err);
        setInitializing(false);
      }
    };
    
    initSession();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [session]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setStarting(true);
    try {
      const data = await startChatInterview(topic);
      navigate(`/chat-interview/${data.id}`, { replace: true });
      setSession(data);
    } catch (err) {
      console.error("Failed to start chat", err);
    } finally {
      setStarting(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !session) return;
    
    const messageToSend = inputMessage;
    setInputMessage('');
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'USER', content: messageToSend }]
    }));
    
    setLoading(true);
    try {
      const updatedSession = await sendChatMessage(session.id, messageToSend);
      setSession(updatedSession);
    } catch (err) {
      console.error("Failed to send message", err);
      const data = await getChatSession(session.id);
      setSession(data);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!id && !session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Configure Your AI Interview
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            What specific topic or role would you like to practice today?
          </p>
          
          <form onSubmit={handleStartInterview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Interview Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React JS, System Design, Behavioral..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full py-3 flex justify-center items-center" 
              disabled={starting || !topic.trim()}
            >
              {starting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Starting...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" /> Start Interview
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm z-10 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            Live AI Interviewer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Focus Topic: {session?.topic}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleVoiceOutput}
            className={`p-2 rounded-lg transition-colors ${isVoiceOutputEnabled ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
            title={isVoiceOutputEnabled ? "Mute AI Voice" : "Enable AI Voice"}
          >
            {isVoiceOutputEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <Button variant="outline" size="sm" onClick={() => { window.speechSynthesis?.cancel(); navigate('/dashboard'); }}>End Interview</Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {session?.messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'USER' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {msg.role === 'USER' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'USER' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                isListening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
              title="Toggle Microphone"
            >
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <div className="relative flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type or speak your response..."}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 resize-none overflow-hidden"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim() || loading}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-4">
            <span>Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">Enter</kbd> to send</span>
            <span>Click the microphone to speak your answer!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

