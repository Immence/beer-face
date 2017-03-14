import request from 'request-promise';

export default class Faces {

  static detect(url) {
    const options = {
      method: 'POST',
      uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses',
      body: { url },
      headers: {
        'content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MS_COG_API_KEY,
      },
      json: true,
    };

    return request(options)
      .then((parsedBody) => {
        console.log(parsedBody);
        return parsedBody;
      });
  }
}
