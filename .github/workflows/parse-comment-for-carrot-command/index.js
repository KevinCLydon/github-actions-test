const core = require('@actions/core');
const github = require('@actions/github');


try{
    console.log("Context: " + github.context.payload);
    // Get pull request info
    let pr = github.context.payload["issue"]["pull_request"];
    console.log(pr);
    // Get comment body input
    const commentBody = core.getInput('comment-body');
    // Check if comment body matches the format for a carrot test command
    const re = /^CARROT\([^,\s]+,\s*[^,\s]+,\s*[^,\s]+\)$/;
    let workingCommentBody = commentBody.trim();
    if(re.test(workingCommentBody)) {
        // Extract params
        workingCommentBody = workingCommentBody.substring(7, workingCommentBody.length-1);
        const params = workingCommentBody.split(",");
        const testName = params[0].trim();
        const testInputKey = params[1].trim();
        const evalInputKey = params[2].trim();
        // 

    }
} catch(error) {
    core.setFailed(error.message);
}
