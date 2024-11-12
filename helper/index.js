const _ = require('lodash');
const sanitizeFilename = require('sanitize-filename');

function camelCase(string) {
  return _.camelCase(string);
}

function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function kebabCase(string) {
  return _.kebabCase(string);
}

function capitalize(string) {
  return _.capitalize(string);
}

function oneLine(string) {
  return string.replace(/\n/g, ' ').trim();
}

function convertToFilename(string, options = { replacement: '-', maxLength: 255 }) {
  let sanitizedString = sanitizeFilename(string);

  sanitizedString = sanitizedString.replace(/[\s]+/g, options.replacement);

  if (sanitizedString.length > options.maxLength) {
    sanitizedString = sanitizedString.slice(0, options.maxLength);
  }

  return sanitizedString;
}

module.exports = {
  camelCase,
  pascalCase,
  kebabCase,
  capitalize,
  oneLine,
  convertToFilename
};