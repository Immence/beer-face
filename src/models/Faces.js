import fs from 'fs';
import request from 'request';
import rp from 'request-promise';

export default class Faces {

  static detect(filePath) {
    const uri = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses';
    const options = {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': process.env.MS_COG_API_KEY,
      },
      body: fs.createReadStream(filePath),
    };

    return rp.post(uri, options);
  }
}
