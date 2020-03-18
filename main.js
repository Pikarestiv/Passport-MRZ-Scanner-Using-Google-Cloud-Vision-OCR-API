const express = require('express');
const app = express();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient(
  {
    keyFilename: './APIKey.json'
  }
);
const parse = require('mrz').parse;


async function quickstart() {
    //Google Cloud Vision Text Annotator (OCR)
    let sample1 = './samples/Passport1.png';
    let sample2 = './samples/Passport2.jpg';
    
    //Extracting the mrz and preparing it for decoding
    const [result] = await client.textDetection(sample2);
    const texts = result.textAnnotations;
    let mainResult = texts[0].description;
    let mrzStartPosition = mainResult.indexOf("P<");
    let mrzText = mainResult.slice(mrzStartPosition);
    let textss = mrzText.replace( /\s/g, "");
    let line1  = textss.substring(0, 44);
    let line2  = textss.substring(44, 88);
    let mrzToDecode = `${line1}\n${line2}`;


    //MRZ Parser from https://www.npmjs.com/package/mrz  
    let passportDetails = parse(mrzToDecode);
    console.log(passportDetails);
}

  try {
    quickstart();
  } 
  catch (e) {
    console.error(e);
  }

app.listen(5000, '127.0.0.1', ()=> console.log('Server Running Okay...'));
