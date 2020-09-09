import {ContentMimeType, MimeTypeCategory, MimeTypeCategoryMapping} from '../../../../models/content';

export interface MimeTypeFacet {
    name: ContentMimeType;
    count: number;
}

export interface MimeTypeCategoryAggregation {
    name: MimeTypeCategory;
    count: number;
    values: MimeTypeFacet[];
}

export class CsMimeTypeFacetToMimeTypeCategoryAggregator {
    public static aggregate(mimeTypeFacets: MimeTypeFacet[]): MimeTypeCategoryAggregation[] {
        interface Mapping {
            [key: string]: { count: number; values: MimeTypeFacet[] };
        }

        const mapping = mimeTypeFacets.reduce<Mapping>((acc, facet) => {
            for (const category in MimeTypeCategory) {
                if (!(category in MimeTypeCategory)) {
                    continue;
                }

                if ((MimeTypeCategoryMapping[category] || []).includes(facet.name)) {
                    if (acc[category]) {
                        acc[category].count = acc[category].count + facet.count;
                        acc[category].values = acc[category].values.concat(facet);
                    } else {
                        acc[category] = {
                            count: facet.count,
                            values: [facet]
                        };
                    }
                }
            }

            return acc;
        }, {});

        return Object.keys(mapping).map((m) => {
            return {
                name: m as MimeTypeCategory,
                ...mapping[m]
            };
        });
    }
}
