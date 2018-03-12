import { SuiTealiumTracker } from './SuiTealiumTracker'
/**
 * The install.js file will have the ownership of attach listeners to the dom elements that have the tealiumTag
 * data tag.
 * @param {Object} params
 */
module.exports.tealiumTracker = params => new SuiTealiumTracker(params).init()
