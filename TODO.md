# TODO - Chatbot Backend CORS Fix

## 🚨 CURRENT ISSUE (As of May 6, 2026)

**Problem:** CORS error blocking chatbot communication between frontend and backend

**Error Message:**
```
Access to fetch at 'https://web-ai-agent.onrender.com/api/chat' from origin 'https://theredds.eu' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Status:** 
- ✅ Frontend deployed correctly (GitHub Pages → theredds.eu)
- ✅ Backend deployed with correct code (Render.com → web-ai-agent.onrender.com)
- ✅ Backend responds to OPTIONS requests (returns 200)
- ❌ Backend NOT sending CORS headers in response
- ✅ Latest CORS fix committed to GitHub (commit `325559c`)
- ⏳ Waiting for Render to auto-deploy latest CORS fix

---

## 📋 What We Did Today

### ✅ Completed:

1. **Updated Backend Personality** 
   - Changed from "Elektriker Notdienst" to "Sassy Portfolio Assistant"
   - Location: `/Users/oliver-jan.jarosik/git/web-ai-agent/prompt.txt`
   - Commit: `a18066b`

2. **Added CORS Support**
   - Added `theredds.eu` to allowed origins
   - Location: `/Users/oliver-jan.jarosik/git/web-ai-agent/app.py` (lines 18-34)
   - Commits: `af5d49f`, `1214438`, `24cfac6`, `325559c`

3. **Configured GitHub Pages Secret**
   - Added `VITE_MIA_CHAT_API_URL` = `https://web-ai-agent.onrender.com/api/chat`
   - Updated `.github/workflows/deploy.yml` to inject env variable during build
   - Commit: `cf9cdf3` (in redds_page repo)

4. **Verified Deployments**
   - Frontend: ✅ Latest version live on theredds.eu
   - Backend: ⏳ Latest code pushed, waiting for Render auto-deploy

---

## 🔧 Tomorrow's Tasks

### Priority 1: Fix CORS (Critical!)

**Task:** Verify Render deployed the latest CORS fix and test chatbot

**Steps:**

1. **Check Render Deployment Status**
   - Go to: https://dashboard.render.com/
   - Find service: "web-ai-agent"
   - Verify latest commit is deployed: `325559c` (or newer)
   - Look for: "Simplify CORS config: enable for all routes with allowed origins"

2. **Test CORS Headers**
   ```bash
   curl -X OPTIONS https://web-ai-agent.onrender.com/api/chat \
     -H "Origin: https://theredds.eu" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: content-type" \
     -i
   ```
   **Expected:** Should see `Access-Control-Allow-Origin: https://theredds.eu` in headers

3. **Test on Website**
   - Visit: https://theredds.eu
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
   - Scroll to Projects section → Media Impact Assistant chatbot
   - Send test message: "Tell me about Oliver"
   - **Expected:** Sassy response in 1-3 sentences

4. **If CORS Still Fails:**
   - **Option A:** Try even simpler CORS config:
     ```python
     # In app.py, replace CORS line with:
     CORS(app, origins="*")  # Temporary test - allow all origins
     ```
   - **Option B:** Add manual CORS headers to `/api/chat` route:
     ```python
     @app.post("/api/chat")
     def api_chat():
         response = jsonify({...})
         response.headers.add('Access-Control-Allow-Origin', 'https://theredds.eu')
         response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
         response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
         return response
     ```
   - **Option C:** Check Render environment variables:
     - Settings → Environment
     - Make sure no `ALLOWED_ORIGINS` variable is overriding defaults

---

## 📂 Key Files & Locations

### Backend (web-ai-agent repo)
- **Repo:** https://github.com/deweezy12/web-ai-agent
- **Deployed:** https://web-ai-agent.onrender.com
- **Key Files:**
  - `app.py` (lines 36-38) - CORS configuration
  - `prompt.txt` - System prompt for chatbot personality
  - `requirements.txt` - Dependencies (includes flask-cors>=5.0.0)

### Frontend (redds_page repo)
- **Repo:** https://github.com/deweezy12/redds_page
- **Deployed:** https://theredds.eu
- **Key Files:**
  - `src/components/ChatbotTile.tsx` (line 18) - Reads API URL from env
  - `.github/workflows/deploy.yml` (lines 35-38) - Injects env variable
  - **GitHub Secret:** `VITE_MIA_CHAT_API_URL` = `https://web-ai-agent.onrender.com/api/chat`

---

## 🐛 Debugging Guide

### If chatbot shows "failed to fetch":

**Step 1: Open Browser DevTools**
- Right-click → "Inspect" or "Untersuchen"
- Go to **Console** tab

**Step 2: Look for errors**
- Red error messages about CORS
- Copy the full error message

**Step 3: Check Network Tab**
- Click **Network** tab
- Send a message in chatbot
- Look for request to `web-ai-agent.onrender.com/api/chat`
- Click on it → Check:
  - **Status:** Should be 200
  - **Response Headers:** Should have `Access-Control-Allow-Origin`
  - **Response Body:** Should have `{"reply": "..."}`

