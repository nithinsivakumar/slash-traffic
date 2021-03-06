/**
 * commandParser take an arbitrary string of text/ 2 strings and
 * extract origin and destination informations for slashcommand to process.
 */

/**
 * implements some validation rule to check if the input 
 * is something that can be used with the googleAPIs to 
 * get distance and traffic.
 * @param {array} input
 * return {String} error
 */
const validateInputCommand = (input) => {
    let error
    if (!input) {
        error = 'Not a valid address to find distance and duration'
        return error
    }
    const size = input.length
    if (size == 0) {
        error = 'No destination provided! Please see the usage by typing /traffic in the message box.'
    } else if (size > 2) {
        error = 'Multiple places found! You can specify atmost two places.'
    }
    return error
}

/**
 * Split the input text into source and destination.
 * A regex that splits string based on single quotes
 * @param {String} text 
 * return {array} result 
 */
const parseInput = (text) => {
    let result
    const regEx = /\'.*?\'/g;
    result = text.match(regEx)
    return result
}

/**
 * Modify the input text into google maps format.
 * @param {array} params 
 * return {array} result
 */
const formatInput = (params) => {
    const spaceRgx = / /g
    const quoteRgx = /'/g
    let formatted = Array
    for (let index = 0; index < params.length; index++) {
        formatted[index] = params[index].replace(quoteRgx, '').replace(spaceRgx, '+');
    }
    return formatted
}

/**
 * Parse the input text for slashcommand module.
 * The origin is by default local address.
 * @param {String} body
 * return {array} result 
 */
const commandParser = (body) => {
    const params = parseInput(body)
    const result = {
        header: '',
        origin: '',
        dest: '',
        error: ''
    }
    const header = {
        origin: '',
        dest: ''
    }
    result.error = validateInputCommand(params)
    if (typeof result.error !== 'undefined') return result
    const size = params.length
    const parsed = formatInput(params)
    if (size == 1) {
        header.origin = 'C3 Metrics'
        header.dest = params[0]
        result.origin = '75+Portsmouth+Blvd+Suite+130+Portsmouth+NH+03801'
        result.dest = parsed[0]
    } else {
        header.origin = params[0]
        header.dest = params[1]
        result.origin = parsed[0]
        result.dest = parsed[1]
    }
    result.header = header
    return result
}

module.exports = commandParser