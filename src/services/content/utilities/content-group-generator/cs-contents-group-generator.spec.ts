import {CsContentsGroupGenerator} from './';
import {
    searchResult,
    searchResultWithMultiValueAttributes,
    searchResultWithNullAttributes,
    searchResultWithMultiValueSearchableAttributes,
    searchResultWithMultiValueSearchableAttributesAndTargetedContent
} from './cs-contents-group-generator.spec.data';
import {CsSortOrder} from '../../interface';

describe('ContentGroupGenerator', () => {
    it('should be able to generate contents grouped by its attributes', () => {
        // assert
        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResult.result.content as any,
                groupBy: 'subject',
                sortBy: {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
                filterBy: [],
                groupSortBy: {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
                groupFilterBy: [],
                combination: {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            })
        ).toMatchSnapshot();

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResult.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                }],
                filterBy: [],
                groupSortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                }],
                groupFilterBy: [],
                combination: {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            })
        ).toEqual({
            name: 'subject',
            combination: {
                'medium': 'english'
            },
            sections: [
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueAttributes.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterBy: [],
                groupSortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                groupFilterBy: [],
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithNullAttributes.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterBy: [],
                groupSortBy: [],
                groupFilterBy: [],
                combination: {
                    medium: ['', 'invalid_medium', 'english', 'hindi'],
                    gradeLevel: [''],
                    invalidAttribute: undefined
                } as any,
            })
        ).toEqual({
            name: 'subject',
            combination: {
                'medium': ''
            },
            sections: expect.any(Array)
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueAttributes.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterBy: [{
                    filterAttribute: 'variants.online.size',
                    filterCondition: {
                        operation: '!=',
                        value: 3045
                    }
                }],
                groupSortBy: [],
                groupFilterBy: [],
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                // {
                //     count: 1,
                //     name: 'Physical Science',
                //     contents: expect.any(Array)
                // },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueSearchableAttributes.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterBy: [],
                groupSortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                groupFilterBy: [],
                includeSearchable: true
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'NewSubject',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });
    });

    it('should be able to generate contents grouped by its attributes with targeted contents prioritised', () => {
        expect(
            CsContentsGroupGenerator.generate({
                prioritiseTargetedContents: {
                    categories: ['board', 'medium', 'gradeLevel'],
                    sourceFramework: {
                        board: ['State (Andhra Pradesh)'],
                        medium: ['English'],
                        gradeLevel: ['Class 1', 'Class 4']
                    }
                },
                contents: searchResultWithMultiValueSearchableAttributesAndTargetedContent.result.content as any,
                groupBy: 'subject',
                sortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                groupSortBy: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                groupFilterBy: [],
                filterBy: [],
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                {
                    count: 2,
                    name: 'Geography',
                    contents: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'b (targeted)'
                        }),
                        expect.objectContaining({
                            name: 'a (non-targeted)'
                        })
                    ]),
                    targetedContents: [
                        expect.objectContaining({
                            board: 'State (Other than Andhra Pradesh)',
                            se_boards: expect.arrayContaining(['State (Andhra Pradesh)', 'State (Other than Andhra Pradesh)'])
                        })
                    ]
                },
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array),
                    targetedContents: undefined
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array),
                    targetedContents: undefined
                }
            ]
        });
    });
});
