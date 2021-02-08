export class Aggregator {
  public static groupByIntoMap<T>(list: T[], field: keyof T | string): { [key: string]: T[] } {
    return list.reduce(
      (result, item) => {
        const fieldVal = String(Aggregator.deepGet(item, String(field).split('.')));
        return ({
          ...result,
          [fieldVal]: [
            ...(result[fieldVal] || []),
            item,
          ],
        });
      },
      {},
    );
  }

  public static groupByIntoPairList<T>(list: T[], field: keyof T | string): [string, T[]][] {
    const asMap = Aggregator.groupByIntoMap(list, field);
    return Object.keys(asMap).map((key) => {
      return [key, asMap[key]] as [string, any[]];
    });
  }

  public static sorted<T>(list: T[], sort: { [key: string]: 'asc' | 'desc' }[], comparator?: (a, b) => number): T[] {
    return list.sort((a, b) => {
      let comparison = 0;

      for (const sortBy of sort) {
        if (comparison !== 0) {
          break;
        }

        for (const key in sortBy) {
          if (!(key in sortBy)) {
            continue;
          }

          const aKeyValue = Aggregator.deepGet(a, key.split('.'));
          const bKeyValue = Aggregator.deepGet(b, key.split('.'));

          comparison = comparator ? comparator(aKeyValue, bKeyValue) : String(aKeyValue).localeCompare(bKeyValue);
          comparison = sortBy[key] === 'asc' ? comparison : -comparison;
        }
      }

      return comparison;
    });
  }

  private static deepGet = (obj, props) => props.reduce((agg, prop) => (agg && agg[prop]) ? agg[prop] : null, obj);
}
