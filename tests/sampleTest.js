/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/sampleTest.js
 */
const expect = require('chai').expect;

describe('Sample Test >', () => {
  const ONE = 1;
  const TWO = 2;

  it('Ok, 1 + 1 = 2', (done) => {
    expect(ONE + ONE).to.equal(TWO);
    done();
  });
});
