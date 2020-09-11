import {ContentMimeType, MimeTypeCategory, MimeTypeCategoryMapping} from '../../../../models/content';

export interface MimeTypeFacet {
    name: ContentMimeType;
    count: number;
    apply?: boolean;
}

export interface MimeTypeCategoryAggregation {
    name: MimeTypeCategory;
    count: number;
    values: MimeTypeFacet[];
    apply?: boolean;
}

export class CsMimeTypeFacetToMimeTypeCategoryAggregator {
    public static aggregate(mimeTypeFacets: MimeTypeFacet[], exclude: MimeTypeCategory[] = []): MimeTypeCategoryAggregation[] {
        interface Mapping {
            [key: string]: { count: number; values: MimeTypeFacet[], apply?: boolean };
        }

        const mapping = mimeTypeFacets.reduce<Mapping>((acc, facet) => {
            for (const category in MimeTypeCategory) {
                if (!(category in MimeTypeCategory) || exclude.indexOf(category as any) >= 0) {
                    continue;
                }

                if ((MimeTypeCategoryMapping[category] || []).includes(facet.name)) {
                    if (acc[category]) {
                        acc[category].count = acc[category].count + facet.count;
                        acc[category].values = acc[category].values.concat(facet);
                        if (facet.apply !== undefined) {
                            if (acc[category].apply !== undefined) {
                                acc[category].apply = acc[category].apply || facet.apply;
                            } else {
                                acc[category].apply = facet.apply;
                            }
                        }
                    } else {
                        if (facet.apply !== undefined) {
                            acc[category] = {
                                count: facet.count,
                                values: [facet],
                                apply: facet.apply
                            };
                        } else {
                            acc[category] = {
                                count: facet.count,
                                values: [facet],
                            };
                        }
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
