import { Observable } from "rxjs";
import { CsCertificateServiceConfig } from "src";

export interface CSGetLearnerCerificateRequest {
    userId: string;
    size?: number;
}

export interface CsCertificateService {
    fetchCertificatesV1( req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<any>;
    fetchCertificatesV2( req: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<any>;
  }