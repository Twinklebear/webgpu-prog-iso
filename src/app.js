import { datasets, getVolumeDimensions } from "./volumes";
import { VolumeRaycaster } from "./volume_raycaster";
import { RandomIsovalueBenchmark, ManualSingleBenchmark, SweepIsovalueBenchmark, NestedBenchmark, RotateBenchmark} from './run_benchmark';
import { Controller, ArcballCamera } from "./webgl-util";
import { display_render_frag_spv, display_render_vert_spv } from "./embedded_shaders";
import { vec3, mat4 } from "gl-matrix";
import { saveAs } from 'file-saver';
import { imageDataToTensor, getImageTensorFromPath, runModel } from "./inference";
import { InferenceSession } from "onnxruntime-web/webgpu";

(async () => {
    function runBenchmark(benchmark)
    {
        requestBenchmark = benchmark;
    }

    function saveScreenShotButton()
    {
        saveScreenshot = true;
    }

    // Assumes the input renderTarget and outCanvas have the same image dimensions
    async function takeScreenshot(device, name, renderTarget, imageBuffer, outCanvas)
    {
        var commandEncoder = device.createCommandEncoder();
        commandEncoder.copyTextureToBuffer({texture: renderTarget},
                                        {buffer: imageBuffer, bytesPerRow: outCanvas.width * 4},
                                        [outCanvas.width, outCanvas.height, 1]);
        device.queue.submit([commandEncoder.finish()]);
        await device.queue.onSubmittedWorkDone();

        await imageBuffer.mapAsync(GPUMapMode.READ);
        var imageReadbackArray = new Uint8ClampedArray(imageBuffer.getMappedRange());

        var context = outCanvas.getContext('2d');
        var imgData = context.createImageData(outCanvas.width, outCanvas.height);
        imgData.data.set(imageReadbackArray);
        context.putImageData(imgData, 0, 0);
        outCanvas.toBlob(function(b) {
            saveAs(b, `${name}.png`);
        }, "image/png");

        imageBuffer.unmap();
    }

    document.getElementById("runRandomBenchmark").onclick = () => {runBenchmark("random")};
    document.getElementById("runSweepUp").onclick = () => {runBenchmark("sweepUp")};
    document.getElementById("runSweepDown").onclick = () => {runBenchmark("sweepDown")};
    document.getElementById("runRotate").onclick = () => {runBenchmark("rotate")};
    document.getElementById("recomputeSurface").onclick = () => {runBenchmark("manualSingle")};
    document.getElementById("saveScreenShotButton").onclick = () => {saveScreenShotButton()};

    var adapter = await navigator.gpu.requestAdapter();
    console.log(adapter.limits);

    var gpuDeviceDesc = {
        requiredLimits: {
            maxStorageBuffersPerShaderStage: adapter.limits.maxStorageBuffersPerShaderStage,
            maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
            maxBufferSize: adapter.limits.maxBufferSize
        },
    };
    var device = await adapter.requestDevice(gpuDeviceDesc);

    var session = await InferenceSession.create('./big.onnx', { executionProviders: ['webgpu'], graphOptimizationLevel: 'all'});

    var canvas = document.getElementById("webgpu-canvas");
    var context = canvas.getContext("webgpu");

    var requestBenchmark = null;
    var saveScreenshot = false;

    var dataset = datasets.skull;
    if (window.location.hash) {
        var name = decodeURI(window.location.hash.substr(1));
        console.log(`Linked to data set ${name}`);
        dataset = datasets[name];
    }

    var volumeDims = getVolumeDimensions(dataset.name);
    var zfpDataName = dataset.name + ".zfp";
    var volumeURL = null;
    if (window.location.hostname == "www.willusher.io") {
        volumeURL = "https://cdn.willusher.io/bcmc-demo-data/" + zfpDataName;
    } else {
        volumeURL = "/models/bcmc-data/" + zfpDataName;
    }
    var compressedData =
        await fetch(volumeURL).then((res) => res.arrayBuffer().then(function(arr) {
            return new Uint8Array(arr);
        }));

    if (compressedData == null) {
        alert(`Failed to load compressed data`);
        return;
    }
    var imageBuffer = device.createBuffer({
        size: canvas.width * canvas.height * 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    var resolutionBuffer = device.createBuffer({
        size: 2 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    var commandEncoder = device.createCommandEncoder();
    var uploadResolution = device.createBuffer(
        {size: 2 * 4, usage: GPUBufferUsage.COPY_SRC, mappedAtCreation: true});
    new Uint32Array(uploadResolution.getMappedRange()).set([canvas.width, canvas.height]);
    uploadResolution.unmap();
    commandEncoder.copyBufferToBuffer(uploadResolution, 0, resolutionBuffer, 0, 2 * 4);
    device.queue.submit([commandEncoder.finish()]);
    var renderBGLayout = device.createBindGroupLayout({
        entries: [
            {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: "2d"}},
            {binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: {type: "uniform"}},
            {binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {type: "filtering"}}
        ]
    });
    const sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
    });

    var enableSpeculationUI = document.getElementById("enableSpeculation");
    enableSpeculationUI.checked = true;

    var recordVisibleBlocksUI = document.getElementById("recordVisibleBlocks")
    var resolution = document.getElementById("resolution");
    var resolutionToDivisor = {"full": 1, "half": 2, "quarter": 4};
    var width = canvas.width / resolutionToDivisor[resolution.value];
    var height = canvas.height / resolutionToDivisor[resolution.value];

    var headstartSlider = document.getElementById("startSpecCount");
    var volumeRC =
        new VolumeRaycaster(device, width, height, recordVisibleBlocksUI, enableSpeculationUI, parseInt(headstartSlider.value));

    resolution.onchange = async () => {
        var width = canvas.width / resolutionToDivisor[resolution.value];
        var height = canvas.height / resolutionToDivisor[resolution.value];
        console.log(`Changed resolution to ${width}x${height}`);
        volumeRC = new VolumeRaycaster(
            device, width, height, recordVisibleBlocksUI, enableSpeculationUI, parseInt(headstartSlider.value));
        await volumeRC.setCompressedVolume(
            compressedData, dataset.compressionRate, volumeDims, dataset.scale);
        recomputeSurface = true;
        renderPipelineBG = device.createBindGroup({
            layout: renderBGLayout,
            entries: [
                {binding: 0, resource: volumeRC.renderTarget.createView()},
                {binding: 1, resource: {buffer: resolutionBuffer}},
                {binding: 2, resource: sampler}
            ]
        });
    };
    headstartSlider.onchange = async () => {
        var width = canvas.width / resolutionToDivisor[resolution.value];
        var height = canvas.height / resolutionToDivisor[resolution.value];
        volumeRC = new VolumeRaycaster(
            device, width, height, recordVisibleBlocksUI, enableSpeculationUI, parseInt(headstartSlider.value));
        await volumeRC.setCompressedVolume(
            compressedData, dataset.compressionRate, volumeDims, dataset.scale);
        recomputeSurface = true;
        renderPipelineBG = device.createBindGroup({
            layout: renderBGLayout,
            entries: [
                {binding: 0, resource: volumeRC.renderTarget.createView()},
                {binding: 1, resource: {buffer: resolutionBuffer}},
                {binding: 2, resource: sampler}
            ]
        });
    }
    await volumeRC.setCompressedVolume(
        compressedData, dataset.compressionRate, volumeDims, dataset.scale);

    var totalMemDisplay = document.getElementById("totalMemDisplay");
    var mcMemDisplay = document.getElementById("mcMemDisplay");
    var cacheMemDisplay = document.getElementById("cacheMemDisplay");
    var fpsDisplay = document.getElementById("fps");
    var camDisplay = document.getElementById("camDisplay");

    var enableCache = document.getElementById("enableCache");
    enableCache.checked = true;

    var isovalueSlider = document.getElementById("isovalue");
    isovalueSlider.min = dataset.range[0];
    isovalueSlider.max = dataset.range[1];
    if (dataset.step !== undefined) {
        isovalueSlider.step = dataset.step;
    } else {
        isovalueSlider.step = (isovalueSlider.max - isovalueSlider.min) / 255.0;
    }
    isovalueSlider.value = (dataset.range[0] + dataset.range[1]) / 2.0;
    var currentIsovalue = isovalueSlider.value;

    var cacheInfo = document.getElementById("cacheInfo");
    var displayCacheInfo = function() {
        var percentActive = (volumeRC.numVisibleBlocks / volumeRC.totalBlocks) * 100;
        cacheInfo.innerHTML = `Cache Space: ${
      volumeRC.lruCache.cacheSize
    } blocks
            (${(
              (volumeRC.lruCache.cacheSize / volumeRC.totalBlocks) *
              100
            ).toFixed(2)} %
            of ${volumeRC.totalBlocks} total blocks)<br/>
            # Cache Slots Available ${
              volumeRC.lruCache.displayNumSlotsAvailable}<br/>
            <b>For this Pass:</b><br/>
            # Newly Decompressed: ${volumeRC.newDecompressed}<br/>
            # Visible Blocks: ${volumeRC.numVisibleBlocks}
            (${percentActive.toFixed(2)}%)<br/>`;
    };
    displayCacheInfo();

    const defaultEye = vec3.set(vec3.create(), 0.0, 0.0, -1.5);
    const center = vec3.set(vec3.create(), 0.0, 0.0, 0.0);
    const up = vec3.set(vec3.create(), 0.0, 1.0, 0.0);
    /*
    // For matching benchmark configurations
    var benchmarkEye = {
        "eyePos": [-1.012491226196289, 0.7122936248779297, 0.8317527174949646],
        "eyeDir": [0.6625354886054993, -0.5211779475212097, -0.537977933883667],
        "upDir": [0.4094274640083313, 0.8534227609634399, -0.3225504457950592],
    };
    const defaultEye = vec3.set(vec3.create(),
                                benchmarkEye["eyePos"][0],
                                benchmarkEye["eyePos"][1],
                                benchmarkEye["eyePos"][2]);
    const center = vec3.add(vec3.create(),
                            defaultEye,
                            vec3.set(vec3.create(),
                                     benchmarkEye["eyeDir"][0],
                                     benchmarkEye["eyeDir"][1],
                                     benchmarkEye["eyeDir"][2]));
    const up = vec3.set(vec3.create(),
                        benchmarkEye["upDir"][0],
                        benchmarkEye["upDir"][1],
                        benchmarkEye["upDir"][2]);
                        */

    var camera = new ArcballCamera(defaultEye, center, up, 4, [
        canvas.width,
        canvas.height,
    ]);
    const nearPlane = 0.1;
    var proj = mat4.perspective(
        mat4.create(), (50 * Math.PI) / 180.0, canvas.width / canvas.height, nearPlane, 1000);
    var projView = mat4.create();

    var numFrames = 0;
    var totalTimeMS = 0;
    var cameraChanged = true;

    var controller = new Controller();
    controller.mousemove = function(prev, cur, evt) {
        if (evt.buttons == 1) {
            cameraChanged = true;
            camera.rotate(prev, cur);
            numFrames = 0;
            totalTimeMS = 0;
        } else if (evt.buttons == 2) {
            cameraChanged = true;
            camera.pan([cur[0] - prev[0], prev[1] - cur[1]]);
            numFrames = 0;
            totalTimeMS = 0;
        }
    };
    controller.wheel = function(amt) {
        cameraChanged = true;
        camera.zoom(amt * 0.05);
        numFrames = 0;
        totalTimeMS = 0;
    };
    controller.pinch = controller.wheel;
    controller.twoFingerDrag = function(drag) {
        cameraChanged = true;
        camera.pan(drag);
        numFrames = 0;
        totalTimeMS = 0;
    };
    controller.registerForCanvas(canvas);

    var animationFrame = function() {
        var resolve = null;
        var promise = new Promise((r) => (resolve = r));
        window.requestAnimationFrame(resolve);
        return promise;
    };

    requestAnimationFrame(animationFrame);

    var upload = device.createBuffer({
        // mat4, 2 vec4's and a float + some extra to align
        size: 32 * 4,
        usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
    });

    /* We need a render pass to blit the image that is computed by the volume
     * raycaster to the screen. This just draws a quad to the screen and loads
     * the corresponding texel from the render to show on the screen
     */
    var swapChainFormat = "bgra8unorm";
    context.configure(
        {device: device, format: swapChainFormat, usage: GPUTextureUsage.RENDER_ATTACHMENT});

    var vertModule = device.createShaderModule({code: display_render_vert_spv});
    var fragModule = device.createShaderModule({code: display_render_frag_spv});

    var renderPipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({bindGroupLayouts: [renderBGLayout]}),
        vertex: {
            module: vertModule,
            entryPoint: "main",
        },
        fragment:
            {module: fragModule, entryPoint: "main", targets: [{format: swapChainFormat}]}
    });

    var renderPipelineBG = device.createBindGroup({
        layout: renderBGLayout,
        entries: [
            {binding: 0, resource: volumeRC.renderTarget.createView()},
            {binding: 1, resource: {buffer: resolutionBuffer}},
            {binding: 2, resource: sampler}
        ]
    });

    var renderPassDesc = {
        colorAttachments: [{
            view: undefined,
            loadOp: "clear",
            clearValue: [0.3, 0.3, 0.3, 1],
            storeOp: "store"
        }],
    };

    var currentBenchmark = null;
    var cameraBenchmark = null;

    var perfStats = [];

    var recomputeSurface = true;
    var surfaceDone = false;
    var averageComputeTime = 0;
    while (true) {
        await animationFrame();
        var start = performance.now();

        if (requestBenchmark && !currentBenchmark) {
            perfStats = [];
            await volumeRC.lruCache.reset();
            if (requestBenchmark == "random") {
                var valueBenchmark =
                    new RandomIsovalueBenchmark(isovalueSlider, dataset.range);
                // cameraBenchmark = new CameraOrbitBenchmark(1.5);
                cameraBenchmark = new RotateBenchmark(1.5, canvas.width, canvas.height);
                currentBenchmark = new NestedBenchmark(valueBenchmark, cameraBenchmark);
            } else if (requestBenchmark == "sweepUp") {
                var valueBenchmark =
                    new SweepIsovalueBenchmark(isovalueSlider, dataset.range, true);
                // cameraBenchmark = new CameraOrbitBenchmark(1.5);
                cameraBenchmark = new RotateBenchmark(1.5, canvas.width, canvas.height);
                currentBenchmark = new NestedBenchmark(valueBenchmark, cameraBenchmark);
            } else if (requestBenchmark == "sweepDown") {
                var valueBenchmark =
                    new SweepIsovalueBenchmark(isovalueSlider, dataset.range, false);
                // cameraBenchmark = new CameraOrbitBenchmark(1.5);
                cameraBenchmark = new RotateBenchmark(1.5, canvas.width, canvas.height);
                currentBenchmark = new NestedBenchmark(valueBenchmark, cameraBenchmark);
            } else if (requestBenchmark == "manualSingle") {
                currentBenchmark = new ManualSingleBenchmark();
                recomputeSurface = true;
            } else {
                // cameraBenchmark = new CameraOrbitBenchmark(1.5);
                cameraBenchmark = new RotateBenchmark(1.5, canvas.width, canvas.height);
                currentBenchmark = cameraBenchmark;
            }
            requestBenchmark = null;
        }

        if (currentBenchmark && surfaceDone) {
            if (!currentBenchmark.run()) {
                var blob = new Blob([JSON.stringify(perfStats)], {type: "text/plain"});
                saveAs(blob, `perf-${dataset.name}-${currentBenchmark.name}.json`);

                currentBenchmark = null;
            } else if (currentBenchmark.name.includes("cameraOrbit")) {
                camera = new ArcballCamera(cameraBenchmark.currentPoint, center, up, 4, [
                    canvas.width,
                    canvas.height,
                ]);
                cameraChanged = true;
            } else if (currentBenchmark.name.includes("rotate")) {
                if (cameraBenchmark.iteration == 1) {
                    camera = new ArcballCamera(cameraBenchmark.startPoint, center, up, 4, [
                        canvas.width,
                        canvas.height,
                    ]);
                } else {
                    camera.rotate([cameraBenchmark.lastX, cameraBenchmark.lastY], [cameraBenchmark.currentX, cameraBenchmark.currentY]);
                }
                cameraChanged = true;
            }
        }

        projView = mat4.mul(projView, proj, camera.camera);
        await upload.mapAsync(GPUMapMode.WRITE);
        var uploadArray = new Float32Array(upload.getMappedRange());
        uploadArray.set(projView);
        uploadArray.set(camera.eyePos(), 16);
        uploadArray.set(camera.eyeDir(), 20);
        uploadArray.set([nearPlane], 24);
        upload.unmap();

        if (cameraChanged) {
            cameraChanged = false;
            recomputeSurface = true;

            var eyePos = camera.eyePos();
            var eyeDir = camera.eyeDir();
            var upDir = camera.upDir();
            camDisplay.innerHTML = `eye = ${eyePos[0].toFixed(4)}, ${eyePos[1].toFixed(
                4
            )}, ${eyePos[2].toFixed(4)}<br/>
                dir = ${eyeDir[0].toFixed(4)}, ${eyeDir[1].toFixed(
                4
            )}, ${eyeDir[2].toFixed(4)}<br/>
                up = ${upDir[0].toFixed(4)}, ${upDir[1].toFixed(
                4
            )}, ${upDir[2].toFixed(4)}`;
        }

        if (!enableCache.checked) {
            await volumeRC.lruCache.reset();
        }

        if (isovalueSlider.value != currentIsovalue) {
            recomputeSurface = true;
            currentIsovalue = parseFloat(isovalueSlider.value);
        }

        if (recomputeSurface || !surfaceDone) {
            var eyePos = camera.eyePos();
            var eyeDir = camera.eyeDir();
            var upDir = camera.upDir();

            var start = performance.now();
            surfaceDone = await volumeRC.renderSurface(
                currentIsovalue, 1, upload, recomputeSurface, eyePos, eyeDir, upDir);
            var end = performance.now();

            if (surfaceDone) {
                perfStats.push(
                    {"isovalue": currentIsovalue, "stats": volumeRC.surfacePerfStats});
            }

            averageComputeTime =
                Math.round(volumeRC.totalPassTime / volumeRC.numPasses);
            recomputeSurface = false;

            displayCacheInfo();
            var memUse = volumeRC.reportMemoryUse();
            mcMemDisplay.innerHTML = memUse[0];
            cacheMemDisplay.innerHTML = memUse[1];
            totalMemDisplay.innerHTML = `Total Memory: ${memUse[2]}`;

            if (document.getElementById("outputImages").checked) {
                if (volumeRC.numPasses == 1 || surfaceDone){
                    var filename = dataset.name.replace(/_/g, '').substring(0, 5);
                    if (currentBenchmark) {
                        if (currentBenchmark.name.includes("rotate")) {
                            filename = filename + "_seq" + cameraBenchmark.renderID + "_" + cameraBenchmark.iteration;
                            if (volumeRC.numPasses == 1) {
                                filename += "_001spp";
                            } else {
                                filename += "_ref";
                            }
                        } else {
                            filename += volumeRC.renderID + "_" + String(volumeRC.numPasses).padStart(4,'0');
                        }
                    }
                    else {
                        filename += volumeRC.renderID + "_" + String(volumeRC.numPasses).padStart(4,'0');
                    }
                    await takeScreenshot(
                        device,
                        filename,
                        volumeRC.renderTarget,
                        imageBuffer,
                        document.getElementById('out-canvas'));
                }
            }
            if (document.getElementById("infer").checked && volumeRC.numPasses == 1) {
                var outCanvas = document.getElementById("out-canvas");
                var commandEncoder = device.createCommandEncoder();
                commandEncoder.copyTextureToBuffer({texture: volumeRC.renderTarget},
                                                {buffer: imageBuffer, bytesPerRow: outCanvas.width * 4},
                                                [outCanvas.width, outCanvas.height, 1]);
                device.queue.submit([commandEncoder.finish()]);
                await device.queue.onSubmittedWorkDone();
        
                await imageBuffer.mapAsync(GPUMapMode.READ);
                var imageReadbackArray = new Uint8ClampedArray(imageBuffer.getMappedRange());
                var inputTensor = imageDataToTensor(imageReadbackArray, [1, 3, 1280, 720]);
                // var inputTensor = await getImageTensorFromPath("./big.png", [1, 3, 1280, 720]);
                console.log(inputTensor);
                runModel(session, inputTensor);
                imageBuffer.unmap();
            }
        }
        if (saveScreenshot) {
            saveScreenshot = false;
            await takeScreenshot(device,
                                 `${dataset.name}_prog_iso`,
                                 volumeRC.renderTarget,
                                 imageBuffer,
                                 document.getElementById('out-canvas'));
        }

        // Blit the image rendered by the raycaster onto the screen
        var commandEncoder = device.createCommandEncoder();

        renderPassDesc.colorAttachments[0].view = context.getCurrentTexture().createView();
        var renderPass = commandEncoder.beginRenderPass(renderPassDesc);

        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, renderPipelineBG);
        // Draw a full screen quad
        renderPass.draw(6, 1, 0, 0);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);

        // Measure render time by waiting for the work done
        await device.queue.onSubmittedWorkDone();
        var end = performance.now();
        numFrames += 1;
        totalTimeMS += end - start;
        fpsDisplay.innerHTML = `Avg. FPS ${Math.round((1000.0 * numFrames) / totalTimeMS)}<br/>
            Avg. pass time: ${averageComputeTime}ms<br/>
            Pass # ${volumeRC.numPasses}<br/>
            Speculation Count: ${volumeRC.speculationCount}<br/>
            Total pipeline time: ${Math.round(volumeRC.totalPassTime)}ms`;
    }
})();