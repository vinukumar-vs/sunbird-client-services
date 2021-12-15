import {Aggregator} from './aggregator';

describe('Aggregator', () => {
  describe('groupByIntoMap()', () => {
    it('should be able to group a list into a map based on a fixed key', () => {
      const sample = [
        {a: 1, b: 2, c: 3},
        {a: 1, b: 20, c: 30},
        {a: 4, b: 5, c: 6},
        {a: 4, b: 50, c: 60},
        {a: 7, b: 8, c: 9},
        {a: 7, b: 80, c: 90},
      ];

      expect(Aggregator.groupByIntoMap(sample, 'a')).toEqual({
        '1': [{a: 1, b: 2, c: 3}, {a: 1, b: 20, c: 30}],
        '4': [{a: 4, b: 5, c: 6}, {a: 4, b: 50, c: 60}],
        '7': [{a: 7, b: 8, c: 9}, {a: 7, b: 80, c: 90}],
      });
    });

    it('should be able to group a list into a map based on a deep key', () => {
      const sample = [
        {nested: {a: 1, b: 2, c: 3}},
        {nested: {a: 1, b: 20, c: 30}},
        {nested: {a: 4, b: 5, c: 6}},
        {nested: {a: 4, b: 50, c: 60}},
        {nested: {a: 7, b: 8, c: 9}},
        {nested: {a: 7, b: 80, c: 90}},
      ];

      expect(Aggregator.groupByIntoMap(sample, 'nested.a')).toEqual({
        '1': [{nested: {a: 1, b: 2, c: 3}}, {nested: {a: 1, b: 20, c: 30}}],
        '4': [{nested: {a: 4, b: 5, c: 6}}, {nested: {a: 4, b: 50, c: 60}}],
        '7': [{nested: {a: 7, b: 8, c: 9}}, {nested: {a: 7, b: 80, c: 90}}],
      });
    });
  });

  describe('groupByIntoPairList()', () => {
    it('should be able to group a list into a pair list based on a fixed key', () => {
      const sample = [
        {a: 1, b: 2, c: 3},
        {a: 1, b: 20, c: 30},
        {a: 4, b: 5, c: 6},
        {a: 4, b: 50, c: 60},
        {a: 7, b: 8, c: 9},
        {a: 7, b: 80, c: 90},
      ];

      expect(Aggregator.groupByIntoPairList(sample, 'a')).toEqual([
        ['1', [{a: 1, b: 2, c: 3}, {a: 1, b: 20, c: 30}]],
        ['4', [{a: 4, b: 5, c: 6}, {a: 4, b: 50, c: 60}]],
        ['7', [{a: 7, b: 8, c: 9}, {a: 7, b: 80, c: 90}]],
      ]);
    });

    it('should be able to group a list into a map based on a deep key', () => {
      const sample = [
        {nested: {a: 1, b: 2, c: 3}},
        {nested: {a: 1, b: 20, c: 30}},
        {nested: {a: 4, b: 5, c: 6}},
        {nested: {a: 4, b: 50, c: 60}},
        {nested: {a: 7, b: 8, c: 9}},
        {nested: {a: 7, b: 80, c: 90}},
      ];

      expect(Aggregator.groupByIntoPairList(sample, 'nested.a')).toEqual([
        ['1', [{nested: {a: 1, b: 2, c: 3}}, {nested: {a: 1, b: 20, c: 30}}]],
        ['4', [{nested: {a: 4, b: 5, c: 6}}, {nested: {a: 4, b: 50, c: 60}}]],
        ['7', [{nested: {a: 7, b: 8, c: 9}}, {nested: {a: 7, b: 80, c: 90}}]],
      ]);
    });
  });

  describe('sorted()', () => {
    it('should be able to sort list with single fixed key', () => {
      const sample = [
        {a: 'Sample', b: 80, c: 90},
        {a: 'Sample', b: 50, c: 60},
        {a: 'Sample', b: 2, c: 3},
        {a: 'Sample', b: 5, c: 6},
        {a: 'Sample', b: 20, c: 30},
        {a: 'Sample', b: 8, c: 9},
      ];

      expect(Aggregator.sorted(sample, [{'a': 'desc'}])).toEqual([
        expect.objectContaining({a: 'Sample'}),
        expect.objectContaining({a: 'Sample'}),
        expect.objectContaining({a: 'Sample'}),
        expect.objectContaining({a: 'Sample'}),
        expect.objectContaining({a: 'Sample'}),
        expect.objectContaining({a: 'Sample'}),
      ]);
    });

    it('should be able to sort list with multiple fixed keys and/or preferences', () => {
      const sample = [
        {a: 'Sample', b: 80, c: 30}
      ];

      expect(Aggregator.sorted(sample, [{'a': 'desc'}, {'b': 'desc'}, {'c': { order: 'asc', preference: [90, 60, 30] }}])).toEqual([
        expect.objectContaining({a: 'Sample', b: 80, c: 30})
      ]);

      expect(Aggregator.sorted(sample, [{'a': 'desc'}, {'b': { order: 'asc', preference: [20] }}])).toEqual([
        expect.objectContaining({a: 'Sample', b: 80, c: 30})
      ]);
    });

    it('should be able to sort list with multiple fixed keys', () => {
      const sample = [
        {a: 'Sample', b: 80, c: 90}
      ];

      expect(Aggregator.sorted(sample, [{'a': 'desc'}, {'b': 'desc'}])).toEqual([
        expect.objectContaining({a: 'Sample', b: 80, c: 90})
      ]);

      expect(Aggregator.sorted(sample, [{'a': 'desc'}, {'b': 'asc'}])).toEqual([
        expect.objectContaining({a: 'Sample', b: 80, c: 90})
      ]);
    });

    it('should be able to sort list with single deep key', () => {
      const sample = [
        {nested: {a: 7, b: 80, c: 90}}
      ];

      expect(Aggregator.sorted(sample, [{'nested.a': 'desc'}])).toEqual([
        {nested: expect.objectContaining({a: 7})}
      ]);
    });

    it('should be able to sort list with multiple deep keys', () => {
      const sample = [
        {nested: {a: 7, b: 80, c: 90}}];

      expect(Aggregator.sorted(sample, [{'nested.a': 'desc'}, {'nested.b': 'desc'}])).toEqual([
        {nested: expect.objectContaining({a: 7, b: 80})}
      ]);

      expect(Aggregator.sorted(sample, [{'nested.a': 'desc'}, {'nested.b': 'asc'}])).toEqual([
        {nested: expect.objectContaining({a: 7, b: 80, c: 90})}
      ]);
    });

    describe('when comparator is used', () => {
      it('should be able to sort list with custom comparator instead of default string compare', () => {
        const sample = [
          {a: 'Thu Aug 27 2020 17:05:06 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:04:04 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:01:02 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:03:01 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:02:03 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:06:05 GMT+0530 (India Standard Time)'},
        ];

        expect(Aggregator.sorted(sample, [{'a': 'desc'}], (a, b) => {
          return (new Date(a)).getSeconds() - (new Date(b)).getSeconds();
        })).toEqual([
          {a: 'Thu Aug 27 2020 17:05:06 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:06:05 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:04:04 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:02:03 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:01:02 GMT+0530 (India Standard Time)'},
          {a: 'Thu Aug 27 2020 17:03:01 GMT+0530 (India Standard Time)'},
        ]);
      });
    });
  });
});
