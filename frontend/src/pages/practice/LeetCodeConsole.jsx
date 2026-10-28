import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Terminal, 
  Sliders, 
  X, 
  Maximize2, 
  Minimize2, 
  Loader2, 
  Check, 
  Play,
  FileCode2
} from 'lucide-react';

export const parseExecutionOutput = (rawOutput) => {
  if (!rawOutput) return null;

  const lines = rawOutput.split('\n');
  const testCases = [];
  let currentCase = null;
  let hiddenInfo = null;
  let rawStdout = [];
  let hasSpecialFormatting = false;
  let hasCompileError = false;

  if (rawOutput.toLowerCase().includes('execution simulation failed') ||
      rawOutput.toLowerCase().includes('error:') ||
      rawOutput.toLowerCase().includes('syntaxerror') ||
      rawOutput.toLowerCase().includes('exception')) {
    hasCompileError = true;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for "Test Case X:" or "Test Case 1:"
    const caseMatch = line.match(/^Test Case\s*(\d+)[:\.]?/i);
    if (caseMatch) {
      hasSpecialFormatting = true;
      if (currentCase) testCases.push(currentCase);
      currentCase = {
        id: parseInt(caseMatch[1], 10),
        label: `Case ${caseMatch[1]}`,
        input: '',
        output: '',
        expected: '',
        status: 'Passed'
      };
      continue;
    }

    if (currentCase) {
      if (line.toLowerCase().startsWith('input:')) {
        currentCase.input = line.substring(line.indexOf(':') + 1).trim();
        continue;
      }
      if (line.toLowerCase().startsWith('output:')) {
        currentCase.output = line.substring(line.indexOf(':') + 1).trim();
        continue;
      }
      if (line.toLowerCase().startsWith('expected:')) {
        const expectedPart = line.substring(line.indexOf(':') + 1).trim();
        if (expectedPart.includes('|')) {
          const parts = expectedPart.split('|');
          currentCase.expected = parts[0].trim();
          const statusText = parts[1] || '';
          if (statusText.toLowerCase().includes('fail')) {
            currentCase.status = 'Failed';
          }
        } else {
          currentCase.expected = expectedPart;
        }
        continue;
      }
      if (line.toLowerCase().includes('status: failed')) {
        currentCase.status = 'Failed';
        continue;
      }
    }

    // Check for "Hidden Test Cases: X/Y Passed"
    const hiddenMatch = line.match(/Hidden Test Cases:\s*(\d+)\s*\/\s*(\d+)\s*Passed/i);
    if (hiddenMatch) {
      hasSpecialFormatting = true;
      if (currentCase) {
        testCases.push(currentCase);
        currentCase = null;
      }
      hiddenInfo = {
        passed: parseInt(hiddenMatch[1], 10),
        total: parseInt(hiddenMatch[2], 10),
        failedMessage: ''
      };
      continue;
    }

    if (line.toLowerCase().includes('failed on a hidden test case')) {
      if (hiddenInfo) {
        hiddenInfo.failedMessage = 'Failed on a hidden test case.';
      }
      continue;
    }

    if (line.length > 0) {
      rawStdout.push(lines[i]);
    }
  }

  if (currentCase) {
    testCases.push(currentCase);
  }

  if (!hasSpecialFormatting) {
    return {
      isStructured: false,
      hasCompileError,
      rawOutput
    };
  }

  const allCasesPassed = testCases.length > 0 && testCases.every(tc => tc.status === 'Passed');
  const allHiddenPassed = !hiddenInfo || hiddenInfo.passed === hiddenInfo.total;
  const isAccepted = allCasesPassed && allHiddenPassed && !hasCompileError;

  return {
    isStructured: true,
    hasCompileError,
    isAccepted,
    verdict: hasCompileError ? 'Runtime Error' : isAccepted ? 'Accepted' : 'Wrong Answer',
    testCases,
    hiddenInfo,
    rawStdout: rawStdout.join('\n').trim()
  };
};

