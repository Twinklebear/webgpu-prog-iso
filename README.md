# WebGPU Progressive Raycasting with ML Infill
This repo expands https://github.com/Twinklebear/webgpu-prog-iso with multiple optimizations including first pass speculation, 
starting with speculation using larger framebuffers, and ML infill using onnxruntime-web.

## Getting Started

After cloning the repo run

```
npm install
npm run build
```

Then move the files in "ml-models" along with the "ort-wasm-simd*" files into the built dist/ folder. Then create a folder
"models/bcmc-data" in dist/ and populate with the zfp compressed datasets. 

You can then serve the application from the dist folder using 
```
python -m http.server
```
