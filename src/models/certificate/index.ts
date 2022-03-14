export interface LearnerCertificateV1 {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: {
        pdfUrl: string;
        data: {
            badge: {
                name: string;
                issuer: {
                    name: string;
                };
            };
            issuedOn: string;
        };
        related: {
            courseId: string;
            Id: string;
        };
    };
}

export interface Signatory {
    image: string,
    identity: string,
    name: string,
    osid: string,
    designation: string
}

export interface LearnerCertificateV2 {
        training: {
            osid: string,
            name: string,
            id: string,
            batchId: string,
            type: string
        },
        certificateLabel: string,
        signatory: Signatory[],
        recipient: {
            osid: string,
            name: string,
            id: string,
            type: string
        },
        issuer: {
            osid: string,
            name: string,
            url: string
        },
        osid: string,
        status: string
}

export interface LearnerCertificate {
    id: string;
    courseId?: string;
    name: string;
    pdfUrl?: string;
    issuedOn?: string;
    issuerName: string;
    osSignedData?: string;
}