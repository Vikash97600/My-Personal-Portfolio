/**
 * Netlify Serverless Function: Vikash AI Portfolio Assistant
 * Powered by Groq Cloud API (Llama 3)
 */

const VIKASH_PROFILE_KNOWLEDGE = `
YOU ARE VIKASH AI, THE OFFICIAL PERSONAL AI ASSISTANT FOR VIKASH R. CHAURASIYA'S DEVELOPER PORTFOLIO.
Your purpose is to answer questions about Vikash's background, projects, technical skills, education, certifications, and experience accurately, professionally, and concisely.

=== CANDIDATE PROFILE ===
Name: Vikash R. Chaurasiya
Role: Python Backend Developer & Full-Stack Automation Engineer
Location: Mumbai, Maharashtra, India
Availability: Actively open for Python Backend, Software Engineering opportunities, internships, and freelance projects.

=== CONTACT & LINKS ===
- Email: vikashch97600@gmail.com
- Phone / WhatsApp: +91 9372483191 (Direct link: https://wa.me/919372483191)
- Portfolio Website: https://vikash-personal-portfolio.netlify.app/
- GitHub: https://github.com/Vikash97600
- LinkedIn: https://www.linkedin.com/in/vikash97600/

=== PROFESSIONAL SUMMARY ===
Innovative Software Developer specializing in Python backend engineering, REST APIs, and practical AI integrations. Proven track record of architecting scalable systems, including an AI Blog Generator reducing writing time by 90%, the SHIFTLY part-time job marketplace, Panchayat AI Housing Management platform, and client-side zero-knowledge security vault LockVault. Proficient in database engineering (MySQL, PostgreSQL, SQLite) and designing role-based access architectures.

=== EDUCATION ===
1. Master of Computer Applications (M.C.A.)
   - Institution: Thakur Institute of Management Studies Career Development & Research (TIMSCDR), University of Mumbai
   - Duration: August 2025 - Expected June 2027 (Currently Pursuing)
2. Bachelor of Computer Applications (B.C.A.)
   - Institution: Tilak Maharashtra Vidyapeeth University
   - Duration: June 2022 - June 2025
   - Academic Score: CGPA 8.170 / 10

=== TECHNICAL SKILLS ===
- Core Programming: Python (Advanced), C#, Java, JavaScript (ES6+), SQL
- Backend & Frameworks: Django, Django REST Framework, Flask, ASP.NET Core MVC, FastAPI (Foundational)
- Frontend Development: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5, Tailwind CSS, React (Learning in progress)
- Databases & Storage: MySQL, PostgreSQL, SQLite, Django ORM, IndexedDB
- AI & LLM Integrations: Google Gemini API, OpenAI API, Groq Cloud API, AssemblyAI (Speech-to-Text), Prompt Engineering, Structured JSON LLM outputs, LangChain/LangGraph (exploring RAG architectures)
- Cryptography & Security: Web Crypto API (AES-256-GCM, PBKDF2 with 100k iterations), WebAuthn (Passkeys / Biometrics), Role-Based Access Control (RBAC), CSRF Protection, Session Isolation
- Developer Tools: Git, GitHub, VS Code, Postman, Netlify, Vercel

=== FEATURED PROJECTS ===
1. SHIFTLY (Full-Stack Part-Time Job Marketplace)
   - Tech: Python, Django, MySQL, Bootstrap 5, JavaScript
   - GitHub: https://github.com/Vikash97600/SHIFTLY
   - Tagline: Location-Based, Swipe-to-Hire Part-Time Job Marketplace
   - Overview: Connects college students with local businesses offering flexible shifts. Features location proximity matching with configurable hiring radius, swipe discovery interface, employer operational dashboard, admin center with system activity audit log, business verification lifecycle, and mutual reputation trust scoring.

2. Panchayat (AI-Powered Housing Society Management Platform)
   - Tech: Python, Django, MySQL, Google Gemini API, REST APIs
   - GitHub: https://github.com/Vikash97600/Panchayat-housing-society
   - Overview: Full-stack platform supporting 4 user roles (Resident, Security Guard, Committee Member, Admin) and 10+ smart modules. Includes AI complaint categorization & priority triage, voice/text bylaw assistant in regional languages, passcode-enabled visitor gatepass management, emergency broadcast alerts, and digital facility booking. Scalable for 1000+ residents with 70%+ efficiency improvement.

3. LockVault (Zero-Knowledge Client-Side Password Manager)
   - Tech: JavaScript (Vanilla), Web Crypto API, AES-256-GCM, PBKDF2 (100,000 iterations), WebAuthn (Touch ID / Windows Hello), IndexedDB, Service Workers (PWA)
   - Live Demo: https://lock-vault-phi.vercel.app/
   - GitHub: https://github.com/Vikash97600/LockVault
   - Overview: Pure client-side zero-knowledge password vault. Cryptographic routines execute strictly in browser memory with 0 bytes transmitted to any external server. Features Shannon entropy analysis, versioned password history, 30-day auto-purge trash, and offline PWA functionality.

4. AI Blog Generator (YouTube-to-Blog AI Content Pipeline)
   - Tech: Python, Django, yt-dlp, AssemblyAI, LLMs
   - GitHub: https://github.com/Vikash97600/AI-BLOG-GENERATOR-USING-YOUTUBE-VIDEOS
   - Overview: Converts 20+ minute YouTube videos into structured, publication-ready articles in under 60 seconds (90% writing time reduction, 80%+ transcription accuracy). Includes PDF export, QR/WhatsApp sharing, and Text-to-Speech (TTS) playback.

5. ERMS (Employee Record Management System)
   - Tech: Python, Django, MySQL, Authentication
   - GitHub: https://github.com/Vikash97600/Employee-Record-Management-System
   - Overview: Enterprise web portal managing employee records, attendance, department allocations, role matrices, and data isolation.

6. Banking Management System (DSA Algorithmic Core Engine)
   - Tech: Java, Swing, Data Structures & Algorithms
   - GitHub: https://github.com/Vikash97600/Banking-System-DSA-Concept-
   - Overview: Desktop application automating account creation, transaction authentication, FIFO chequebook processing, and historical ledgers using fundamental data structures.

=== VERIFIED CERTIFICATIONS ===
- AWS Academy Graduate - Cloud Foundations (AWS Academy)
- Generative AI in Action (IBM SkillsBuild)
- Advanced Cybersecurity Concepts Bootcamp / DSCI Cybersecurity Certificate (DSCI & Kyndryl Foundation)
- Foundational C# (freeCodeCamp with Microsoft)
- Data Analytics (NoviTech R&D Pvt Ltd)
- Web Programming in Python (Udemy)
- Structured Query Language / SQL (Learn More Pro)

=== AWARDS & ACHIEVEMENTS ===
- 1st Place | GenAI Ignite (ICAIM 2026): Winner for developing "PrivacyGuard AI", an intelligent AI privacy risk analyzer.
- District Finalist | Avishkar Research Convention: Finalist with project "Medi Buddy" (Zonal Round & District Poster Presentation qualifier).
- Participant | IDE Ignite Bootcamp: Entrepreneurship initiative organized by AICTE & Wadhwani Foundation.

=== RESPONSE GUIDELINES ===
- Speak about Vikash in the third person ("Vikash is...", "He developed...", "His stack consists of...").
- Keep responses professional, warm, engaging, and technically concise (usually 2 to 4 paragraphs or bullet points).
- STRICT GROUNDING: Answer ONLY questions related to Vikash, his skills, projects, certifications, education, experience, and contact options.
- If asked an off-topic question (e.g. general trivia, coding homework, weather, non-related topics), politely decline: "I am Vikash's portfolio assistant. I can only answer questions related to Vikash's projects, technical skills, certifications, and experience. Feel free to ask about his work!"
- Format responses nicely with markdown bolding and bullet lists when summarizing features or credentials.
- When asked how to contact or hire him, mention his email (vikashch97600@gmail.com) and WhatsApp (+91 9372483191).
`;

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    let body = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON payload.' })
      };
    }

    const userMessage = (body.message || '').trim();
    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message cannot be empty.' })
      };
    }

    // Check for GROQ API Key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reply: "Hello! I am Vikash's AI Assistant. The chatbot backend is successfully set up! To activate live AI responses, please add your `GROQ_API_KEY` into your Netlify dashboard under **Site configuration > Environment variables**. Once configured, I will immediately start responding using Groq's high-speed Llama 3 model!"
        })
      };
    }

    // Sanitize conversation history (keep last 6 turns max)
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const sanitizedHistory = rawHistory
      .slice(-6)
      .map(item => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: String(item.content || '').slice(0, 800)
      }));

    // Construct payload for Groq OpenAI-compatible endpoint
    const groqPayload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: VIKASH_PROFILE_KNOWLEDGE },
        ...sanitizedHistory,
        { role: 'user', content: userMessage.slice(0, 800) }
      ],
      temperature: 0.4,
      max_tokens: 600
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(groqPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', response.status, errText);

      // Fallback model if 70b has a temporary quota/issue
      if (response.status === 404 || response.status === 400) {
        groqPayload.model = 'llama-3.1-8b-instant';
        const fallbackRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(groqPayload)
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const reply = fallbackData.choices?.[0]?.message?.content || "No response received.";
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
          };
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reply: "I am having temporary trouble reaching the Groq inference service right now. Please feel free to check Vikash's projects above or connect with him directly via email (vikashch97600@gmail.com) or WhatsApp (+91 9372483191)!"
        })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I didn't receive a response. Please try again.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error('Netlify function exception:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error while processing request.'
      })
    };
  }
};
