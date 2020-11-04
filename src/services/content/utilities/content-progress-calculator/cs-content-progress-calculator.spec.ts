import {CsContentProgressCalculator} from './';
import {CsMimeType} from '../../interface';

describe('CsContentProgressCalculator', () => {
    describe('when no summary data is given', () => {
        it('should return 0', () => {
            expect(CsContentProgressCalculator.calculate([], CsMimeType.EPUB)).toEqual(0);
        });
    });

    describe('when summary data with some progress is given for playback MIME types (CsMimeType.YOUTUBE, CsMimeType.VIDEO, CsMimeType.WEBM, CsMimeType.PDF, CsMimeType.EPUB)', () => {
        it('should return 100 if user has visited endPage or contentEnd', () => {
            expect(CsContentProgressCalculator.calculate([{progress: undefined, endpageseen: true}], CsMimeType.EPUB)).toEqual(0);
            expect(CsContentProgressCalculator.calculate([{progress: 20, endpageseen: true}], CsMimeType.EPUB)).toEqual(100);
            expect(CsContentProgressCalculator.calculate([{progress: 100, visitedcontentend: true}], CsMimeType.EPUB)).toEqual(100);
        });

        it('should return 100 if playback progressed more than 20%', () => {
            expect(CsContentProgressCalculator.calculate([{
                progress: 10,
                totallength: 100,
                visitedlength: 50
            }], CsMimeType.EPUB)).toEqual(100);
        });

        it('should return progress as is if playback progressed less than 20%', () => {
            expect(CsContentProgressCalculator.calculate([{
                progress: 10,
                totallength: 100,
                visitedlength: 10
            }], CsMimeType.EPUB)).toEqual(10);
            expect(CsContentProgressCalculator.calculate([{
                progress: 15,
                totallength: 100,
                visitedlength: 10
            }], CsMimeType.EPUB)).toEqual(15);
        });
    });

    describe('when summary data with some progress is given for non-playback MIME types (CsMimeType.H5P, CsMimeType.HTML)', () => {
        it('should return 100 regardless of progress given', () => {
            expect(CsContentProgressCalculator.calculate([{progress: 10}], CsMimeType.H5P)).toEqual(100);
            expect(CsContentProgressCalculator.calculate([{progress: 70}], CsMimeType.H5P)).toEqual(100);
        });
    });

    describe('when summary data with some progress is given for unknown MIME types', () => {
        it('should return 100 for any unknown MIME type only when progress is 100, zero otherwise', () => {
            expect(CsContentProgressCalculator.calculate([{progress: 100}], 'UNKNOWN' as CsMimeType)).toEqual(100);
            expect(CsContentProgressCalculator.calculate([{progress: 70}], 'UNKNOWN' as CsMimeType)).toEqual(0);
        });
    });
});
