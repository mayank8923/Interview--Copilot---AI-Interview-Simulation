import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMockSession, submitMockAnswer, finishMockSession } from '../../api/mockApi';
import { Button } from '../../components/ui/Button';
import { Clock, Loader2, ArrowRight, Flag, Mic, MicOff, Code2, Play, X, Terminal, ChevronUp, ChevronDown, RotateCcw, Volume2, VolumeX, Radio } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { executeCode } from '../../api/codeExecutionApi';
import { LeetCodeConsole } from '../practice/LeetCodeConsole';
import { getStarterTemplate } from '../../utils/starterCodeTemplates';

export const InterviewRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState('java');
  
  // Fake timer logic (e.g. 5 mins per question)
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  // Code Execution
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  // Web Speech & Audio States
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const answerRef = useRef(answer);
  
  useEffect(() => { answerRef.current = answer; }, [answer]);

  const speakQuestion = (title, content) => {
    if (!('speechSynthesis' in window) || !isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const cleanContent = (content || '').replace(/[#*`_~]/g, '');
    const textToSpeak = `Question: ${title}. ${cleanContent}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
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

  const handleRunCode = async () => {
    const codeToRun = answerRef.current;
    if (!codeToRun.trim()) return;
    try {
      setIsExecuting(true);
      setShowConsole(true);
      const result = await executeCode(language, codeToRun);
      
      if (result.compile && result.compile.code !== 0) {
        setOutput(result.compile.output);
      } else if (result.run) {
        setOutput(result.run.output || 'Program exited with no output.');
      }
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  useEffect(() => {
    if (session?.currentQuestion) {
      if (session.currentQuestion.type !== 'HR' && !answer) {
        const template = getStarterTemplate(session.currentQuestion.title, language);
        setAnswer(template);
      }
      if (isVoiceEnabled) {
        speakQuestion(session.currentQuestion.title, session.currentQuestion.content);
      }
    }
  }, [session?.currentQuestionIndex, session?.currentQuestion?.id]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const template = getStarterTemplate(session?.currentQuestion?.title, newLang);
    setAnswer(template);
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getMockSession(id);
        if (data.status === 'COMPLETED') {
          navigate(`/mock/report/${id}`, { replace: true });
        } else {
          setSession(data);
          setTimeLeft(5 * 60); // Reset timer per question
        }
      } catch (err) {
        console.error('Failed to load session', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, navigate]);

  useEffect(() => {
    if (!session || session.status === 'COMPLETED') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion(); // Auto-submit if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  // Init Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    let baseText = '';
    let currentFinals = '';

    recognition.onstart = () => {
      baseText = answerRef.current;
      if (baseText.length > 0 && !baseText.endsWith(' ') && !baseText.endsWith('\n')) {
        baseText += ' ';
      }
      currentFinals = '';
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentFinals += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setAnswer(baseText + currentFinals + interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    
    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  const handleNextQuestion = async () => {
    if (submitting) return;
    stopSpeaking();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();

    try {
      setSubmitting(true);
      const data = await submitMockAnswer(id, answer || 'No answer provided.');
      setAnswer('');
      if (data.currentQuestionIndex >= data.totalQuestions) {
        handleFinish();
      } else {
        setSession(data);
        setTimeLeft(5 * 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    try {
      setSubmitting(true);
      await finishMockSession(id);
      navigate(`/mock/report/${id}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session || !session.currentQuestion) return null;

  const isLastQuestion = session.currentQuestionIndex === session.totalQuestions - 1;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isTimeLow = timeLeft < 60;
  
  const isTechnical = session.currentQuestion.type === 'TECHNICAL' || session.currentQuestion.type === 'SYSTEM_DESIGN';

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-stone-100 flex flex-col font-sans">
      
      {/* Header Bar */}
      <header className="h-14 bg-[#131418] border-b border-stone-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold text-sm text-stone-200">
            Mock Interview (Question {session.currentQuestionIndex + 1} of {session.totalQuestions})
          </span>

          {/* Voice Indicator */}
          {isAiSpeaking ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> AI Reading Question...
            </span>
          ) : isListening ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Microphone Active...
            </span>
          ) : null}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Voice Read Aloud Toggle */}
          <button 
            onClick={() => {
              if (isVoiceEnabled) stopSpeaking();
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isVoiceEnabled 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                : 'bg-[#1a1b20] text-stone-500 border-stone-800'
            }`}
            title={isVoiceEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {isTechnical && (
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-500" />
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#101114] border border-stone-800 text-stone-200 text-xs font-bold rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          )}
          <div className={`flex items-center gap-1.5 font-mono text-base font-bold ${isTimeLow ? 'text-rose-400 animate-pulse' : 'text-stone-300'}`}>
            <Clock className="w-4 h-4" />
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <Button variant="outline" size="sm" onClick={handleFinish} className="border-rose-900/50 text-rose-400 hover:bg-rose-950/30 text-xs">
            End Early
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Question Area */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-stone-800 bg-[#111215]">
          <div className="p-8 overflow-y-auto prose prose-invert max-w-none flex-1">
            <div className="flex items-start justify-between gap-4 mb-4 not-prose">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{session.currentQuestion.title}</h2>
              <button
                onClick={() => speakQuestion(session.currentQuestion.title, session.currentQuestion.content)}
                className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 shrink-0 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Re-read Question Aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear AI</span>
              </button>
            </div>
            <div className="text-stone-300 text-sm leading-relaxed">
              <ReactMarkdown>{session.currentQuestion.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right: Answer Area */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#14151a]">
          <div className="flex-1 flex flex-col min-h-0 relative">
            {isTechnical ? (
               <div className="flex-1 relative pt-2">
                 <Editor
                   height="100%"
                   language={language}
                   theme="vs-dark"
                   value={answer}
                   onChange={(value) => setAnswer(value || '')}
                   onMount={handleEditorMount}
                   options={{
                     minimap: { enabled: false },
                     fontSize: 14,
                     wordWrap: "on",
                     scrollBeyondLastLine: false,
                     automaticLayout: true
                   }}
                 />
               </div>
            ) : (
              <div className="flex-1 flex flex-col relative bg-[#101114]">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your response here, or click the microphone below to speak hands-free..."
                  className="flex-1 w-full bg-transparent resize-none outline-none font-sans text-base leading-relaxed text-stone-200 p-8 placeholder-stone-500"
                  spellCheck="false"
                  autoFocus
                />
                <div className="absolute bottom-6 right-6">
                   <button 
                     onClick={toggleListening}
                     className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs transition-all shadow-lg ${
                       isListening 
                         ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-500/30' 
                         : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 hover:scale-105 active:scale-95 shadow-amber-500/25'
                     }`}
                   >
                     {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                     {isListening ? 'Stop Listening' : 'Speak Answer'}
                   </button>
                </div>
              </div>
            )}

            {/* LeetCode-style Testcase & Test Result Console */}
            {isTechnical && showConsole && (
              <LeetCodeConsole
                rawOutput={output}
                isExecuting={isExecuting}
                onClose={() => setShowConsole(false)}
                questionContent={session?.currentQuestion?.content}
                onRunCode={handleRunCode}
                isRunDisabled={isExecuting || !answer.trim()}
              />
            )}
          </div>
          
          {/* Action Bar */}
          <div className="px-4 py-2.5 border-t border-stone-800 bg-[#131418] flex items-center justify-between shrink-0">
            <div>
              {isTechnical && (
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:bg-[#1a1b20] border border-stone-800 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Console</span>
                  {showConsole ? <ChevronDown className="w-3.5 h-3.5 text-stone-400" /> : <ChevronUp className="w-3.5 h-3.5 text-stone-400" />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {isTechnical && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRunCode} 
                  disabled={isExecuting || !answer.trim()}
                  icon={Play}
                  className="border-stone-800 text-stone-300 hover:bg-[#1a1b20] text-xs font-semibold"
                >
                  {isExecuting ? 'Running...' : 'Run'}
                </Button>
              )}
              <Button 
                size="sm"
                onClick={handleNextQuestion} 
                disabled={submitting}
                icon={isLastQuestion ? Flag : ArrowRight}
                className={`bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 ${
                  submitting ? '[&>svg]:animate-spin' : ''
                }`}
              >
                {submitting ? 'Saving...' : isLastQuestion ? 'Finish Interview' : 'Next Question'}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

