export class CsCourseProgressCalculator {
    calculate(endPageSeen: boolean, visitedContentEnd: boolean, progress: number) {
        let customProgress;
        if (endPageSeen || visitedContentEnd) {
            customProgress = 100;
        } else {
            customProgress = progress;
        }
        return customProgress;
    }
}
