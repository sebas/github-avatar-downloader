const request = require('request'),
  fs = require('fs');

require('dotenv').config();

const { GITHUB_TOKEN } = process.env;

// Get the command line parameters and make sure
// we have all that we need, print an error and exit
// if we don't.
const repoOwner = process.argv[2];
const repoName = process.argv[3];

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
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });  
}

if(repoOwner === undefined || repoName === undefined) {
  console.log("You need to pass both parameters");
  process.exit();
}

console.log('Welcome to the GitHub Avatar Downloader!');

// Loop through the avatars calling a function to download them.
getRepoContributors(repoOwner, repoName, function(err, results) {     
  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    downloadImageByURL( result.avatar_url, 'avatars/' + index + '.jpg');
  }
  console.log('Download complete.');
});