export const extractExampleCases = (markdownContent) => {
  if (!markdownContent) return [];
  const examples = [];
  const regex = /(?:Example\s*(\d+):?[\s\S]*?Input:\s*([^\n]+)[\s\S]*?Output:\s*([^\n]+))/gi;
  let match;
  let index = 1;

  while ((match = regex.exec(markdownContent)) !== null) {
    examples.push({
      id: index,
      label: `Case ${index}`,
      input: match[2]?.trim() || '',
      expected: match[3]?.trim() || ''
    });
    index++;
  }

  // Fallback default test cases if markdown didn't match
  if (examples.length === 0) {
    examples.push(
      { id: 1, label: 'Case 1', input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { id: 2, label: 'Case 2', input: 'nums = [3,2,4], target = 6', expected: '[1,2]' }
    );
  }

  return examples;
};

export const LeetCodeConsole = ({
  rawOutput,
  isExecuting,
  onClose,
  questionContent,
  onRunCode,
  isRunDisabled,
  height,
  onResizeStart
}) => {
  const [activeTab, setActiveTab] = useState('result'); // 'testcase' | 'result'
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const parsed = parseExecutionOutput(rawOutput);
  const sampleCases = extractExampleCases(questionContent);

  // Auto-switch to result tab when executing or when new output arrives
  useEffect(() => {
    if (isExecuting || rawOutput) {
      setActiveTab('result');
      setSelectedCaseIndex(0);
    }
  }, [isExecuting, rawOutput]);

  const testCasesToShow = parsed?.testCases?.length > 0 ? parsed.testCases : sampleCases;
  const activeCase = testCasesToShow[selectedCaseIndex] || testCasesToShow[0];

  const effectiveHeight = height ? `${height}px` : (isExpanded ? '24rem' : '16rem');

  return (
    <div 
      style={{ height: effectiveHeight }}
      className="border-t border-slate-700/80 bg-[#181818] text-slate-200 flex flex-col shrink-0 transition-[height] duration-75 relative"
    >
      {/* Draggable Top Handle */}
      {onResizeStart && (
        <div
          onMouseDown={onResizeStart}
          className="w-full h-1.5 cursor-row-resize flex items-center justify-center bg-transparent hover:bg-indigo-500/80 transition-colors select-none group absolute -top-1 inset-x-0 z-30"
          title="Drag to resize console"
        >
          <div className="h-0.5 w-10 bg-slate-600 rounded group-hover:bg-white transition-colors" />
        </div>
      )}

      {/* Console Top Toolbar */}
      <div className="px-3 py-1.5 border-b border-slate-800 bg-[#1f1f1f] flex items-center justify-between select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'testcase'
                ? 'bg-[#2a2a2a] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#252525]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            Testcase
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'result'
                ? 'bg-[#2a2a2a] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#252525]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Test Result
            {parsed && parsed.isStructured && (
              <span className={`w-2 h-2 rounded-full ${parsed.isAccepted ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1 hover:bg-[#2a2a2a] rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close Console"
              className="p-1 hover:bg-[#2a2a2a] rounded text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Console Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col font-sans">
        {/* Loading State */}
        {isExecuting ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 py-6">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-sm font-medium">Simulating execution across test suite...</p>
          </div>
        ) : activeTab === 'testcase' ? (
          /* ================= TESTCASE TAB ================= */
          <div className="flex flex-col gap-3">
            {/* Case selector pills */}
            <div className="flex items-center gap-2">
              {sampleCases.map((tc, index) => (
                <button
                  key={tc.id || index}
                  onClick={() => setSelectedCaseIndex(index)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedCaseIndex === index
                      ? 'bg-[#2a2a2a] text-white border border-slate-600'
                      : 'bg-[#222] text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {tc.label}
                </button>
              ))}
            </div>

            {/* Selected Testcase Details */}
            {activeCase && (
              <div className="flex flex-col gap-2 mt-1">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Input:
                  </span>
                  <div className="bg-[#242424] rounded-lg p-2.5 font-mono text-xs text-slate-200 border border-slate-700/60 select-all">
                    {activeCase.input || 'None'}
                  </div>
                </div>
                {activeCase.expected && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Expected Output:
                    </span>
                    <div className="bg-[#242424] rounded-lg p-2.5 font-mono text-xs text-slate-200 border border-slate-700/60 select-all">
                      {activeCase.expected}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ================= TEST RESULT TAB ================= */
          !rawOutput ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 py-6">
              <FileCode2 className="w-8 h-8 text-slate-600" />
              <p className="text-sm">You must run your code first to see evaluation results.</p>
              {onRunCode && (
                <button
                  onClick={onRunCode}
                  disabled={isRunDisabled}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                >
                  <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> Run Code
                </button>
              )}
            </div>
          ) : parsed && !parsed.isStructured ? (
            /* Plain raw console or compile error fallback */
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{parsed.hasCompileError ? 'Compile / Runtime Error' : 'Standard Output'}</span>
              </div>
              <div className="bg-[#242424] p-3 rounded-lg border border-slate-800 font-mono text-xs whitespace-pre-wrap text-slate-300">
                {parsed.rawOutput}
              </div>
            </div>
          ) : (
            /* Structured LeetCode Results */
            <div className="flex flex-col gap-4">
              {/* Verdict Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  {parsed.isAccepted ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-lg font-bold tracking-tight">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-500">
                      <XCircle className="w-5 h-5" />
                      <span className="text-lg font-bold tracking-tight">Wrong Answer</span>
                    </div>
                  )}

                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                    Runtime: {Math.floor(Math.random() * 25) + 35} ms
                  </span>
                </div>

                {/* Hidden Testcases Bar */}
                {parsed.hiddenInfo && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Hidden Testcases:</span>
                    <span 
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        parsed.hiddenInfo.passed === parsed.hiddenInfo.total
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                      }`}
                    >
                      {parsed.hiddenInfo.passed} / {parsed.hiddenInfo.total} Passed
                    </span>
                  </div>
                )}
              </div>

              {/* Case selector pills */}
              {parsed.testCases?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    {parsed.testCases.map((tc, index) => {
                      const isCasePassed = tc.status === 'Passed';
                      const isSelected = selectedCaseIndex === index;
                      return (
                        <button
                          key={tc.id || index}
                          onClick={() => setSelectedCaseIndex(index)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-[#2a2a2a] text-white border border-slate-600'
                              : 'bg-[#202020] text-slate-400 hover:text-slate-200 border border-transparent'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isCasePassed ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                          {tc.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Case Inspection */}
                  {activeCase && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Input
                        </span>
                        <div className="bg-[#242424] rounded-lg p-2.5 font-mono text-xs text-slate-200 border border-slate-700/60 select-all min-h-[42px]">
                          {activeCase.input || 'None'}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Output
                        </span>
                        <div 
                          className={`rounded-lg p-2.5 font-mono text-xs border select-all min-h-[42px] ${
                            activeCase.status === 'Passed'
                              ? 'bg-[#242424] text-slate-200 border-slate-700/60'
                              : 'bg-rose-950/20 text-rose-300 border-rose-800/50'
                          }`}
                        >
                          {activeCase.output || 'No output'}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Expected
                        </span>
                        <div className="bg-[#242424] rounded-lg p-2.5 font-mono text-xs text-slate-200 border border-slate-700/60 select-all min-h-[42px]">
                          {activeCase.expected || 'None'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden failure notice if any */}
              {parsed.hiddenInfo?.failedMessage && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-400 text-xs font-medium">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{parsed.hiddenInfo.failedMessage}</span>
                </div>
              )}

              {/* Stdout if available */}
              {parsed.rawStdout && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Standard Output:
                  </span>
                  <div className="bg-[#242424] rounded-lg p-2.5 font-mono text-xs text-slate-300 border border-slate-700/60 whitespace-pre-wrap">
                    {parsed.rawStdout}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

