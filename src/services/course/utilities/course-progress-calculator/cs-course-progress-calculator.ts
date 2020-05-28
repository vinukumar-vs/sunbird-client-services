export class CsCourseProgressCalculator {
    calculate(
        progress: number,
        endPageSeen: boolean,
        visitedLength: number,
        totalSeekedLength: number,
        totalLength: number
    ): number {
        let customProgress;
        const minProgress = 20;
        if (
            (progress === 100) ||
            ((visitedLength === totalLength) && (totalSeekedLength === 0)) ||
            (endPageSeen && totalSeekedLength === 0) ||
            (progress > minProgress) && endPageSeen
        ) {
            customProgress = 100;
        } else if ((progress > minProgress) && !endPageSeen) {
            customProgress = ((visitedLength - totalSeekedLength) / totalLength) * 100;
        } else {
            customProgress = progress;
        }
        return Math.max(customProgress, progress);
    }
}
