(() => {
  const tips = [
    {
      tag: "NHAA 14566",
      text: "Integrated with National Helpline Against Atrocities (NHAA - 14566) • 24/7 Support"
    },
    {
      tag: "Legal Right",
      text: "Complainants under the SC/ST Act are entitled to travel & daily maintenance allowance for hearings."
    },
    {
      tag: "Privacy Guard",
      text: "Voice acoustic stress markers are extracted locally—raw audio recordings are never permanently stored."
    },
    {
      tag: "Free Legal Aid",
      text: "Complainants can request free DLSA legal representation across all district courts."
    },
    {
      tag: "Wellness Note",
      text: "Box breathing (4s in, 4s hold, 4s out, 4s hold) rapidly de-escalates acute physiological stress."
    }
  ];

  const tagEl = document.getElementById("announcement-tag");
  const textEl = document.getElementById("announcement-text");
  const nextBtn = document.getElementById("announcement-next-btn");

  if (!tagEl || !textEl) return;

  let currentIndex = 0;
  let intervalTimer = null;

  function renderTip(index) {
    // Subtle fade transition
    textEl.style.opacity = "0";
    tagEl.style.opacity = "0";

    setTimeout(() => {
      tagEl.textContent = tips[index].tag;
      textEl.textContent = tips[index].text;
      textEl.style.opacity = "1";
      tagEl.style.opacity = "1";
    }, 150);
  }

  function nextTip() {
    currentIndex = (currentIndex + 1) % tips.length;
    renderTip(currentIndex);
  }

  function resetAutoPlay() {
    if (intervalTimer) clearInterval(intervalTimer);
    intervalTimer = setInterval(nextTip, 7000);
  }

  // Initial random tip
  currentIndex = Math.floor(Math.random() * tips.length);
  renderTip(currentIndex);
  resetAutoPlay();

  // Manual next button
  nextBtn?.addEventListener("click", () => {
    nextTip();
    resetAutoPlay();
  });
})();