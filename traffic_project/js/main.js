// main.js

let chart;
let labels = [];
let fixedData = [];
let adaptiveData = [];
let fixedIntersection;
let adaptiveIntersection;

let fixedController;
let adaptiveController;

let timer = null;

// UI Elements (Fixed)
const fixedAvgWait = document.getElementById("avgWaitFixed");
const fixedServed = document.getElementById("servedFixed");
const fixedMaxQueue = document.getElementById("maxQueueFixed");

// UI Elements (Adaptive)
const adaptiveAvgWait = document.getElementById("avgWaitAdaptive");
const adaptiveServed = document.getElementById("servedAdaptive");
const adaptiveMaxQueue = document.getElementById("maxQueueAdaptive");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function init() {
    fixedIntersection = new Intersection(CONFIG.arrivalRate);
    adaptiveIntersection = new Intersection(CONFIG.arrivalRate);

    fixedController = new FixedCycleController(CONFIG.fixedGreenDuration);
    adaptiveController = new WeightedPriorityController(CONFIG.alpha);

    updateUI();
    labels = [];
fixedData = [];
adaptiveData = [];
setupChart();

}

function setupChart() {
    const ctx = document.getElementById("trafficChart").getContext("2d");

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Fixed",
                    data: fixedData,
                    borderWidth: 2
                },
                {
                    label: "Adaptive",
                    data: adaptiveData,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            animation: false
        }
    });
}

function generateSharedArrivals() {
    return {
        N: Math.floor(Math.random() * (CONFIG.arrivalRate + 1)),
        S: Math.floor(Math.random() * (CONFIG.arrivalRate + 1)),
        E: Math.floor(Math.random() * (CONFIG.arrivalRate + 1)),
        W: Math.floor(Math.random() * (CONFIG.arrivalRate + 1))
    };
}

function tick() {
    const arrivals = generateSharedArrivals();

    // Apply same arrivals
    fixedIntersection.applyArrivals(arrivals);
    adaptiveIntersection.applyArrivals(arrivals);

    // Decide signals
    fixedIntersection.currentSignal =
        fixedController.decide(fixedIntersection);

    adaptiveIntersection.currentSignal =
        adaptiveController.decide(adaptiveIntersection);

    // Step both systems
    fixedIntersection.step();
    adaptiveIntersection.step();

    updateUI();
    const time = labels.length;
labels.push(time);

fixedData.push(parseFloat(calculateAvgWait(fixedIntersection)));
adaptiveData.push(parseFloat(calculateAvgWait(adaptiveIntersection)));

chart.update();

}

function calculateAvgWait(intersection) {
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

    return totalVehicles > 0
        ? (totalWait / totalVehicles).toFixed(2)
        : 0;
}

function updateUI() {
    fixedAvgWait.textContent = calculateAvgWait(fixedIntersection);
    fixedServed.textContent = fixedIntersection.totalServed;
    fixedMaxQueue.textContent = fixedIntersection.maxQueueObserved;

    adaptiveAvgWait.textContent = calculateAvgWait(adaptiveIntersection);
    adaptiveServed.textContent = adaptiveIntersection.totalServed;
    adaptiveMaxQueue.textContent =
        adaptiveIntersection.maxQueueObserved;
}

startBtn.onclick = () => {
    if (!timer) {
        timer = setInterval(tick, CONFIG.simulationSpeed);
    }
};

pauseBtn.onclick = () => {
    clearInterval(timer);
    timer = null;
};

resetBtn.onclick = () => {
    pauseBtn.onclick();
    init();
};

init();