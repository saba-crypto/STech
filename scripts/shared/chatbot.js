// Chatbot component - site-wide floating AI Assistant widget
import { steckAi } from "../data/AI.js";
import { formatChatMessageDate } from "../utils/formatDate.js";
import { showPopup } from "../utils/showPopup.js";
function renderChatbotHtml() {
  const messageHistory = steckAi.getMessageHistory();
  return `
    <div class="chatbot-widget">
      <div
        id="chatbot-window"
        class="chatbot-window"
        role="dialog"
        aria-modal="false"
        aria-label="STech AI Assistant"
        aria-hidden="true"
      >
        <div class="chatbot-header">
          <div class="chatbot-title-group">
            <span class="chatbot-status-dot" aria-hidden="true"></span>
            <span class="chatbot-title">STech Assistant</span>
          </div>
          <button
            type="button"
            class="chatbot-close-btn"
            aria-label="Close chat"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        
        <div class="chatbot-messages" role="log" aria-live="polite">
        ${renderMessagesHtml(messageHistory)}
          
        </div>

        <div class="chatbot-footer">
          <form class="chatbot-input-form">
            <input
              type="text"
              class="chatbot-input"
              placeholder="Type your message..."
              aria-label="Chat message"
              autocomplete="off"
            />
            <button
              type="submit"
              class="chatbot-send-btn"
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button
        type="button"
        class="chatbot-trigger"
        aria-label="Open chat"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="chatbot-window"
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  `;
}

function initChatbot() {
  if (document.querySelector(".chatbot-widget")) return;

  document.body.insertAdjacentHTML("beforeend", renderChatbotHtml());

  const triggerBtn = document.querySelector(".chatbot-trigger");
  const chatWindow = document.querySelector(".chatbot-window");
  const closeBtn = document.querySelector(".chatbot-close-btn");
  const form = document.querySelector(".chatbot-input-form");
  const input = document.querySelector(".chatbot-input");
  const messagesList = document.querySelector(".chatbot-messages");

  if (!triggerBtn || !chatWindow) return;

  const scrollToBottom = () => {
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  };

  scrollToBottom();

  const toggleChat = open => {
    const shouldOpen =
      typeof open === "boolean" ? open : !chatWindow.classList.contains("open");
    chatWindow.classList.toggle("open", shouldOpen);
    triggerBtn.setAttribute("aria-expanded", String(shouldOpen));
    chatWindow.setAttribute("aria-hidden", String(!shouldOpen));

    if (shouldOpen) {
      scrollToBottom();
      requestAnimationFrame(scrollToBottom);
      setTimeout(() => {
        scrollToBottom();
        if (input) input.focus();
      }, 150);
    }
  };

  triggerBtn.addEventListener("click", () => toggleChat());

  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleChat(false));
  }

  // Close on Escape key press
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && chatWindow.classList.contains("open")) {
      toggleChat(false);
      triggerBtn.focus();
    }
  });

  let AiMessageLoading = false;

  if (form && input && messagesList) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) {
        showPopup("Input Text is Invalid");
        return;
      }
      if (AiMessageLoading) {
        showPopup("Please Wait Until AI Finishes response");
        return;
      }

      //creates chat message
      const userMessageElement = createUserMessage(text);
      messagesList.appendChild(userMessageElement);

      input.value = "";
      messagesList.scrollTop = messagesList.scrollHeight;

      //sends message to Google Gemini
      AiMessageLoading = true;
      const botMessageElement = createBotMessage("Thinking...");
      messagesList.appendChild(botMessageElement);
      messagesList.scrollTop = messagesList.scrollHeight;

      try {
        const botResponse = await steckAi.sendMessage(text);
        botMessageElement.querySelector(".chat-bubble").textContent = botResponse;
      } catch (error) {
        console.error(error);
        botMessageElement.querySelector(".chat-bubble").textContent =
          "Sorry, I couldn't reach the assistant right now.";
      } finally {
        AiMessageLoading = false;
        messagesList.scrollTop = messagesList.scrollHeight;
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}

export { initChatbot };

function renderMessagesHtml(messages) {
  return messages
    .map(message => {
      const isModel = message.role === "model" || message.role === "bot";
      return `
      <div class="chat-message ${isModel ? "model-message" : "user-message"}">
        <div class="chat-bubble">
          ${message.text}
        </div>
        <span class="chat-time">${formatChatMessageDate(message.date)}</span>
      </div>
    `;
    })
    .join("");
}

function createUserMessage(text) {
  const userMessage = document.createElement("div");
  userMessage.className = "chat-message user-message";
  userMessage.innerHTML = `
        <div class="chat-bubble"></div>
        <span class="chat-time">Just now</span>
      `;
  userMessage.querySelector(".chat-bubble").textContent = text;
  return userMessage;
}

function createBotMessage(text) {
  const botMessage = document.createElement("div");
  botMessage.className = "chat-message model-message";
  botMessage.innerHTML = `
        <div class="chat-bubble"></div>
        <span class="chat-time">Just now</span>
      `;
  botMessage.querySelector(".chat-bubble").textContent = text;
  return botMessage;
}
