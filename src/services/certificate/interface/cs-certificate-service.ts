import { Observable } from "rxjs";
import { CsLearnerCertificate, CsLearnerCertificateV1 } from "src/models";
import { CsCertificateServiceConfig } from "../../../index";


export interface GetPublicKeyRequest {
  signingKey: string;
  algorithim: String;
}

export interface GetPublicKeyResponse {
  osid: string;
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

export interface CSGetLearnerCerificateRequest {
    userId: string;
    size?: number;
}

export interface CsCertificateService {
    fetchCertificatesV1( req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<any>;
    fetchCertificatesV2( req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]>;
    fetchcertificates( req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]>;
    getPublicKey( req: GetPublicKeyRequest, config?: CsCertificateServiceConfig): Observable<GetPublicKeyResponse>;
    getCerificateDownloadURI(req: FetchCertificateRequest, config?: CsCertificateServiceConfig): Observable<FetchCertificateResponse>;
  }