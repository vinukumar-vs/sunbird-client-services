import {CsMimeTypeFacetToMimeTypeCategoryAggregator, MimeTypeFacet} from './cs-mime-type-facet-to-mime-type-category-aggregator';

describe('CsMimeTypeFacetToMimeTypeCategoryAggregator', () => {
    it('should be able to group mimeType facets by mimeType category', () => {
        const facetValues: MimeTypeFacet[] = [
            {
                'name': 'application/pdf',
                'count': 15,
            },
            {
                'name': 'application/vnd.ekstep.content-collection',
                'count': 32,
            },
            {
                'name': 'application/vnd.ekstep.ecml-archive',
                'count': 34,
            },
            {
                'name': 'application/vnd.ekstep.h5p-archive',
                'count': 2,
            },
            {
                'name': 'video/mp4',
                'count': 136,
            },
            {
                'name': 'video/webm',
                'count': 1,
            },
            {
                'name': 'video/x-youtube',
                'count': 91,
            }
        ];

        expect(CsMimeTypeFacetToMimeTypeCategoryAggregator.aggregate(facetValues)).toEqual([
            {
                'name': 'DOCS',
                'count': 15,
                'values': [
                    {
                        'name': 'application/pdf',
                        'count': 15
                    }
                ]
            },
            {
                'name': 'ALL',
                'count': 279,
                'values': [
                    {
                        'name': 'application/pdf',
                        'count': 15
                    },
                    {
                        'name': 'application/vnd.ekstep.ecml-archive',
                        'count': 34
                    },
                    {
                        'name': 'application/vnd.ekstep.h5p-archive',
                        'count': 2
                    },
                    {
                        'name': 'video/mp4',
                        'count': 136
                    },
                    {
                        'name': 'video/webm',
                        'count': 1
                    },
                    {
                        'name': 'video/x-youtube',
                        'count': 91
                    }
                ]
            },
            {
                'name': 'COLLECTION',
                'count': 32,
                'values': [
                    {
                        'name': 'application/vnd.ekstep.content-collection',
                        'count': 32
                    }
                ]
            },
            {
                'name': 'INTERACTION',
                'count': 36,
                'values': [
                    {
                        'name': 'application/vnd.ekstep.ecml-archive',
                        'count': 34
                    },
                    {
                        'name': 'application/vnd.ekstep.h5p-archive',
                        'count': 2
                    }
                ]
            },
            {
                'name': 'VIDEO',
                'count': 137,
                'values': [
                    {
                        'name': 'video/mp4',
                        'count': 136
                    },
                    {
                        'name': 'video/webm',
                        'count': 1
                    }
                ]
            }
        ]);
    });
});
