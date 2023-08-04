# WebGPU Speculative Progressive Isosurface Raycaster

This is the implementation of the GPU-parallel speculative, progressive
implicit isosurface raycasting algorithm for
block-compressed data sets described in "" by Will Usher, Landon Dyken, and Sidharth Kumar
at LDAV 2023. Please see the paper (link soon!) for more details.

## Usage

- [Skull](https://www.willusher.io/webgpu-prog-iso/) (256^3, issues on macOS)
- [Magnetic Reconnection](https://www.willusher.io/webgpu-prog-iso/#magnetic) (512^3, ok on macOS)
- [Chameleon](https://www.willusher.io/webgpu-prog-iso/#chameleon) (1024x1024x1080, issues on macOS)

The data sets are available on the [Open SciVis Data Sets page](https://klacansky.com/open-scivis-datasets/).

## Images


![skull_256x256x256_uint8 raw crate2_prog_iso](https://github.com/Twinklebear/webgpu-prog-iso/assets/1522476/831200d8-201a-479c-b2b4-b1124ef8c43a)

![chameleon_1024x1024x1080_uint16 raw crate2_prog_iso](https://github.com/Twinklebear/webgpu-prog-iso/assets/1522476/f1d7b80b-c170-43c4-8c61-6257295a5240)
