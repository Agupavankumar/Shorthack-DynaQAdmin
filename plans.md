# 🗺️ Project Plan: Dynamic Content Injection System

## Milestone 1: Admin Dashboard (React)
### Features:
- Dashboard interface with preview iframe
- Real-time element selection via WebSocket
- Prompt-to-HTML/CSS generator (LLM integration)
- Position generated code based on clicked element
- List and manage generated instructions
- DOM selector and HTML editor integration

### Tasks:
- [ ] Set up React project with Typescript and React Router
- [ ] Implement Dashboard layout with sidebar and main content
- [ ] Integrate iframe for live preview
- [ ] Set up WebSocket connection for element selection
- [ ] Add text field for user prompt
- [ ] Connect to Azure OpenAI LLM to generate HTML/CSS from prompt
- [ ] Position generated code based on clicked element
- [ ] Display generated code for review and editing
- [ ] Allow saving, editing, and deleting instructions
- [ ] Connect frontend to backend API using Axios
- [ ] Add frontend validation for input
- [ ] Add error handling
- [ ] Configure .env for API URL and LLM credentials

---

## Milestone 2: Backend API (.NET Core)
### Features:
- RESTful API for instruction management
- Data validation and sanitization
- Secure storage and retrieval of instructions

### Tasks:
- [ ] Set up .NET Core Web API project
- [ ] Design Instruction model (fields: id, selector, action, content, attribute, value, className, domain, etc.)
- [ ] Implement InstructionsController with CRUD endpoints
- [ ] Implement InstructionService for business logic
- [ ] Integrate Entity Framework Core with SQL database
- [ ] Add data validation using Data Annotations and custom validators
- [ ] Sanitize HTML content to prevent XSS
- [ ] Implement authentication/authorization for admin endpoints
- [ ] Add audit logging for instruction changes
- [ ] Add rate limiting to API endpoints
- [ ] Write unit and integration tests
- [ ] Enable CORS for frontend development

---

## Milestone 3: JavaScript SDK
### Features:
- Fetch and apply instructions by domain
- Apply DOM changes using querySelector
- Support for event listeners (click, hover, etc.)
- Error handling and reporting

### Tasks:
- [ ] Design SDK API and initialization method
- [ ] Implement instruction fetching from backend
- [ ] Parse and apply DOM changes using querySelector
- [ ] Add support for event listeners (click, hover, etc.)
- [ ] Handle errors gracefully and report issues
- [ ] Add versioning support for SDK
- [ ] Write documentation for SDK integration

---

## Milestone 4: Deployment & CI/CD
### Features:
- Automated deployment for all components
- CDN hosting for SDK
- Monitoring and error reporting

### Tasks:
- [ ] Set up CI/CD pipelines for frontend, backend, and SDK
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Azure App Service (or similar)
- [ ] Host SDK on CDN (e.g., Cloudflare)
- [ ] Set up monitoring for backend and error reporting for SDK
- [ ] Document deployment process

---

## Milestone 5: Documentation & Support
### Features:
- Comprehensive documentation for all components
- User guides and API references

### Tasks:
- [ ] Write user guide for admin dashboard
- [ ] Write API documentation for backend
- [ ] Write integration guide for SDK
- [ ] Add FAQ and troubleshooting section
- [ ] Set up support channels (e.g., email, issue tracker) 