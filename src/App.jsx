import React, { useState } from 'react';
import { 
  Briefcase, User, FileText, Star, AlertTriangle, 
  CheckCircle, ChevronRight, Zap, Target, Award,
  Activity, UploadCloud, Sparkles, Copy, Bot, Trash2
} from 'lucide-react';

// --- Extrator de PDF (PDF.js Dinâmico) ---
const loadPDFJS = async () => {
  if (window.pdfjsLib) return window.pdfjsLib;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.body.appendChild(script);
  });
};

const parseLinkedInText = (text) => {
  const data = { headline: '', about: '', experience: '', skills: '' };
  const cleanText = text.replace(/Page \d+ of \d+/gi, '').replace(/Contato\n|Contact\n/gi, '');

  const resumoMatch = cleanText.match(/Resumo\n([\s\S]*?)(?:Experiência|Formação acadêmica|Experience|Education)/i);
  if (resumoMatch) data.about = resumoMatch[1].trim();

  const expMatch = cleanText.match(/Experiência\n([\s\S]*?)(?:Formação acadêmica|Education|Principais competências|Competências|Skills|Certifications)/i);
  if (expMatch) data.experience = expMatch[1].trim();

  const skillsMatch = cleanText.match(/(?:Principais competências|Top Skills|Competências)\n([\s\S]*?)(?:Certifications|Languages|Idiomas|Honors|Recomendações|Projetos|Projects|\n[A-Z][a-z]+ [A-Z][a-z]+\n)/i); 
  if (skillsMatch) {
     data.skills = skillsMatch[1].split('\n').map(s => s.trim()).filter(s => s && s.length > 2).join(', ');
  }

  const parts = cleanText.split(/Resumo|Experiência/i);
  if (parts.length > 1) {
     const beforeResumo = parts[0].split('\n').map(l => l.trim()).filter(l => l);
     const headlineLines = [];
     let foundLocation = false;
     for (let i = beforeResumo.length - 1; i >= 0; i--) {
         const line = beforeResumo[i];
         if (!foundLocation && (line.match(/brasil|brazil|portugal/i) || line.split(',').length >= 2)) {
            foundLocation = true;
            continue;
         }
         if (foundLocation) {
            if (line.length < 25 && !line.includes('|') && !line.includes('-') && headlineLines.length > 0) break;
            headlineLines.unshift(line);
         }
     }
     if (headlineLines.length > 0) {
        data.headline = headlineLines.join(' ').replace(/\s+/g, ' ');
     } else if (beforeResumo.length >= 2) {
        data.headline = beforeResumo[beforeResumo.length - 2];
     }
  }
  return data;
};

