import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calcDuration } from '../src/lib/utils.ts';

const FALLBACK = 'Duration unavailable';
const AUG_2024 = new Date(2024, 7, 15);

describe('calcDuration separators', () => {
  it('accepts em dash, en dash, and ASCII hyphen', () => {
    assert.equal(calcDuration('May 2023 \u2014 Aug 2023'), '3 mos');
    assert.equal(calcDuration('May 2023 \u2013 Aug 2023'), '3 mos');
    assert.equal(calcDuration('May 2023 - Aug 2023'), '3 mos');
  });

  it('accepts separators without surrounding spaces', () => {
    assert.equal(calcDuration('May 2023\u2014Aug 2023'), '3 mos');
    assert.equal(calcDuration('May 2023-Aug 2023'), '3 mos');
  });
});

describe('calcDuration fixed ranges', () => {
  it('formats months, years, and both units', () => {
    assert.equal(calcDuration('May 2023 \u2014 Aug 2023'), '3 mos');
    assert.equal(calcDuration('May 2023 \u2014 Jun 2023'), '1 mo');
    assert.equal(calcDuration('Aug 2023 \u2014 Aug 2024'), '1 yr');
    assert.equal(calcDuration('Aug 2023 \u2014 Aug 2025'), '2 yrs');
    assert.equal(calcDuration('Aug 2023 \u2014 Sep 2024'), '1 yr 1 mo');
    assert.equal(calcDuration('Aug 2023 \u2014 Sep 2025'), '2 yrs 1 mo');
  });

  it('clamps a valid same-month range to one month', () => {
    assert.equal(calcDuration('May 2023 \u2014 May 2023'), '1 mo');
  });
});

describe('calcDuration Present', () => {
  it('matches Present case-insensitively against the provided clock', () => {
    assert.equal(calcDuration('Aug 2023 \u2014 Present', AUG_2024), '1 yr');
    assert.equal(calcDuration('Aug 2023 \u2014 present', AUG_2024), '1 yr');
    assert.equal(calcDuration('Aug 2023 \u2014 PRESENT', AUG_2024), '1 yr');
  });

  it('computes Present with all three separators', () => {
    assert.equal(calcDuration('May 2023 \u2014 Present', AUG_2024), '1 yr 3 mos');
    assert.equal(calcDuration('May 2023 \u2013 Present', AUG_2024), '1 yr 3 mos');
    assert.equal(calcDuration('May 2023 - Present', AUG_2024), '1 yr 3 mos');
  });

  it('rejects an invalid clock instead of producing NaN', () => {
    assert.equal(
      calcDuration('Aug 2023 \u2014 Present', new Date('not a date')),
      FALLBACK
    );
  });

  it('rejects a start date in the future', () => {
    assert.equal(calcDuration('Jan 2025 \u2014 Present', AUG_2024), FALLBACK);
  });
});

describe('calcDuration malformed periods', () => {
  it('returns the fallback for empty input', () => {
    assert.equal(calcDuration(''), FALLBACK);
    assert.equal(calcDuration('   '), FALLBACK);
  });

  it('does not treat a missing or empty end token as Present', () => {
    assert.equal(calcDuration('May 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 \u2014'), FALLBACK);
    assert.equal(calcDuration('May 2023 -'), FALLBACK);
    assert.equal(calcDuration('\u2014 Aug 2023'), FALLBACK);
  });

  it('returns the fallback for extra or unsupported separators', () => {
    assert.equal(calcDuration('May 2023 \u2014 Aug 2023 \u2014 Sep 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 \u2014 \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 - - Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 / Aug 2023'), FALLBACK);
  });

  it('returns the fallback for unknown months', () => {
    assert.equal(calcDuration('Foo 2023 \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 \u2014 Foo 2023'), FALLBACK);
    assert.equal(calcDuration('September 2023 \u2014 Aug 2024'), FALLBACK);
  });

  it('returns the fallback for out-of-range or non-numeric years', () => {
    assert.equal(calcDuration('May 0000 \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 99 \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 1899 \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 \u2014 Aug 12345'), FALLBACK);
    assert.equal(calcDuration('May abc \u2014 Aug 2023'), FALLBACK);
    assert.equal(calcDuration('May 2023 \u2014 Aug nope'), FALLBACK);
  });

  it('returns the fallback for reversed ranges instead of one month', () => {
    assert.equal(calcDuration('Aug 2023 \u2014 May 2023'), FALLBACK);
    assert.equal(calcDuration('Aug 2024 \u2014 Aug 2023'), FALLBACK);
  });

  it('rejects non-string input without throwing', () => {
    for (const value of [null, undefined, 123, true, {}, [], new Date()]) {
      assert.equal(calcDuration(value), FALLBACK);
    }
  });
});
