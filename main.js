/* =========================
   NAV MENU TOGGLE (UNCHANGED)
========================= */


(function () {
  const btn = document.querySelector("[data-navbtn]");
  const links = document.querySelector("[data-navlinks]");
  if (btn && links) {
    btn.addEventListener("click", () => links.classList.toggle("open"));
  }
})();

/* =========================
   DOC ACCORDION (UNCHANGED)
========================= */
document.addEventListener("click", function (e) {
  const head = e.target.closest(".doc-head");
  if (!head) return;

  const body = head.nextElementSibling;
  body.style.display = body.style.display === "block" ? "none" : "block";
});

/* =========================
   CHATBOT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const CHATBOT_API =
    "https://portfolio-chatbot.pagadalas1906.workers.dev/api/chat";

  const chatFab = document.getElementById("chatFab");
  const chatWidget = document.getElementById("chatWidget");
  const chatClose = document.getElementById("chatClose");

  const chatWindow = document.getElementById("chatWindow");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatChips = document.getElementById("chatChips");

  console.log("CHAT ELEMENTS:", {
    chatFab,
    chatWidget,
    chatClose,
    chatWindow,
    userInput,
    sendBtn,
    chatChips,
  });

  if (!chatFab || !chatWidget || !chatWindow || !userInput || !sendBtn) return;

  /* ---------- UI ---------- */
  function openChat() {
    chatWidget.classList.add("open");
    chatWidget.setAttribute("aria-hidden", "false");
    setTimeout(() => userInput.focus(), 50);
  }

  function closeChat() {
    chatWidget.classList.remove("open");
    chatWidget.setAttribute("aria-hidden", "true");
  }

  /* ---------- Messages ---------- */
  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    userInput.value = "";

    const typing = document.createElement("div");
    typing.className = "msg bot";
    typing.textContent = "Typing...";
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
      const res = await fetch(CHATBOT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      typing.remove();
      addMessage(data.reply || "No reply received.", "bot");
    } catch (err) {
      typing.remove();
      console.error("Chatbot error:", err);
      addMessage("Error connecting to chatbot.", "bot");
    }
  }

  /* ---------- INITIAL STATE ---------- */
  closeChat();

  /* ---------- BUTTON EVENTS ---------- */
  chatFab.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    chatWidget.classList.contains("open") ? closeChat() : openChat();
  });

  chatClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeChat();
  });

  sendBtn.addEventListener("click", sendMessage);

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
    if (e.key === "Escape") closeChat();
  });

  /* ---------- CHIP BUTTONS (FIXED) ---------- */
  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    const wrap = chip.closest("#chatChips");
    if (!wrap) return;

    const chipText =
      chip.getAttribute("data-prompt") || chip.textContent || "";
    if (!chipText.trim()) return;

    console.log("Chip clicked:", chipText);

    openChat();
    userInput.value = chipText;
    sendMessage();
  });

  /* ---------- OUTSIDE CLICK CLOSE ---------- */
  document.addEventListener("mousedown", (e) => {
    if (!chatWidget.classList.contains("open")) return;
    const inside =
      chatWidget.contains(e.target) || chatFab.contains(e.target);
    if (!inside) closeChat();
  });

  /* ---------- WELCOME MESSAGE ---------- */
  addMessage("Hi! Ask me about my projects, skills, or tools.", "bot");
});

/* =========================
   GREEN DOWNLOAD RESUME BUTTON
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const resumeBtn = document.getElementById("resumeBtn");
  const resumeMenu = document.getElementById("resumeMenu");

  if (!resumeBtn || !resumeMenu) return;

  // Toggle menu
  resumeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resumeMenu.classList.toggle("show");
  });

  // Handle resume click
  resumeMenu.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-file]");
    if (!btn) return;

    const file = btn.getAttribute("data-file");
    const url = `assets/pdfs/${file}`;

    window.open(url, "_blank");
    resumeMenu.classList.remove("show");
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    resumeMenu.classList.remove("show");
  });
});
