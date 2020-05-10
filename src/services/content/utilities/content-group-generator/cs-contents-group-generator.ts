import {Content} from '../../../../models/content';
import {CsContentSortCriteria, CsSortOrder} from '../../interface';

export interface CsContentGroupingCriteria {
    groupAttribute: string;
    values: string[];
    sortCriteria?: CsContentSortCriteria;
    meta?: {
        combination: {
            of: keyof Content,
            with: keyof Content
        }
    };
}

interface CsContentsGrouped {
    attribute: string;
    name: string;
    groups?: CsContentsGrouped[];
    contents?: Content[];
    meta?: {
        combination: {
            string: {
                string: boolean;
            }
        }
    };
}

export class CsContentsGroupGenerator {
    static generate(
        contents: Content[], criteria: CsContentGroupingCriteria[], contentSortCriteria?: CsContentSortCriteria
    ): CsContentsGrouped[] | undefined {
        criteria = [...criteria];
        const currentGroupCriteria = criteria.shift();

        if (!currentGroupCriteria) {
            return undefined;
        }

        const currentGroupCriteriaValues = [...currentGroupCriteria.values];

        if (!currentGroupCriteriaValues.length) {
            contents.forEach((content) => {
                if (CsContentsGroupGenerator.isMultiValueAttribute(content, currentGroupCriteria.groupAttribute)) {
                    (content[currentGroupCriteria.groupAttribute] as string[]).forEach((attr) => {
                        CsContentsGroupGenerator.uniquelyAddValue(currentGroupCriteriaValues, attr);
                    });
                }

                CsContentsGroupGenerator.uniquelyAddValue(currentGroupCriteriaValues, content[currentGroupCriteria.groupAttribute]);
            });
        }

        const groups = currentGroupCriteriaValues.reduce<CsContentsGrouped[]>((acc: CsContentsGrouped[], acceptedValue: string) => {
            const newContentSlice = CsContentsGroupGenerator.filterContents(contents, currentGroupCriteria.groupAttribute, acceptedValue);

            if (!newContentSlice.length) {
                return acc;
            }

            acc.push({
                attribute: currentGroupCriteria.groupAttribute,
                name: acceptedValue,
                contents: (() => {
                    if (!criteria.length) {
                        if (contentSortCriteria) {
                            CsContentsGroupGenerator.sortItems(newContentSlice, contentSortCriteria);
                            return newContentSlice;
                        }

                        return newContentSlice;
                    }
                })(),
                groups: CsContentsGroupGenerator.generate(newContentSlice, criteria, contentSortCriteria),
                meta: currentGroupCriteria.meta ?
                    {combination: CsContentsGroupGenerator.generateCombinations(newContentSlice, currentGroupCriteria.meta.combination)} :
                    undefined
            } as CsContentsGrouped);

            return acc;
        }, []);

        if (currentGroupCriteria.sortCriteria) {
            CsContentsGroupGenerator.sortItems(groups, currentGroupCriteria.sortCriteria);
        }

        return groups;
    }

    static filterContents(contents: Content[], attribute: string, acceptedValue: string): Content[] {
        return contents.filter((content) => {
            if (CsContentsGroupGenerator.isMultiValueAttribute(content, attribute)) {
                return content[attribute].map((c) => (c || '').toLowerCase()).includes((acceptedValue || '').toLowerCase());
            } else {
                return (acceptedValue || '').toLowerCase() === (content[attribute] || '').toLowerCase();
            }
        });
    }

    static isMultiValueAttribute = (content, attr) => Array.isArray(content[attr]);

    static uniquelyAddValue = (list: any[], value: any) => !(list.indexOf(value) >= 0) && list.push(value);

    static sortItems<T>(items: T[], sortCriteria: CsContentSortCriteria): void {
        items.sort((a, b) => {
            if (!a[sortCriteria.sortAttribute] || !b[sortCriteria.sortAttribute]) {
                return 0;
            }
            const comparison = String(a[sortCriteria.sortAttribute]).localeCompare(b[sortCriteria.sortAttribute]);

            return sortCriteria.sortOrder === CsSortOrder.ASC ? comparison : (comparison * -1);
        });
    }

    static generateCombinations(
        contents: Content[], combination: { of: keyof Content, with: keyof Content },
    ): { [key: string]: { [key: string]: boolean } } {
        return contents.reduce<{ [key: string]: { [key: string]: boolean } }>((acc, content) => {
            const addToCombinations = (combinationOf) => {
                if (!acc[content[combinationOf]]) {
                    acc[content[combinationOf]] = {};
                }

                if (CsContentsGroupGenerator.isMultiValueAttribute(content, combination.with)) {
                    content[combination.with].forEach((v) => {
                        acc[content[combinationOf]][v] = true;
                    });
                } else {
                    acc[content[combinationOf]][content[combination.with]] = true;
                }
            };

            if (CsContentsGroupGenerator.isMultiValueAttribute(content, combination.of)) {
                content[combination.of].forEach(addToCombinations);
            } else {
                addToCombinations(combination.of);
            }

            return acc;
        }, {});
    }
}
