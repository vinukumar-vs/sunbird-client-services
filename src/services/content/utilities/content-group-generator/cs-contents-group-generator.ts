import {Content} from '../../../../models';
import {
    CsContentFilterCriteria,
    CsContentSortCriteria,
    CsFilterCriteria,
    CsSortCriteria
} from '../../interface';
import {Aggregator} from '../../../../utilities/aggregator';

export interface CsContentSection {
    name: string;
    combination?: {
        [key in keyof Content]?: string
    };
    sections: CsContentGroup[];
}

export interface CsContentGroup {
    count?: number;
    name?: string;
    contents?: Content[];
    targetedContents?: Content[];
}

export interface CsContentGroupSortCriteria extends CsSortCriteria<CsContentGroup> {}
export interface CsContentGroupFilterCriteria extends CsFilterCriteria<CsContentGroup> {}

export class CsContentsGroupGenerator {
    static generate(config: {
        prioritiseTargetedContents?: {
            categories: (keyof Content)[],
            sourceFramework: Partial<{ [key in keyof Content]: string[] | string | undefined}>,
        },
        includeSearchable?: boolean
        contents: Content[],
        groupBy: keyof Content,
        sortBy?: CsContentSortCriteria | CsContentSortCriteria[],
        filterBy?: CsContentFilterCriteria | CsContentFilterCriteria[],
        groupSortBy?: CsContentGroupSortCriteria | CsContentGroupSortCriteria[],
        groupFilterBy?: CsContentGroupFilterCriteria | CsContentGroupFilterCriteria[],
        combination?: Partial<{
            [key in keyof Content]?: string[]
        }>
    }): CsContentSection {
        let {contents} = config;
        const {
            groupBy,
            groupSortBy = [],
            groupFilterBy = [],
            sortBy = [],
            filterBy = [],
            combination,
            includeSearchable,
            prioritiseTargetedContents
        } = config;

        contents = CsContentsGroupGenerator.filterItems(contents, Array.isArray(filterBy) ? filterBy : [filterBy]);
        contents = CsContentsGroupGenerator.sortItems(contents, Array.isArray(sortBy) ? sortBy : [sortBy]);

        let resultingCombination: {
            [key in keyof Content]?: string
        } | undefined;

        if (combination) {
            resultingCombination = {};

            for (const attribute of Object.keys(combination)) {
                if (!combination[attribute]) {
                    continue;
                }

                for (const value of combination[attribute]) {
                    if (resultingCombination![attribute]) {
                        continue;
                    }

                    const beforeFilterLength = contents.length;
                    const filteredContents = CsContentsGroupGenerator.filterContentsByAttribute(contents, attribute, value);
                    const afterFilterLength = filteredContents.length;

                    if (afterFilterLength && afterFilterLength <= beforeFilterLength) {
                        resultingCombination![attribute] = value;
                        contents = filteredContents;
                    }
                }
            }
        }

        let allTargetedContents: Content[] = [];

        if (prioritiseTargetedContents) {
            const {sourceFramework, categories} = prioritiseTargetedContents;
            allTargetedContents = contents.filter((content) => {
                return Object.keys(sourceFramework)
                    .filter((category) => categories ? categories.indexOf(category as any) > -1 : true)
                    .some((category) => {
                        if (!sourceFramework[category].length) { return false; }

                        const userPreferencesCategoryValues: string[] = (() => {
                            if (CsContentsGroupGenerator.isMultiValueAttribute(sourceFramework, category)) {
                                return sourceFramework[category];
                            }
                            return [sourceFramework[category]];
                        })();

                        const contentCategoryValues: string[] = (() => {
                            if (CsContentsGroupGenerator.isMultiValueAttribute(content, category)) {
                                return content[category];
                            }
                            return [content[category]];
                        })();

                        return !contentCategoryValues.some((value) => userPreferencesCategoryValues.indexOf(value) > -1);
                    });
            });

            if (allTargetedContents && allTargetedContents.length) {
                contents = contents.sort((a, b) => {
                    if (a === b) { return 0; }

                    if (allTargetedContents.indexOf(a) > 1 && allTargetedContents.indexOf(b) === -1) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }
        }

        let sections = Array.from(
            contents
                .reduce<Map<string, Content[]>>((acc, content) => {
                    let _groupBy: string = groupBy;
                    if (includeSearchable && content['se_' + groupBy + 's']) {
                        _groupBy = 'se_' + groupBy + 's';
                    }
                    if (CsContentsGroupGenerator.isMultiValueAttribute(content, _groupBy)) {
                        content[_groupBy].forEach((value) => {
                            const c = acc.get(value) || [];
                            c.push(content);
                            acc.set(value, c);
                        });
                    } else {
                        const c = acc.get(content[_groupBy] || 'Other') || [];
                        c.push(content);
                        acc.set(content[_groupBy] || 'Other', c);
                    }

                    return acc;
                }, new Map<string, Content[]>())
                .entries()
        ).map<CsContentGroup>(([groupedBy, contentsList]) => {
            const targetedContents = contentsList.filter((c) => allTargetedContents.indexOf(c) > -1);

            return {
                name: groupedBy,
                count: contentsList.length,
                contents: contentsList,
                ...((targetedContents && targetedContents.length) ? { targetedContents } : {})
            };
        });

        sections = CsContentsGroupGenerator.filterItems(sections, Array.isArray(groupFilterBy) ? groupFilterBy : [groupFilterBy]);
        sections = CsContentsGroupGenerator.sortItems(sections, Array.isArray(groupSortBy) ? groupSortBy : [groupSortBy]);

        if (prioritiseTargetedContents) {
            sections = sections.sort((a , b) => {
                if (
                    a.targetedContents && a.targetedContents.length &&
                    !(b.targetedContents && b.targetedContents.length)
                ) {
                    return -1;
                } else if (
                    !(a.targetedContents && a.targetedContents.length) &&
                    b.targetedContents && b.targetedContents.length
                ) {
                    return 1;
                }

                return 0;
            });
        }

        return {
            name: groupBy,
            sections,
            combination: resultingCombination
        };
    }

    private static filterContentsByAttribute(contents: Content[], attribute: string, acceptedValue: string): Content[] {
        return contents.filter((content) => {
            if (CsContentsGroupGenerator.isMultiValueAttribute(content, attribute)) {
                return content[attribute].map((c) => (c || '').toLowerCase()).includes((acceptedValue || '').toLowerCase());
            } else {
                return (acceptedValue || '').toLowerCase() === (content[attribute] || '').toLowerCase();
            }
        });
    }

    private static isMultiValueAttribute = (content, attr) => Array.isArray(content[attr]);

    private static sortItems<T>(items: T[], sortCriteria: CsSortCriteria<any>[]): T[] {
        return Aggregator.sorted(items, sortCriteria.map((c) => ({
            [c.sortAttribute]: c.sortOrder
        })) as { [key: string]: 'asc' | 'desc' }[]);
    }

    private static filterItems<T>(items: T[], filterCriteria: CsFilterCriteria<any>[]): T[] {
        return Aggregator.filtered(items, filterCriteria.map((c) => ({
            [c.filterAttribute]: {operation: c.filterCondition.operation, value: c.filterCondition.value}
        })) as { [key: string]: { operation: '==' | '<=' | '>=' | '!=', value: any } }[]);
    }
}
