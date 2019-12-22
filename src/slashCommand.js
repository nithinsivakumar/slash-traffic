/**
 * implements the high level business logic needed for the slash command to work. 
 * It will delegate some of the business logic to commandParser, googleAPI modules
 */

const processCommand = require('./commandParser')

/**
 * It reiceves the content of the request coming from the Slack server and 
 * will use commadParser module to process it and validate it.
 * It will also invoke ggogleAPI module and manage the response, formatting 
 * into JSON Objects for the Slack. 
 * 
 * 
 * @param {*} getDirections 
 * @param {*} slackToken 
 */
const slashCommandFactory = (getDirections, slackToken) => (body) => new Promise((resolve, reject) => {
    const command = processCommand(body)
    if (typeof command.error == undefined) {
        return resolve(command.error)
    }
    getDirections(command.origin, command.dest)
        .then((result) => {
            return resolve(result);
        })
})


module.exports = slashCommandFactory
