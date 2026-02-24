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
        if (this.queues[dir] > 0) {
            this.queues[dir] -= 1;
            this.totalServed += 1;
        }
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
        this.generateArrivals();
        this.clearVehicle();
        this.updateWaitingTime();
        this.updateMaxQueue();
    }
}