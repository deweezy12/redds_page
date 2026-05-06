# TODO - Render Backend Integration

## 🎯 Current Status

The chatbot frontend is fully implemented and deployed. It needs a Render.com backend to provide AI-powered responses.

## 🔧 Backend Setup

### 1. Deploy Backend to Render.com

**Option A: Use existing backend from Notfall-Webpage**
- Located at: `/Users/oliver-jan.jarosik/git/Notfall-Webpage/artifacts/stitch-bg/src/components/ElektrikEmergencyChat.tsx`
- Backend expects POST requests to `/api/chat`
- Request format: `{ message: string, history: Array<[string, string]> }`
- Response format: `{ reply?: string, error?: string }`

**Option B: Create new Flask/FastAPI backend**
- Set up Python backend with Anthropic API integration
- Implement `/api/chat` endpoint
- Handle conversation history and context
- Deploy to Render.com as a web service

### 2. Backend Requirements

**API Endpoint:**
```
POST /api/chat
Content-Type: application/json

Request Body:
{
  "message": "user message here",
  "history": [
    ["previous user message", "previous assistant reply"],
    ["another user message", "another assistant reply"]
  ]
}

Response:
{
  "reply": "assistant response here"
}
```

**System Prompt (Configure in backend):**
```
You are a witty, sassy AI assistant on Oliver Jan Jarosik's portfolio website - 
which happens to be the greatest website ever made. Keep your responses very 
short and punchy (1-3 sentences max). Be playful about being on such an amazing 
site. Help users learn about Oliver's work in computer vision and AI, but do it 
with style and humor. Think: confident, fun, slightly cheeky.
```

## 🔐 Environment Configuration

### Local Development

Create `.env.local`:
```bash
VITE_MIA_CHAT_API_URL=http://localhost:7860/api/chat
```

### Production (GitHub Actions)

Add GitHub repository secret:
- **Name:** `VITE_MIA_CHAT_API_URL`
- **Value:** `https://your-render-service.onrender.com/api/chat`
- **Location:** GitHub repo → Settings → Secrets and variables → Actions

Note: GitHub Actions workflow already configured (src/.github/workflows/deploy.yml)

## ✅ Testing Checklist

### Local Testing
- [ ] Backend running locally on port 7860
- [ ] `.env.local` configured with local API URL
- [ ] Run `npm run dev`
- [ ] Navigate to projects section
- [ ] Send test message in chat
- [ ] Verify response received (not echo)
- [ ] Test multiple messages for context
- [ ] Verify error handling (stop backend and test)

### Production Testing
- [ ] Backend deployed to Render.com
- [ ] GitHub secret `VITE_MIA_CHAT_API_URL` added
- [ ] Push to main triggers deployment
- [ ] Visit live site (theredds.eu)
- [ ] Scroll to projects section
- [ ] Verify no auto-scroll on page load
- [ ] Test chat functionality
- [ ] Verify sassy personality in responses
- [ ] Test conversation context/history

## 🚀 Deployment Steps

1. **Deploy backend to Render.com**
   - Create new web service on Render
   - Connect GitHub repository (if using existing backend)
   - Set environment variables (ANTHROPIC_API_KEY, etc.)
   - Deploy and note the service URL

2. **Configure GitHub Secret**
   - Add `VITE_MIA_CHAT_API_URL` with Render URL
   - Format: `https://your-service.onrender.com/api/chat`

3. **Trigger Deployment**
   - Push any change to main branch OR
   - Manually trigger deployment from Actions tab

4. **Verify Production**
   - Wait for deployment to complete
   - Visit theredds.eu
   - Test chat functionality

## 📚 Reference Files

**Frontend Implementation:**
- `src/components/ChatbotTile.tsx` - Chat component with backend integration
- `src/pages/HomePage.tsx` - Projects section with chat preview
- `.env.example` - Environment variable documentation

**Backend Reference:**
- `/Users/oliver-jan.jarosik/git/Notfall-Webpage/artifacts/stitch-bg/src/components/ElektrikEmergencyChat.tsx` - Working implementation

## 🔮 Optional Future Enhancements

- [ ] Add typing indicators with realistic delays
- [ ] Implement rate limiting on backend
- [ ] Add conversation history persistence
- [ ] Create admin dashboard for monitoring chat usage
- [ ] Add analytics for popular questions
- [ ] Implement chat export/download feature
- [ ] Add suggested questions/prompts
- [ ] Create mobile-optimized chat experience
