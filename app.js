// Kurze Erklärung der Ablauf-Logik für die Wim-Hof-Atemtechnik:
//
// 1. Mehrere tiefe Atemzüge (z.B. 30-40). -> Hier demo: 5 Sekunden Einatmen-Phase
// 2. Auf letzter Ausatmung Luft anhalten.  -> Hier demo: 10 Sekunden Halten
// 3. Tief einatmen, 15 Sekunden halten.    -> Hier demo: 5 Sekunden Halten, um nicht zu lange zu warten
// 4. Nächste Runde.
//
// In diesem Beispielcode sind die Zeiten sehr kurz gehalten,
// damit man die Demo in Echtzeit testen kann. Passe sie für
// tatsächliches Training an (z.B. längere Haltezeiten).

// Einstellungen
const totalRounds = 3;          // Gesamtanzahl der Runden
const breathCycleTime = 5;      // Einatmen (sek)
const holdTimeAfterExhale = 10; // Luft anhalten nach Ausatmen (sek)
const holdTimeAfterInhale = 5;  // Tiefe Einatmung halten (sek)

let currentRound = 0;
let currentPhase = ""; // "EINATMEN", "HALTEN-LEER", "HALTEN-GEFÜLLT"
let timerInterval = null;
let timeLeft = 0;
let logEl = null;

// DOM-Elemente
const phaseDisplay = document.getElementById("phaseDisplay");
const timeDisplay  = document.getElementById("timeDisplay");
const currentRoundEl = document.getElementById("currentRound");
const totalRoundsEl  = document.getElementById("totalRounds");
const startBtn     = document.getElementById("startBtn");
const stopBtn      = document.getElementById("stopBtn");

document.addEventListener("DOMContentLoaded", () => {
  logEl = document.getElementById("log");
  totalRoundsEl.textContent = totalRounds;
});

function startBreathing() {
  startBtn.disabled = true;
  stopBtn.disabled = false;

  currentRound = 0;
  logEl.innerHTML = "";  // Log zurücksetzen
  nextRound();
}

function stopBreathing() {
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;

  phaseDisplay.textContent = "Bereit?";
  timeDisplay.textContent  = "00:00";
  currentRoundEl.textContent = "0";
}

function nextRound() {
  currentRound++;
  currentRoundEl.textContent = currentRound;

  // Log Rundenbeginn
  addLog(`Runde ${currentRound} gestartet`);
  
  runPhaseEinatmen();
}

// ----------------
// PHASEN
// ----------------

function runPhaseEinatmen() {
  currentPhase = "EINATMEN";
  phaseDisplay.textContent = "Tief EINATMEN";
  timeLeft = breathCycleTime;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      runPhaseHaltenLeer(); // Weiter zur nächsten Phase
    }
  }, 1000);
}

function runPhaseHaltenLeer() {
  currentPhase = "HALTEN-LEER";
  phaseDisplay.textContent = "Luft anhalten (nach Ausatmen)";
  timeLeft = holdTimeAfterExhale;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      runPhaseHaltenGefuellt(); // Weiter zur nächsten Phase
    }
  }, 1000);
}

function runPhaseHaltenGefuellt() {
  currentPhase = "HALTEN-GEFÜLLT";
  phaseDisplay.textContent = "Tief einatmen und halten!";
  timeLeft = holdTimeAfterInhale;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (currentRound < totalRounds) {
        addLog(`Runde ${currentRound} beendet`);
        nextRound(); // Neue Runde beginnen
      } else {
        addLog(`Alle Runden abgeschlossen!`);
        stopBreathing();
      }
    }
  }, 1000);
}

// ----------------
// HILFSFUNKTIONEN
// ----------------

function updateTimerDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  logEl.appendChild(li);
}

// ----------------
// EVENT LISTENERS
// ----------------

startBtn.addEventListener("click", startBreathing);
stopBtn.addEventListener("click", stopBreathing);
