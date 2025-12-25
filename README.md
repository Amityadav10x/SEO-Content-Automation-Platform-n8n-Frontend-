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

---

## 🧩 Architecture Diagram

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1CVWdcmL6Pp37JruOezjbPvJ2vfut9-zA" alt="Architecture diagram" width="900"/>
  <br/>
  <em>Figure: System architecture showing frontend UI, n8n automation workflows, AI/content generation components, webhook/API integration, validation & formatting layers, and output delivery.</em>
</p>

This diagram illustrates the main components and how they interact:
- Frontend (React/Vue) captures campaign inputs and provides editing/regeneration UI.
- n8n hosts automation workflows that handle validation, keyword research, routing, and calling AI generation steps.
- AI/content generation components (e.g., LLMs, prompt templates) produce platform-specific outputs.
- Webhooks and API endpoints connect the frontend and n8n and handle structured JSON responses.
- Output formatting and cleanup ensure content is editable and platform-ready.

---

```