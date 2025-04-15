const { doFetch, DoFetchError } = require('./do-fetch');
const core = require('@actions/core');

async function tryFetch({
  start = +new Date(),
  interval,
  timeout,
  url,
  method,
  headers,
  expectedStatus,
  expectedResponseField,
  expectedResponseValues,
  errorResponseValues,
}) {
  try {
    await doFetch({
      url,
      method,
      headers,
      expectedStatus,
      expectedResponseField,
      expectedResponseValues,
      errorResponseValues,
    });
  } catch (error) {
    core.debug(`API request failed with ${error}`);

    if (error instanceof DoFetchError && error.shouldFail) {
      throw new Error('API returned an error value.');
    }

    // Wait and then continue
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));

    if (+new Date() - start > timeout * 1000) {
      throw new Error(`Timeout after ${timeout} seconds.`);
    }

    await tryFetch({
      start,
      interval,
      timeout,
      url,
      method,
      headers,
      expectedStatus,
      expectedResponseField,
      expectedResponseValues,
      errorResponseValues,
    });
  }
}

module.exports = { tryFetch };
