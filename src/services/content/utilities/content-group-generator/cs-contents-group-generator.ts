import {Content} from '../../../../models/content';
import {CsContentSortCriteria, CsSortOrder} from '../../interface';

export interface CsContentSectionGroupingCriteria {
    groupBy: keyof Content;
    combination?: {
        [key in keyof Content]?: string[]
    };
    sortCriteria: {
        sortAttribute: keyof Content,
        sortOrder: CsSortOrder.ASC,
    };
}

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
    static generate(
        contents: Content[],
        criteria: CsContentSectionGroupingCriteria
    ): CsContentSection {
        CsContentsGroupGenerator.sortItems(contents, criteria.sortCriteria);

        let combination: {
            [key in keyof Content]?: string
        } | undefined;

        if (criteria.combination) {
            combination = {};

            for (const attribute of Object.keys(criteria.combination)) {
                if (!criteria.combination[attribute]) {
                    continue;
                }

                for (const value of criteria.combination[attribute]) {
                    if (combination![attribute]) {
                        continue;
                    }

                    const beforeFilterLength = contents.length;
                    const filteredContents = CsContentsGroupGenerator.filterContents(contents, attribute, value);
                    const afterFilterLength = filteredContents.length;

                    if (afterFilterLength && afterFilterLength <= beforeFilterLength) {
                        combination![attribute] = value;
                        contents = filteredContents;
                    }
                }
            }
        }

        const sections = Array.from(
            contents
                .reduce<Map<string, Content[]>>((acc, content) => {
                    if (CsContentsGroupGenerator.isMultiValueAttribute(content, criteria.groupBy)) {
                        content[criteria.groupBy].forEach((value) => {
                            const c = acc.get(value) || [];
                            c.push(content);
                            acc.set(value, c);
                        });
                    } else {
                        const c = acc.get(content[criteria.groupBy]) || [];
                        c.push(content);
                        acc.set(content[criteria.groupBy], c);
                    }

                    return acc;
                }, new Map<string, Content[]>())
                .entries()
        ).map<Section>(([groupBy, contentsList]) => {
            return {
                name: groupBy,
                count: contentsList.length,
                contents: contentsList
            };
        });

        CsContentsGroupGenerator.sortItems(sections, criteria.sortCriteria);

        return {
            name: criteria.groupBy,
            sections,
            combination
        };
    }

    private static filterContents(contents: Content[], attribute: string, acceptedValue: string): Content[] {
        return contents.filter((content) => {
            if (CsContentsGroupGenerator.isMultiValueAttribute(content, attribute)) {
                return content[attribute].map((c) => (c || '').toLowerCase()).includes((acceptedValue || '').toLowerCase());
            } else {
                return (acceptedValue || '').toLowerCase() === (content[attribute] || '').toLowerCase();
            }
        });
    }

    private static isMultiValueAttribute = (content, attr) => Array.isArray(content[attr]);

    private static uniquelyAddValue = (list: any[], value: any) => !(list.indexOf(value) >= 0) && list.push(value);

    private static sortItems<T>(items: T[], sortCriteria: CsContentSortCriteria): void {
        items.sort((a, b) => {
            if (!a[sortCriteria.sortAttribute] || !b[sortCriteria.sortAttribute]) {
                return 0;
            }
            const comparison = String(a[sortCriteria.sortAttribute]).localeCompare(b[sortCriteria.sortAttribute]);

            return sortCriteria.sortOrder === CsSortOrder.ASC ? comparison : (comparison * -1);
        });
    }
}
