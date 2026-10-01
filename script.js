/* ================================================================
   EASY CUSTOMIZATION
   Change names, the image, colors, and key messages in this section.
   Put a custom photo in /assets and update imageUrl, for example:
   imageUrl: "./assets/our-photo.jpg"
   ================================================================ */
const CONFIG = {
  yourName: "Goodluck",
  defaultInviteeName: "you",
  introImageUrl: "./assets/intro-doodle.png",
  introImageAlt: "A goofy hand-drawn smiling face",
  imageUrl: "./assets/invitation-photo.png",
  imageAlt: "Smiling portrait in a black blazer",
  reactionImageUrl: "./assets/reaction-photo.png",
  reactionImageAlt: "A child giving a playful, surprised smile",
  scheduleImageUrl: "./assets/schedule-photo.png",
  scheduleImageAlt: "A smiling stick figure drawing",
  finalImageUrl: "./assets/final-photo.png",
  finalImageAlt: "Cartoon mouse with teary eyes and hands over its mouth",
  colors: {
    pink: "#ec6685",
    pinkDark: "#cf476b",
    pinkPale: "#ffe5eb",
    roseWash: "#fff0f2",
    cream: "#fff8f5",
    ink: "#3d2a30",
  },
  messages: {
    browserTitle: "A very serious question 💌",
    signaturePrefix: "with unreasonable amounts of courage,",
    introTitle: "Hey, {name}... 👀",
    introLead: "I made something for you.",
    introTease: "And yes... unfortunately, you have to click it 😂",
    questionEyebrow: "Okay… I have a very serious question for you 👀",
    questionTitle: "Will you go on a date with me? 💐",
    questionTitlePersonalized: "{name}, will you go on a date with me? 💐",
    questionSupporting: "Choose carefully. This is being monitored by the romance department.",
    reactionTitle: "WAIT… YOU ACTUALLY SAID YES?? 😭",
    reactionSubtitle: "I was fully prepared for you to reject me 💀",
    reactionSubtitlePersonalized: "I was fully prepared for you to reject me, {name} 💀",
    foodTitle: "What are we feeling? 🍴✨",
    foodTitlePersonalized: "{name}, what are we feeling? 🍴✨",
    finalTitle: "IT'S A DATE 🥹💗",
    finalTitlePersonalized: "IT'S A DATE, {NAME}! 🥹💗",
    finalCopy: "Okay, it's officially happening.",
    seeYouMessage: "I'll see you then ❤️",
    sharePrompt: "Choose my chat in the share sheet so I get the plan 🥹",
    shareButton: "Share the plan 💌",
    postscript: "P.S. You could've just pressed YES from the beginning. 😭",
    noHints: ["Girl just press YES 😭", "Why are we doing this? 😂", "The YES button is literally right there 👀"],
  },
};

// URLSearchParams decodes names such as Mary%20Jane. Keep URL text as plain text
// (never HTML), and use the configured fallback for missing/empty values.
function readInviteeName() {
  const urlName = new URLSearchParams(window.location.search).get("name");
  const cleaned = (urlName ?? "").replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/\s+/g, " ").trim();
  if (/^(null|undefined)$/i.test(cleaned)) return "";
  return Array.from(cleaned).slice(0, 40).join("");
}

const personalizedName = readInviteeName();
const inviteeName = personalizedName || CONFIG.defaultInviteeName;

function withInviteeName(template) {
  return template.replaceAll("{NAME}", inviteeName.toLocaleUpperCase()).replaceAll("{name}", inviteeName);
}

const state = {
  currentPage: 0,
  date: "",
  time: "",
  food: null,
  chaos: null,
  noAttempts: 0,
};

const pages = [...document.querySelectorAll(".page")];
const progressDots = [...document.querySelectorAll(".progress-dot")];
const root = document.documentElement;

