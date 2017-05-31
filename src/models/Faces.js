import rp from 'request-promise';

export default class Faces {

  static detect(imageUrl) {
    const uri = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses';
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MS_COG_API_KEY,
      },
      body: JSON.stringify({ url: imageUrl }),
    };

    return rp.post(uri, options);
  }
}
