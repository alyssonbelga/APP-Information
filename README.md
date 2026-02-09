# Aprenda Info (Electron + React + Vite)

Aplicativo desktop offline para Windows que ensina informática básica de forma realista e amigável.

## ✅ Pré-requisitos
- Node.js LTS (18+ recomendado)
- NPM (vem com o Node)

## 🚀 Rodar em desenvolvimento
```bash
npm install
npm run dev
```
Isso abre o app com Vite + Electron.

## 🧱 Build e instalador Windows
```bash
npm run build
```
O comando gera o build do renderer e empacota com o **electron-builder** (NSIS). O instalador `.exe` ficará em `dist/`.

## 📁 Estrutura do projeto
- `apps/desktop` — processo principal do Electron (main + preload)
- `src` — renderer React + módulos
- `src/modules/mouse` — lições e jogos do módulo Mouse
- `src/components` — UI comum
- `src/store` — store de progresso
- `assets/icons` — ícones locais

## 💾 Persistência offline
O progresso fica salvo em JSON dentro do `appData` do usuário (via `app.getPath("userData")`).

## 🧩 Expansão
A arquitetura já separa módulos e telas, facilitando adicionar Teclado/Hardware futuramente.
