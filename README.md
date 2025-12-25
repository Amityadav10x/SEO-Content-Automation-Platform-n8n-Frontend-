# 🚀 SEO Content Automation Platform (Frontend + n8n + AI)

A **full-stack, production-grade SEO content automation system** that transforms a single campaign idea into **multiple platform-ready content formats** using structured workflows, validation logic, and AI — without losing human control.

This project is not just about generating content. It is about **building a reliable content system**.

---

## 🔍 Problem Statement

Most AI content tools fail in real-world usage because:

- Keywords are guessed, not research-driven
- One prompt is reused for every platform
- Outputs are unstructured and hard to edit
- Regeneration overwrites context
- No validation, no logic, no quality control
- Frontend and automation are tightly coupled

This workflow solves those problems by treating **content generation as a system**, not a single prompt.

---

## 🧠 What This System Does

The platform takes **structured campaign inputs** and produces **clean, editable, platform-specific content** through a logic-driven automation pipeline.

### Inputs
- Campaign description
- Target audience
- Tone
- Step type (keywords / article / LinkedIn / X / case study)

### Outputs
- SEO keyword list (search-intent based)
- SEO-ready long-form article
- LinkedIn post
- X (Twitter) thread
- Structured case study

Each output is:
- Cleaned and formatted
- UI-ready
- Editable
- Regenerable without losing context

---

## 🔁 n8n Workflow (visual)

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=10IhNsMOewX-w2xPrEoA6SJdYPg0OGciP" alt="n8n workflow" width="900"/>
  <br/>
  <em>Figure: n8n automation workflow</em>
</p>

---

## 🖼️ Frontend Screenshots

Below are the frontend screenshots embedded directly (no links shown). Each image is labeled for clarity.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1Q4X0eSXnluWET47-7uDYJLYQy6lz-b9v" alt="Screenshot 1" width="900"/>
  <br/>
  <strong>Screenshot 1</strong>
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1a5KSyJXY8DTngGn2a5h8YWQCiGbyo3as" alt="Screenshot 2" width="900"/>
  <br/>
  <strong>Screenshot 2</strong>
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1XsmkWhPcRZz0e4dbcHSBv_6wfcvrVJ9X" alt="Screenshot 3" width="900"/>
  <br/>
  <strong>Screenshot 3</strong>
</p>

---

## 🏗️ High-Level Architecture

### Frontend (UI Layer)
- Campaign input form
- Keyword preview & review
- Content preview (Article / LinkedIn / X / Case Study)
- Edit content
- Regenerate content

### Backend & Automation (n8n)
- Webhook-based API design
- Validation & routing logic
- Keyword research automation
- Platform-specific content generation
- Output cleanup and formatting
- Structured JSON responses

### AI Layer
- LLMs used with strict, role-specific prompts
- No “one-prompt-fits-all” generation
- Platform-native writing logic

---

## 🔄 Workflow Breakdown

### 1️⃣ Input Validation
- Ensures campaign description, audience, tone exist
- Prevents broken or empty requests
- Fails early with meaningful responses

### 2️⃣ Keyword Research Engine
- Generates a high-intent seed query
- Fetches real search suggestions
- Deduplicates and normalizes keywords
- Ensures minimum keyword coverage

### 3️⃣ Intelligent Routing
Uses `Switch` and `If` logic to route requests dynamically:
- keywords
- article
- linkedin
- x
- case-study

---

## ✍️ Content Generation Modules

### SEO Article Generator
- Long-form, human-readable content
- Proper H1 / H2 / H3 hierarchy
- Natural keyword usage
- HTML output for frontend rendering

### LinkedIn Post Generator
- Scroll-stopping hooks
- Short, readable paragraphs
- Clean formatting and hashtags

### X (Twitter) Thread Generator
- Tweet-by-tweet structure
- Character-safe tweets
- Optional CTA tweet

### Case Study Generator
- Background → Problem → Approach → Outcomes
- Business-focused writing
- Ideal for SaaS and B2B use cases

---

## 🧹 Cleanup & Formatting Layer
- Removes markdown artifacts
- Normalizes spacing and line breaks
- Formats output for UI
- Returns accurate word & character counts

---

## 🔁 Edit & Regenerate Support
- Edit content directly in UI
- Regenerate without losing context
- Keywords and campaign data remain stable

---

## ⚙️ Tech Stack
- **Frontend:** Campaign input, preview, edit, regenerate
- **Automation:** n8n, Webhooks, Switch & If logic
- **Custom Logic:** JavaScript validation & cleanup nodes
- **AI:** Structured, platform-specific prompts

---

## 💡 Key Learnings
- AI is only useful when wrapped in system design
- Logic must come before generation
- Platform-native content performs better
- Human control is essential

---

## 📌 Why This Project Matters
This project demonstrates real-world automation thinking, end-to-end system design, frontend-backend orchestration, and responsible AI usage.

**This is not a prompt demo.**  
It is a **production-ready content engine**.
