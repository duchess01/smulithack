import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Shield, BookOpen, Send, AlertTriangle, CheckCircle, Info, Lock, User, Bot, ChevronRight, X, Edit3, ThumbsUp, ThumbsDown } from 'lucide-react';

const LegalChatPlatform = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [userProfile, setUserProfile] = useState({ experience: 'beginner' });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [confidentialityCheck, setConfidentialityCheck] = useState(true); // Fixed: default to true
  const [showEducationalTip, setShowEducationalTip] = useState(null);
  const [pendingRefinement, setPendingRefinement] = useState(null);
  const [showPromptAnalysis, setShowPromptAnalysis] = useState(false);
const [promptAnalysis, setPromptAnalysis] = useState(null);
const [showPromptEducation, setShowPromptEducation] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzePrompt = (text) => {
  const textLower = text.toLowerCase();
  
  // Hardcoded analysis for "How can I create a contract for my employee" scenario
  if (textLower.includes('contract') && textLower.includes('employee')) {
    return {
      clarity: 65,
      specificity: 35,
      jurisdiction: 15,
      context: 25,
      suggestions: [
        "Specify the type of employment contract (permanent, temporary, part-time)",
        "Include Singapore jurisdiction and Employment Act requirements",
        "Provide context about your business size and industry",
        "Mention specific clauses you need help with (salary, benefits, termination)"
      ],
      improvements: [
        "Instead of 'contract for employee', try 'employment contract under Singapore Employment Act'",
        "Add business context: 'for my tech startup' or 'for my retail business'",
        "Specify contract type: 'permanent employment contract' vs 'fixed-term contract'"
      ],
      score: 35
    };
  }

  // Fallback for other prompts
  const analysis = {
    clarity: 50,
    specificity: 45,
    jurisdiction: 30,
    context: 40,
    suggestions: ["Be more specific about your legal question"],
    improvements: ["Add more context and specify Singapore jurisdiction"],
    score: 40
  };

  return analysis;
};

  // Sensitive information patterns
  const sensitivePatterns = [
    { regex: /\b\d{6}[A-Z]\b/i, type: 'NRIC', message: 'NRIC detected - Consider redacting personal identifiers' },
    { regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, type: 'email', message: 'Email address detected - Protect client confidentiality' },
    { regex: /\b\d{8,}\b/, type: 'phone', message: 'Possible phone number detected - Consider privacy implications' },
    { regex: /\b(?:case\s+no|suit\s+no)[\s:]?\S+/i, type: 'case', message: 'Case number detected - Verify if this should be shared' },
  ];

  // Legal terms that need verification
  const legalTermsRequiringVerification = [
    'section', 'act', 'regulation', 'statute', 'precedent', 'judgment', 'ruling'
  ];

  // Risk assessment function
  const assessRisk = (text, queryType) => {
    const riskFactors = {
      high: ['court', 'litigation', 'criminal', 'prosecution', 'lawsuit', 'sue', 'breach', 'liable', 'damages'],
      medium: ['contract', 'agreement', 'dispute', 'compliance', 'penalty', 'fine', 'violation'],
      low: ['information', 'general', 'understand', 'explain', 'overview', 'basics']
    };

    const textLower = text.toLowerCase();
    
    if (riskFactors.high.some(term => textLower.includes(term))) {
      return {
        level: 'high',
        color: 'red',
        title: 'High Risk Area',
        message: 'This involves complex legal matters that require immediate professional consultation.',
        actions: [
          'Consult a qualified Singapore lawyer immediately',
          'Do not take any action without legal advice',
          'Preserve all relevant documents',
          'Consider time-sensitive legal deadlines'
        ]
      };
    } else if (riskFactors.medium.some(term => textLower.includes(term))) {
      return {
        level: 'medium',
        color: 'amber',
        title: 'Medium Risk Area',
        message: 'This requires professional review for proper implementation.',
        actions: [
          'Schedule consultation with a lawyer',
          'Review all terms carefully before proceeding',
          'Verify compliance with Singapore regulations',
          'Consider getting a second opinion'
        ]
      };
    } else {
      return {
        level: 'low',
        color: 'green',
        title: 'General Information',
        message: 'This is general legal information for educational purposes.',
        actions: [
          'Use this as background information only',
          'Cross-reference with official sources',
          'Consult a lawyer if specific issues arise',
          'Stay updated on law changes'
        ]
      };
    }
  };

  // Refine prompt function
  const refinePrompt = (originalPrompt) => {
    const refinements = {
      employment: {
        keywords: ['employment', 'work', 'job', 'salary', 'leave', 'termination', 'mom'],
        refined: "I understand you're asking about employment matters in Singapore. Let me refine your question: Are you specifically asking about [employment rights/termination procedures/leave entitlements/salary disputes] under the Employment Act and MOM guidelines? Please specify what your requirements are in detail for better results. An example prompt would be 'How can I draft a legally sound employment contract that clearly defines job responsibilities, compensation, benefits, working hours, confidentiality, termination conditions, and compliance with labor laws?'"
      },
      property: {
        keywords: ['property', 'house', 'hdb', 'condo', 'buy', 'sell', 'lease', 'rent'],
        refined: "I see you're inquiring about property matters. Let me clarify: Are you asking about [HDB regulations/private property transactions/rental agreements/stamp duty requirements] under Singapore property law? Please confirm this refined question addresses your needs."
      },
      contract: {
        keywords: ['contract', 'agreement', 'sign', 'terms', 'breach', 'void'],
        refined: "You're asking about contractual matters. To provide better guidance: Are you specifically interested in how to draft and employee contract for yout company under Singapore contract law? Please provide more information so that I can draft a prompt for you. An example of a good prompt would be 'How can I draft a legally sound employment contract that clearly defines job responsibilities, compensation, benefits, working hours, confidentiality, termination conditions, and compliance with labor laws?'"
      },
      company: {
        keywords: ['company', 'business', 'acra', 'director', 'shareholder', 'incorporation'],
        refined: "I understand you're asking about corporate matters. Let me refine: Are you specifically asking about [company incorporation/director duties/shareholder rights/ACRA compliance] under the Companies Act? Please confirm this captures your query."
      },
      default: {
        keywords: [],
        refined: "To provide you with the most accurate legal information, let me refine your question: Are you asking about [specific legal procedure/rights and obligations/compliance requirements/dispute resolution] in the context of Singapore law? Please confirm if this refinement addresses your query correctly."
      }
    };

    const promptLower = originalPrompt.toLowerCase();
    
    for (const [category, data] of Object.entries(refinements)) {
      if (category !== 'default' && data.keywords.some(keyword => promptLower.includes(keyword))) {
        return data.refined;
      }
    }
    
    return refinements.default.refined;
  };

  // Check for sensitive information
  const checkSensitiveInfo = (text) => {
    const detectedWarnings = [];
    sensitivePatterns.forEach(pattern => {
      if (pattern.regex.test(text)) {
        detectedWarnings.push({
          type: 'sensitive',
          severity: 'high',
          message: pattern.message,
          icon: Lock
        });
      }
    });
    return detectedWarnings;
  };

  // Check for legal citations
  const checkLegalCitations = (text) => {
    const warnings = [];
    const hasLegalTerms = legalTermsRequiringVerification.some(term => 
      text.toLowerCase().includes(term)
    );
    
    if (hasLegalTerms) {
      warnings.push({
        type: 'verification',
        severity: 'medium',
        message: 'Legal references detected - Always verify statutory citations and case law',
        icon: AlertCircle
      });
    }
    return warnings;
  };

  // Educational tips based on query type
  const getEducationalTip = (text) => {
    const tips = {
      contract: {
        title: 'Contract Review Tips',
        content: 'AI can help identify standard clauses but cannot replace professional review for complex agreements. Always verify jurisdiction-specific requirements.',
        icon: BookOpen
      },
      litigation: {
        title: 'Litigation Support',
        content: 'AI can assist with research but cannot provide strategic litigation advice. Court procedures in Singapore require qualified legal representation.',
        icon: Shield
      },
      compliance: {
        title: 'Regulatory Compliance',
        content: 'Singapore regulations change frequently. AI outputs should be cross-referenced with current MAS, ACRA, or relevant authority guidelines.',
        icon: AlertCircle
      }
    };

    if (text.toLowerCase().includes('contract')) return tips.contract;
    if (text.toLowerCase().includes('court') || text.toLowerCase().includes('litigation')) return tips.litigation;
    if (text.toLowerCase().includes('compliance') || text.toLowerCase().includes('regulation')) return tips.compliance;
    
    return null;
  };

  // Simulate AI response with risk assessment
  const generateAIResponse = (userInput, isRefined = false) => {
    const responses = {
      default: "I understand you're seeking legal information. Please note that I'm an AI assistant and cannot provide legal advice. For matters requiring professional judgment, please consult a qualified Singapore lawyer. How can I help you with general legal information today?",
      contract: "For contract-related queries in Singapore, I can provide general information about standard terms and structures. However, specific contract review requires professional legal expertise. Would you like information about general contract principles under Singapore law?",
      property: "Property law in Singapore involves complex regulations including the Residential Property Act and stamp duty requirements. I can share general information, but property transactions should always involve qualified conveyancing lawyers.",
      employment: "Singapore employment law is governed by the Employment Act and MOM guidelines. While I can provide general information about employment rights, specific cases require professional assessment."
    };

    let response = responses.default;
    let queryType = 'general';

    if (userInput.toLowerCase().includes('contract')) {
      response = responses.contract;
      queryType = 'contract';
    } else if (userInput.toLowerCase().includes('property') || userInput.toLowerCase().includes('hdb')) {
      response = responses.property;
      queryType = 'property';
    } else if (userInput.toLowerCase().includes('employment') || userInput.toLowerCase().includes('work')) {
      response = responses.employment;
      queryType = 'employment';
    }

    const riskAssessment = assessRisk(userInput, queryType);

    return {
      text: response,
      riskAssessment,
      isRefined
    };
  };

  const handleSendMessage = () => {
  if (!inputText.trim()) return;

  // Perform prompt analysis
  const analysis = analyzePrompt(inputText);
  
  // Always show analysis for demo purposes when it's the contract/employee scenario
  const isContractEmployeeScenario = inputText.toLowerCase().includes('contract') && inputText.toLowerCase().includes('employee');
  
if (isContractEmployeeScenario || analysis.score < 70) {
  setPromptAnalysis(analysis);
  setShowPromptAnalysis(true);
  
  // For demo: also show the education modal after a delay
  if (isContractEmployeeScenario) {
    setTimeout(() => {
      setShowPromptEducation(true);
    }, 8000); // Show education after 8 seconds
  }
}

  // Check for sensitive information
  const sensitiveWarnings = checkSensitiveInfo(inputText);
  const legalWarnings = checkLegalCitations(inputText);
  const allWarnings = [...sensitiveWarnings, ...legalWarnings];
  
  if (allWarnings.length > 0) {
    setWarnings(allWarnings);
  }

  // Get educational tip
  const tip = getEducationalTip(inputText);
  if (tip) {
    setShowEducationalTip(tip);
  }

  // Add user message with analysis
  const userMessage = {
    id: Date.now(),
    text: inputText,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString(),
    warnings: allWarnings,
    promptAnalysis: analysis
  };

  setMessages(prev => [...prev, userMessage]);
  
  // Check if this is the first interaction or not a refinement confirmation
  const isFirstInteraction = messages.length === 0;
  const currentInput = inputText;
  setInputText('');
  setIsTyping(true);

  if (isFirstInteraction && !pendingRefinement) {
    // First interaction - provide refinement
    setTimeout(() => {
      const refinedPrompt = refinePrompt(currentInput);
      const refinementMessage = {
        id: Date.now() + 1,
        text: refinedPrompt,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        isRefinement: true,
        originalPrompt: currentInput
      };
      setMessages(prev => [...prev, refinementMessage]);
      setPendingRefinement(currentInput);
      setIsTyping(false);
    }, 1500);
  } else {
    // Regular response with risk assessment
    setTimeout(() => {
      const responseData = generateAIResponse(currentInput, !!pendingRefinement);
      const aiResponse = {
        id: Date.now() + 1,
        text: responseData.text,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        disclaimer: true,
        riskAssessment: responseData.riskAssessment
      };
      setMessages(prev => [...prev, aiResponse]);
      setPendingRefinement(null);
      setIsTyping(false);
    }, 1500);
  }
};

