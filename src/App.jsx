import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { 
  Briefcase, User, FileText, Star, AlertTriangle, 
  CheckCircle, ChevronRight, Zap, Target, Award,
  Activity, UploadCloud, Sparkles, Copy, Bot, Trash2
} from 'lucide-react';

const I18N = {
  pt: {
    language: 'Idioma',
    portuguese: 'Português (BR)',
    english: 'English (US)',
    tagline:
      'A auditoria inteligente do seu perfil. Importe seu PDF e deixe nossa IA reescrever sua trajetória com técnicas avançadas de atração de recrutadores.',
    currentProfile: 'Perfil Atual',
    clear: 'Limpar',
    clearTitle: 'Limpar todos os campos',
    importing: 'Extraindo...',
    importPdf: '1. Importar PDF',
    fillExample: 'Preencher com Dados de Exemplo',
    headline: 'Título (Headline)',
    headlinePh: 'Ex: Analista de TI | Business Intelligence...',
    targetRole: 'Cargo alvo',
    targetRolePh: 'Ex: Analista de Dados Sênior / Data Analyst',
    about: 'Sobre (Resumo)',
    aboutPh: 'Cole aqui o texto da seção Sobre do seu perfil...',
    experience: 'Experiências Profissionais',
    experiencePh: 'Copie as descrições dos seus cargos atuais e anteriores...',
    skills: 'Competências Principais',
    skillsPh: 'Ex: Power BI, Python, SQL, Oracle, AWS',
    generating: 'IA reescrevendo o perfil...',
    generate: '2. Gerar Perfil Magnético',
    readyTitle: 'A IA está pronta',
    readyDesc:
      'Importe seu currículo em PDF e deixe nossa IA transformar seus textos em um verdadeiro ímã de oportunidades.',
    processingTitle: 'Processamento Neural',
    processingDesc: 'Analisando SEO e aplicando matriz de conversão nas descrições...',
    attractivenessScore: 'Score de Atratividade',
    top1: 'Perfil Top 1%! Altamente magnético.',
    almost: 'Quase lá! Aplique as sugestões da IA abaixo.',
    generic: 'Perfil Genérico. Urgente aplicar a reescrita da IA.',
    optimizedHeadline: 'Título Otimizado (SEO)',
    salesLetter: 'Carta de Vendas (Resumo)',
    impactMetrics: 'Métricas de Impacto (Experiência)',
    techStack: 'Arsenal Técnico (Skills)',
    goldenTip: 'Dica de Ouro da IA',
    aiSuggestion: 'Sugestão Otimizada da IA',
    copyText: 'Copiar Texto',
    copied: 'Copiado!',
    points: 'pts',
    statusExcellent: 'Excelente',
    statusAdjust: 'Ajustes Necessários',
    statusCritical: 'Crítico',
    copyAll: 'Copiar tudo',
    downloadMd: 'Baixar .md',
    downloadDocx: 'Baixar .docx',
    placeholdersTitle: 'Métricas pendentes (placeholders)',
    placeholdersDesc: 'Preencha os itens entre colchetes para deixar o texto “pronto para ATS”.',
    placeholdersFound: 'placeholders encontrados',
    previewTitle: 'Preview (estilo LinkedIn)',
    previewDesc: 'Visualização rápida do texto final para copiar e colar.',
    missingKey: 'Chave da Groq não configurada. Crie um .env.local com VITE_GROQ_API_KEY=...',
    groqFail: 'Não foi possível conectar à IA da Groq. Verifique sua chave da API ou tente novamente.',
    pdfTooLarge: 'PDF muito grande. Use um arquivo de até 10MB.',
    pdfReadError: 'Erro ao ler o PDF. Tente colar os dados manualmente.',

    proReportTitle: 'Relatório Profissional (Perfil Ouro)',
    level: 'Nível',
    profileStrengthIndex: 'Índice de Força do Perfil',
    headlineVersions: '3 Headline prontas',
    keywordMapTitle: 'Mapa de Palavras-chave',
    seoIndexTitle: 'Índice de Encontrabilidade (SEO)',
    planTitle: 'Plano 30-60-90',
    checklistTitle: 'Checklist Perfil Ouro',
    finalVerdictTitle: 'Veredito Final',
  },
  en: {
    language: 'Language',
    portuguese: 'Português (BR)',
    english: 'English (US)',
    tagline:
      'An intelligent audit of your profile. Import your PDF and let our AI rewrite your career story using advanced recruiter-attraction techniques.',
    currentProfile: 'Current Profile',
    clear: 'Clear',
    clearTitle: 'Clear all fields',
    importing: 'Extracting...',
    importPdf: '1. Import PDF',
    fillExample: 'Fill with Example Data',
    headline: 'Headline',
    headlinePh: 'e.g.: Data Analyst | SQL, Power BI | Insights to revenue',
    targetRole: 'Target role',
    targetRolePh: 'e.g.: Senior Data Analyst',
    about: 'About',
    aboutPh: 'Paste your LinkedIn About section here...',
    experience: 'Work Experience',
    experiencePh: 'Paste descriptions from your current and past roles...',
    skills: 'Top Skills',
    skillsPh: 'e.g.: Power BI, Python, SQL, AWS',
    generating: 'AI is rewriting your profile...',
    generate: '2. Generate Magnetic Profile',
    readyTitle: 'AI is ready',
    readyDesc: 'Import your PDF and let our AI turn your text into a real opportunity magnet.',
    processingTitle: 'Neural Processing',
    processingDesc: 'Analyzing SEO/ATS and applying conversion frameworks...',
    attractivenessScore: 'Attractiveness Score',
    top1: 'Top 1% profile! Highly magnetic.',
    almost: 'Almost there! Apply the suggestions below.',
    generic: 'Generic profile. Apply the rewrite urgently.',
    optimizedHeadline: 'SEO-Optimized Headline',
    salesLetter: 'Sales Letter (About)',
    impactMetrics: 'Impact Metrics (Experience)',
    techStack: 'Technical Stack (Skills)',
    goldenTip: 'AI Golden Tip',
    aiSuggestion: 'AI-Optimized Suggestion',
    copyText: 'Copy text',
    copied: 'Copied!',
    points: 'pts',
    statusExcellent: 'Excellent',
    statusAdjust: 'Needs work',
    statusCritical: 'Critical',
    copyAll: 'Copy all',
    downloadMd: 'Download .md',
    downloadDocx: 'Download .docx',
    placeholdersTitle: 'Missing metrics (placeholders)',
    placeholdersDesc: 'Fill items in brackets to make the text ATS-ready.',
    placeholdersFound: 'placeholders found',
    previewTitle: 'Preview (LinkedIn style)',
    previewDesc: 'Quick view of the final text to copy/paste.',
    missingKey: 'Groq key not configured. Create a .env.local with VITE_GROQ_API_KEY=...',
    groqFail: 'Could not connect to Groq. Check your API key or try again.',
    pdfTooLarge: 'PDF too large. Please use a file up to 10MB.',
    pdfReadError: 'Could not read the PDF. Try pasting the text manually.',

    proReportTitle: 'Professional Report (Gold Profile)',
    level: 'Level',
    profileStrengthIndex: 'Profile Strength Index',
    headlineVersions: '3 ready-to-copy headlines',
    keywordMapTitle: 'Keyword Map',
    seoIndexTitle: 'Findability Index (SEO)',
    planTitle: '30-60-90 Plan',
    checklistTitle: 'Gold Profile Checklist',
    finalVerdictTitle: 'Final Verdict',
  },
};