**Step 4: Manual Test**
```javascript
// Paste in browser console:
fetch('https://web-ai-agent.onrender.com/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'test', history: []})
})
.then(r => r.json())
.then(d => console.log("✅ SUCCESS:", d))
.catch(e => console.error("❌ ERROR:", e.message));
```

---

## 🔍 Technical Details

### Current CORS Configuration (Latest)
```python
# app.py line 36-38
CORS(app, origins=get_allowed_origins())

# get_allowed_origins() returns:
[
    "http://localhost:5173",
    "http://127.0.0.1:5173", 
    "https://deweezy12.github.io",
    "https://theredds.eu"  # ← This is what we need!
]
```

### Expected Backend Response Headers
```
HTTP/2 200
Content-Type: application/json
Access-Control-Allow-Origin: https://theredds.eu
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Render Deployment Info
- **Service:** web-ai-agent
- **Plan:** Free (spins down after 15 min inactivity)
- **Auto-Deploy:** Enabled (should deploy automatically on git push)
- **Latest Commit:** `325559c` - "Simplify CORS config"
- **Environment Variables Required:**
  - `ANTHROPIC_API_KEY` (set in Render dashboard)
  - `PORT` (optional, defaults to 7860)

---

## 📊 Commit History (Latest First)

### Backend (web-ai-agent)
```
325559c - Simplify CORS config: enable for all routes with allowed origins
24cfac6 - Trigger Render: Deploy CORS fix
1214438 - Fix CORS configuration: use correct parameter names and add required headers
7379935 - Trigger Render deployment
af5d49f - Add theredds.eu to CORS allowed origins
a18066b - Update to portfolio chatbot personality for theredds.eu
```

### Frontend (redds_page)
```
67bb15d - Trigger rebuild with chat API URL
cf9cdf3 - Inject VITE_MIA_CHAT_API_URL during build for chatbot integration
```

---

## 🎯 Success Criteria

### When it's working, you should see:

1. **Browser Console:** No CORS errors
2. **Network Tab:** Request shows 200 status with CORS headers
3. **Chatbot UI:**
   - Starter message: "Wait... you actually found the greatest website ever made?..."
   - Send message: "Tell me about Oliver"
   - Response: Short, sassy reply in 1-3 sentences
   - Example: "Oliver's crushing it in computer vision and medical AI at MEVIS. Think cutting-edge algorithms that help doctors see what matters. Pretty cool stuff for the greatest website ever, right?"

---

## 🔮 Optional Future Enhancements

After CORS is fixed:

- [ ] Add typing indicators with realistic delays
- [ ] Implement rate limiting on backend (prevent abuse)
- [ ] Add conversation history persistence (localStorage)
- [ ] Create admin dashboard for monitoring chat usage
- [ ] Add analytics for popular questions
- [ ] Implement chat export/download feature
- [ ] Add suggested questions/prompts
- [ ] Create mobile-optimized chat experience
- [ ] Enable Auto-Deploy notifications (get email when Render deploys)

---

## 📞 Quick Commands

### Local Development
```bash
# Backend
cd /Users/oliver-jan.jarosik/git/web-ai-agent
export ANTHROPIC_API_KEY="your-key"
python app.py

# Frontend
cd /Users/oliver-jan.jarosik/git/redds_page
echo "VITE_MIA_CHAT_API_URL=http://localhost:7860/api/chat" > .env.local
npm run dev
```

### Deployment
```bash
# Push backend changes (triggers Render auto-deploy)
cd /Users/oliver-jan.jarosik/git/web-ai-agent
git add .
git commit -m "Your message"
git push origin main

# Push frontend changes (triggers GitHub Pages deploy)
cd /Users/oliver-jan.jarosik/git/redds_page
git add .
git commit -m "Your message"
git push origin main
```

### Testing
```bash
# Test backend API directly
curl -X POST https://web-ai-agent.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","history":[]}'

# Test CORS headers
curl -X OPTIONS https://web-ai-agent.onrender.com/api/chat \
  -H "Origin: https://theredds.eu" \
  -H "Access-Control-Request-Method: POST" \
  -i
```

---

## 🆘 If All Else Fails

### Nuclear Option: Disable CORS entirely (NOT RECOMMENDED for production)
```python
# In app.py:
CORS(app, origins="*")  # Allow ALL origins
```

This will make it work but is insecure. Only use for testing!

### Alternative: Deploy backend on Vercel/Netlify Functions
If Render continues to have CORS issues, consider migrating to serverless:
- Vercel Functions (supports Python)
- Netlify Functions
- AWS Lambda + API Gateway

Both have built-in CORS handling and are easier to configure.

---

## 💡 Notes & Observations

- Render Free Tier spins down after 15 min → First request takes 30-60 sec
- GitHub Pages deploys take ~1 minute
- Render auto-deploys take ~2-3 minutes
- Browser cache can cause confusion → Always hard refresh (Cmd+Shift+R)
- Cloudflare caches responses → CORS headers may be cached for a few minutes

---

**Last Updated:** May 6, 2026 at 1:20 PM
**Status:** Waiting for Render to deploy CORS fix (commit `325559c`)
**Next Step:** Check Render dashboard tomorrow and test chatbot
