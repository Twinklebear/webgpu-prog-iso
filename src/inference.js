import 'jimp';
import ndarray from "ndarray";
import ops from "ndarray-ops";
import {Tensor, InferenceSession} from "onnxruntime-web/webgpu";
// import * as ort from "onnxruntime-web"; 

export async function runModel(session, preprocessedData) {
  console.log(session);
  // Run inference and get results.
  var [results, inferenceTime] =  await runInference(session, preprocessedData);
  console.log("inference time", inferenceTime);
  const dataFromImage = ndarray(new Float32Array(1280 * 720 * 4), [
    1280,
    720,
    4,
  ]);
  const dataProcessed = ndarray(new Float32Array(results), [
    1,
    3,
    1280,
    720,
  ]);
  ops.assign(
    dataFromImage.pick(null, null, 0),
    dataProcessed.pick(0, 0, null, null)
  );
  ops.assign(
    dataFromImage.pick(null, null, 1),
    dataProcessed.pick(0, 1, null, null)
  );
  ops.assign(
    dataFromImage.pick(null, null, 2),
    dataProcessed.pick(0, 2, null, null)
  );
  let dataForImage = dataFromImage.data;
  for (let y = 0; y < 720; y++) {
    for (let x = 0; x < 1280; x++) {
      let pos = (y * 1280 + x) * 4; // position in buffer based on x and y
      dataForImage[pos] *= 255;
      dataForImage[pos + 1] *= 255;
      dataForImage[pos + 2] *= 255;
      dataForImage[pos + 3] = 255; // set alpha channel
    }
  }
  let canvas = document.getElementById("test-canvas");

  let ctx = canvas.getContext("2d");

  // create imageData object
  let idata = ctx.createImageData(1280, 720);

  // set our buffer as source
  idata.data.set(dataForImage);
  // update canvas with new data
  ctx.putImageData(idata, 0, 0);
//   console.log(dataForImage);
//   return [results, inferenceTime];
}

async function runInference(session, preprocessedData) {
  // Get start time to calculate inference time.
  const start = new Date();
  // create feeds with the input name from model export and the preprocessed data.
  const feeds = {};
  feeds[session.inputNames[0]] = preprocessedData;
//   for (var i = 1; i < session.inputNames.length; i++) {
//     feeds[session.inputNames[i]] = new Tensor("float32", []);
//   }
  
  // Run the session inference.
  const outputData = await session.run(feeds);
  console.log(outputData);
  const results = outputData[session.outputNames[0]].data;
  // Get the end time to calculate inference time.
  const end = new Date();
  // Convert to seconds.
  const inferenceTime = (end.getTime() - start.getTime())/1000;
  // Get output results with the output name from the model export.
  
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
  
  
  

