import {CsContentsGroupGenerator} from './';
import {searchResult, searchResultWithMultiValueAttributes, searchResultWithNullAttributes} from './cs-contents-group-generator.spec.data';
import {CsSortOrder} from '../../interface';

describe('ContentGroupGenerator', () => {
    it('should be able to generate contents grouped by its attributes', () => {
        // assert
        expect(
            CsContentsGroupGenerator.generate(
                searchResult.result.content as any,
                'subject',
                {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
                {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            )
        ).toMatchSnapshot();

        expect(
            CsContentsGroupGenerator.generate(
                searchResult.result.content as any,
                'subject',
                [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                }],
                {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            )
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
            CsContentsGroupGenerator.generate(
                searchResultWithMultiValueAttributes.result.content as any,
                'subject',
                [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }]
            )
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
            CsContentsGroupGenerator.generate(
                searchResultWithNullAttributes.result.content as any,
                'subject',
                [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                {
                    medium: ['', 'invalid_medium', 'english', 'hindi'],
                    gradeLevel: [''],
                    invalidAttribute: undefined
                } as any,
            )
        ).toEqual({
            name: 'subject',
            combination: {
                'medium': ''
            },
            sections: expect.any(Array)
        });
    });
});
