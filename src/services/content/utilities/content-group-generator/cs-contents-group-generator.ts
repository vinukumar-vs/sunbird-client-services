import {Content} from '../../../../models/content';
import {CsContentSortCriteria, CsSortOrder} from '../../interface';

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
        groupBy: keyof Content,
        sortCriteria: CsContentSortCriteria,
        combination?: {
            [key in keyof Content]?: string[]
        }
    ): CsContentSection {
        CsContentsGroupGenerator.sortItems(contents, sortCriteria);

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
                    const filteredContents = CsContentsGroupGenerator.filterContents(contents, attribute, value);
                    const afterFilterLength = filteredContents.length;

                    if (afterFilterLength && afterFilterLength <= beforeFilterLength) {
                        resultingCombination![attribute] = value;
                        contents = filteredContents;
                    }
                }
            }
        }

        const sections = Array.from(
            contents
                .reduce<Map<string, Content[]>>((acc, content) => {
                    if (CsContentsGroupGenerator.isMultiValueAttribute(content, groupBy)) {
                        content[groupBy].forEach((value) => {
                            const c = acc.get(value) || [];
                            c.push(content);
                            acc.set(value, c);
                        });
                    } else {
                        const c = acc.get(content[groupBy]) || [];
                        c.push(content);
                        acc.set(content[groupBy], c);
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

        CsContentsGroupGenerator.sortItems(sections, sortCriteria);

        return {
            name: groupBy,
            sections,
            combination: resultingCombination
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
