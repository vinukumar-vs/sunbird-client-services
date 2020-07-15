import {CsMimeType} from '../../interface';

export class CsContentProgressCalculator {
    private static PLAYBACK_MIME_TYPES = [CsMimeType.YOUTUBE, CsMimeType.VIDEO, CsMimeType.WEBM, CsMimeType.PDF, CsMimeType.EPUB];
    private static OTHER_MIME_TYPES = [CsMimeType.H5P, CsMimeType.HTML];

    static calculate(summary: any[], mimeType: CsMimeType): number {
        const summaryMap = summary.reduce((acc, s) => {
            Object.keys(s).forEach((k) => {
                acc[k] = s[k];
            });
            return acc;
        }, {});

        if (!summaryMap.progress) {
            return 0;
        }

        if (CsContentProgressCalculator.PLAYBACK_MIME_TYPES.indexOf(mimeType) > -1) {
            return CsContentProgressCalculator.calculatePlaybackProgress(
                summaryMap['progress'] || 0,
                summaryMap['visitedlength'] || 0,
                summaryMap['totallength'] || 0,
                summaryMap['endpageseen'] || false,
                summaryMap['visitedcontentend'] || false,
            );
        } else if (
            CsContentProgressCalculator.OTHER_MIME_TYPES.indexOf(mimeType) > -1
        ) {
            return CsContentProgressCalculator.absoluteProgress(summaryMap.progress, 0);
        } else {
            return CsContentProgressCalculator.absoluteProgress(summaryMap.progress, 100);
        }
    }

    private static calculatePlaybackProgress(
        progress: number,
        visitedLength: number,
        totalLength: number,
        endPageSeen: boolean,
        visitedContentEnd: boolean,
    ) {
        let customProgress;
        if (endPageSeen || visitedContentEnd || (totalLength && (visitedLength * 100) / totalLength) > 20) {
            customProgress = 100;
        } else {
            customProgress = progress;
        }
        return customProgress;
    }

    private static absoluteProgress(progress: number, threshold: number): number {
        if (progress >= threshold) {
            return 100;
        }

        return 0;
    }
}
