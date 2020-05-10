import {searchResult} from './cs-contents-group-generator.spec.data';
import {CsContentGroupingCriteria, CsContentsGroupGenerator} from './cs-contents-group-generator';
import {CsSortOrder} from '../../interface';

describe('ContentGroupGenerator', () => {
    it('should be able to generate contents grouped by its attributes', () => {
        // arrange
        const groupingRequest: CsContentGroupingCriteria[] = [
            {
                groupAttribute: 'contentType',
                values: ['TextBook', 'Course'],
                sortCriteria: {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
                meta: {
                    combination: {
                        of: 'medium',
                        with: 'gradeLevel'
                    }
                }
            },
            {
                groupAttribute: 'subject',
                values: [],
                sortCriteria: {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
            },
        ];
        // assert
        console.log(JSON.stringify(CsContentsGroupGenerator.generate(
            searchResult.result.content as any,
            groupingRequest,
            {
                sortAttribute: 'name',
                sortOrder: CsSortOrder.ASC,
            }
        )));
        expect(
            CsContentsGroupGenerator.generate(
                searchResult.result.content as any,
                groupingRequest,
                {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                }
            )
        ).toMatchSnapshot();
    });
});