const sanitizeJsonText = (text) => {
  if (typeof text !== 'string') return '';

  let out = text.trim();

  // Remove code fences if the model accidentally returns them.
  out = out.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');

  // Convert \u{1F600} -> actual unicode char (JSON does not support \u{...}).
  out = out.replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_m, hex) => {
    const codePoint = Number.parseInt(hex, 16);
    if (!Number.isFinite(codePoint)) return '';
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return '';
    }
  });

  // Fix invalid unicode escapes like "\u12G4" by escaping the backslash.
  out = out.replace(/\\u(?![0-9a-fA-F]{4})/g, '\\\\u');

  return out;
};

const parseModelJsonObject = (rawText) => {
  const sanitized = sanitizeJsonText(rawText);
  if (!sanitized) {
    throw new Error('Resposta vazia da IA');
  }

  try {
    return JSON.parse(sanitized);
  } catch {
    // Fallback: extract the first JSON object from the text.
    const start = sanitized.indexOf('{');
    const end = sanitized.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('JSON inválido');
    const candidate = sanitized.slice(start, end + 1);
    return JSON.parse(candidate);
  }
};

const normalizeAnalysis = (value) => {
  const safeNumber = (n, fallback = 0) => (Number.isFinite(Number(n)) ? Number(n) : fallback);
  const safeItems = (items) => (Array.isArray(items) ? items : []);
  const safeText = (s) => (typeof s === 'string' ? s : '');

  const feedback = value?.feedback ?? {};
  const section = (key) => {
    const node = feedback?.[key] ?? {};
    return {
      score: safeNumber(node.score, 0),
      items: safeItems(node.items).map((it) => ({
        type: it?.type === 'success' || it?.type === 'warning' || it?.type === 'error' ? it.type : 'warning',
        text: safeText(it?.text),
      })),
      suggestion: safeText(node.suggestion),
    };
  };

  return {
    score: safeNumber(value?.score, 0),
    feedback: {
      headline: section('headline'),
      about: section('about'),
      experience: section('experience'),
      skills: section('skills'),
    },
    goldenTip: safeText(value?.goldenTip),
    proReport: value?.proReport && typeof value.proReport === 'object' ? value.proReport : null,
  };
};

const extractPlaceholders = (text) => {
  if (!text) return [];
  return text.match(/\[[^\]\n]{2,80}\]/g) ?? [];
};

