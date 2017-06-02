/* eslint-disable */
$(function() {

  function renderResult(recommendations) {
    recommendations.forEach( function(rec) {
      $('#recommendation').html('');
      $('#recommendation').append('<h2>'+rec.beer.name+'<h2>');
      $('#recommendation').append('<p>'+rec.beer.description+'<p>');
      $('#recommendation').append('<p>'+JSON.stringify(rec.parsedFace)+'<p>');
    });
  }

  function uploadImage(dataUri, signedRequest) {
    return fetch(dataUri)
    .then(res => res.blob())
    .then(blob => {
      reqObj = {
        method: 'PUT',
        body: blob,
      };
      return fetch(signedRequest, reqObj);
    });
  }

  Webcam.set('flip_horiz', true);
  Webcam.on('error', function(err) {
    console.log(err);
  } );

  Webcam.attach('#camera_feed');

  function getSuggestion(imageUrl) {
    const body = JSON.stringify({ imageUrl: imageUrl });
    return fetch('/api/suggest', { method: "POST", body })
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        console.log(json);
      });
  }

  function getUploadParameters() {
    return fetch('/api/uploadParameters')
      .then(function(res) {
        return res.text();
      });
  }

  function take_snapshot() {
    Webcam.snap(function(data_uri) {
      document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
      getUploadParameters()
      .then(function(s3params) {
        const signedRequest = JSON.parse(s3params).signedRequest;
        return uploadImage(data_uri, signedRequest);
      })
      .then(function(s3result) {
        var imageUrl = s3result.url.substring(0, s3result.url.indexOf('?'));
        return getSuggestion(imageUrl);
      });
    });
  }

  $('#recommend').click(function() {
    take_snapshot();
  });
});
