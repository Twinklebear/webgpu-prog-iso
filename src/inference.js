import 'jimp';
import {Tensor, InferenceSession} from "onnxruntime-web/webgpu";
// import * as ort from "onnxruntime-web"; 
var recurrentState = false;

export function cleanRecurrentState() {
    recurrentState = false;
}

export async function runInference(session, preprocessedData, width) {
    // Get start time to calculate inference time.
    // create feeds with the input name from model export and the preprocessed data.
    const feeds = {};
    const architecture = [32, 64, 64, 80];
    feeds[session.inputNames[0]] = preprocessedData;
    for (var i = 0; i < session.inputNames.length - 1; i++) {
        if (recurrentState) {
            feeds[session.inputNames[i + 1]] = recurrentState[i];
        } else {
            var dim = width / 2**i;
            feeds[session.inputNames[session.inputNames.length - i - 1]] = new Tensor("float32", 
                new Float32Array(architecture[i] * dim * dim), 
                [1, architecture[i], dim, dim]
            );
        }
    }
    const start = new Date();  
    const outputData = await session.run(feeds);
    const results = outputData[session.outputNames[0]].data;
    recurrentState = [
        outputData[session.outputNames[3]],
        outputData[session.outputNames[4]],
        outputData[session.outputNames[5]],
        outputData[session.outputNames[6]]
    ];
    const end = new Date();
    const inferenceTime = Math.round(end.getTime() - start.getTime());
  
    return [results, inferenceTime];
}

export async function getImageTensorFromPath(path, dims) {
    // 1. load the image  
    var image = await loadImageFromPath(path, dims[2], dims[3]);
    // 2. convert to tensor
    var imageTensor = imageDataToTensor(image, dims);
    // 3. return the tensor
    return imageTensor;
  }
  
  async function loadImageFromPath(path, width, height) {
    // Use Jimp to load the image and resize it.
    var imageData = await Jimp.read(path).then((imageBuffer) => {
      return imageBuffer.resize(width, height);
    });
  
    return imageData;
  }
  
 export function imageDataToTensor(image, dims) {
    // 1. Get buffer data from image and create R, G, and B arrays.
    // var imageBufferData = image.bitmap.data;
    var imageBufferData = image;
    const [redArray, greenArray, blueArray] = new Array(new Array(), new Array(), new Array());
  
    // 2. Loop through the image buffer and extract the R, G, and B channels
    for (let i = 0; i < imageBufferData.length; i += 4) {
      redArray.push(imageBufferData[i]);
      greenArray.push(imageBufferData[i + 1]);
      blueArray.push(imageBufferData[i + 2]);
      // skip data[i + 3] to filter out the alpha channel
    }
  
    // 3. Concatenate RGB to transpose [224, 224, 3] -> [3, 224, 224] to a number array
    const transposedData = redArray.concat(greenArray).concat(blueArray);
  
    // 4. convert to float32
    let i, l = transposedData.length; // length, we need this for the loop
    // create the Float32Array size 3 * 224 * 224 for these dimensions output
    const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
    for (i = 0; i < l; i++) {
      float32Data[i] = transposedData[i] / 255.0; // convert to float
    }
    // 5. create the tensor object from onnxruntime-web.
    const inputTensor = new Tensor("float32", float32Data, dims);
    return inputTensor;
  }
  
  
  

