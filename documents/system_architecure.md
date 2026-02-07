# Rane — System Architecture Diagram

## High-Level Overview

Rane is a full-stack web application built with a **single Next.js repository**, using **serverless API routes** for backend logic, **Auth0** for authentication, **MongoDB Atlas** for persistence, and the **Gemini API** for AI-powered interpretation.

All components are designed to be lightweight, ethical, and hackathon-feasible.

---

## Architecture Diagram (Logical)

```text
┌──────────────────────────────┐
│        User Browser          │
│  (Web / Mobile Responsive)   │
└──────────────┬───────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────┐
│     Next.js Frontend App     │
│  - Onboarding UI             │
│  - Daily Reflection Input    │
│  - Inner Weather Views       │
│  - Pattern Timeline          │
│  - Chat-style Input          │
└──────────────┬───────────────┘
               │ Auth Redirect / JWT
               ▼
┌──────────────────────────────┐
│           Auth0              │
│  - User Authentication       │
│  - Social / Email Login      │
│  - JWT Token Issuance        │
└──────────────┬───────────────┘
               │ Verified Token
               ▼
┌──────────────────────────────┐
│   Next.js API Routes         │
│   (Serverless Backend)       │
│                              │
│  Responsibilities:           │
│  - Verify Auth0 JWT          │
│  - Handle user requests      │
│  - Sanitize & package data   │
│  - Call Gemini API           │
│  - Store & fetch data        │
└──────────────┬───────────────┘
        ┌──────┴─────────┐
        │                │
        ▼                ▼
┌──────────────────┐   ┌─────────────────────┐
│   Gemini API     │   │   MongoDB Atlas     │
│                  │   │                     │
│  - Text analysis │   │  - Users            │
│  - Weather logic │   │  - Reflections      │
│  - Insight gen   │   │  - Weather states   │
└──────────────────┘   └─────────────────────┘
