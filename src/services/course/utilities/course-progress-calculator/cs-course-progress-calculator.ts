export class CsCourseProgressCalculator {
    calculate(endPageSeen: boolean, visitedContentEnd: boolean, progress: number, visitedlength: number, totallength: number) {
        let customProgress;
        if (endPageSeen || visitedContentEnd || ((visitedlength * 100) / totallength ) > 20) {
            customProgress = 100;
        } else {
            customProgress = progress;
        }
        return customProgress;
    }
}