// Apply the customization object to the site in one place.
function applyConfig() {
  document.title = CONFIG.messages.browserTitle;
  document.querySelector("meta[name='theme-color']").content = CONFIG.colors.cream;
  document.getElementById("introImage").src = CONFIG.introImageUrl;
  document.getElementById("introImage").alt = CONFIG.introImageAlt;
  document.getElementById("crushImage").src = CONFIG.imageUrl;
  document.getElementById("crushImage").alt = CONFIG.imageAlt;
  document.getElementById("reactionImage").src = CONFIG.reactionImageUrl;
  document.getElementById("reactionImage").alt = CONFIG.reactionImageAlt;
  document.getElementById("scheduleImage").src = CONFIG.scheduleImageUrl;
  document.getElementById("scheduleImage").alt = CONFIG.scheduleImageAlt;
  document.getElementById("finalImage").src = CONFIG.finalImageUrl;
  document.getElementById("finalImage").alt = CONFIG.finalImageAlt;
  document.getElementById("signature").textContent = `${CONFIG.messages.signaturePrefix} ${CONFIG.yourName}`;
  [
    ["introLead", "introLead"],
    ["introTease", "introTease"],
    ["questionEyebrow", "questionEyebrow"],
    ["questionTitle", "questionTitle"],
    ["questionSupporting", "questionSupporting"],
    ["reactionTitle", "reactionTitle"],
    ["reactionSubtitle", "reactionSubtitle"],
    ["foodTitle", "foodTitle"],
    ["finalTitle", "finalTitle"],
    ["finalCopy", "finalCopy"],
    ["seeYouMessage", "seeYouMessage"],
    ["sharePrompt", "sharePrompt"],
    ["shareDateButton", "shareButton"],
    ["postscript", "postscript"],
  ].forEach(([elementId, messageKey]) => {
    document.getElementById(elementId).textContent = CONFIG.messages[messageKey];
  });
  // Only the named links alter existing screens; the no-name URL keeps their
  // original copy. textContent prevents URL text from becoming markup.
  document.getElementById("introTitle").textContent = withInviteeName(CONFIG.messages.introTitle);
  if (personalizedName) {
    [
      ["questionTitle", "questionTitlePersonalized"],
      ["reactionSubtitle", "reactionSubtitlePersonalized"],
      ["foodTitle", "foodTitlePersonalized"],
      ["finalTitle", "finalTitlePersonalized"],
    ].forEach(([elementId, messageKey]) => {
      document.getElementById(elementId).textContent = withInviteeName(CONFIG.messages[messageKey]);
    });
  }
  root.style.setProperty("--pink", CONFIG.colors.pink);
  root.style.setProperty("--pink-dark", CONFIG.colors.pinkDark);
  root.style.setProperty("--pink-pale", CONFIG.colors.pinkPale);
  root.style.setProperty("--rose-wash", CONFIG.colors.roseWash);
  root.style.setProperty("--cream", CONFIG.colors.cream);
  root.style.setProperty("--ink", CONFIG.colors.ink);
}

function updateProgress(pageNumber) {
  progressDots.forEach((dot, index) => {
    const step = index;
    dot.classList.toggle("active", step === pageNumber);
    dot.classList.toggle("complete", step < pageNumber);
  });
}

// Smoothly swaps screens while keeping keyboard focus and scroll position friendly.
function goToPage(pageNumber) {
  if (pageNumber === state.currentPage) return;

  const currentPage = pages.find((page) => Number(page.dataset.page) === state.currentPage);
  const nextPage = pages.find((page) => Number(page.dataset.page) === pageNumber);
  if (!nextPage) return;

  // NO may have escaped into the page itself. Hide it when leaving page one.
  if (state.currentPage === 1) document.getElementById("noButton").hidden = true;

  currentPage?.classList.add("leaving");
  window.setTimeout(() => {
    if (currentPage) {
      currentPage.hidden = true;
      currentPage.classList.remove("active", "leaving");
    }

    nextPage.hidden = false;
    nextPage.classList.add("active", "entering");
    state.currentPage = pageNumber;
    updateProgress(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const heading = nextPage.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }

    if (pageNumber === 7) {
      renderFinalSummary();
      launchConfetti();
    }

    window.setTimeout(() => nextPage.classList.remove("entering"), 500);
  }, 220);
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => goToPage(Number(button.dataset.next)));
});

// ----------------------------------------------------------------
// PAGE 1: The NO button dodge logic
// ----------------------------------------------------------------
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const noHint = document.getElementById("noHint");
let nextMouseDodgeTime = 0;
let lastNoPointerDownTime = -Infinity;

function overlaps(rectA, rectB, padding = 0) {
  return !(
    rectA.right + padding < rectB.left ||
    rectA.left > rectB.right + padding ||
    rectA.bottom + padding < rectB.top ||
    rectA.top > rectB.bottom + padding
  );
}

