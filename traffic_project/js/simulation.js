// simulation.js

class Intersection {
    constructor(arrivalRate = 2) {
        this.queues = {
            N: 0,
            S: 0,
            E: 0,
            W: 0
        };

        this.waitingTime = {
            N: 0,
            S: 0,
            E: 0,
            W: 0
        };

        this.currentSignal = "N";
        this.arrivalRate = arrivalRate;
        this.totalServed = 0;
        this.maxQueueObserved = 0;
    }

    applyArrivals(arrivals) {
    for (let dir in arrivals) {
        this.queues[dir] += arrivals[dir];
    }
}

    randomArrival() {
        return Math.floor(Math.random() * (this.arrivalRate + 1));
    }

    generateArrivals() {
        for (let dir in this.queues) {
            const arrivals = this.randomArrival();
            this.queues[dir] += arrivals;
        }
    }

    clearVehicle() {
    const dir = this.currentSignal;

    const clearanceRate = 3; // 👈 NEW

    const vehiclesToClear = Math.min(clearanceRate, this.queues[dir]);

    this.queues[dir] -= vehiclesToClear;
    this.totalServed += vehiclesToClear;
}

    updateWaitingTime() {
        for (let dir in this.queues) {
            this.waitingTime[dir] += this.queues[dir];
        }
    }

    updateMaxQueue() {
        const maxNow = Math.max(...Object.values(this.queues));
        if (maxNow > this.maxQueueObserved) {
            this.maxQueueObserved = maxNow;
        }
    }

    step() {
        this.clearVehicle();
        this.updateWaitingTime();
        this.updateMaxQueue();
    }
}