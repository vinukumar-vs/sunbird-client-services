import { Observable } from "rxjs";
import { CsCertificateServiceConfig } from "src";

export interface CsCertificateService {
    fetchCertificatesV1( req: any, config?: CsCertificateServiceConfig): Observable<any>;
    fetchCertificatesV2( req: any, config?: CsCertificateServiceConfig): Observable<any>;
  }