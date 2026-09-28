# CrewBar

Marketplace (PWA-ready) que conecta **bars / casas** a **bartenders freelancers**.

- Marca: preto `#000` · branco · lima `#C8F542`
- UI em **português (pt-BR)**
- Dados no **localStorage** (sem backend e **sem pagamentos**)
- Vite + React + TypeScript
- Publicado em [GitHub Pages](https://producaothebartenders-collab.github.io/crewbar/)

## Como rodar

Na raiz do repositório:

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente `http://localhost:5173/crewbar/`).

Build de produção:

```bash
npm run build
npm run preview
```

## Contas demo

Todas usam a senha **`demo123`** (texto puro — só para demo local).

| Papel        | E-mail                     | Senha    |
|-------------|----------------------------|----------|
| Empregador  | `empregador@crewbar.demo`  | `demo123` |
| Bartender   | `ana@crewbar.demo`         | `demo123` |
| Bartender   | `bruno@crewbar.demo`       | `demo123` |

Seed incluso: 1 casa (**Bar do Centro**, SP), 2 bartenders com perfil + quiz feitos, 2 vagas abertas.

Na tela de login há atalhos e botão **Resetar dados demo**.

## O que funciona

1. Splash / onboarding + escolha de papel no cadastro  
2. Login / registro (local)  
3. Perfil do bartender (foto URL ou upload data URL, bio, cidade, experiência, skills, telefone/WhatsApp)  
4. Quiz de 15 perguntas · nota 0–100 · badges Excelente / Bom / Regular / Iniciante · pode refazer após o resultado  
5. Perfil da casa (nome, cidade, tipo)  
6. Empregador cria vagas grátis (título, data, horário, cidade, cache, slots, requisitos, descrição)  
7. Bartender navega vagas e se candidata **1× por vaga** (exige perfil ≥70% + foto + quiz)  
8. Empregador vê candidatos ordenados por **quiz desc** e depois horário da candidatura  
9. Telefone/WhatsApp **ocultos** até **Selecionar** → status `selected` + link `wa.me`  
10. Statuses de vaga: aberta / preenchida / encerrada / cancelada  
11. Statuses de candidatura: pendente / selecionado / não selecionado  
12. Impulsionar vaga marcado como **em breve** (sem pagamento)  
13. `manifest.webmanifest` + service worker stub para “Adicionar à tela inicial”

## Fluxo sugerido para testar

1. Entre como **Ana** → veja vagas → candidate-se  
2. Saia e entre como **Empregador** → abra a vaga → veja Ana no topo (quiz 93%) → **Selecionar** → WhatsApp aparece  
3. (Opcional) Crie outra vaga e entre como **Bruno** para candidatar

## Limitações conhecidas (MVP)

- Tudo é local no navegador (sem sync entre devices)  
- Senhas em texto (não use em produção)  
- Sem pagamentos / boost pago  
- Service worker é stub (cache básico)  
- Sem notificações push reais  

## Estrutura

```
src/
  context/AppContext.tsx   # auth + dados
  data/quiz.ts             # 15 perguntas
  data/seed.ts             # contas e vagas demo
  pages/                   # telas
public/
  icon.png                 # ícone do app
  logo.png                 # lockup
  manifest.webmanifest
  sw.js
```
