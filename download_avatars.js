var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');

let repoOwner = process.argv[2];
let repoName = process.argv[3];

if(repoOwner === undefined || repoName === undefined) {
    console.log("You need to pass both parameters");
} else {

console.log("repoOwner: ", repoOwner);
console.log("repoName: ", repoName);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    console.log("Great so you want:");
    console.log("   Repository owner: ", repoOwner);
    console.log("   And the repository: ", repoName);

    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': 'token ' + secrets.GITHUB_TOKEN
        }
      };

    // console.log("opt ", options);

    request(options, function(err, res, body) {
        console.log("body: ", body);      
        console.log("err: ", err);
        cb(err, JSON.parse(body));
    });  
  }

  // getRepoContributors("jquery", "jquery", function(err, result) {
  // getRepoContributors("sebas", "nodefsex", function(err, result) {
    getRepoContributors(repoOwner, repoName, function(err, result) {     
    console.log("Errors:", err);
    console.log("Result:", result);
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log("The avatar URL", element.avatar_url);
        downloadImageByURL( element.avatar_url, 'avatars/' + index + '.jpg');
    }
  }); 

  function downloadImageByURL(url, filePath) {
    console.log('Downloading image...');

    request.get(url)
        .on('error', function (err) {
            throw err; 
        })
        .on('response', function (response) {
            console.log('Response Status Code: ', response.statusCode);
        })
        .on('end', function (response) {
            console.log('Download complete.');
        })
        .pipe(fs.createWriteStream(filePath)
        );     
  }

}