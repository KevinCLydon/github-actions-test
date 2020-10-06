const core = require('@actions/core');
const github = require('@actions/github');


try{
    // Get comment body input
    const commentBody = core.getInput('comment-body');
    // Check if comment body matches the format for a carrot test command
    const re = /^CARROT\([^,\s]+,\s*[^,\s]+(,\s*\{[\s\S]*\}\s*)?\)$/;
    let workingCommentBody = commentBody.trim();
    if(re.test(workingCommentBody)) {
        // Extract params
        workingCommentBody = workingCommentBody.substring(7, workingCommentBody.length-1);
        const params = splitParams(workingCommentBody);
        // Set outputs
        core.setOutput("test-name", params[0]);
        core.setOutput("email", params[1]);
        if(params.length > 2){
            core.setOutput("test-inputs", params[2]);
        }
        else{
            core.setOutput("test-inputs", "{}");
        }
        if(params.length > 3){
            core.setOutput("eval-inputs", params[3]);
        }
        else{
            core.setOutput("eval-inputs", "{}");
        }
    }
    // If it doesn't match, exit
    else {
        
    }
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

} catch(error) {
    core.setFailed(error.message);
}

// Splits the paramString into an array of params based on comma-separation within the string,
// but keeping json objects intact
function splitParams(paramString) {
    let params = []; // For tracking params as we process them
    let currentParam = ""; // For assembling the current param
    let braceDepth = 0; // For keeping track of how many braces deep we are in an object
    for(let i = 0; i < paramString.length; i++) {
        if(braceDepth == 0 && paramString[i] == ','){
            params.push(currentParam);
            currentParam = "";
        }
        else{
            if(paramString[i] == '{') {
                braceDepth++;
            }
            else if(paramString[i] == '}'){
                braceDepth--;
            }
            currentParam += paramString[i];
        }
    }
    // Add last param to list of params
    params.push(currentParam);

    return params;
}