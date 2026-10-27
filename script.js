// ===================== EDIT YOUR PROJECTS HERE =====================
// Update each video's title, note and YouTube URL. Thumbnail images are generated automatically.
// SOCIAL and PRODUCT use a vertical 9:16 player. EVENT RECAP and DOCUMENTARY use 16:9.
const projects = {
  social: {
    title: "SOCIAL",
    description: "Short-form content, social-first storytelling and brand work. Vertical format (9:16).",
    ratio: "vertical",
    platform: "youtube",
    videos: [
      { title: "Social Project 01", note: "", url: "https://youtube.com/shorts/Esx9Q-nXcuA" },
      { title: "Social Project 02", note: "", url: "https://www.youtube.com/shorts/3ZGwRSuKMkc" },
      { title: "Social Project 03", note: "", url: "https://youtube.com/shorts/g9duGEs5IK0?feature=share" }
    ]
  },
  tiktok: {
    title: "TIKTOK VIRAL",
    description: "Funny clips, trending moments and viral TikTok videos. Add a public TikTok video URL and enter its view count manually in script.js.",
    ratio: "vertical",
    platform: "tiktok",
    videos: [
      { title: "Viral Clip 01", url: "https://www.tiktok.com/@linhanh.duide/video/7670121839867497735", views: "3.3M views", note: "Comedy" },
      { title: "Viral Clip 02", url: "https://www.tiktok.com/@linhanh.duide/video/7696099124394970376", views: "1.3M views", note: "Comedy" },
      { title: "Viral Clip 03", url: "https://www.tiktok.com/@linhanh.duide/video/7664972228521495815", views: "900K views", note: "Comedy" }
    ]
  },
  product: {
    title: "PRODUCT",
    description: "Product films and commercial visuals. Vertical format (9:16).",
    ratio: "vertical",
    platform: "youtube",
    videos: [
      { title: "Product Project 01", note: "", url: "https://youtube.com/shorts/TW-Ar-gkUb4" },
      { title: "Product Project 02", note: "", url: "https://youtube.com/shorts/_cDip0X5mKY" },
      { title: "Product Project 03", note: "", url: "https://youtube.com/shorts/myv6Lw7xwXI" }
    ]
  },
  event: {
    title: "EVENT RECAP",
    description: "Event highlights, recaps and community moments. Horizontal format (16:9).",
    ratio: "horizontal",
    platform: "youtube",
    videos: [
      { title: "Recap Project 01", note: "", url: "https://www.youtube.com/watch?v=xikHksGsh1I" },
      { title: "Recap Project 02", note: "", url: "https://www.youtube.com/watch?v=Lib7T5ZeNzM" },
      { title: "Recap Project 03", note: "", url: "https://www.youtube.com/watch?v=1DYR_t1S1EU" }
    ]
  },
  documentary: {
    title: "DOCUMENTARY",
    description: "People, places and stories told with a documentary approach. Horizontal format (16:9).",
    ratio: "horizontal",
    platform: "youtube",
    videos: [
      { title: "Documentary Project 01", note: "", url: "https://www.youtube.com/watch?v=1intmVV3izw" },
      { title: "Documentary Project 02", note: "", url: "https://www.youtube.com/watch?v=SN2eFIXd14w" },
      { title: "Documentary Project 03", note: "", url: "https://www.youtube.com/watch?v=OaXxw_TPznU" }
    ]
  }
};

const folderModal = document.getElementById("folder-modal");
const playerModal = document.getElementById("player-modal");
const aboutModal = document.getElementById("about-modal");
const videoGrid = document.getElementById("video-grid");
const folderTitle = document.getElementById("folder-title");
const folderDescription = document.getElementById("folder-description");
const playerFrame = document.getElementById("player-frame");
const playerTitle = document.getElementById("player-title");
const playerCount = document.getElementById("player-count");
const previousButton = document.getElementById("previous-video");
const nextButton = document.getElementById("next-video");
const playlistButton = document.getElementById("toggle-playlist");
const playlist = document.getElementById("player-playlist");
let lastTrigger = null;
let activeFolderKey = null;
let activeVideoIndex = -1;

function getVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1).split("/")[0];
    if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
    const pieces = parsed.pathname.split("/").filter(Boolean);
    const index = pieces.findIndex(part => ["shorts", "embed", "live"].includes(part));
    return index >= 0 ? pieces[index + 1] : "";
  } catch { return ""; }
}
function getTikTokId(url) {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    return match ? match[1] : "";
  } catch { return ""; }
}
function setModalState(modal, open) {
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("modal-open", !!document.querySelector(".modal.open, .player-modal.open, .about-modal.open"));
}
function stopPlayer() {
  playerFrame.replaceChildren(); // Removing the iframe stops YouTube audio and playback.
  setModalState(playerModal, false);
  playlist.hidden = true;
  playlist.replaceChildren();
  activeVideoIndex = -1;
  previousButton.disabled = true;
  nextButton.disabled = true;
}
function closeFolder() {
  stopPlayer();
  setModalState(folderModal, false);
  if (lastTrigger?.focus) lastTrigger.focus();
}
function openAbout(trigger) {
  lastTrigger = trigger || document.activeElement;
  stopPlayer();
  setModalState(aboutModal, true);
  aboutModal.querySelector(".close")?.focus();
}
function closeAbout() {
  setModalState(aboutModal, false);
  if (lastTrigger?.focus) lastTrigger.focus();
}
function openFolder(key, trigger) {
  const folder = projects[key];
  if (!folder) return;
  lastTrigger = trigger || document.activeElement;
  stopPlayer();
  activeFolderKey = key;
  folderTitle.textContent = folder.title;
  folderDescription.textContent = folder.description;
  videoGrid.replaceChildren();
  if (!folder.videos.length) {
    const empty = document.createElement("div");
    empty.className = "empty-note";
    empty.textContent = activeFolderKey === "tiktok" ? "Add a public TikTok video URL and a manual views label in script.js under EDIT YOUR PROJECTS HERE. Use the full /@creator/video/VIDEO_ID link." : "Add project titles and video URLs in script.js under EDIT YOUR PROJECTS HERE.";
    videoGrid.append(empty);
  }
  folder.videos.forEach((video, index) => {
    const id = folder.platform === "tiktok" ? getTikTokId(video.url) : getVideoId(video.url);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `video-card ${folder.ratio}`;
    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumb";
    thumbnail.loading = "lazy";
    thumbnail.alt = `${video.title} thumbnail`;
    if (id && folder.platform !== "tiktok") {
      thumbnail.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      thumbnail.onerror = () => { if (!thumbnail.dataset.fallback) { thumbnail.dataset.fallback = "1"; thumbnail.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`; } };
    } else if (folder.platform === "tiktok") {
      thumbnail.src = "assets/folder-tiktok-viral.png";
      thumbnail.style.objectFit = "contain";
      thumbnail.style.background = "linear-gradient(135deg,#c7e7ff,#f7fbff)";
    }
    const title = document.createElement("strong"); title.textContent = video.title;
    const note = document.createElement("small"); note.textContent = [video.note, video.views].filter(Boolean).join(" · ");
    card.append(thumbnail, title, note);
    card.addEventListener("click", () => playVideo(index));
    videoGrid.append(card);
  });
  setModalState(folderModal, true);
}
function renderPlaylist() {
  const folder = projects[activeFolderKey];
  playlist.replaceChildren();
  if (!folder) return;
  folder.videos.forEach((video, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `playlist-item${index === activeVideoIndex ? " active" : ""}`;
    item.textContent = `${String(index + 1).padStart(2, "0")} · ${video.title}`;
    item.addEventListener("click", () => playVideo(index));
    playlist.append(item);
  });
}
function playVideo(index) {
  const folder = projects[activeFolderKey];
  if (!folder || index < 0 || index >= folder.videos.length) return;
  const video = folder.videos[index];
  const isTikTok = folder.platform === "tiktok";
  const id = isTikTok ? getTikTokId(video.url) : getVideoId(video.url);
  if (!id) return;
  playerFrame.replaceChildren(); // Ensure the previous iframe is destroyed before switching.
  activeVideoIndex = index;
  playerTitle.textContent = video.title;
  playerFrame.className = `player-frame ${folder.ratio === "vertical" ? "vertical" : "horizontal"}${folder.platform === "tiktok" ? " tiktok" : ""}`;
  const iframe = document.createElement("iframe");
  iframe.title = video.title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  if (isTikTok) {
    iframe.src = `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}?controls=1&description=1&music_info=1&autoplay=1`;
    iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
  } else {
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&enablejsapi=1`;
  }
  playerFrame.append(iframe);
  playerCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(folder.videos.length).padStart(2, "0")}`;
  previousButton.disabled = index === 0;
  nextButton.disabled = index === folder.videos.length - 1;
  if (!playlist.hidden) renderPlaylist();
  setModalState(playerModal, true);
}

// Folder and About buttons.
document.addEventListener("click", event => {
  const folderButton = event.target.closest("[data-open-folder]");
  if (folderButton) { event.preventDefault(); openFolder(folderButton.dataset.openFolder, folderButton); return; }
  const aboutButton = event.target.closest("[data-open-about]");
  if (aboutButton) { event.preventDefault(); openAbout(aboutButton); }
});
document.querySelectorAll("[data-close-folder]").forEach(el => el.addEventListener("click", closeFolder));
document.querySelectorAll("[data-close-player]").forEach(el => el.addEventListener("click", stopPlayer));
document.querySelectorAll("[data-close-about]").forEach(el => el.addEventListener("click", closeAbout));
previousButton.addEventListener("click", () => playVideo(activeVideoIndex - 1));
nextButton.addEventListener("click", () => playVideo(activeVideoIndex + 1));
playlistButton.addEventListener("click", () => { playlist.hidden = !playlist.hidden; if (!playlist.hidden) renderPlaylist(); });
// Clicking Home always stops playback first, preventing audio continuing behind the home screen.
document.querySelectorAll('[data-home-link], a[href="#home"]').forEach(el => el.addEventListener("click", () => { stopPlayer(); closeFolder(); closeAbout(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (playerModal.classList.contains("open")) stopPlayer();
    else if (folderModal.classList.contains("open")) closeFolder();
    else if (aboutModal.classList.contains("open")) closeAbout();
  }
  if (playerModal.classList.contains("open") && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    if (event.key === "ArrowLeft" && activeVideoIndex > 0) playVideo(activeVideoIndex - 1);
    if (event.key === "ArrowRight" && activeVideoIndex < projects[activeFolderKey].videos.length - 1) playVideo(activeVideoIndex + 1);
  }
});
function updateClock() {
  const clock = document.getElementById("clock"); if (!clock) return;
  const now = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const pad = n => String(n).padStart(2, "0");
  clock.textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
updateClock(); setInterval(updateClock, 60000);