function pointDistanceFromRect(x, y, rect) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

function getVisibleBounds(buttonRect) {
  const viewport = window.visualViewport;
  const viewportLeft = viewport?.offsetLeft ?? 0;
  const viewportTop = viewport?.offsetTop ?? 0;
  const viewportWidth = viewport?.width ?? window.innerWidth;
  const viewportHeight = viewport?.height ?? window.innerHeight;
  const padding = 16;

  return {
    minX: viewportLeft + padding,
    maxX: Math.max(viewportLeft + padding, viewportLeft + viewportWidth - buttonRect.width - padding),
    minY: viewportTop + padding,
    maxY: Math.max(viewportTop + padding, viewportTop + viewportHeight - buttonRect.height - padding),
  };
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}

/*
  Move NO into the page on the first dodge so the card cannot clip it. Then
  choose a random spot across the visible viewport, away from YES and the
  pointer. Slower travel on large screens keeps the movement easy to follow.
*/
function moveNoButton(avoidX, avoidY, force = false) {
  const now = performance.now();
  if (state.currentPage !== 1 || noButton.hidden) return;
  // Mouse moves wait for the previous glide; direct taps always work.
  if (!force && now < nextMouseDodgeTime) return;

  const currentRect = noButton.getBoundingClientRect();
  if (!noButton.classList.contains("escaped")) {
    // Preserve its exact screen position while moving it out of the card.
    noButton.style.transition = "none";
    noButton.classList.add("escaped");
    document.body.append(noButton);
    noButton.style.left = `${currentRect.left}px`;
    noButton.style.top = `${currentRect.top}px`;
    noButton.style.right = "auto";
    void noButton.offsetWidth;
    noButton.style.transition = "";
  }

  state.noAttempts += 1;
  const buttonRect = noButton.getBoundingClientRect();
  const bounds = getVisibleBounds(buttonRect);
  const yesRect = yesButton.getBoundingClientRect();
  const pointerX = Number.isFinite(avoidX) ? avoidX : buttonRect.left + buttonRect.width / 2;
  const pointerY = Number.isFinite(avoidY) ? avoidY : buttonRect.top + buttonRect.height / 2;
  const currentCenterX = buttonRect.left + buttonRect.width / 2;
  const currentCenterY = buttonRect.top + buttonRect.height / 2;
  const safeCandidates = [];
  const otherCandidates = [];

  function consider(left, top) {
    const candidate = {
      left,
      top,
      right: left + buttonRect.width,
      bottom: top + buttonRect.height,
    };
    if (overlaps(candidate, yesRect, 18)) return;

    const centerX = left + buttonRect.width / 2;
    const centerY = top + buttonRect.height / 2;
    const pointerDistance = Math.hypot(centerX - pointerX, centerY - pointerY);
    const travelDistance = Math.hypot(centerX - currentCenterX, centerY - currentCenterY);
    const choice = { left, top, pointerDistance, travelDistance };
    otherCandidates.push(choice);
    if (pointerDistance >= 120 && travelDistance >= 75) safeCandidates.push(choice);
  }

  // Include screen corners, then sample the full viewport for varied dodges.
  for (const left of [bounds.minX, bounds.maxX]) {
    for (const top of [bounds.minY, bounds.maxY]) consider(left, top);
  }
  for (let index = 0; index < 64; index += 1) {
    const left = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const top = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
    consider(left, top);
  }

  const pool = safeCandidates.length ? safeCandidates : otherCandidates;
  const next = pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : { left: bounds.maxX, top: bounds.minY };
  const travel = Math.hypot(next.left - buttonRect.left, next.top - buttonRect.top);
  const duration = clamp(Math.round(travel * 1.1), 520, 1200);
  noButton.style.transitionDuration = `${duration}ms, ${duration}ms, 180ms`;
  noButton.style.left = `${next.left}px`;
  noButton.style.top = `${next.top}px`;
  nextMouseDodgeTime = now + duration + 140;

  if (state.noAttempts >= 3) {
    noHint.textContent = CONFIG.messages.noHints[Math.min(Math.floor((state.noAttempts - 3) / 2), CONFIG.messages.noHints.length - 1)];
  }
}

document.addEventListener("pointermove", (event) => {
  if (state.currentPage !== 1 || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
  const noRect = noButton.getBoundingClientRect();
  if (pointDistanceFromRect(event.clientX, event.clientY, noRect) < 58) {
    moveNoButton(event.clientX, event.clientY);
  }
});

// pointerdown works for fingers, pens, and mice. Preventing default ensures a tap
// moves NO rather than activating it at its previous position.
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  lastNoPointerDownTime = performance.now();
  moveNoButton(event.clientX, event.clientY, true);
});

noButton.addEventListener("click", (event) => {
  event.preventDefault();
  // Ignore a synthetic click after a touch; keyboard activation still dodges.
  if (performance.now() - lastNoPointerDownTime > 500) {
    moveNoButton(event.clientX, event.clientY, true);
  }
});

yesButton.addEventListener("click", () => goToPage(2));

// Re-clamp after rotation, resize, or mobile browser-bar changes.
function keepNoVisible() {
  if (!noButton.classList.contains("escaped") || noButton.hidden) return;
  const rect = noButton.getBoundingClientRect();
  const bounds = getVisibleBounds(rect);
  noButton.style.left = `${clamp(rect.left, bounds.minX, bounds.maxX)}px`;
  noButton.style.top = `${clamp(rect.top, bounds.minY, bounds.maxY)}px`;
}

window.addEventListener("resize", keepNoVisible);
window.visualViewport?.addEventListener("resize", keepNoVisible);
window.visualViewport?.addEventListener("scroll", keepNoVisible);

// ----------------------------------------------------------------
// PAGE 3: The fake agreement
// ----------------------------------------------------------------
const acceptButton = document.getElementById("acceptButton");
const agreementAction = document.getElementById("agreementAction");
const transactionResult = document.getElementById("transactionResult");

acceptButton.addEventListener("click", () => {
  agreementAction.hidden = true;
  transactionResult.hidden = false;
  transactionResult.querySelector("button").focus();
});

// ----------------------------------------------------------------
// PAGE 4: Real date/time validation and browser-state storage
// ----------------------------------------------------------------
const scheduleForm = document.getElementById("scheduleForm");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().split("T")[0];
dateInput.min = localToday;

scheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const hasDate = Boolean(dateInput.value);
  const hasTime = Boolean(timeInput.value);
  document.getElementById("dateError").textContent = hasDate ? "" : "Pick a date so I know when to be nervous 😭";
  document.getElementById("timeError").textContent = hasTime ? "" : "Pick a time too — fashionably late needs a baseline.";

  if (!hasDate || !hasTime) return;
  state.date = dateInput.value;
  state.time = timeInput.value;
  goToPage(5);
});

[dateInput, timeInput].forEach((input) => {
  input.addEventListener("input", () => {
    const error = document.getElementById(`${input.name}Error`);
    if (input.value) error.textContent = "";
  });
});

// ----------------------------------------------------------------
// PAGES 5 & 6: Reusable single-choice behavior
// ----------------------------------------------------------------
function setupChoiceGroup(containerId, stateKey, errorId) {
  const container = document.getElementById(containerId);
  const options = [...container.querySelectorAll(".option-card")];

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-checked", "false");
      });
      option.classList.add("selected");
      option.setAttribute("aria-checked", "true");
      state[stateKey] = {
        label: option.dataset.value,
        emoji: option.dataset.emoji,
      };
      document.getElementById(errorId).textContent = "";
    });
  });
}

setupChoiceGroup("foodOptions", "food", "foodError");
setupChoiceGroup("chaosOptions", "chaos", "chaosError");

document.getElementById("foodNext").addEventListener("click", () => {
  if (!state.food) {
    document.getElementById("foodError").textContent = "You have to pick one. Snacks are a legal requirement.";
    return;
  }
  goToPage(6);
});

document.getElementById("chaosNext").addEventListener("click", () => {
  if (!state.chaos) {
    document.getElementById("chaosError").textContent = "Please select your preferred level of questionable decision-making.";
    return;
  }
  // Start audio from this tap so mobile browsers allow it. The notes begin
  // as the final-page transition finishes and the confetti appears.
  playCelebrationSound();
  goToPage(7);
});

// ----------------------------------------------------------------
// PAGE 7: Summary, confetti, and the definitely-not-cancel button
// ----------------------------------------------------------------
function formatDate(value, includeYear = false) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(new Date(year, month - 1, day));
}

function formatTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hour, minute));
}

function renderFinalSummary() {
  document.getElementById("summaryDate").textContent = formatDate(state.date);
  document.getElementById("summaryTime").textContent = formatTime(state.time);
  document.getElementById("summaryFood").textContent = state.food.label;
  document.getElementById("summaryFoodEmoji").textContent = state.food.emoji;
  document.getElementById("summaryChaos").textContent = state.chaos.label;
  document.getElementById("summaryChaosEmoji").textContent = state.chaos.emoji;
}

// A short original chime, scheduled from the final button's click to satisfy
// mobile audio rules while lining up with the confetti after the transition.
function playCelebrationSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const audioContext = new AudioContextClass();
    const start = audioContext.currentTime + 0.23;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      const noteStart = start + index * 0.12;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      volume.gain.setValueAtTime(0.0001, noteStart);
      volume.gain.exponentialRampToValueAtTime(0.085, noteStart + 0.035);
      volume.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.48);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 0.5);
    });

    audioContext.resume().catch(() => {});
    window.setTimeout(() => audioContext.close().catch(() => {}), 1900);
  } catch {
    // The invitation still works if a browser or device does not allow audio.
  }
}

function buildShareMessage() {
  return [
    personalizedName ? withInviteeName(CONFIG.messages.finalTitlePersonalized) : CONFIG.messages.finalTitle,
    `📅 ${formatDate(state.date, true)}`,
    `⏰ ${formatTime(state.time)}`,
    `${state.food.emoji} ${state.food.label}`,
    `${state.chaos.emoji} Chaos level: ${state.chaos.label}`,
    "I'll see you then ❤️",
  ].join("\n");
}

async function copyShareMessage(message) {
  const status = document.getElementById("shareStatus");
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(message);
    status.textContent = "Copied! Paste this into my chat and send it 💌";
  } catch {
    const fallback = document.getElementById("shareFallbackText");
    fallback.value = message;
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
    status.textContent = "Copy the details below and send them to me 💌";
  }
}

// The native share sheet lets her choose your chat/contact. Sharing is never
// automatic; if unavailable, the exact same details can be copied instead.
document.getElementById("shareDateButton").addEventListener("click", async () => {
  const message = buildShareMessage();
  const status = document.getElementById("shareStatus");
  if (!navigator.share) {
    await copyShareMessage(message);
    return;
  }

  try {
    await navigator.share({ title: "Our date plan 💗", text: message });
    status.textContent = "Share sheet closed. Make sure you chose my chat 💌";
  } catch (error) {
    if (error?.name === "AbortError") {
      status.textContent = "Not shared yet. Tap again when you're ready 💌";
    } else {
      await copyShareMessage(message);
    }
  }
});

function launchConfetti() {
  const layer = document.getElementById("confettiLayer");
  const colors = [CONFIG.colors.pink, "#f4b85e", "#ffd5df", "#8cc8b5", "#bb98d9", "#ffffff"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pieceCount = reducedMotion ? 0 : 72;

  layer.replaceChildren();
  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    const isHeart = index % 9 === 0;
    piece.className = `confetti${isHeart ? " heart-confetti" : ""}`;
    if (isHeart) {
      piece.textContent = "♥";
    } else {
      piece.style.background = colors[index % colors.length];
      piece.style.borderRadius = index % 3 === 0 ? "50%" : "2px";
    }
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--fall-duration", `${3.4 + Math.random() * 2.5}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.75}s`);
    piece.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    piece.style.setProperty("--spin", `${360 + Math.random() * 720}deg`);
    layer.appendChild(piece);
  }

  window.setTimeout(() => layer.replaceChildren(), 7000);
}

const changedMindDialog = document.getElementById("changedMindDialog");
document.getElementById("changedMindButton").addEventListener("click", () => changedMindDialog.showModal());
document.getElementById("dialogCloseButton").addEventListener("click", () => changedMindDialog.close());
document.getElementById("dialogCloseIcon").addEventListener("click", () => changedMindDialog.close());

changedMindDialog.addEventListener("click", (event) => {
  const rect = changedMindDialog.getBoundingClientRect();
  const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (clickedBackdrop) changedMindDialog.close();
});

applyConfig();
