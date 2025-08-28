// --- config: where your animal images live (FastAPI static) ---
const ANIMALS_BASE = "/static/animals"; // e.g., /static/animals/dog.jpg

// Grab DOM nodes
const imgEl = document.getElementById("animalImg");
const uploadSection = document.getElementById("uploadSection");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileInfo = document.getElementById("fileInfo");

// Wire radio change handlers
document.querySelectorAll('input[name="source"]').forEach((r) => {
  r.addEventListener("change", () => r.checked && handleSelection(r.value));
});

// --- fix: ignore late image load events ---
let imgLoadToken = 0; // increments to invalidate older loads

function handleSelection(value) {
  if (value === "upload") {
    hideImage();                 // invalidate current load + hide
    uploadSection.hidden = false;
    fileInfo.textContent = "";   // clear any previous error/info
    return;
  }
  // animal selected
  uploadSection.hidden = true;
  fileInfo.textContent = "";     // clear stale messages
  showAnimal(value);
}

function showAnimal(animal) {
  const myToken = ++imgLoadToken;  // this request’s id
  imgEl.style.display = "block";
  imgEl.hidden = false;
  imgEl.alt = `${animal} image`;

  const url = `${ANIMALS_BASE}/${animal}.jpg`;
  imgEl.src = url;

  imgEl.onload = () => {
    if (myToken !== imgLoadToken) return; // stale, ignore
    fileInfo.textContent = "";            // ensure no message remains
  };

  imgEl.onerror = () => {
    if (myToken !== imgLoadToken) return; // stale, ignore
    hideImage(true); // don't bump token again
    fileInfo.textContent = `Could not load image at ${url}. Check your static path or extension.`;
  };
}

function hideImage(dontBump) {
  if (!dontBump) imgLoadToken++;  // invalidate any in‑flight load
  // remove handlers to prevent late writes
  imgEl.onload = null;
  imgEl.onerror = null;

  // hide + stop current request
  imgEl.src = "";
  imgEl.alt = "";
  imgEl.hidden = true;
  imgEl.style.display = "none";
}

// Ensure correct UI on refresh (Firefox restores radio state)
document.addEventListener("DOMContentLoaded", () => {
  const checked = document.querySelector('input[name="source"]:checked');
  if (checked) {
    handleSelection(checked.value);
  } else {
    hideImage();
    uploadSection.hidden = true;
    fileInfo.textContent = "";
  }
});

// Upload handler — expects FastAPI POST /upload/ with field "file"
uploadBtn?.addEventListener("click", async () => {
  fileInfo.textContent = "";
  const file = fileInput.files?.[0];
  if (!file) {
    fileInfo.textContent = "Please choose a file first.";
    return;
  }

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch("/upload/", { method: "POST", body: fd });
    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      fileInfo.textContent = `Upload failed (${res.status}). ${JSON.stringify(payload)}`;
      return;
    }

    fileInfo.textContent =
      typeof payload === "string"
        ? `Success:\n${payload}`
        : `Success:\n${JSON.stringify(payload, null, 2)}`;
  } catch (err) {
    fileInfo.textContent = `Upload error: ${err}`;
  }
});