const applyImprovedPrompt = (improvedPrompt) => {
  setInputText(improvedPrompt);
  setShowPromptAnalysis(false);
  setPromptAnalysis(null);
};

  const handleRefinementResponse = (accepted) => {
    if (accepted) {
      // User accepted refinement, proceed with original query
      setIsTyping(true);
      setTimeout(() => {
        const responseData = generateAIResponse(pendingRefinement, true);
        const aiResponse = {
          id: Date.now() + 1,
          text: responseData.text,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          disclaimer: true,
          riskAssessment: responseData.riskAssessment
        };
        setMessages(prev => [...prev, aiResponse]);
        setPendingRefinement(null);
        setIsTyping(false);
      }, 1000);
    } else {
      // User rejected refinement, ask for clarification
      const clarificationMessage = {
        id: Date.now() + 1,
        text: "I understand the refinement wasn't quite right. Please rephrase your question with more specific details so I can provide better assistance.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        disclaimer: true
      };
      setMessages(prev => [...prev, clarificationMessage]);
      setPendingRefinement(null);
    }
  };

  const PromptAnalysisCard = ({ analysis, originalPrompt, onApplyImprovement, onClose }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const generateImprovedPrompt = () => {
    // Hardcoded improved prompt for the demo scenario
    if (originalPrompt.toLowerCase().includes('contract') && originalPrompt.toLowerCase().includes('employee')) {
      return "What are the essential clauses I need to include in a permanent employment contract under the Singapore Employment Act for a software developer role at my tech startup, including probation period, salary structure, and termination procedures?";
    }
    
    // Fallback for other prompts
    return originalPrompt + " in Singapore under relevant Singapore law";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <span>Prompt Analysis & Suggestions</span>
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Overall Score */}
      <div className={`p-3 rounded-lg border mb-4 ${getScoreBg(analysis.score)}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Prompt Quality Score</span>
          <span className={`text-xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              analysis.score >= 70 ? 'bg-green-500' : 
              analysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Clarity', score: analysis.clarity },
          { label: 'Specificity', score: analysis.specificity },
          { label: 'Jurisdiction', score: analysis.jurisdiction },
          { label: 'Context', score: analysis.context }
        ].map(({ label, score }) => (
          <div key={label} className="bg-gray-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div 
                className={`h-1 rounded-full ${
                  score >= 70 ? 'bg-green-400' : 
                  score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Improvement Suggestions:</h4>
          <div className="space-y-2">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improved Prompt */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-800 mb-2">Suggested Improved Prompt:</h4>
        <p className="text-sm text-blue-700 bg-white p-2 rounded border border-blue-100 mb-3">
          "{generateImprovedPrompt()}"
        </p>
        <button
          onClick={() => onApplyImprovement(generateImprovedPrompt())}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Use This Improved Prompt
        </button>
      </div>
    </div>
  );
};

  const OnboardingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to LegalGoWhere!</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-700">Important Disclaimer</h3>
              <p className="text-sm text-gray-600">This AI assistant provides general legal information only. It is NOT a substitute for professional legal advice.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-700">Your Responsibility</h3>
              <p className="text-sm text-gray-600">Always verify AI-generated information with official sources and consult qualified Singapore lawyers for specific legal matters.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-700">Data Protection</h3>
              <p className="text-sm text-gray-600">Avoid sharing sensitive personal or client information. The system will warn you about potential confidentiality risks.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Singapore Law Context:</strong> This assistant is designed with Singapore's legal framework in mind, including references to local acts, regulations, and authorities.
          </p>
        </div>

        <button
          onClick={() => setShowOnboarding(false)}
          className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors font-medium"
        >
          I Understand - Continue
        </button>
      </div>
    </div>
  );

  const PromptEducationModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>How to Write Better Legal Prompts</span>
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* The 4 C's Framework */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">The 4 C's of Legal Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">1. Clarity</h4>
              <p className="text-sm text-blue-700">Use specific question words (what, how, when, where, why)</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">2. Context</h4>
              <p className="text-sm text-green-700">Provide situation details without sensitive info</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-1">3. Completeness</h4>
              <p className="text-sm text-amber-700">Include relevant legal areas and timeframes</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">4. Compliance</h4>
              <p className="text-sm text-purple-700">Specify Singapore jurisdiction and relevant acts</p>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Before & After Examples</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">❌ Poor</span>
                <p className="text-sm text-gray-600">"Tell me about employment law"</p>
              </div>
              <div>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">✅ Better</span>
                <p className="text-sm text-gray-700">"What are the notice period requirements under Singapore's Employment Act for terminating a permanent employee who has worked for 2 years?"</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">❌ Poor</span>
                <p className="text-sm text-gray-600">"Contract questions"</p>
              </div>
              <div>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">✅ Better</span>
                <p className="text-sm text-gray-700">"What constitutes a valid acceptance of a contract offer under Singapore Contract Law, and what happens if acceptance is communicated via email?"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Tips</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Always specify "Singapore" or relevant Singapore authority</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Mention specific acts (Employment Act, Companies Act, etc.) if known</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Provide context about your role and requirements (employee, business owner, tenant, etc.)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Avoid sharing sensitive personal or client information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Ask one clear question at a time for best results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  </div>
);

  const WarningBanner = ({ warning }) => (
    <div className={`flex items-start space-x-2 p-3 rounded-lg mb-2 ${
      warning.severity === 'high' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
    }`}>
      <warning.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
        warning.severity === 'high' ? 'text-red-600' : 'text-amber-600'
      }`} />
      <p className={`text-sm ${
        warning.severity === 'high' ? 'text-red-800' : 'text-amber-800'
      }`}>{warning.message}</p>
    </div>
  );

  const EducationalTipCard = ({ tip, onClose }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <tip.icon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">{tip.title}</h4>
            <p className="text-sm text-blue-800">{tip.content}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-blue-600 hover:text-blue-800">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const RiskAssessmentCard = ({ assessment }) => (
    <div className={`mt-3 p-4 rounded-lg border-l-4 ${
      assessment.color === 'red' ? 'bg-red-50 border-red-400' :
      assessment.color === 'amber' ? 'bg-amber-50 border-amber-400' :
      'bg-green-50 border-green-400'
    }`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          assessment.color === 'red' ? 'bg-red-500' :
          assessment.color === 'amber' ? 'bg-amber-500' :
          'bg-green-500'
        }`} />
        <h4 className={`font-semibold ${
          assessment.color === 'red' ? 'text-red-800' :
          assessment.color === 'amber' ? 'text-amber-800' :
          'text-green-800'
        }`}>
          {assessment.title}
        </h4>
      </div>
      <p className={`text-sm mb-3 ${
        assessment.color === 'red' ? 'text-red-700' :
        assessment.color === 'amber' ? 'text-amber-700' :
        'text-green-700'
      }`}>
        {assessment.message}
      </p>
      <div className="space-y-1">
        <h5 className={`font-medium text-sm ${
          assessment.color === 'red' ? 'text-red-800' :
          assessment.color === 'amber' ? 'text-amber-800' :
          'text-green-800'
        }`}>
          Recommended Actions:
        </h5>
        {assessment.actions.map((action, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <ChevronRight className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
              assessment.color === 'red' ? 'text-red-600' :
              assessment.color === 'amber' ? 'text-amber-600' :
              'text-green-600'
            }`} />
            <p className={`text-xs ${
              assessment.color === 'red' ? 'text-red-700' :
              assessment.color === 'amber' ? 'text-amber-700' :
              'text-green-700'
            }`}>
              {action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const RefinementButtons = ({ onAccept, onReject }) => (
    <div className="mt-3 flex space-x-2">
      <button
        onClick={() => onAccept(true)}
        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
      >
        <ThumbsUp className="w-3 h-3" />
        <span>Yes, that's correct</span>
      </button>
      <button
        onClick={() => onAccept(false)}
        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
      >
        <Edit3 className="w-3 h-3" />
        <span>Let me rephrase</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {showOnboarding && <OnboardingModal />}
      {showPromptAnalysis && promptAnalysis && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <PromptAnalysisCard 
        analysis={promptAnalysis}
        originalPrompt={inputText || messages[messages.length - 1]?.text || ''}
        onApplyImprovement={applyImprovedPrompt}
        onClose={() => {
          setShowPromptAnalysis(false);
          setPromptAnalysis(null);
        }}
      />
    </div>
  </div>
)}

{showPromptEducation && (
  <PromptEducationModal onClose={() => setShowPromptEducation(false)} />
)}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">Legal GoWhere?</h1>
          </div>
          <div className="flex items-center space-x-2">
  <button
    onClick={() => setShowPromptEducation(true)}
    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1"
  >
    <BookOpen className="w-3 h-3" />
    <span>Prompt Tips</span>
  </button>
  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Beta</span>
  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Not Legal Advice</span>
</div>
        </div>
      </div>

      {/* Permanent Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> This AI provides general information only. Always consult a qualified Singapore lawyer for legal advice.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {showEducationalTip && (
            <EducationalTipCard 
              tip={showEducationalTip} 
              onClose={() => setShowEducationalTip(null)} 
            />
          )}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-700 mb-2">How can I help you today?</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                I can provide general information about Singapore law, help you understand legal concepts, 
                and guide you to appropriate resources. Remember to verify all information with official sources.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <button 
                  onClick={() => setInputText("What are the key employment rights in Singapore?")}
                  className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-medium text-sm text-gray-700 mb-1">Employment Law</h3>
                  <p className="text-xs text-gray-500">Learn about MOM regulations</p>
                </button>
                
                <button 
                  onClick={() => setInputText("What should I know about property transactions in Singapore?")}
                  className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-medium text-sm text-gray-700 mb-1">Property Law</h3>
                  <p className="text-xs text-gray-500">HDB and private property basics</p>
                </button>
                
                <button 
                onClick={() => setInputText("How can I create a contract for my employee")}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                <h3 className="font-medium text-sm text-gray-700 mb-1">Employment Contract</h3>
                <p className="text-xs text-gray-500">Try this demo prompt!</p>
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              {message.warnings && message.warnings.length > 0 && (
                <div className="mb-2">
                  {message.warnings.map((warning, idx) => (
                    <WarningBanner key={idx} warning={warning} />
                  ))}
                </div>
              )}
              
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-lg ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="w-4 h-4 text-white" /> : 
                      <Bot className="w-4 h-4 text-white" />
                    }
                  </div>
                  
                  <div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    
                    {message.isRefinement && (
                      <RefinementButtons 
                        onAccept={handleRefinementResponse}
                        onReject={handleRefinementResponse}
                      />
                    )}
                    
                    {message.riskAssessment && (
                      <RiskAssessmentCard assessment={message.riskAssessment} />
                    )}
                    
                    {message.disclaimer && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
                        <Info className="w-3 h-3" />
                        <span>General information only - not legal advice</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Bot className="w-5 h-5" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Dynamic Warnings */}
      {warnings.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            {warnings.map((warning, idx) => (
              <WarningBanner key={idx} warning={warning} />
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="confidentiality"
              checked={confidentialityCheck}
              onChange={(e) => setConfidentialityCheck(e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="confidentiality" className="text-xs text-gray-600">
              I've reviewed my message for confidential information
            </label>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setWarnings([]);
              }}
              onKeyPress={(e) => e.key === 'Enter' && confidentialityCheck && handleSendMessage()}
              placeholder="Type your legal question... (Remember: No sensitive client data)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!confidentialityCheck || !inputText.trim()}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                confidentialityCheck && inputText.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Press Enter to send • AI responses are for reference only
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>PDPA Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>IMDA AI Framework</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalChatPlatform;