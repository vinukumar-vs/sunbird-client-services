export interface Content {
    identifier: string;
    name: string;
    appIcon: string;
    description: string;
    pkgVersion: string;
    status: string;
    size: string;
    owner: string;
    creator: string;
    subject: string | string[];
    board: string;
    medium: string | string[];
    publisher: string;
    me_totalRatings: string;
    me_averageRating: string;
    me_totalDownloads: string;
    copyright: string;
    copyrightYear: string;
    license: string;
    licenseDetails: LicenseDetails;
    expires: string;
    downloadUrl: string;
    variants: { [key: string]: any };
    artifactUrl: string;
    language: string[];
    gradeLevel: string[];
    osId: string;
    contentType: string;
    resourceType: string;
    mimeType: string;
    artifactMimeType: string;
    versionKey: string;
    contentEncoding: string;
    contentDisposition: string;
    contentTypesCount: string;
    lastPublishedOn: string;
    createdOn: string;
    createdBy: string;
    channel: string;
    screenshots: string[];
    audience: any;
    pragma: string[];
    attributions: string[];
    dialcodes: string[];
    childNodes: string[];
    previewUrl: string;
    framework: string;
    creators: string;
    contributors: string;
    streamingUrl: string;
    totalScore: any;
    altMsg?: AltMsg [];
    organisation?: string;
    author?: string;
    collaborators?: string;
    originData?: OriginData;
    origin?: string;
    totalQuestions?: number;
}

export interface LicenseDetails {
    description: string;
    name: string;
    url: string;
}

export interface AltMsg {
    key: string;
    value: string;
    translations?: string;
}

export interface OriginData {
    name?: string;
    author?: string;
    license?: string;
    organisation?: string;
}
