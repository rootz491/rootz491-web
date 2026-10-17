import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  FAVORITES_KEY,
  SORT_KEY,
  VIEW_KEY,
  parseFavorites,
  parseSort,
  parseView,
  readPref,
  toggleFavorite,
  writePref,
} from '../src/lib/toolPrefs.ts';

describe('pref keys', () => {
  it('exposes the storage keys', () => {
    assert.equal(VIEW_KEY, 'rz-tools:view');
    assert.equal(SORT_KEY, 'rz-tools:sort');
    assert.equal(FAVORITES_KEY, 'rz-tools:favorites');
  });
});

describe('parseView', () => {
  it('defaults to grid', () => {
    assert.equal(parseView(null), 'grid');
    assert.equal(parseView('grid'), 'grid');
    assert.equal(parseView('list'), 'list');
  });

  it('falls back to grid for anything else', () => {
    assert.equal(parseView(''), 'grid');
    assert.equal(parseView('LIST'), 'grid');
    assert.equal(parseView('table'), 'grid');
  });
});

describe('parseSort', () => {
  it('parses known values', () => {
    assert.equal(parseSort(null), 'default');
    assert.equal(parseSort('default'), 'default');
    assert.equal(parseSort('name'), 'name');
  });

  it('falls back to default for anything else', () => {
    assert.equal(parseSort(''), 'default');
    assert.equal(parseSort('NAME'), 'default');
    assert.equal(parseSort('date'), 'default');
  });
});

describe('parseFavorites', () => {
  it('parses a JSON array of strings', () => {
    assert.deepEqual(parseFavorites('["json","base64"]'), ['json', 'base64']);
  });

  it('dedupes while preserving order', () => {
    assert.deepEqual(parseFavorites('["a","b","a","b"]'), ['a', 'b']);
  });

  it('drops non-string entries', () => {
    assert.deepEqual(parseFavorites('["a",1,null,"b"]'), ['a', 'b']);
  });

  it('returns [] for malformed or non-array JSON', () => {
    assert.deepEqual(parseFavorites(null), []);
    assert.deepEqual(parseFavorites('not json'), []);
    assert.deepEqual(parseFavorites('{"a":1}'), []);
    assert.deepEqual(parseFavorites('"json"'), []);
  });

  it('filters to validSlugs when provided', () => {
    assert.deepEqual(parseFavorites('["a","zzz","b"]', ['a', 'b']), ['a', 'b']);
    assert.deepEqual(parseFavorites('["zzz"]', ['a']), []);
  });
});

describe('toggleFavorite', () => {
  it('adds when missing', () => {
    assert.deepEqual(toggleFavorite(['a'], 'b'), ['a', 'b']);
  });

  it('removes when present', () => {
    assert.deepEqual(toggleFavorite(['a', 'b'], 'a'), ['b']);
  });

  it('does not mutate the input list', () => {
    const list = ['a'];
    const next = toggleFavorite(list, 'b');
    assert.deepEqual(list, ['a']);
    assert.notEqual(next, list);
  });
});

describe('readPref / writePref without window', () => {
  it('readPref returns null', () => {
    assert.equal(typeof window, 'undefined');
    assert.equal(readPref(VIEW_KEY), null);
  });

  it('writePref is a safe no-op', () => {
    assert.doesNotThrow(() => writePref(VIEW_KEY, 'list'));
  });
});