// --- Integração com IA Real (Groq API) ---
const analyzeWithAI = async (profileData) => {
  // Chave da API inserida diretamente para uso rápido
  const apiKey = "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"; 

  // Prompt do Sistema altamente assertivo e focado em alta performance
  const systemInstruction = `
    Aja como um Tech Recruiter Sênior de uma empresa FAANG (Big Tech) e um Especialista em SEO/ATS para LinkedIn.
    Sua análise deve ser cruelmente honesta, direta e orientada a conversão (conseguir entrevistas).
    Remova qualquer clichê, linguagem passiva ou jargões vazios ("motivado", "focado").

    REGRAS DE REESCRITA (Obrigatórias):
    - HEADLINE: Máximo 120 caracteres. Use o formato: [Cargo Alvo] | [Hard Skill 1, Hard Skill 2] | [Proposta de Valor Curta]. 
    - SOBRE (About): 3 a 4 parágrafos curtos. Foque em anos de experiência, especialidade principal, maiores conquistas e um Call to Action (CTA) claro no final.
    - EXPERIÊNCIA: Você DEVE usar a Fórmula X-Y-Z do Google ("Realizei [X], medido por [Y], fazendo [Z]"). Inicie cada bullet point com um verbo de ação forte no passado (Ex: Otimizei, Arquitetei, Lideri). Invente placeholders [como este] se faltarem métricas, para o usuário preencher depois.
    - SKILLS: Filtre e organize as top 15 Hard Skills mais relevantes para sistemas ATS. Remova soft skills genéricas dessa seção.

    MUITO IMPORTANTE: Você DEVE retornar APENAS um objeto JSON válido. NENHUM texto fora do JSON.
    Siga ESTRITAMENTE esta estrutura de JSON para sua resposta:
    {
      "score": 85,
      "feedback": {
        "headline": {
          "score": 90,
          "items": [ { "type": "success"|"warning"|"error", "text": "Sua mensagem aqui" } ],
          "suggestion": "Texto da reescrita aqui"
        },
        "about": {
          "score": 80,
          "items": [ { "type": "success"|"warning"|"error", "text": "Sua mensagem aqui" } ],
          "suggestion": "Texto da reescrita aqui"
        },
        "experience": {
          "score": 75,
          "items": [ { "type": "success"|"warning"|"error", "text": "Sua mensagem aqui" } ],
          "suggestion": "Texto da reescrita aqui"
        },
        "skills": {
          "score": 100,
          "items": [ { "type": "success"|"warning"|"error", "text": "Sua mensagem aqui" } ],
          "suggestion": "Texto da reescrita aqui"
        }
      },
      "goldenTip": "Uma dica de ouro impactante aqui"
    }
  `;

  const prompt = `Analise este perfil com rigor:\n\nTítulo: ${profileData.headline}\n\nResumo: ${profileData.about}\n\nExperiência: ${profileData.experience}\n\nCompetências: ${profileData.skills}`;

  const payload = {
    model: "llama-3.3-70b-versatile", // Modelo gratuito e poderoso da Groq
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Falha na API da Groq');
      }
      
      const data = await response.json();
      const resultText = data.choices[0].message.content;
      return JSON.parse(resultText);
    } catch (error) {
      if (i === 4) throw new Error("Não foi possível conectar à IA da Groq. Verifique sua chave da API ou tente novamente.");
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};


// --- Componentes UI ---

