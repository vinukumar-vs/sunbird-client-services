import {CsMimeTypeFacetToMimeTypeCategoryAggregator, MimeTypeFacet} from './cs-mime-type-facet-to-mime-type-category-aggregator';
import {MimeTypeCategory} from '../../../../models/content';

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
        const facetValues2: MimeTypeFacet[] = [
            {
                'name': 'application/vnd.ekstep.h5p-archive',
                'count': 2,
                'apply': false
            },
            {
                'name': 'text/x-url',
                'count': 1,
                'apply': false
            },
            {
                'name': 'video/webm',
                'count': 1,
                'apply': false
            },
            {
                'name': 'application/pdf',
                'count': 15,
                'apply': false
            },
            {
                'name': 'application/vnd.ekstep.content-collection',
                'count': 32,
                'apply': false
            },
            {
                'name': 'application/vnd.ekstep.ecml-archive',
                'count': 34,
                'apply': false
            },
            {
                'name': 'video/x-youtube',
                'count': 91,
                'apply': false
            },
            {
                'name': 'video/mp4',
                'count': 136,
                'apply': true
            }
        ];

        expect(CsMimeTypeFacetToMimeTypeCategoryAggregator.aggregate(facetValues)).toEqual([
            {
                'name': 'DOC',
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
                'count': 311,
                'values': [
                    {
                        'name': 'application/pdf',
                        'count': 15
                    },
                    {
                        'name': 'application/vnd.ekstep.content-collection',
                        'count': 32
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
                'count': 228,
                'values': [
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
            }
        ]);
        expect(CsMimeTypeFacetToMimeTypeCategoryAggregator.aggregate(facetValues2)).toEqual([
            {
                'name': 'INTERACTION',
                'count': 36,
                'values': [
                    {
                        'name': 'application/vnd.ekstep.h5p-archive',
                        'count': 2,
                        'apply': false
                    },
                    {
                        'name': 'application/vnd.ekstep.ecml-archive',
                        'count': 34,
                        'apply': false
                    }
                ],
                'apply': false
            },
            {
                'name': 'ALL',
                'count': 312,
                'values': [
                    {
                        'name': 'application/vnd.ekstep.h5p-archive',
                        'count': 2,
                        'apply': false
                    },
                    {
                        'name': 'text/x-url',
                        'count': 1,
                        'apply': false
                    },
                    {
                        'name': 'video/webm',
                        'count': 1,
                        'apply': false
                    },
                    {
                        'name': 'application/pdf',
                        'count': 15,
                        'apply': false
                    },
                    {
                        'name': 'application/vnd.ekstep.content-collection',
                        'count': 32,
                        'apply': false
                    },
                    {
                        'name': 'application/vnd.ekstep.ecml-archive',
                        'count': 34,
                        'apply': false
                    },
                    {
                        'name': 'video/x-youtube',
                        'count': 91,
                        'apply': false
                    },
                    {
                        'name': 'video/mp4',
                        'count': 136,
                        'apply': true
                    }
                ],
                'apply': true
            },
            {
                'name': 'VIDEO',
                'count': 228,
                'values': [
                    {
                        'name': 'video/webm',
                        'count': 1,
                        'apply': false
                    },
                    {
                        'name': 'video/x-youtube',
                        'count': 91,
                        'apply': false
                    },
                    {
                        'name': 'video/mp4',
                        'count': 136,
                        'apply': true
                    }
                ],
                'apply': true
            },
            {
                'name': 'DOC',
                'count': 15,
                'values': [
                    {
                        'name': 'application/pdf',
                        'count': 15,
                        'apply': false
                    }
                ],
                'apply': false
            },
        ]);

    });

    it('should be able to group mimeType facets by mimeType category without provided excludes', () => {
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
        expect(CsMimeTypeFacetToMimeTypeCategoryAggregator.aggregate(facetValues, [MimeTypeCategory.ALL])).toEqual([
            {
                'name': 'DOC',
                'count': 15,
                'values': [
                    {
                        'name': 'application/pdf',
                        'count': 15
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
                'count': 228,
                'values': [
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
            }
        ]);
    });
});
