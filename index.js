const core = require('@actions/core');
const { tryFetch } = require('./lib/try-fetch');

(async function () {
  try {
    let method = core.getInput('method');
    let url = core.getInput('url');
    let headersString = core.getInput('headers');
    let timeout = parseInt(core.getInput('timeout'));
    let interval = parseInt(core.getInput('interval'));
    let expectedStatus = parseInt(core.getInput('expected-status'));
    let expectedResponseField = core.getInput('expected-response-field');
    let expectedResponseValues = core
      .getInput('expected-response-values')
      ?.split(',');
    let errorResponseValues = core
      .getInput('error-response-values')
      ?.split(',');

    core.debug(`=== Waiting for API response to continue. ===`);
    core.debug(`URL: ${url}`);
    core.debug(`Method: ${method}`);
    core.debug(`Headers: ${headersString}`);
    core.debug('# Waiting for this response:');
    core.debug(`HTTP Status: ${expectedStatus}`);

    if (expectedResponseField && expectedResponseValues) {
      core.debug(
        `Response contains field "${expectedResponseField}" with value "${expectedResponseValues}"`
      );
      if (errorResponseValues) {
        core.debug(
          `Response field "${expectedResponseField}" should not have one of the following values: ${errorResponseValues.join(
            ', '
          )}`
        );
      }
    } else if (expectedResponseField) {
      core.debug(`Response contains field "${expectedResponseField}"`);
    }

    core.debug('');
    core.debug('');

    let headers = headersString ? JSON.parse(headersString) : {};
    let start = +new Date();

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

    core.debug('API request was successfull.');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
