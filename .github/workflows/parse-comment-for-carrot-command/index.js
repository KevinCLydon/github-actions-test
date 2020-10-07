const core = require('@actions/core');
const github = require('@actions/github');


try{
    processComment();
} catch(error) {
    core.setFailed(error.message);
}

async function processComment() {
    // Get pull request info
    let pr = github.context.payload["issue"]["pull_request"];
    // If pr doesn't have a value, this isn't a pull request comment, so we'll return
    if(pr === undefined) {
        console.log("Not a PR comment")
        return;
    }
    // Get comment body input
    const commentBody = core.getInput('comment-body');
    // Parse the comment body to get the parameters
    const params = parseComment(commentBody);
    // If params doesn't have a value, the comment is not formatted as a CARROT comment, so return
    if(params === undefined) {
        console.log("Comment is not formatted as a CARROT command comment");
        return;
    }
    // Get the other info we need about the PR via the GitHub API
    console.log(getPRInfo(pr["url"]).await);

    console.log("test");
}

// Parses the comment provided in commentBody and returns an object containing testName,
// testInputKey, and evalInputKey if successful, or undefined if the comment is not in the correct
// format for a CARROT comment
function parseComment(commentBody) {
    // Check if comment body matches the format for a carrot test command
    const re = /^CARROT\([^,\s]+,\s*[^,\s]+,\s*[^,\s]+\)$/;
    let workingCommentBody = commentBody.trim();
    // If it matches, extract the parameters
    if(re.test(workingCommentBody)) {
        // Extract params
        workingCommentBody = workingCommentBody.substring(7, workingCommentBody.length-1);
        const params = workingCommentBody.split(",");
        // If there aren't 3 params, return
        if(params.length != 3) {
            console.log("Comment does not have the correct number of params");
            return;
        }
        // Pull out the specific params
        const testName = params[0].trim();
        const testInputKey = params[1].trim();
        const evalInputKey = params[2].trim();
        // If testName is empty, return
        if(testName.length < 1) {
            console.log("Comment does not have a value for first param: testName");
            return;
        }
        // If we made it this far, return the parsed params object
        return {
            testName,
            testInputKey,
            evalInputKey
        };
    }
    // If it doesn't match, return
    else {
        console.log("Comment doesn't match CARROT command regex");
        return;
    }
}

async function getPRInfo(prUrl) {
    // Parse owner, repo, and pull_number from prURL so we can get the PR info using octokit
    const splitUrl = prUrl.split("/");
    const owner = splitUrl[4];
    const repo = splitUrl[5];
    const pullNumber = splitUrl[7];
    // Create octokit so we can make request
    octokit = getOctokit();
    // If it's undefined, return
    if(octokit === undefined) {
        console.log("Failed to initialize octokit for retrieving PR info");
        return;
    }
    // Get the PR info
    const { data: pullRequest } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
    });

    console.log(pullRequest);
}

// Initializes an octokit using the token supplied in the github-token input.  Returns the created
// octokit if successful or undefined if the token is undefined
function getOctokit() {
    const token = core.getInput("github-token");
    // If token isn't defined, return
    if(token === undefined) {
        console.log("No value set for github-token");
        return;
    }
    // Create octokit
    return github.getOctokit(token);
}