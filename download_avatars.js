var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    // ...
    console.log("Great so you want:");
    console.log("Repository owner", repoOwner);
    console.log("And the repositoru:", repoName);

    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': ''
        }
      };

    request(options, function(err, res, body) {
        cb(err, body);
    });  
  }

  // getRepoContributors("jquery", "jquery", function(err, result) {
  getRepoContributors("sebas", "nodefsex", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
  }); 