var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');


// Get the command line parameters and make sure
// we have all that we need, print an error and exit
// if we don't.
let repoOwner = process.argv[2];
let repoName = process.argv[3];

// Given an URL and a path save that to our
// hard drive.
function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function (err) {
      throw err; 
    })
    .pipe(fs.createWriteStream(filePath)
    );     
}

// Get a repository owner and a repository and get all the
// contributors information from Github.
// Pass that information to our callback function
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

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });  
}

if(repoOwner === undefined || repoName === undefined) {
  console.log("You need to pass both parameters");
} else {

  console.log("repoOwner: ", repoOwner);
  console.log("repoName: ", repoName);

  console.log('Welcome to the GitHub Avatar Downloader!');

  // Loop through the avatars calling a function to download them.
  getRepoContributors(repoOwner, repoName, function(err, result) {     
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      downloadImageByURL( element.avatar_url, 'avatars/' + index + '.jpg');
    }
    console.log('Download complete.');
  }); 
}