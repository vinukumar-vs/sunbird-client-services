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
    status: string
}

export interface CsVerifyCertificateRequest {
    publicKey?: string;
    certificateData: any;
    schemaName?: string;
    certificateId: string;
}

export interface VerifyCertificateResponse {
    isVerified: boolean;
    status: string;
    certificateData: {
        issuedTo: string;
        issuanceDate: string;
        issuerName: string;
        trainingName: string;
    }
}

export interface CsCertificateService {
    fetchCertificatesV1(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<any>;
    fetchCertificatesV2(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]>;
    fetchCertificates(req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]>;
    getPublicKey(req: GetPublicKeyRequest, config?: CsCertificateServiceConfig): Observable<GetPublicKeyResponse>;
    getCerificateDownloadURI(req: FetchCertificateRequest, config?: CsCertificateServiceConfig): Observable<FetchCertificateResponse>;
    getLegacyCerificateDownloadURI(req: GetLegacyCertificateRequest, config?: CsCertificateServiceConfig): Observable<GetLegacyCertificateResponse>;
    //   verifyCertificate(req: CsVerifyCertificateRequest): Promise<any>;
    getCertificateDetails(req: CsGetCertificateRequest, config?: CsCertificateServiceConfig): Observable<CsCertificateDetailsResponse>;
    getEncodedData(req: string): Promise<any>;
    verifyCertificate(req: CsVerifyCertificateRequest, config?: CsCertificateServiceConfig): Promise<VerifyCertificateResponse>
}
