import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { startChatInterview, sendChatMessage, getChatSession, concludeChatSession } from '../../api/chatApi';
import { getLatestResumeAnalysis } from '../../api/resumeApi';
import { VoiceFeedbackModal } from './VoiceFeedbackModal';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Target, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  Radio, 
  CheckCircle2, 
  Square,
  ArrowRight,
  Award,
  Flame,
  HeartHandshake,
  Briefcase,
  Sliders,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TOPIC_PRESETS = [
  'System Design & Distributed Systems',
  'React, TypeScript & Web Performance',
  'Spring Boot, Java & Microservices',
  'Algorithms & Data Structure Optimization',
  'Behavioral & STAR Leadership Scenarios'
];

const INTERVIEWER_PERSONAS = [
  {
    id: 'FAANG Bar Raiser',
    title: 'FAANG Bar Raiser',
    badge: 'Strict & Deep',
    icon: Flame,
    color: 'text-amber-500',
    tagline: 'Challenges system trade-offs, edge cases, failure domains, and scalability bottlenecks.'
  },
  {
    id: 'Supportive Mentor',
    title: 'Supportive Mentor',
    badge: 'Constructive Hints',
    icon: HeartHandshake,
    color: 'text-emerald-500',
    tagline: 'Provides warm encouraging cues, validates thinking, and offers guided prompts.'
  },
  {
    id: 'HR Talent Partner',
    title: 'HR Talent Partner',
    badge: 'STAR & Culture',
    icon: Briefcase,
    color: 'text-orange-500',
    tagline: 'Focuses on leadership principles, conflict management, cross-functional impact, and growth.'
  }
];

