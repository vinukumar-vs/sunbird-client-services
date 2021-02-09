import {Content} from '../../../../models';
import {CsContentFilterCriteria, CsContentSortCriteria, CsSortOrder} from '../../interface';
import {Aggregator} from '../../../../utilities/aggregator';

export interface CsContentSection {
    name: string;
    combination?: {
        [key in keyof Content]?: string
    };
    sections: Section[];
}

interface Section {
    count?: number;
    name?: string;
    contents?: Content[];
}

export class CsContentsGroupGenerator {
    static generate(config: {
        contents: Content[],
        groupBy: keyof Content,
        sortCriteria: CsContentSortCriteria | CsContentSortCriteria[],
        filterCriteria: CsContentFilterCriteria | CsContentFilterCriteria[],
        combination?: {
            [key in keyof Content]?: string[]
        },
        includeSearchable?: boolean
    }): CsContentSection {
        let {contents} = config;
        const {groupBy, sortCriteria, filterCriteria, combination, includeSearchable} = config;

        contents = CsContentsGroupGenerator.filterItems(contents, Array.isArray(filterCriteria) ? filterCriteria : [filterCriteria]);
        contents = CsContentsGroupGenerator.sortItems(contents, Array.isArray(sortCriteria) ? sortCriteria : [sortCriteria]);

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

        let sections = Array.from(
            contents
                .reduce<Map<string, Content[]>>((acc, content) => {
                    let _groupBy: string = groupBy;
                    if (includeSearchable && content['se_' + groupBy]) {
                        _groupBy = 'se_' + groupBy;
                    }
                    if (CsContentsGroupGenerator.isMultiValueAttribute(content, _groupBy)) {
                        content[_groupBy].forEach((value) => {
                            const c = acc.get(value) || [];
                            c.push(content);
                            acc.set(value, c);
                        });
                    } else {
                        const c = acc.get(content[_groupBy]) || [];
                        c.push(content);
                        acc.set(content[_groupBy] || 'Other', c);
                    }

                    return acc;
                }, new Map<string, Content[]>())
                .entries()
        ).map<Section>(([groupedBy, contentsList]) => {
            return {
                name: groupedBy,
                count: contentsList.length,
                contents: contentsList
            };
        });

        sections = CsContentsGroupGenerator.sortItems(sections, Array.isArray(sortCriteria) ? sortCriteria : [sortCriteria]);

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

    private static sortItems<T>(items: T[], sortCriteria: CsContentSortCriteria[]): T[] {
        return Aggregator.sorted(items, sortCriteria.map((c) => ({
            [c.sortAttribute]: c.sortOrder === CsSortOrder.ASC ? 'asc' : 'desc'
        })) as { [key: string]: 'asc' | 'desc' }[]);
    }

    private static filterItems<T>(items: T[], filterCriteria: CsContentFilterCriteria[]): T[] {
        return Aggregator.filtered(items, filterCriteria.map((c) => ({
            [c.filterAttribute]: {operation: c.filterCondition.operation, value: c.filterCondition.value}
        })) as { [key: string]: { operation: '==' | '<=' | '>=' | '!=', value: any } }[]);
    }
}
