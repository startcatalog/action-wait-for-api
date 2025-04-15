const fetch = require('node-fetch');
const { getDotted } = require('./get-dotted');
const { log } = require('./log');

async function doFetch({
  url,
  method,
  headers,
  expectedStatus,
  expectedResponseField,
  expectedResponseValues,
  errorResponseValues,
}) {
  log(`Try API request...`);
  let response = await fetch(url, { method, headers });

  if (response.status !== expectedStatus) {
    throw new Error(
      `Wrong status ${response.status}, expected ${expectedStatus}`
    );
  }

  if (!expectedResponseField) {
    return true;
  }

  let json = await response.json();

  let value = getDotted(json, expectedResponseField);
  if (typeof value === 'undefined') {
    throw new Error(`Property "${expectedResponseField}" does not exist`);
  }

  if (!expectedResponseValues) {
    return true;
  }

  let actualStringValue = `${value}`;
  if (!expectedResponseValues.includes(actualStringValue)) {
    const shouldFail = errorResponseValues?.includes(actualStringValue);
    throw new DoFetchError(
      `Property "${expectedResponseField}" is "${actualStringValue}" instead of "${expectedResponseValues.join(
        ', '
      )}"`,
      shouldFail
    );
  }

  return true;
}

class DoFetchError extends Error {
  constructor(message, shouldFail, options) {
    super(message, options);
    this.name = 'DoFetchError';
    this.shouldFail = shouldFail;
  }
}

module.exports = { doFetch };
