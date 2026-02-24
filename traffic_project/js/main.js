// main.js

let intersection;
let controller;
let timer = null;

// UI elements
const northEl = document.getElementById("northQueue");
const southEl = document.getElementById("southQueue");
const eastEl = document.getElementById("eastQueue");
const westEl = document.getElementById("westQueue");
const signalEl = document.getElementById("currentSignal");

const avgWaitEl = document.getElementById("avgWait");
const servedEl = document.getElementById("served");
const maxQueueEl = document.getElementById("maxQueue");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("modeSelect");

// Initialize system
function init(mode = "fixed") {
    intersection = new Intersection(2);

    if (mode === "fixed") {
        controller = new FixedCycleController(5);
    } else if (mode === "maxQueue") {
        controller = new MaxQueueController();
    } else {
        controller = new WeightedPriorityController(0.5);
    }

    updateUI();
}

// One simulation tick
function tick() {
    const decision = controller.decide(intersection);
    intersection.currentSignal = decision;

    intersection.step();

    updateUI();
}

// Update UI values
function updateUI() {
    northEl.textContent = intersection.queues.N;
    southEl.textContent = intersection.queues.S;
    eastEl.textContent = intersection.queues.E;
    westEl.textContent = intersection.queues.W;

    signalEl.textContent = intersection.currentSignal;

    const totalWait =
        intersection.waitingTime.N +
        intersection.waitingTime.S +
        intersection.waitingTime.E +
        intersection.waitingTime.W;

    const totalVehicles =
        intersection.totalServed +
        intersection.queues.N +
        intersection.queues.S +
        intersection.queues.E +
        intersection.queues.W;

    avgWaitEl.textContent =
        totalVehicles > 0 ? (totalWait / totalVehicles).toFixed(2) : 0;

    servedEl.textContent = intersection.totalServed;
    maxQueueEl.textContent = intersection.maxQueueObserved;
}

// Button handlers
startBtn.onclick = () => {
    if (!timer) {
        timer = setInterval(tick, 1000);
    }
};

pauseBtn.onclick = () => {
    clearInterval(timer);
    timer = null;
};

resetBtn.onclick = () => {
    pauseBtn.onclick();
    init(modeSelect.value);
};

modeSelect.onchange = () => {
    init(modeSelect.value);
};

// Initial load
init();