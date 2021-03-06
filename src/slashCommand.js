/**
 * implements the high level business logic needed for the slash command to work. 
 * It will delegate some of the business logic to commandParser, googleAPI modules
 */

const processCommand = require('./commandParser')

/**
 * Creates an error attachment based on slack message format
 * @param {String} error  
 */
const createErrorResponse = (error) => ({
    color: 'danger',
    text: `*Error*:\n${error}`,
    mrkdwn_in: ['text']
})

/**
 * Format success message attachement
 * @param {array} result 
 */
const createSuccessResponse = (result) => ({
    color: 'good',
    text: `Distance - ${result.distance} \n Duration - ${result.duration}`,
    mrkdwn_in: ['text']
})

/**
 * This function recieves the content of the request coming from the Slack server 
 * This will use commadParser module to process input and validate it.
 * It will also invoke googleAPI module, manage the response, formatting 
 * into JSON Objects for the Slack. 
 * 
 * @param {method} getDirections 
 * @param {String} slackToken 
 * @param {String} body
 */
const slashCommandFactory = (getDirections, slackToken) => (body) => new Promise((resolve, reject) => {
    const command = processCommand(body)
    console.log(`${command.origin} -> ${command.dest}`)
    if (typeof command.error !== 'undefined') {
        return resolve({
            text: '',
            attachments: [createErrorResponse(command.error)]
        })
    }
    getDirections(command.origin, command.dest)
        .then((result) => {
            if (result.error !== '') {
                return resolve({
                    text: '',
                    attachments: [createErrorResponse(result.error)]
                })
            }
            return resolve({
                text: `Real time traffic from ${command.header.origin} to ${command.header.dest}`,
                attachments: [createSuccessResponse(result)]
            })
        })
})

module.exports = slashCommandFactory