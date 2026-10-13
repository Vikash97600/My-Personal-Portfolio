/**
 * Vikash AI Portfolio Chatbot Controller
 * Handles chat widget lifecycle, UI interactions, Markdown rendering, and Netlify function communication.
 */

(function () {
    'use strict';

    // State
    let isOpen = false;
    let isWaiting = false;
    let history = [];

    // Netlify API endpoints (primary clean redirect, fallback direct function)
    const PRIMARY_API = '/api/chat';
    const FALLBACK_API = '/.netlify/functions/chat';

    // Storage key
    const STORAGE_KEY = 'vikash_ai_chat_history';

    /**
     * Minimal safe Markdown to HTML parser
     * Handles bold, italics, inline code, links, and bullet lists
     */
    function formatMarkdown(text) {
        if (!text) return '';

        // Escape HTML tags to prevent XSS
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Links: [text](url)
        escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Bold: **text**
        escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic: *text*
        escaped = escaped.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

        // Inline code: `code`
        escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Process line by line for bullet points and paragraphs
        const lines = escaped.split('\n');
        let html = '';
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                const bulletContent = line.replace(/^[-*•]\s+/, '');
                html += `<li>${bulletContent}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                if (line.length > 0) {
                    html += `<p>${line}</p>`;
                }
            }
        }

        if (inList) {
            html += '</ul>';
        }

        return html;
    }

    /**
     * Initialize Chatbot DOM Elements
     */
    function initChatWidget() {
        if (document.getElementById('vikashChatWidget')) return;

        const widgetMarkup = `
            <div id="vikashChatWidget" class="chat-widget">
                <!-- Floating Chat Launcher Button -->
                <button id="chatLauncherBtn" class="chat-launcher-btn" aria-label="Open Vikash AI Assistant" data-tooltip="Ask Vikash AI">
                    <span class="chat-launcher-pulse"></span>
                    <span class="chat-launcher-icon">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </span>
                    <span class="chat-launcher-close-icon">
                        <i class="fa-solid fa-xmark"></i>
                    </span>
                    <span class="chat-launcher-badge">AI</span>
                </button>

                <!-- Floating Invite Pill (Shows on entry, dismissible) -->
                <div id="chatInvitePill" class="chat-invite-pill">
                    <span class="chat-invite-sparkle">✨</span>
                    <span class="chat-invite-text">Ask me about my projects & resume!</span>
                    <button class="chat-invite-close" id="chatInviteClose" aria-label="Dismiss">&times;</button>
                </div>

                <!-- Chat Modal Window -->
                <div id="chatModal" class="chat-modal" role="dialog" aria-modal="true" aria-labelledby="chatModalTitle" aria-hidden="true">
                    <!-- Modal Header -->
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="chat-avatar">
                                <i class="fa-solid fa-robot"></i>
                                <span class="status-indicator online"></span>
                            </div>
                            <div>
                                <h3 id="chatModalTitle" class="chat-title">Vikash AI <span class="chat-model-tag">Groq Llama 3</span></h3>
                                <p class="chat-subtitle"><span class="chat-live-dot"></span> Online · Grounded Portfolio Assistant</p>
                            </div>
                        </div>
                        <div class="chat-header-actions">
                            <button id="chatClearBtn" class="chat-action-btn" title="Reset Conversation" aria-label="Reset Conversation">
                                <i class="fa-solid fa-rotate-left"></i>
                            </button>
                            <button id="chatCloseBtn" class="chat-action-btn" title="Close Chat" aria-label="Close Chat">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Scroll Container -->
                    <div id="chatMessages" class="chat-messages" role="log" aria-live="polite">
                        <!-- Welcome Message -->
                        <div class="chat-message assistant">
                            <div class="message-avatar">
                                <i class="fa-solid fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Hi! I'm <strong>Vikash AI</strong>, powered by Groq. Ask me anything about Vikash's projects, technical skills, certifications, education, or resume!</p>
                            </div>
                        </div>

                        <!-- Quick Prompt Suggestion Chips -->
                        <div id="chatChipsContainer" class="chat-chips-container">
                            <span class="chat-chips-title">Quick questions:</span>
                            <div class="chat-chips">
                                <button type="button" class="chat-chip" data-question="Tell me about SHIFTLY">SHIFTLY</button>
                                <button type="button" class="chat-chip" data-question="Tell me about Panchayat">Panchayat</button>
                                <button type="button" class="chat-chip" data-question="What is your backend tech stack?">Backend Stack</button>
                                <button type="button" class="chat-chip" data-question="What certifications do you hold?">Certifications</button>
                                <button type="button" class="chat-chip" data-question="How can I contact or hire Vikash?">Contact Info</button>
                            </div>
                        </div>
                    </div>

                    <!-- Input Form -->
                    <form id="chatForm" class="chat-form">
                        <div class="chat-input-wrapper">
                            <input type="text" id="chatInput" class="chat-input" placeholder="Ask about projects, skills, resume..." maxlength="500" autocomplete="off" required>
                            <button type="submit" id="chatSendBtn" class="chat-send-btn" aria-label="Send Message">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="chat-footer-disclaimer">
                            <span>Powered by Groq Cloud · Grounded in verified portfolio data</span>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetMarkup);

        attachEventListeners();
        restoreChatHistory();
    }

    /**
     * Attach Event Listeners to UI Elements
     */
    function attachEventListeners() {
        const launcherBtn = document.getElementById('chatLauncherBtn');
        const closeBtn = document.getElementById('chatCloseBtn');
        const clearBtn = document.getElementById('chatClearBtn');
        const invitePill = document.getElementById('chatInvitePill');
        const inviteClose = document.getElementById('chatInviteClose');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');
        const chipsContainer = document.getElementById('chatChipsContainer');

        // Toggle chat on launcher click
        if (launcherBtn) {
            launcherBtn.addEventListener('click', toggleChat);
        }

        // Close chat button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeChat);
        }

        // Clear chat button
        if (clearBtn) {
            clearBtn.addEventListener('click', resetChat);
        }

        // Invite pill dismiss
        if (inviteClose) {
            inviteClose.addEventListener('click', function (e) {
                e.stopPropagation();
                dismissInvitePill();
            });
        }

        // Clicking invite pill opens chat
        if (invitePill) {
            invitePill.addEventListener('click', function () {
                openChat();
                dismissInvitePill();
            });
        }

        // Form submit
        if (chatForm) {
            chatForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text || isWaiting) return;
                sendMessage(text);
                chatInput.value = '';
            });
        }

        // Quick suggestion chips
        if (chipsContainer) {
            chipsContainer.addEventListener('click', function (e) {
                const chip = e.target.closest('.chat-chip');
                if (chip && !isWaiting) {
                    const question = chip.getAttribute('data-question');
                    if (question) {
                        sendMessage(question);
                    }
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        });
    }

    function dismissInvitePill() {
        const pill = document.getElementById('chatInvitePill');
        if (pill) {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                pill.style.display = 'none';
            }, 300);
        }
    }

    function toggleChat() {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    function openChat() {
        isOpen = true;
        const modal = document.getElementById('chatModal');
        const launcher = document.getElementById('chatLauncherBtn');
        const chatInput = document.getElementById('chatInput');

        if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
        }
        if (launcher) {
            launcher.classList.add('is-active');
        }

        dismissInvitePill();

        setTimeout(() => {
            if (chatInput) chatInput.focus();
            scrollToBottom();
        }, 150);
    }

    function closeChat() {
        isOpen = false;
        const modal = document.getElementById('chatModal');
        const launcher = document.getElementById('chatLauncherBtn');

        if (modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }
        if (launcher) {
            launcher.classList.remove('is-active');
        }
    }

    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    /**
     * Append message bubble to chat container
     */
    function appendMessage(role, content) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // Hide chips after first user query
        const chipsContainer = document.getElementById('chatChipsContainer');
        if (chipsContainer && role === 'user') {
            chipsContainer.style.display = 'none';
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}`;

        if (role === 'assistant') {
            msgDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="message-content">
                    ${formatMarkdown(content)}
                </div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="message-content">
                    <p>${escapeHtml(content)}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show Typing Indicator
     */
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return null;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant chat-typing-message';
        typingDiv.id = 'chatTypingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="message-content typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('chatTypingIndicator');
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    /**
     * Send user message to Netlify backend
     */
    async function sendMessage(text) {
        if (!text || isWaiting) return;

        isWaiting = true;
        const sendBtn = document.getElementById('chatSendBtn');
        const chatInput = document.getElementById('chatInput');

        if (sendBtn) sendBtn.disabled = true;
        if (chatInput) chatInput.disabled = true;

        // Render user message
        appendMessage('user', text);
        history.push({ role: 'user', content: text });

        // Show typing indicator
        showTypingIndicator();

        try {
            let res;
            try {
                res = await fetch(PRIMARY_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history: history.slice(-6) })
                });
            } catch (networkErr) {
                // Try fallback function route
                res = await fetch(FALLBACK_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history: history.slice(-6) })
                });
            }

            removeTypingIndicator();

            if (res.ok) {
                const data = await res.json();
                const reply = data.reply || "I didn't receive a response. Please ask again!";
                appendMessage('assistant', reply);
                history.push({ role: 'assistant', content: reply });
                saveChatHistory();
            } else {
                appendMessage(
                    'assistant',
                    "I am currently waiting for the `GROQ_API_KEY` to be linked in Netlify's environment variables. In the meantime, you can review Vikash's projects above or reach him directly via [WhatsApp](https://wa.me/919372483191)!"
                );
            }
        } catch (err) {
            removeTypingIndicator();
            console.warn('Chat request notice:', err);
            appendMessage(
                'assistant',
                "The Netlify backend is currently starting up or offline. Once deployed to Netlify with `GROQ_API_KEY`, live responses will activate instantly! Feel free to email Vikash at vikashch97600@gmail.com."
            );
        } finally {
            isWaiting = false;
            if (sendBtn) sendBtn.disabled = false;
            if (chatInput) {
                chatInput.disabled = false;
                chatInput.focus();
            }
        }
    }

    /**
     * Local storage persistence
     */
    function saveChatHistory() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-8)));
        } catch (e) {
            // Ignore storage restrictions
        }
    }

    function restoreChatHistory() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    history = parsed;
                    parsed.forEach(msg => {
                        appendMessage(msg.role, msg.content);
                    });
                }
            }
        } catch (e) {
            // Reset if corrupted
            history = [];
        }
    }

    function resetChat() {
        history = [];
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {}

        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="chat-message assistant">
                    <div class="message-avatar">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Conversation reset. Ask me anything about Vikash's projects, technical skills, certifications, education, or resume!</p>
                    </div>
                </div>
                <div id="chatChipsContainer" class="chat-chips-container">
                    <span class="chat-chips-title">Quick questions:</span>
                    <div class="chat-chips">
                        <button type="button" class="chat-chip" data-question="Tell me about SHIFTLY">SHIFTLY</button>
                        <button type="button" class="chat-chip" data-question="Tell me about Panchayat">Panchayat</button>
                        <button type="button" class="chat-chip" data-question="What is your backend tech stack?">Backend Stack</button>
                        <button type="button" class="chat-chip" data-question="What certifications do you hold?">Certifications</button>
                        <button type="button" class="chat-chip" data-question="How can I contact or hire Vikash?">Contact Info</button>
                    </div>
                </div>
            `;
        }
        scrollToBottom();
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }
})();
