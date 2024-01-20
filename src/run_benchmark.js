import {vec3} from "gl-matrix";
import {datasets} from "./volumes";
const benchmarkIterations = 20;
const cameraIterations = 10;
const rotateIterations = 10;

export var RandomIsovalueBenchmark = function (isovalueSlider, range) {
    this.name = "random";
    this.iteration = 0;
    this.isovalueSlider = isovalueSlider;
    this.range = range;
    this.numIterations = benchmarkIterations;
};

RandomIsovalueBenchmark.prototype.run = function () {
    if (this.iteration == this.numIterations) {
        return false;
    }
    var range = this.range[1] - this.range[0];
    this.isovalueSlider.value = Math.random() * range + this.range[0];
    this.iteration += 1;
    return true;
};

RandomIsovalueBenchmark.prototype.reset = function () {
    this.iteration = 0;
};

export var SweepIsovalueBenchmark = function (isovalueSlider, range, sweepUp) {
    this.iteration = 0;
    this.isovalueSlider = isovalueSlider;
    this.range = range;
    this.sweepUp = sweepUp;
    this.numIterations = benchmarkIterations;
    if (this.sweepUp) {
        this.name = "sweepUp";
        this.currentValue = range[0];
    } else {
        this.name = "sweepDown";
        this.currentValue = range[1];
    }
};

SweepIsovalueBenchmark.prototype.run = function () {
    if (this.iteration == this.numIterations) {
        return false;
    }
    var step = (this.range[1] - this.range[0]) / benchmarkIterations;
    if (this.sweepUp) {
        this.currentValue += step;
    } else {
        this.currentValue -= step;
    }
    this.isovalueSlider.value = this.currentValue;
    this.iteration += 1;
    return true;
};

// ManualSingleBenchmark just re-runs whatever current isovalue we have picked
export var ManualSingleBenchmark = function () {
    this.done = false;
    this.name = "manualSingle";
};

ManualSingleBenchmark.prototype.run = function () {
    if (this.done) {
        return false;
    }
    this.done = true;
    return true;
};

ManualSingleBenchmark.prototype.reset = function () {
    this.done = false;
};

SweepIsovalueBenchmark.prototype.reset = function () {
    this.iteration = 0;
};

export var CameraOrbitBenchmark = function (radius) {
    this.iteration = 0;
    this.name = "cameraOrbit";
    this.numIterations = cameraIterations;
    this.radius = radius;
};

CameraOrbitBenchmark.prototype.run = function () {
    if (this.iteration == this.numIterations) {
        return false;
    }
    const increment = Math.PI * (3.0 - Math.sqrt(5.0));
    const offset = 2.0 / this.numIterations;

    var y = ((this.iteration * offset) - 1.0) + offset / 2.0;
    const r = Math.sqrt(1.0 - y * y);
    const phi = this.iteration * increment;
    var x = r * Math.cos(phi);
    var z = r * Math.sin(phi);

    x *= this.radius;
    y *= this.radius;
    z *= this.radius;

    this.currentPoint = vec3.set(vec3.create(), x, y, z);
    this.iteration += 1;

    return true;
};

CameraOrbitBenchmark.prototype.reset = function () {
    this.iteration = 0;
};

export var RotateBenchmark = function (radius, width, height) {
    this.iteration = 0;
    this.name = "rotate";
    this.numIterations = rotateIterations;
    this.radius = radius;
    this.width = width;
    this.height = height;
    this.renderID = Date.now().toString().slice(-6);

    var theta = Math.random() * 2 * Math.PI; // Azimuthal angle
    var phi = Math.acos(2 * Math.random() - 1); // Polar angle
    var x = radius * Math.sin(phi) * Math.cos(theta);
    var y = radius * Math.sin(phi) * Math.sin(theta);
    var z = radius * Math.cos(phi);
    this.startPoint = vec3.set(vec3.create(), x, y, z);

    this.startX = Math.random() * this.width;
    this.startY = Math.random() * this.height;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.endX = Math.random() * this.width;
    this.endY = Math.random() * this.height;
};

RotateBenchmark.prototype.run = function () {
    if (this.iteration == this.numIterations) {
        return false;
    }
    this.lastX = this.currentX;
    this.lastY = this.currentY;
    const t = this.iteration / (this.numIterations - 1);
    this.currentX = this.startX + t * (this.endX - this.startX);
    this.currentY = this.startY + t * (this.endY - this.startY);
    this.iteration += 1;
    return true;
};

RotateBenchmark.prototype.reset = function () {
    this.renderID = Date.now().toString().slice(-6);
    this.iteration = 0;
    var theta = Math.random() * 2 * Math.PI; // Azimuthal angle
    var phi = Math.acos(2 * Math.random() - 1); // Polar angle
    var x = this.radius * Math.sin(phi) * Math.cos(theta);
    var y = this.radius * Math.sin(phi) * Math.sin(theta);
    var z = this.radius * Math.cos(phi);
    this.startPoint = vec3.set(vec3.create(), x, y, z);

    this.startX = Math.random() * this.width;
    this.startY = Math.random() * this.height;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.endX = Math.random() * this.width;
    this.endY = Math.random() * this.height;
};

export var NestedBenchmark = function (outerLoop, innerLoop) {
    this.name = outerLoop.name + "-" + innerLoop.name;
    this.outerLoop = outerLoop;
    this.innerLoop = innerLoop;
    this.iteration = 0;
};

NestedBenchmark.prototype.run = function () {
    if (this.iteration == 0) {
        this.outerLoop.run();
    }
    if (!this.innerLoop.run()) {
        if (!this.outerLoop.run()) {
            return false;
        }
        this.innerLoop.reset();
        this.innerLoop.run();
    }
    this.iteration += 1;
    return true;
}

// Generate the list of benchmark configurations
// we're going to run in autobenchmark mode
export function generateBenchmarkConfigurations() {
    // Do we really need to go up to ssc 8?
    const startSpecCounts = [1, 2];//, 4, 8];
    //const resolutions = ["1080", "720", "360"];
    const resolutions = ["720", "360"];
    const imageCompleteness = [0.8];
    const datasets = ["skull",
        "tacc_turbulence",
        "magnetic",
        "kingsnake",
        "chameleon",
        "beechnut",
        "miranda",
        "jicf_q",
        "dns_large",
        "richtmyer_meshkov"
    ];

    let benchmarks = [];
    for (const d of datasets) {
        for (const ic of imageCompleteness) {
            for (const r of resolutions) {
                for (const ssc of startSpecCounts) {
                    benchmarks.push({
                        dataset: d,
                        imageCompleteness: ic,
                        resolution: r,
                        startSpecCount: ssc
                    });
                }
            }
        }
    }
    return benchmarks;
}