export const ChatInterviewPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  // Setup state for new interviews
  const [topic, setTopic] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('FAANG Bar Raiser');
  const [useResume, setUseResume] = useState(false);
  const [latestResume, setLatestResume] = useState(null);
  const [starting, setStarting] = useState(false);

  // Conclusion / Scorecard
  const [concluding, setConcluding] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  // Voice AI States
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Populate browser voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Prefer natural English voices
        const naturalVoice = voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));
        if (naturalVoice) setSelectedVoice(naturalVoice);
      }
    };

    updateVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            interimTranscript += trans;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          setInputMessage(currentText);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Speak AI message
  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !isVoiceOutputEnabled || !text) return;

    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Speak AI message automatically when new message arrives
  useEffect(() => {
    if (isVoiceOutputEnabled && session?.messages?.length > 0) {
      const lastMessage = session.messages[session.messages.length - 1];
      if (lastMessage.role === 'AI') {
        speakText(lastMessage.content);
      }
    }
  }, [session?.messages?.length, isVoiceOutputEnabled]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking(); // Stop AI speaking when user begins talking
      setInputMessage('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition already active", err);
      }
    }
  };

  const toggleVoiceOutput = () => {
    if (isVoiceOutputEnabled) {
      stopSpeaking();
    }
    setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        if (id) {
          const data = await getChatSession(id);
          setSession(data);
          if (data.feedback) {
            setShowScorecard(true);
          }
          setInitializing(false);
        } else {
          // Check for latest analyzed resume
          try {
            const resume = await getLatestResumeAnalysis();
            if (resume) {
              setLatestResume(resume);
              const shouldAutoCheck = searchParams.get('useResume') === 'true' || searchParams.get('resume') === 'true';
              if (shouldAutoCheck) {
                setUseResume(true);
                if (resume.targetRole && !topic) {
                  setTopic(resume.targetRole);
                }
              }
            }
          } catch (rErr) {
            console.warn("Could not check resume status", rErr);
          }
          setInitializing(false);
        }
      } catch (err) {
        console.error("Failed to initialize chat", err);
        setInitializing(false);
      }
    };
    
    initSession();
  }, [id, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleStartInterview = async (chosenTopic) => {
    const targetTopic = chosenTopic || topic;
    if (!targetTopic.trim()) return;
    
    setStarting(true);
    try {
      const data = await startChatInterview(targetTopic, selectedPersona, useResume);
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
    if (!inputMessage.trim() || !session || loading) return;
    
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    stopSpeaking();
    
    setSession(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), { role: 'USER', content: messageToSend }]
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

  const handleConcludeInterview = async () => {
    if (!session || concluding) return;
    stopSpeaking();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setConcluding(true);
    try {
      const updated = await concludeChatSession(session.id);
      setSession(updated);
      setShowScorecard(true);
    } catch (err) {
      console.error("Failed to conclude interview", err);
      alert("Could not generate interview score. You can continue speaking or try again in a moment.");
    } finally {
      setConcluding(false);
    }
  };

  // Live Speech & Filler Word Metrics
  const userMessages = session?.messages?.filter(m => m.role === 'USER') || [];
  const totalWordsSpoken = userMessages.reduce((acc, m) => {
    return acc + (m.content ? m.content.trim().split(/\s+/).filter(Boolean).length : 0);
  }, 0);
  const fillerRegex = /\b(um|uh|like|you know|sort of|basically|actually|literally)\b/gi;
  const totalFillerWords = userMessages.reduce((acc, m) => {
    const matches = m.content ? m.content.match(fillerRegex) : null;
    return acc + (matches ? matches.length : 0);
  }, 0);

  if (initializing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fbf9f6] dark:bg-[#0c0d0f] transition-colors gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs font-semibold text-stone-500">Connecting to AI Voice Assistant...</p>
      </div>
    );
  }

  // Configuration Screen for new interview session
  if (!id && !session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbf9f6] dark:bg-[#0c0d0f] p-4 transition-colors">
        <div className="bg-white dark:bg-[#131418] max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800/80 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-stone-950 mx-auto shadow-md shadow-amber-500/20">
              <Bot className="w-6 h-6 fill-stone-950" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              AI Voice Interview Assistant
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              Simulate realistic interactive voice rounds with live speech recognition, persona-driven questioning, and post-session performance scorecards.
            </p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleStartInterview(topic); }} className="space-y-5">
            {/* Persona Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
                Choose Interviewer Persona
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {INTERVIEWER_PERSONAS.map(p => {
                  const isSelected = selectedPersona === p.id;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-stone-900 dark:text-white shadow-sm ring-1 ring-amber-500'
                          : 'bg-stone-50 dark:bg-[#18191f] border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon className={`w-4 h-4 ${p.color}`} />
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected 
                              ? 'bg-amber-500 text-stone-950' 
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}>
                            {p.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                          {p.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resume-Tailored Grounding Card */}
            {latestResume ? (
              <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                useResume 
                  ? 'bg-amber-500/10 border-amber-500/40 text-stone-900 dark:text-white shadow-sm ring-1 ring-amber-500/20' 
                  : 'bg-stone-50 dark:bg-[#18191f] border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-sm">
                    <FileText className="w-5 h-5 fill-stone-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        Tailor to My Uploaded Resume
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {latestResume.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      AI will probe your real past projects & tech stack for <strong>{latestResume.targetRole || 'Software Engineer'}</strong>.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={useResume}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setUseResume(next);
                      if (next && latestResume.targetRole && !topic) {
                        setTopic(latestResume.targetRole);
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                </label>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#18191f] border border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-500">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span>No resume scanned yet. Upload one to unlock personalized questions!</span>
                </div>
                <Link to="/resume" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0 ml-2">
                  Upload PDF →
                </Link>
              </div>
            )}

            {/* Target Topic Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                Interview Topic or Target Role
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Caching, React Performance, Behavioral STAR..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#101114] text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all"
              />
            </div>

            {/* Quick Topic Presets */}
            <div>
              <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Or select a popular interview round:
              </span>
              <div className="flex flex-wrap gap-2">
                {TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setTopic(preset); handleStartInterview(preset); }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-[#1a1b20] hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 transition-all text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 flex justify-center items-center text-sm font-bold shadow-md shadow-amber-500/20" 
              disabled={starting || !topic.trim()}
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Initializing Interview Session...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Start Voice Interview
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#fbf9f6] dark:bg-[#0c0d0f] h-[calc(100vh-3.5rem)] overflow-hidden transition-colors">
      
      {/* Top Header Bar */}
      <div className="bg-white/90 dark:bg-[#131418]/90 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/80 px-4 sm:px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold shadow-sm shadow-amber-500/20">
            <Bot className="w-5 h-5 fill-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-tight">
                AI Voice Interviewer
              </h2>
              {/* Persona Pill */}
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {session?.persona || selectedPersona}
              </span>
              {/* Resume Tailored Pill */}
              {session?.resumeTailored && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25">
                  <FileText className="w-3 h-3 text-orange-500" /> Resume Tailored
                </span>
              )}
              {/* Dynamic Status Pill */}
              {isAiSpeaking ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Speaking...
                </span>
              ) : isListening ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Listening to you...
                </span>
              ) : loading ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                  <Loader2 className="w-3 h-3 animate-spin" /> Formulating question...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" /> Live
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs sm:max-w-md">
              Focus: <span className="font-semibold text-stone-700 dark:text-stone-300">{session?.topic}</span>
            </p>
          </div>
        </div>

        {/* Audio Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Stop Button if speaking */}
          {isAiSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Stop voice"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* Voice Output Toggle */}
          <button 
            onClick={toggleVoiceOutput}
            className={`p-2 rounded-xl transition-all ${
              isVoiceOutputEnabled 
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                : 'bg-stone-100 text-stone-400 dark:bg-[#1a1b20] dark:text-stone-500 border border-stone-200 dark:border-stone-800'
            }`}
            title={isVoiceOutputEnabled ? "Mute Voice Speech" : "Unmute Voice Speech"}
          >
            {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Scorecard button if evaluation ready */}
          {session?.feedback && (
            <button
              onClick={() => setShowScorecard(true)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Scorecard ({session.feedback.overallScore}/100)</span>
            </button>
          )}

          {/* Conclude Interview Button */}
          <Button 
            onClick={handleConcludeInterview}
            disabled={concluding || !session?.messages || session.messages.length < 2}
            size="sm" 
            className="text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-sm"
          >
            {concluding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Evaluating...
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5 mr-1.5" />
                Conclude & Score
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { stopSpeaking(); navigate('/dashboard'); }}
            className="text-xs font-semibold"
            title="Leave room"
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          
          {session?.messages?.map((msg, index) => {
            const isUser = msg.role === 'USER';
            return (
              <div 
                key={index} 
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isUser 
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 shadow-sm' 
                    : 'bg-white dark:bg-[#18191f] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-500" />}
                </div>

                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-medium rounded-tr-none shadow-sm' 
                      : 'bg-white dark:bg-[#131418] border border-stone-200/90 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Per-message voice replay icon */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-amber-500 dark:text-stone-400 dark:hover:text-amber-400 transition-colors"
                        title="Replay Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay Voice</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-[#18191f] border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-500" />
              </div>
              <div className="bg-white dark:bg-[#131418] border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Interviewer is evaluating and formulating follow-up question...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice Assistant Interactive Bottom Action Console */}
      <div className="bg-white/90 dark:bg-[#131418]/90 backdrop-blur-md border-t border-stone-200/90 dark:border-stone-800/80 p-3 sm:p-4 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          
          {/* Live Voice Visualizer Bar when listening or speaking */}
          {(isListening || isAiSpeaking) && (
            <div className="flex items-center justify-center gap-2 py-1 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
              <span>
                {isListening ? 'Microphone Active — Speak your technical explanation...' : 'AI Voice Assistant is speaking...'}
              </span>
            </div>
          )}

          {/* Form / Mic Input Row */}
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            
            {/* Push to Talk / Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all shrink-0 flex items-center justify-center ${
                isListening 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 animate-pulse' 
                  : 'bg-stone-100 text-stone-700 hover:bg-amber-500/10 hover:text-amber-600 dark:bg-[#1a1b20] dark:text-stone-300 dark:hover:bg-amber-500/15 dark:hover:text-amber-400 border border-stone-200 dark:border-stone-800'
              }`}
              title={isListening ? "Stop Microphone" : "Speak Response (Microphone)"}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Input Field */}
            <div className="relative flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Type or speak your answer..."}
                className="w-full bg-stone-100 dark:bg-[#101114] border border-stone-200 dark:border-stone-800 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm resize-none overflow-hidden max-h-32 transition-colors"
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
                className="absolute right-2.5 top-2.5 p-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 font-bold rounded-xl disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Helper Footnote & Speech Metrics */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 px-1">
            <div className="flex items-center gap-3">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 font-mono text-[10px]">Enter</kbd> to submit</span>
              <span>Tap <strong className="text-amber-500">Mic</strong> to talk hands-free</span>
            </div>
            
            {/* Live Spoken Word & Filler Tracker */}
            {totalWordsSpoken > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-600 dark:text-stone-300">
                  {totalWordsSpoken} words spoken
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  totalFillerWords === 0 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : totalFillerWords <= 2 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  {totalFillerWords} filler{totalFillerWords === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Evaluation Scorecard Modal */}
      {showScorecard && session?.feedback && (
        <VoiceFeedbackModal 
          session={session} 
          onClose={() => setShowScorecard(false)} 
          onRestart={() => {
            setShowScorecard(false);
            setSession(null);
            navigate('/chat-interview');
          }} 
        />
      )}

    </div>
  );
};