const ScoreRing = ({ score }) => {
  let color = 'text-rose-500';
  if (score >= 70) color = 'text-amber-400';
  if (score >= 90) color = 'text-emerald-400';

  return (
    <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 36 36">
        <path
          className="text-slate-800"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${color} transition-all duration-1000 ease-out`}
          strokeDasharray={`${score}, 100`}
          strokeWidth="3"
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white tracking-tighter">{Math.round(score)}</span>
        <span className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">Score</span>
      </div>
    </div>
  );
};

const FeedbackCard = ({ title, icon: Icon, data }) => {
  const [copied, setCopied] = useState(false);

  const getStatusColor = (score) => {
    if (score >= 90) return 'border-emerald-500/50 bg-emerald-500/10';
    if (score >= 70) return 'border-amber-500/50 bg-amber-500/10';
    return 'border-rose-500/50 bg-rose-500/10';
  };

  const getStatusText = (score) => {
    if (score >= 90) return { text: 'Excelente', color: 'text-emerald-400' };
    if (score >= 70) return { text: 'Ajustes Necessários', color: 'text-amber-400' };
    return { text: 'Crítico', color: 'text-rose-400' };
  };

  const copyToClipboard = () => {
    if (!data.suggestion) return;
    document.execCommand('copy');
    navigator.clipboard.writeText(data.suggestion).catch(() => {
      const el = document.createElement('textarea');
      el.value = data.suggestion;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = getStatusText(data.score);

  return (
    <div className={`p-5 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm mb-6 ${getStatusColor(data.score)} transition-all`}>
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-900 shadow-inner ${status.color}`}>
            <Icon size={20} />
          </div>
          <h3 className="font-bold text-white text-lg tracking-wide">{title}</h3>
        </div>
        <span className={`font-bold text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 ${status.color}`}>
          {status.text} ({data.score} pts)
        </span>
      </div>
      
      <div className="space-y-3 mb-5">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
            <span className="mt-0.5 flex-shrink-0">
              {item.type === 'error' && <AlertTriangle size={16} className="text-rose-500" />}
              {item.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
              {item.type === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
            </span>
            <p className="leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {data.suggestion && (
        <div className="mt-4 pt-4 border-t border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Sparkles size={14} /> Sugestão Otimizada da IA
            </h4>
            <button 
              onClick={copyToClipboard}
              className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-indigo-500 font-semibold"
            >
              {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          </div>
          <div className="bg-[#0B1120] p-4 rounded-xl text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap leading-relaxed font-mono text-[13px] shadow-inner">
            {data.suggestion}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const initialState = { headline: '', about: '', experience: '', skills: '' };
  const [formData, setFormData] = useState(initialState);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClearData = () => {
    setFormData(initialState);
    setAnalysis(null);
    setErrorMsg("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    
    setIsParsingPDF(true);
    try {
      const pdfjs = await loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let lastY = -1;
        let text = '';
        for (const item of textContent.items) {
          if (lastY !== item.transform[5] && lastY !== -1) text += '\n';
          else if (lastY !== -1) text += ' ';
          text += item.str;
          lastY = item.transform[5];
        }
        fullText += text + '\n';
      }
      
      const extractedData = parseLinkedInText(fullText);
      setFormData(prev => ({
        headline: extractedData.headline || prev.headline,
        about: extractedData.about || prev.about,
        experience: extractedData.experience || prev.experience,
        skills: extractedData.skills || prev.skills
      }));
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao ler o PDF. Tente colar os dados manualmente.");
    } finally {
      setIsParsingPDF(false);
      e.target.value = null;
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setErrorMsg("");
    setAnalysis(null);
    try {
      const result = await analyzeWithAI(formData);
      setAnalysis(result);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = () => {
    setFormData({
      headline: 'Analista de Sistemas | BI e Dados',
      about: 'Trabalho com análise de dados e BI. Faço relatórios em PowerBI e dou suporte para a empresa. Sou muito focado e proativo.',
      experience: 'Analista na Empresa X\nFazia manutenção de servidores e criava dashboards no Power BI para a diretoria. Trabalhava com SQL Server e Oracle.',
      skills: 'Power BI, SQL, Python, Excel, Proatividade, Liderança'
    });
  };

  return (
    // ADICIONADO: w-full e !max-w-full para forçar o preenchimento de todo o ecrã
    <div className="min-h-screen w-full !max-w-full bg-[#0B1120] text-slate-200 font-sans p-4 sm:p-8 lg:p-12 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ADICIONADO: max-w-[1600px] para ocupar até os monitores mais largos */}
      <div className="w-full max-w-[1600px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Bot className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            LinkedIn <span className="text-indigo-500">Magnet</span> AI
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            A auditoria inteligente do seu perfil. Importe seu PDF e deixe nossa IA reescrever sua trajetória com técnicas avançadas de atração de recrutadores.
          </p>
        </div>

        {/* Layout da Grelha - Vai expandir perfeitamente lado a lado em ecrãs grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Formulário de Input (Esquerda) */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            
            <div className="p-6 bg-slate-800/30 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400" /> Perfil Atual
              </h2>
              
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm w-full sm:w-auto">
                 <button 
                   onClick={handleClearData} 
                   className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-2 rounded-lg transition-colors text-xs font-semibold"
                   title="Limpar todos os campos"
                 >
                   <Trash2 size={14} /> Limpar
                 </button>
                 
                 <div className="hidden sm:block w-px h-4 bg-slate-700"></div>

                 <label className={`flex items-center gap-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-semibold flex-1 sm:flex-none justify-center ${isParsingPDF ? 'opacity-70 pointer-events-none animate-pulse' : ''}`}>
                    {isParsingPDF ? <Zap size={16} /> : <UploadCloud size={16} />}
                    {isParsingPDF ? 'Extraindo...' : '1. Importar PDF'}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isParsingPDF} />
                 </label>
              </div>
            </div>
            
            {/* Link exemplo na barra cinza abaixo do header */}
            <div className="px-6 pt-3 pb-0 text-right">
                <button onClick={loadExample} className="text-slate-500 hover:text-indigo-400 transition-colors text-xs font-medium underline underline-offset-2">
                  Preencher com Dados de Exemplo
                </button>
            </div>

            <div className="p-6 pt-4 space-y-6 flex-1 flex flex-col">
              {/* Headline */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <User size={16} className="text-indigo-400"/> Título (Headline)
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="Ex: Analista de TI | Business Intelligence..."
                  className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400"/> Sobre (Resumo)
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Cole aqui o texto da seção Sobre do seu perfil..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y custom-scrollbar placeholder:text-slate-600"
                ></textarea>
              </div>

              {/* Experience */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-400"/> Experiências Profissionais
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Copie as descrições dos seus cargos atuais e anteriores..."
                  className="w-full h-full min-h-[160px] p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y custom-scrollbar placeholder:text-slate-600"
                ></textarea>
              </div>

              {/* Skills */}
              <div className="pb-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Star size={16} className="text-indigo-400"/> Competências Principais
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Ex: Power BI, Python, SQL, Oracle, AWS"
                  className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                   <AlertTriangle size={18} /> {errorMsg}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!formData.headline && !formData.about && !formData.experience && !formData.skills)}
                className="w-full relative group overflow-hidden py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 border border-slate-600 hover:border-indigo-400 mt-auto"
              >
                {/* Efeito Hover Inteligente */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="animate-pulse text-indigo-300" size={20} />
                      IA reescrevendo o perfil...
                    </>
                  ) : (
                    <>2. Gerar Perfil Magnético <ChevronRight size={20} /></>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Painel de Resultados (Direita) */}
          <div className="relative h-full flex flex-col">
            {!analysis && !isAnalyzing ? (
               <div className="flex-1 h-full min-h-[600px] bg-slate-900/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center p-10 text-center text-slate-400">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                    <Bot size={64} className="text-slate-600 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-300">A IA está pronta</h3>
                  <p className="max-w-md">Importe seu currículo em PDF e deixe nossa IA transformar seus textos em um verdadeiro ímã de oportunidades.</p>
               </div>
            ) : isAnalyzing ? (
               <div className="flex-1 h-full min-h-[600px] bg-slate-900/50 backdrop-blur-md rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center p-10 text-center">
                  <div className="relative">
                    <div className="w-24 h-24 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="w-24 h-24 absolute inset-0 border-r-4 border-l-4 border-violet-500 rounded-full animate-[spin_2s_reverse_infinite]"></div>
                    <Bot size={32} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mt-8 text-white mb-2">Processamento Neural</h3>
                  <p className="text-slate-400 animate-pulse">Analisando SEO e aplicando matriz de conversão nas descrições...</p>
               </div>
            ) : (
              <div className="flex-1 bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-8 bg-gradient-to-b from-indigo-900/20 to-slate-900/0 border-b border-slate-700/50 text-center">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center justify-center gap-2">
                    <Target size={16}/> Score de Atratividade
                  </h2>
                  <ScoreRing score={analysis.score} />
                  
                  <div className="mt-6">
                    {analysis.score >= 90 && <p className="text-emerald-400 font-bold flex items-center justify-center gap-2 text-lg"><Award/> Perfil Top 1%! Altamente magnético.</p>}
                    {analysis.score >= 70 && analysis.score < 90 && <p className="text-amber-400 font-bold text-lg">Quase lá! Aplique as sugestões da IA abaixo.</p>}
                    {analysis.score < 70 && <p className="text-rose-400 font-bold text-lg">Perfil Genérico. Urgente aplicar a reescrita da IA.</p>}
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar max-h-[800px]">
                  
                  <FeedbackCard title="Título Otimizado (SEO)" icon={User} data={analysis.feedback.headline} />
                  <FeedbackCard title="Carta de Vendas (Resumo)" icon={Activity} data={analysis.feedback.about} />
                  <FeedbackCard title="Métricas de Impacto (Experiência)" icon={Briefcase} data={analysis.feedback.experience} />
                  <FeedbackCard title="Arsenal Técnico (Skills)" icon={Star} data={analysis.feedback.skills} />
                  
                  {analysis.goldenTip && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-indigo-500/20 rotate-12">
                         <Sparkles size={100} />
                      </div>
                      <h4 className="font-bold text-indigo-300 flex items-center gap-2 mb-3 text-lg relative z-10">
                        <Bot className="text-indigo-400" /> Dica de Ouro da IA
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed relative z-10 text-justify">
                        {analysis.goldenTip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Estilos customizados locais */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99, 102, 241, 0.8); }
      `}} />
    </div>
  );
}