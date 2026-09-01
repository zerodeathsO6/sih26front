/**
 * Sahayak AI - Complete Dashboard Controller (dashboard.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "sahayak_chats_v1";
  const ACTIVE_CHAT_KEY = "sahayak_active_chat_id";

  // --- 1. Tab & View Routing System ---
  const navButtons = document.querySelectorAll(".nav-item-btn");
  const panels = document.querySelectorAll(".main-panel");
  const menuView = document.getElementById("sidebar-view-menu");
  const chatsView = document.getElementById("sidebar-view-chats");
  const backToMenuBtn = document.getElementById("btn-back-to-menu");
  const toggleChatListBtn = document.getElementById("btn-toggle-chat-list");

  function switchTab(targetPanelId) {
    panels.forEach((panel) => {
      panel.style.display = panel.id === targetPanelId ? "flex" : "none";
    });

    navButtons.forEach((btn) => {
      const isTarget = btn.dataset.target === targetPanelId;
      btn.classList.toggle("btn-primary", isTarget);
      btn.classList.toggle("btn-outline", !isTarget);
    });

    // Initialize Chart.js when entering telemetry/dashboard tabs
    if (
      targetPanelId === "view-dashboard" ||
      targetPanelId === "view-telemetry"
    ) {
      initCharts();
    }
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.target));
  });

  // Sidebar Sub-View Toggle (Menu <-> Chats)
  toggleChatListBtn?.addEventListener("click", () => {
    menuView.style.display = "none";
    chatsView.style.display = "flex";
  });

  backToMenuBtn?.addEventListener("click", () => {
    chatsView.style.display = "none";
    menuView.style.display = "flex";
  });

  // --- 2. LocalStorage Chat Management ---
  let chats = loadChats();
  let activeChatId =
    localStorage.getItem(ACTIVE_CHAT_KEY) || chats[0]?.id || null;

  const chatListContainer = document.getElementById("chat-list-container");
  const chatMessagesContainer = document.getElementById(
    "chat-messages-container",
  );
  const chatSearchInput = document.getElementById("chat-search-input");
  const chatMessageInput = document.getElementById("chat-message-input");
  const sendMessageBtn = document.getElementById("btn-send-message");
  const newChatBtn = document.getElementById("btn-new-chat");
  const currentChatTitle = document.getElementById("current-chat-title");
  const exportBtn = document.getElementById("btn-export-chat");

  function loadChats() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    const seed = [
      {
        id: "chat_" + Date.now(),
        title: "Initial Intake Session",
        lastModified: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        messages: [
          {
            sender: "assistant",
            text: "Hello Officer. I am ready to process case notes, triage intake logs, or track indicators. How would you like to start?",
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  function saveChats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }

  function renderChatList(query = "") {
    if (!chatListContainer) return;
    chatListContainer.innerHTML = "";
    const filtered = chats.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase()),
    );

    filtered.forEach((chat) => {
      const isActive = chat.id === activeChatId;
      const lastMsg = chat.messages[chat.messages.length - 1]?.text || "Empty";

      const item = document.createElement("div");
      item.style.cssText = `
        padding: 10px 12px; border-radius: var(--radius-sm);
        background-color: ${isActive ? "var(--primary-light)" : "var(--bg-surface)"};
        border: 1px solid ${isActive ? "var(--primary-border)" : "var(--border)"};
        display: flex; justify-content: space-between; align-items: center; cursor: pointer;
      `;
      item.innerHTML = `
        <div style="overflow: hidden; padding-right: 6px; flex: 1;">
          <h4 style="font-size: 0.85rem; font-weight: 700; color: ${isActive ? "var(--primary)" : "var(--text-main)"}; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${chat.title}</h4>
          <p style="font-size: 0.72rem; color: var(--text-muted); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMsg}</p>
        </div>
        <button class="delete-btn" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem;">✕</button>
      `;

      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) return;
        activeChatId = chat.id;
        localStorage.setItem(ACTIVE_CHAT_KEY, chat.id);
        renderChatList(chatSearchInput.value);
        renderMessages();
      });

      item.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        chats = chats.filter((c) => c.id !== chat.id);
        if (activeChatId === chat.id) activeChatId = chats[0]?.id || null;
        saveChats();
        renderChatList(chatSearchInput.value);
        renderMessages();
      });

      chatListContainer.appendChild(item);
    });
  }

  function renderMessages() {
    if (!chatMessagesContainer) return;
    chatMessagesContainer.innerHTML = "";
    const currentChat = chats.find((c) => c.id === activeChatId);
    if (!currentChat) {
      if (currentChatTitle)
        currentChatTitle.textContent = "Select a conversation";
      return;
    }

    if (currentChatTitle) currentChatTitle.textContent = currentChat.title;

    currentChat.messages.forEach((msg) => {
      const isUser = msg.sender === "user";
      const row = document.createElement("div");
      row.style.cssText = `display: flex; gap: 12px; max-width: 75%; ${isUser ? "align-self: flex-end; flex-direction: row-reverse;" : ""}`;

      row.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: ${isUser ? "var(--bg-subtle)" : "var(--primary)"}; border: 1px solid var(--border); color: ${isUser ? "var(--text-main)" : "#fff"}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">
          ${isUser ? "U" : "S"}
        </div>
        <div style="padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.85rem; line-height: 1.5; background-color: ${isUser ? "var(--primary)" : "var(--bg-subtle)"}; color: ${isUser ? "#ffffff" : "var(--text-main)"}; ${!isUser ? "border: 1px solid var(--border);" : ""}">
          ${msg.text}
        </div>
      `;
      chatMessagesContainer.appendChild(row);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function handleSendMessage() {
    const text = chatMessageInput.value.trim();
    if (!text || !activeChatId) return;

    const currentChat = chats.find((c) => c.id === activeChatId);
    if (!currentChat) return;

    currentChat.messages.push({ sender: "user", text });
    chatMessageInput.value = "";
    saveChats();
    renderChatList(chatSearchInput.value);
    renderMessages();

    // AI Distress Extraction Mock
    setTimeout(() => {
      currentChat.messages.push({
        sender: "assistant",
        text: `Telemetry Log recorded for: "${text.substring(0, 32)}...". Model severity score evaluated: Moderate (38%).`,
      });
      saveChats();
      renderChatList(chatSearchInput.value);
      renderMessages();
    }, 600);
  }

  newChatBtn?.addEventListener("click", () => {
    const newId = "chat_" + Date.now();
    chats.unshift({
      id: newId,
      title: `Case Intake #${chats.length + 101}`,
      lastModified: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      messages: [
        {
          sender: "assistant",
          text: "New distress assessment session initialized.",
        },
      ],
    });
    activeChatId = newId;
    saveChats();
    renderChatList();
    renderMessages();
  });

  sendMessageBtn?.addEventListener("click", handleSendMessage);
  chatMessageInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  chatSearchInput?.addEventListener("input", (e) =>
    renderChatList(e.target.value),
  );

  exportBtn?.addEventListener("click", () => {
    const currentChat = chats.find((c) => c.id === activeChatId);
    if (!currentChat) return;
    const blob = new Blob([JSON.stringify(currentChat, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentChat.title.replace(/\s+/g, "_")}.json`;
    a.click();
  });

  // --- 3. Chart.js Telemetry Initializer ---
  let chartsInitialized = false;
  function initCharts() {
    if (chartsInitialized || typeof Chart === "undefined") return;

    // Overview Line Chart
    const ctxOverview = document
      .getElementById("dashboardOverviewChart")
      ?.getContext("2d");
    if (ctxOverview) {
      new Chart(ctxOverview, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Distress Signals Triaged",
              data: [12, 19, 8, 15, 22, 10, 14],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.35,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    // Telemetry Multi-Line Chart
    const ctxTelemetry = document
      .getElementById("telemetryLineChart")
      ?.getContext("2d");
    if (ctxTelemetry) {
      new Chart(ctxTelemetry, {
        type: "line",
        data: {
          labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
          datasets: [
            {
              label: "Voice Pitch Anomalies",
              data: [45, 59, 80, 56],
              borderColor: "#dc2626",
              tension: 0.3,
            },
            {
              label: "Sleep Disruption Index",
              data: [28, 48, 40, 19],
              borderColor: "#d97706",
              tension: 0.3,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    // Telemetry Severity Doughnut
    const ctxDoughnut = document
      .getElementById("telemetryDoughnutChart")
      ?.getContext("2d");
    if (ctxDoughnut) {
      new Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
          labels: ["Critical", "High", "Moderate", "Low"],
          datasets: [
            {
              data: [12, 28, 45, 39],
              backgroundColor: ["#dc2626", "#d97706", "#3b82f6", "#10b981"],
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    chartsInitialized = true;
  }

  // Initial Load
  renderChatList();
  renderMessages();

  const sidebar = document.getElementById("app-sidebar");
  const collapseBtn = document.getElementById("btn-collapse-sidebar");
  const expandBtn = document.getElementById("btn-expand-sidebar");

  collapseBtn?.addEventListener("click", () => {
    sidebar.style.marginLeft = "-280px";
    if (expandBtn) expandBtn.style.display = "inline-flex";
  });

  expandBtn?.addEventListener("click", () => {
    sidebar.style.marginLeft = "0px";
    expandBtn.style.display = "none";
  });
});
