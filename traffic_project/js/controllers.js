// controllers.js

class FixedCycleController {
    constructor(duration = 5) {
        this.order = ["N", "E", "S", "W"];
        this.index = 0;
        this.duration = duration;
        this.timer = 0;
    }

    decide(intersection) {
        this.timer++;

        if (this.timer >= this.duration) {
            this.timer = 0;
            this.index = (this.index + 1) % this.order.length;
        }

        return this.order[this.index];
    }
}

class MaxQueueController {
    decide(intersection) {
        const queues = intersection.queues;

        return Object.keys(queues).reduce((a, b) =>
            queues[a] > queues[b] ? a : b
        );
    }
}

class WeightedPriorityController {
    constructor(alpha = 0.5) {
        this.alpha = alpha;
    }

    decide(intersection) {
        const scores = {};

        for (let dir in intersection.queues) {
            scores[dir] =
                intersection.queues[dir] +
                this.alpha * intersection.waitingTime[dir];
        }

        return Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );
    }
}