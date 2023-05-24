import { Observable } from "rxjs";
import { CsLearnerCertificate } from "../../../models";
import { CsCertificateServiceConfig } from "../../../index";


export interface GetPublicKeyRequest {
    osid: string;
    alg?: String;
    schemaName?: string;
}

export interface GetPublicKeyResponse {
    osid: string;
    value: string;
    alg: string;
    osOwner: string[];
}

export interface FetchCertificateRequest {
    certificateId: string;
    schemaName?: string;
    type?: CertificateType;
    templateUrl?: string;
}

export enum CertificateType {
    CERTIFICATE_REGISTRY = "certificate_registry",
    RC_CERTIFICATE_REGISTRY = "rc_certificate_registry"
}

export interface FetchCertificateResponse {
    printUri: string;
}

export interface GetLegacyCertificateRequest {
    pdfUrl: string
}

export interface GetLegacyCertificateResponse {
    signedUrl: string
}

export interface CSGetLearnerCerificateRequest {
    userId: string;
    schemaName?: string;
    size?: number;
}

export interface CsGetCertificateRequest {
    certificateId: string;
    schemaName?: string;
}

export interface CsCertificateDetailsResponse {
    training?: string;
    recipient?: string;
    status: string;
    _osSignedData?: any;
}

export interface CsVerifyCertificateRequest {
    publicKey?: string;
    certificateData?: any;
    schemaName?: string;
    certificateId: string;
}

export interface CsVerifyCertificateResponse {
    verified: boolean;
    status: string;
    certificateData: {
        issuedTo: string;
        issuanceDate: string;
        issuerName: string;
        trainingName: string;
        trainigId: string;
    }
}

export interface CsLearnerCertificateResponse {
    certRegCount: number;
    rcCount: number;
    certificates: CsLearnerCertificate[]
}

export interface CsCertificateService {
    fetchCertificatesV1(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<any>;
    fetchCertificatesV2(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]>;
    fetchCertificates(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificateResponse>;
    getPublicKey(req: GetPublicKeyRequest, config?: CsCertificateServiceConfig): Observable<GetPublicKeyResponse>;
    getCerificateDownloadURI(req: FetchCertificateRequest, config?: CsCertificateServiceConfig): Observable<FetchCertificateResponse>;
    getLegacyCerificateDownloadURI(req: GetLegacyCertificateRequest, config?: CsCertificateServiceConfig): Observable<GetLegacyCertificateResponse>;
    getCertificateDetails(req: CsGetCertificateRequest, config?: CsCertificateServiceConfig): Observable<CsCertificateDetailsResponse>;
    getEncodedData(req: string): Promise<any>;
    verifyCertificate(req: CsVerifyCertificateRequest, config?: CsCertificateServiceConfig): Observable<CsVerifyCertificateResponse>
}
