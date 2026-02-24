# LinkedIn Magnet AI - By Aurora Business

App em React + Vite + Tailwind para auditoria/reescrita de perfil do LinkedIn.

## Rodar localmente

1) Instale dependências:

`npm install`

2) Configure a chave da Groq (não commitar):

- Copie `.env.example` para `.env.local`
- Preencha `VITE_GROQ_API_KEY` com sua chave

3) Suba o ambiente de desenvolvimento:

`npm run dev`

## Deploy (Vercel)

- Configure a variável de ambiente `VITE_GROQ_API_KEY` no projeto da Vercel.
- O build é feito com `npm run build`.