const safeClipboardWrite = async (text) => {
  if (!text) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    throw new Error('Clipboard API indisponível');
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

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
const analyzeWithAI = async (profileData, options) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    const isEn = options?.lang === 'en';
    throw new Error(isEn ? I18N.en.missingKey : I18N.pt.missingKey);
  }

  const isEn = options?.lang === 'en';
  const outputLanguage = isEn ? 'English (US)' : 'Português (Brasil)';
  const targetRole = (options?.targetRole ?? '').trim();

  // Prompt do Sistema altamente assertivo e focado em alta performance
  const systemInstruction = `
    Aja como um Tech Recruiter Sênior de uma empresa FAANG (Big Tech) e um Especialista em SEO/ATS para LinkedIn.
    Sua análise deve ser cruelmente honesta, direta e orientada a conversão (conseguir entrevistas).
    Remova qualquer clichê, linguagem passiva ou jargões vazios ("motivado", "focado").

    CONTEXTO (Obrigatório):
    - Idioma de saída: ${outputLanguage}. Escreva TODOS os textos de "suggestion" e "goldenTip" nesse idioma.
    - Cargo alvo (se informado): ${targetRole || '[não informado — inferir pelo perfil]'}.

    REGRAS DE REESCRITA (Obrigatórias):
    - HEADLINE: Máximo 120 caracteres. Use o formato: [Cargo Alvo] | [Hard Skill 1, Hard Skill 2] | [Proposta de Valor Curta]. 
    - SOBRE (About): 3 a 4 parágrafos curtos. Foque em anos de experiência, especialidade principal, maiores conquistas e um Call to Action (CTA) claro no final.
    - EXPERIÊNCIA (Muito importante): Reescreva e otimize TODO o texto de experiência fornecido pelo usuário — não foque apenas no último cargo.
      - Se houver múltiplas posições/empresas, preserve todas e mantenha a ordem original (mais recente → mais antiga).
      - Para cada cargo, gere 3 a 6 bullets usando a Fórmula X-Y-Z do Google: "Realizei [X], medido por [Y], fazendo [Z]".
      - Comece cada bullet com um verbo forte no passado (Ex: Otimizei, Arquitetei, Liderei, Automatizei, Reduzi, Implementei).
      - Se faltarem números/métricas, crie placeholders claros entre colchetes (ex.: [redução de 18%], [R$ X], [tempo em minutos]).
      - Formatação: organize por cargo (ex.: "Cargo — Empresa (Período)") e bullets em linhas separadas com "- ".
      - Obrigatório: inclua pelo menos 1 métrica (número real ou placeholder) em cada cargo.
      - Se o texto vier "embolsado" (sem separação clara de cargos), você deve inferir blocos e ainda assim reescrever tudo.
    - SKILLS: Filtre e organize as top 15 Hard Skills mais relevantes para sistemas ATS. Remova soft skills genéricas dessa seção.

    DIAGNÓSTICO PROFISSIONAL (Obrigatório):
    Você também é um Especialista em Marca Pessoal, Recrutamento Tech e SEO para LinkedIn.
    Gere um diagnóstico profissional completo e classifique o perfil em: Iniciante | Intermediário | Avançado | PERFIL OURO.
    Use apenas as informações fornecidas pelo usuário. Se algum tópico não estiver informado (ex.: Educação/Certificações/Engajamento), assuma como "não informado" e sinalize no checklist.

    LIMITES (Obrigatório):
    - Mantenha listas curtas e acionáveis (máx. 8 itens por lista).
    - checklist: máx. 10 itens.
    - plano 30-60-90: máx. 6 itens por período.

    REGRAS DE SAÍDA (Crítico):
    - Retorne APENAS JSON válido, sem markdown e sem blocos de código.
    - NÃO use escapes unicode (ex.: \\u{...} ou \\uXXXX). Use caracteres normais UTF-8.
    - Não use emojis.

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
      "goldenTip": "Explique em 2-4 frases o que é a fórmula X-Y-Z e dê 1 exemplo prático aplicado ao perfil do usuário.",
      "proReport": {
        "level": "Iniciante|Intermediário|Avançado|PERFIL OURO",
        "profileStrengthIndex": {
          "total": 72,
          "breakdown": {
            "headlineProfessional": 10,
            "aboutSummary": 9,
            "experiences": 9,
            "strategicKeywords": 8,
            "measurableResults": 7,
            "educationCertifications": 0,
            "engagementAuthority": 0,
            "positioningClarity": 4
          }
        },
        "headlineVersions": {
          "recruiters": "...",
          "ats": "...",
          "authority": "..."
        },
        "keywordMap": {
          "priority": ["..."],
          "whereToInsert": ["..."],
          "idealFrequency": "..."
        },
        "seoFindability": {
          "score": 68,
          "tips": ["..."]
        },
        "plan306090": {
          "d30": ["..."],
          "d60": ["..."],
          "d90": ["..."]
        },
        "checklist": [
          { "status": "OK|AJUSTAR|CRÍTICO", "text": "..." }
        ],
        "finalVerdict": {
          "verdict": "...",
          "priorities": ["..."]
        }
      }
    }
  `;

  const prompt = `Analise este perfil com rigor:\n\nCargo alvo (se existir): ${targetRole || '(não informado)'}\n\nTítulo: ${profileData.headline}\n\nResumo: ${profileData.about}\n\nExperiência (texto completo, pode conter vários cargos): ${profileData.experience}\n\nCompetências: ${profileData.skills}`;

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
      const parsed = parseModelJsonObject(resultText);
      return normalizeAnalysis(parsed);
    } catch {
      if (i === 4) throw new Error(isEn ? I18N.en.groqFail : I18N.pt.groqFail);
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};


