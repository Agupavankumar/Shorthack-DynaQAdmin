
# 📄 Dynamic Content Injection System

## ✅ Overview
A system that allows dynamic content injection into websites using a JavaScript SDK. The admin dashboard is built with React, and the backend is built with .NET.

## 🏗️ Architecture
- **Client SDK**: JavaScript snippet embedded in websites.
- **Admin Dashboard**: React-based UI for managing content.
- **Backend API**: .NET Core API for storing and serving instructions.

## 🎨 Frontend Plan (React)
- **Components**:
  - `Dashboard`: Main interface with a preview iframe and instruction editor.
  - `InstructionForm`: Form to create and edit instructions.
  - `InstructionList`: List of existing instructions.
- **Features**:
  - Iframe preview
  - DOM selector
  - HTML editor
  - Save to backend
- **Libraries**:
  - React Router
  - Axios
  - Monaco Editor
  - Tailwind CSS

## 🧩 Backend Plan (.NET Core)
- **Controllers**:
  - `InstructionsController`
- **Models**:
  - `Instruction`
- **Services**:
  - `InstructionService`
- **Database**:
  - Entity Framework Core with SQL
- **Endpoints**:
  - `GET /api/instructions`
  - `POST /api/instructions`
  - `PUT /api/instructions/{id}`
  - `DELETE /api/instructions/{id}`

## 🧠 SDK Script
- Fetch instructions by domain
- Apply DOM changes using `querySelector`
- Support event listeners (click, hover, etc.)

## 🔁 Data Flow
1. SDK fetches instructions from backend
2. Applies changes to DOM
3. Admin dashboard updates instructions via API

## 🚀 Deployment Strategy
- Host SDK on CDN (e.g., Cloudflare)
- Deploy frontend on Vercel/Netlify
- Deploy backend on Azure App Service or similar
- Use CI/CD for updates

## 🛠️ Running Admin Dashboard Locally
- Run the admin dashboard locally (e.g., `http://localhost:3000`)
- Ensure backend allows CORS requests from `localhost:3000`
- Use `.env` in React to point to the backend:
  REACT_APP_API_URL=http://localhost:5000