// --- Componentes UI ---

const ScoreRing = ({ score }) => {
  const gradientId = useId();

  let color = 'text-rose-500';
  if (score >= 70) color = 'text-amber-400';
  if (score >= 90) color = 'text-emerald-400';

  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
      <div className="absolute inset-0 rounded-full bg-slate-950/40 border border-slate-700/50 shadow-inner"></div>
      <div className="absolute inset-2 rounded-full bg-indigo-500/10 blur-xl opacity-70"></div>

      <svg className="relative z-10 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.75" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <path
          className="text-slate-800"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${color} transition-all duration-1000 ease-out drop-shadow-[0_0_10px_currentColor]`}
          strokeDasharray={`${score}, 100`}
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute z-20 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-white tracking-tighter leading-none">{Math.round(score)}</span>
        <span className="text-[11px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">SCORE</span>
      </div>
    </div>
  );
};

const parseExperienceBlocks = (text) => {
  if (!text) return [];

  const lines = String(text)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd());

  const blocks = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    const hasContent =
      (current.heading && current.heading.trim()) ||
      current.bullets.length > 0 ||
      current.paragraphs.length > 0;
    if (hasContent) blocks.push(current);
    current = null;
  };

  const isHeadingLine = (line) => {
    const s = line.trim();
    if (!s) return false;
    if (/^[-•*]\s+/.test(s)) return false;
    if (s.length > 140) return false;
    if (!s.includes('(') || !s.includes(')')) return false;
    return /\s[—-]\s/.test(s) || s.includes('—');
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isHeadingLine(line)) {
      pushCurrent();
      current = { heading: line, bullets: [], paragraphs: [] };
      continue;
    }

    const bulletMatch = line.match(/^[-•*]\s+(.*)$/);
    if (bulletMatch) {
      if (!current) current = { heading: '', bullets: [], paragraphs: [] };
      const bulletText = (bulletMatch[1] || '').trim();
      if (bulletText) current.bullets.push(bulletText);
      continue;
    }

    if (!current) current = { heading: '', bullets: [], paragraphs: [] };
    current.paragraphs.push(line);
  }

  pushCurrent();
  return blocks;
};

const ExperienceSuggestionView = ({ text }) => {
  const blocks = parseExperienceBlocks(text);

  if (blocks.length === 0) {
    return <div className="whitespace-pre-wrap leading-relaxed font-mono text-[13px]">{text}</div>;
  }

  const hasMultipleBlocks = blocks.filter((b) => b.heading).length >= 1;
  if (!hasMultipleBlocks) {
    return <div className="whitespace-pre-wrap leading-relaxed font-mono text-[13px]">{text}</div>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => (
        <div key={`${block.heading || 'block'}-${idx}`} className="rounded-xl border border-slate-700/40 bg-slate-950/30 p-4">
          {block.heading && (
            <div className="text-sm font-bold text-slate-100 tracking-wide">
              {block.heading}
            </div>
          )}

          {block.paragraphs.length > 0 && (
            <div className="mt-2 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {block.paragraphs.join('\n')}
            </div>
          )}

          {block.bullets.length > 0 && (
            <div className="mt-3 space-y-2">
              {block.bullets.map((b, bIdx) => (
                <div key={`${idx}-b-${bIdx}`} className="flex gap-3 text-sm text-slate-200 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-400/80 flex-shrink-0" />
                  <div className="whitespace-pre-wrap">{b}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ExperiencePreviewView = ({ text }) => {
  const blocks = parseExperienceBlocks(text);

  if (blocks.length === 0) {
    return <div className="whitespace-pre-wrap leading-relaxed">{text}</div>;
  }

  const hasHeadings = blocks.some((b) => b.heading);
  if (!hasHeadings) {
    return <div className="whitespace-pre-wrap leading-relaxed">{text}</div>;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => (
        <div key={`${block.heading || 'block'}-${idx}`} className="space-y-2">
          {block.heading && (
            <div className="text-slate-100 font-semibold">{block.heading}</div>
          )}

          {block.paragraphs.length > 0 && (
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {block.paragraphs.join('\n')}
            </div>
          )}

          {block.bullets.length > 0 && (
            <div className="space-y-2">
              {block.bullets.map((b, bIdx) => (
                <div key={`${idx}-pb-${bIdx}`} className="flex gap-3 text-slate-200 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400/80 flex-shrink-0" />
                  <div className="whitespace-pre-wrap">{b}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const FeedbackCard = ({ title, icon: Icon, data, t, sectionKey }) => {
  const [copied, setCopied] = useState(false);

  const getStatusColor = (score) => {
    if (score >= 90) return 'border-emerald-500/50 bg-emerald-500/10';
    if (score >= 70) return 'border-amber-500/50 bg-amber-500/10';
    return 'border-rose-500/50 bg-rose-500/10';
  };

  const getStatusText = (score) => {
    if (score >= 90) return { text: t('statusExcellent'), color: 'text-emerald-400' };
    if (score >= 70) return { text: t('statusAdjust'), color: 'text-amber-400' };
    return { text: t('statusCritical'), color: 'text-rose-400' };
  };

  const copyToClipboard = async () => {
    if (!data.suggestion) return;

    await safeClipboardWrite(data.suggestion);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = getStatusText(data.score);

  return (
    <div className={`p-5 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm mb-6 ${getStatusColor(data.score)} transition-all`}>
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-900 shadow-inner ${status.color}`}>
            {React.createElement(Icon, { size: 20 })}
          </div>
          <h3 className="font-bold text-white text-lg tracking-wide">{title}</h3>
        </div>
        <span className={`font-bold text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 ${status.color}`}>
          {status.text} ({data.score} {t('points')})
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
              <Sparkles size={14} /> {t('aiSuggestion')}
            </h4>
            <button 
              onClick={copyToClipboard}
              className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-indigo-500 font-semibold"
            >
              {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? t('copied') : t('copyText')}
            </button>
          </div>
          <div className="bg-[#0B1120] p-4 rounded-xl text-sm text-slate-200 border border-slate-700/50 shadow-inner">
            {sectionKey === 'experience' ? (
              <ExperienceSuggestionView text={data.suggestion} />
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed font-mono text-[13px]">{data.suggestion}</div>
            )}
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
  const [uiLang, setUiLang] = useState('pt');
  const [targetRole, setTargetRole] = useState('');
  const [bulkActionState, setBulkActionState] = useState(null); // 'copied' | 'downloaded-md' | 'downloaded-docx'

  const placeholdersRef = useRef(null);

  const STORAGE_KEY = 'linkedin-magnet-ai:v2';

  const t = useMemo(() => {
    return (key) => I18N[uiLang]?.[key] ?? I18N.pt[key] ?? key;
  }, [uiLang]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.formData) {
        setFormData({ ...initialState, ...parsed.formData });
      }
      if (parsed?.analysis) {
        setAnalysis(normalizeAnalysis(parsed.analysis));
      }
      if (parsed?.uiLang) {
        setUiLang(parsed.uiLang === 'en' ? 'en' : 'pt');
      }
      if (typeof parsed?.targetRole === 'string') {
        setTargetRole(parsed.targetRole);
      }
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, analysis, uiLang, targetRole }));
    } catch {
      // ignore
    }
  }, [formData, analysis, uiLang, targetRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClearData = () => {
    setFormData(initialState);
    setAnalysis(null);
    setErrorMsg("");
    setTargetRole('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setErrorMsg(t('pdfTooLarge'));
      e.target.value = null;
      return;
    }
    
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
      setErrorMsg(t('pdfReadError'));
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
      const result = await analyzeWithAI(formData, { lang: uiLang, targetRole });
      setAnalysis(result);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = () => {
    if (uiLang === 'en') {
      setTargetRole('Senior Data Analyst');
      setFormData({
        headline: 'Data Analyst | SQL, Power BI',
        about: 'I work with BI and analytics, turning data into decisions. I build dashboards in Power BI and automate reporting. I am focused on impact and measurable outcomes.',
        experience:
          'Data Analyst — Company X\nBuilt Power BI dashboards for executives and automated recurring reports. Worked with SQL Server and Oracle to improve data quality.',
        skills: 'Power BI, SQL, Python, Excel, AWS'
      });
      return;
    }

    setTargetRole('Analista de Dados Sênior');
    setFormData({
      headline: 'Analista de Sistemas | BI e Dados',
      about: 'Trabalho com análise de dados e BI. Faço relatórios em PowerBI e dou suporte para a empresa. Sou muito focado e proativo.',
      experience:
        'Analista — Empresa X\nCriava dashboards no Power BI para a diretoria e automatizava relatórios. Trabalhava com SQL Server e Oracle para melhorar a qualidade dos dados.',
      skills: 'Power BI, SQL, Python, Excel, AWS'
    });
  };

  const finalHeadline = analysis?.feedback?.headline?.suggestion || formData.headline;
  const finalAbout = analysis?.feedback?.about?.suggestion || formData.about;
  const finalExperience = analysis?.feedback?.experience?.suggestion || formData.experience;
  const finalSkills = analysis?.feedback?.skills?.suggestion || formData.skills;

  const allTextMarkdown = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `# LinkedIn Magnet AI - By Aurora Business\n\n_Date: ${today}_\n\n## Headline\n${finalHeadline || ''}\n\n## About\n${finalAbout || ''}\n\n## Experience\n${finalExperience || ''}\n\n## Skills\n${finalSkills || ''}\n`;
  }, [finalAbout, finalExperience, finalHeadline, finalSkills]);

  const placeholders = useMemo(() => {
    const values = [
      analysis?.feedback?.headline?.suggestion,
      analysis?.feedback?.about?.suggestion,
      analysis?.feedback?.experience?.suggestion,
      analysis?.feedback?.skills?.suggestion,
    ];
    const set = new Set();
    for (const value of values) {
      for (const ph of extractPlaceholders(value)) {
        set.add(ph);
      }
    }
    return Array.from(set);
  }, [analysis]);

  const hasPlaceholders = placeholders.length > 0;

  const nudgeToPlaceholders = () => {
    if (!hasPlaceholders) return;
    placeholdersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopyAll = async () => {
    await safeClipboardWrite(allTextMarkdown);
    setBulkActionState('copied');
    setTimeout(() => setBulkActionState(null), 1500);
    nudgeToPlaceholders();
  };

  const handleDownloadMd = () => {
    const today = new Date().toISOString().slice(0, 10);
    const blob = new Blob([allTextMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-magnet-ai-${today}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBulkActionState('downloaded-md');
    setTimeout(() => setBulkActionState(null), 1500);
    nudgeToPlaceholders();
  };

  const handleDownloadDocx = async () => {
    const today = new Date().toISOString().slice(0, 10);

    // Import dinâmico para não pesar no bundle inicial
    const docx = await import('docx');
    const { Document, Packer, Paragraph, HeadingLevel } = docx;

    const linesToParagraphs = (value) => {
      const text = (value ?? '').toString();
      const lines = text.split(/\r?\n/);
      return lines.map((line) => new Paragraph({ text: line }));
    };

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: 'LinkedIn Magnet AI - By Aurora Business', heading: HeadingLevel.TITLE }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Headline', heading: HeadingLevel.HEADING_1 }),
            ...linesToParagraphs(finalHeadline),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'About', heading: HeadingLevel.HEADING_1 }),
            ...linesToParagraphs(finalAbout),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_1 }),
            ...linesToParagraphs(finalExperience),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_1 }),
            ...linesToParagraphs(finalSkills),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-magnet-ai-${today}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setBulkActionState('downloaded-docx');
    setTimeout(() => setBulkActionState(null), 1500);
    nudgeToPlaceholders();
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
          <div className="flex justify-end mb-4">
            <label className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold">{t('language')}</span>
              <select
                value={uiLang}
                onChange={(e) => setUiLang(e.target.value === 'en' ? 'en' : 'pt')}
                className="bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="pt">{t('portuguese')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </label>
          </div>
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Bot className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            LinkedIn <span className="text-indigo-500">Magnet</span> AI - By Aurora Business
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {t('tagline')}
          </p>
        </div>

        {/* Layout da Grelha - Vai expandir perfeitamente lado a lado em ecrãs grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Formulário de Input (Esquerda) */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            
            <div className="p-6 bg-slate-800/30 border-b border-slate-700/50 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400" /> {t('currentProfile')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                <button
                  onClick={loadExample}
                  className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-slate-200 px-4 py-2 rounded-xl transition-all font-semibold border border-slate-700/50 hover:border-indigo-500 text-xs"
                >
                  <Sparkles size={16} className="text-indigo-300" /> {t('fillExample')}
                </button>

                <button
                  onClick={handleClearData}
                  className="flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-rose-300 px-4 py-2 rounded-xl transition-all font-semibold border border-slate-700/50 hover:border-rose-500/70 text-xs"
                  title={t('clearTitle')}
                >
                  <Trash2 size={16} /> {t('clear')}
                </button>

                <label className={`flex items-center justify-center gap-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-semibold ${isParsingPDF ? 'opacity-70 pointer-events-none animate-pulse' : ''}`}>
                  {isParsingPDF ? <Zap size={16} /> : <UploadCloud size={16} />}
                  {isParsingPDF ? t('importing') : t('importPdf')}
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isParsingPDF} />
                </label>
              </div>
            </div>

            <div className="p-6 pt-4 space-y-6 flex-1 flex flex-col">
              {/* Headline */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <User size={16} className="text-indigo-400"/> {t('headline')}
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder={t('headlinePh')}
                  className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Target size={16} className="text-indigo-400" /> {t('targetRole')}
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder={t('targetRolePh')}
                  className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400"/> {t('about')}
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder={t('aboutPh')}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y custom-scrollbar placeholder:text-slate-600"
                ></textarea>
              </div>

              {/* Experience */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-400"/> {t('experience')}
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder={t('experiencePh')}
                  className="w-full h-full min-h-[160px] p-4 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y custom-scrollbar placeholder:text-slate-600"
                ></textarea>
              </div>

              {/* Skills */}
              <div className="pb-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Star size={16} className="text-indigo-400"/> {t('skills')}
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder={t('skillsPh')}
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
                      {t('generating')}
                    </>
                  ) : (
                    <>{t('generate')} <ChevronRight size={20} /></>
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
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Bot size={64} className="text-slate-600 relative z-10 robot-float" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-300">{t('readyTitle')}</h3>
                  <p className="max-w-md">{t('readyDesc')}</p>
               </div>
            ) : isAnalyzing ? (
               <div className="flex-1 h-full min-h-[600px] bg-slate-900/50 backdrop-blur-md rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center p-10 text-center">
                  <div className="relative">
                    <div className="w-24 h-24 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="w-24 h-24 absolute inset-0 border-r-4 border-l-4 border-violet-500 rounded-full animate-[spin_2s_reverse_infinite]"></div>
                    <Bot size={32} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mt-8 text-white mb-2">{t('processingTitle')}</h3>
                  <p className="text-slate-400 animate-pulse">{t('processingDesc')}</p>
               </div>
            ) : (
              <div className="flex-1 bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-8 bg-gradient-to-b from-indigo-900/20 to-slate-900/0 border-b border-slate-700/50 text-center">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center justify-center gap-2">
                    <Target size={16}/> {t('attractivenessScore')}
                  </h2>
                  <ScoreRing score={analysis.score} />
                  
                  <div className="mt-6">
                    {analysis.score >= 90 && <p className="text-emerald-400 font-bold flex items-center justify-center gap-2 text-lg"><Award/> {t('top1')}</p>}
                    {analysis.score >= 70 && analysis.score < 90 && <p className="text-amber-400 font-bold text-lg">{t('almost')}</p>}
                    {analysis.score < 70 && <p className="text-rose-400 font-bold text-lg">{t('generic')}</p>}
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar max-h-[800px]">

                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={handleCopyAll}
                      className="text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 font-semibold"
                    >
                      <Copy size={14} /> {t('copyAll')}
                    </button>
                    <button
                      onClick={handleDownloadMd}
                      className="text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 font-semibold"
                    >
                      <FileText size={14} className="text-indigo-400" /> {t('downloadMd')}
                    </button>
                    <button
                      onClick={handleDownloadDocx}
                      className="text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 font-semibold"
                    >
                      <FileText size={14} className="text-indigo-400" /> {t('downloadDocx')}
                    </button>

                    {hasPlaceholders && (
                      <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                        <AlertTriangle size={14} className="text-amber-400" />
                        <span className="font-semibold">{placeholders.length}</span>
                        <span>{t('placeholdersFound')}</span>
                      </div>
                    )}

                    {bulkActionState === 'copied' && (
                      <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                        <CheckCircle size={14} className="text-emerald-400" /> {t('copied')}
                      </div>
                    )}
                  </div>
                  
                  <FeedbackCard title={t('optimizedHeadline')} icon={User} data={analysis.feedback.headline} t={t} />
                  <FeedbackCard title={t('salesLetter')} icon={Activity} data={analysis.feedback.about} t={t} />
                  <FeedbackCard title={t('impactMetrics')} icon={Briefcase} data={analysis.feedback.experience} t={t} sectionKey="experience" />
                  <FeedbackCard title={t('techStack')} icon={Star} data={analysis.feedback.skills} t={t} />

                  {analysis.proReport && (
                    <div className="mb-6 p-5 rounded-2xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white flex items-center gap-2">
                            <Award size={18} className="text-indigo-400" /> {t('proReportTitle')}
                          </h4>
                          <p className="text-sm text-slate-400 mt-1">
                            {t('level')}: <span className="text-slate-200 font-semibold">{analysis.proReport?.level || '-'}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('profileStrengthIndex')}</div>
                          <div className="text-2xl font-extrabold text-white">
                            {Number.isFinite(Number(analysis.proReport?.profileStrengthIndex?.total))
                              ? Math.round(Number(analysis.proReport.profileStrengthIndex.total))
                              : '-'}
                            <span className="text-sm text-slate-400 font-semibold">/100</span>
                          </div>
                        </div>
                      </div>

                      {analysis.proReport?.profileStrengthIndex?.breakdown && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {Object.entries(analysis.proReport.profileStrengthIndex.breakdown).map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between bg-slate-950/30 border border-slate-700/40 rounded-xl px-3 py-2">
                              <span className="text-slate-300 truncate">{k}</span>
                              <span className="text-slate-200 font-semibold">{Number.isFinite(Number(v)) ? Number(v) : '-'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {analysis.proReport?.headlineVersions && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('headlineVersions')}</div>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-1">Recruiters</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">{analysis.proReport.headlineVersions.recruiters || '-'}</div>
                            </div>
                            <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-1">ATS</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">{analysis.proReport.headlineVersions.ats || '-'}</div>
                            </div>
                            <div className="bg-slate-950/40 border border-slate-700/50 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-1">Authority</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">{analysis.proReport.headlineVersions.authority || '-'}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {analysis.proReport?.keywordMap && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('keywordMapTitle')}</div>
                          <div className="text-sm text-slate-300">
                            <div className="mb-2"><span className="text-slate-400">Priority:</span> {(analysis.proReport.keywordMap.priority || []).join(', ') || '-'}</div>
                            <div className="mb-2"><span className="text-slate-400">Ideal frequency:</span> {analysis.proReport.keywordMap.idealFrequency || '-'}</div>
                            <div><span className="text-slate-400">Where to insert:</span> {(analysis.proReport.keywordMap.whereToInsert || []).join(' · ') || '-'}</div>
                          </div>
                        </div>
                      )}

                      {analysis.proReport?.seoFindability && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('seoIndexTitle')}</div>
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-extrabold text-white">
                              {Number.isFinite(Number(analysis.proReport.seoFindability.score))
                                ? Math.round(Number(analysis.proReport.seoFindability.score))
                                : '-'}
                              <span className="text-sm text-slate-400 font-semibold">/100</span>
                            </div>
                            <div className="text-sm text-slate-400">{(analysis.proReport.seoFindability.tips || []).slice(0, 6).join(' • ')}</div>
                          </div>
                        </div>
                      )}

                      {analysis.proReport?.plan306090 && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('planTitle')}</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-slate-950/30 border border-slate-700/40 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-2">30</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                {(analysis.proReport.plan306090.d30 || []).slice(0, 6).join('\n') || '-'}
                              </div>
                            </div>
                            <div className="bg-slate-950/30 border border-slate-700/40 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-2">60</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                {(analysis.proReport.plan306090.d60 || []).slice(0, 6).join('\n') || '-'}
                              </div>
                            </div>
                            <div className="bg-slate-950/30 border border-slate-700/40 rounded-xl p-3">
                              <div className="text-xs text-slate-400 font-semibold mb-2">90</div>
                              <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                {(analysis.proReport.plan306090.d90 || []).slice(0, 6).join('\n') || '-'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {Array.isArray(analysis.proReport?.checklist) && analysis.proReport.checklist.length > 0 && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('checklistTitle')}</div>
                          <div className="space-y-2">
                            {analysis.proReport.checklist.slice(0, 10).map((it, idx) => {
                              const status = (it?.status || '').toUpperCase();
                              const color = status.includes('OK')
                                ? 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10'
                                : status.includes('CR')
                                  ? 'text-rose-300 border-rose-500/20 bg-rose-500/10'
                                  : 'text-amber-300 border-amber-500/20 bg-amber-500/10';
                              return (
                                <div key={`${status}-${idx}`} className={`flex items-start gap-3 px-3 py-2 rounded-xl border ${color}`}>
                                  <span className="text-xs font-extrabold tracking-wider">[{status || 'AJUSTAR'}]</span>
                                  <span className="text-sm text-slate-200">{it?.text || '-'}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {analysis.proReport?.finalVerdict && (
                        <div className="mt-5">
                          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">{t('finalVerdictTitle')}</div>
                          <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {analysis.proReport.finalVerdict.verdict || '-'}
                          </div>
                          {Array.isArray(analysis.proReport.finalVerdict.priorities) && analysis.proReport.finalVerdict.priorities.length > 0 && (
                            <div className="mt-2 text-sm text-slate-300">
                              <span className="text-slate-400">Prioridades:</span> {analysis.proReport.finalVerdict.priorities.slice(0, 8).join(' • ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {placeholders.length > 0 && (
                    <div ref={placeholdersRef} className="mb-6 p-5 rounded-2xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
                      <h4 className="font-bold text-white mb-1">{t('placeholdersTitle')}</h4>
                      <p className="text-sm text-slate-400">{t('placeholdersDesc')}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {placeholders.map((ph) => (
                          <span key={ph} className="text-xs px-2.5 py-1 rounded-full bg-slate-950/50 border border-slate-700/50 text-slate-200 font-mono">
                            {ph}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.goldenTip && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-indigo-500/20 rotate-12">
                         <Sparkles size={100} />
                      </div>
                      <h4 className="font-bold text-indigo-300 flex items-center gap-2 mb-3 text-lg relative z-10">
                        <Bot className="text-indigo-400" /> {t('goldenTip')}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed relative z-10 text-justify">
                        {analysis.goldenTip}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 p-6 bg-slate-900/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <h4 className="font-bold text-white mb-1">{t('previewTitle')}</h4>
                    <p className="text-sm text-slate-400 mb-4">{t('previewDesc')}</p>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Headline</div>
                        <div className="text-slate-200 font-semibold">{finalHeadline || '-'}</div>
                      </div>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About</div>
                        <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{finalAbout || '-'}</div>
                      </div>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Experience</div>
                        <div className="text-sm text-slate-200 leading-relaxed">
                          {finalExperience ? <ExperiencePreviewView text={finalExperience} /> : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills</div>
                        <div className="text-sm text-slate-200 whitespace-pre-wrap">{finalSkills || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 border-t border-slate-700/30 pt-6 text-center text-xs text-slate-500">
          <div>Desenvolvido por Aurora Business Intelligence - 2026</div>
          <div>Todos os direitos reservados</div>
        </footer>
      </div>
    </div>
  );
}