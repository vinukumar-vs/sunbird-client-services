import { Container, inject, injectable } from "inversify";
import { Observable, of } from "rxjs";
import { CsCertificateServiceConfig } from "src";
import { CsHttpService } from "src/core/http-service";
import { InjectionTokens } from "src/injection-tokens";
import { CsCertificateService } from "../interface";

@injectable()
export class CertificateServiceImpl implements CsCertificateService {
  constructor(
    @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
    @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH) private apiPath: string,
    @inject(InjectionTokens.CONTAINER) private container: Container
  ) {
  }

    fetchCertificatesV1(certificateId: string, config?: CsCertificateServiceConfig): Observable<any> {
        // if (!this.certRegistrationApiPath && (!config || !config.certRegistrationApiPath)) {
        //     throw new Error('Required certRegistrationApiPath configuration');
        // }

        // const apiRequest: CsRequest = new CsRequest.Builder()
        //     .withType(CsHttpRequestType.GET)
        //     .withPath((config ? config.certRegistrationApiPath : this.certRegistrationApiPath) + '/download/' + certificateId)
        //     .withBearerToken(true)
        //     .withUserToken(true)
        //     .build();
        // return this.httpService.fetch<{ result: { printUri: string } }>(apiRequest).pipe(
        //     map((response) => {
        //         return response.body.result;
        //     })
        // );
        return of (undefined)
    }

    fetchCertificatesV2(certificateId: string, config?: CsCertificateServiceConfig): Observable<any> {
        // if (!this.certRegistrationApiPath && (!config || !config.certRegistrationApiPath)) {
        //     throw new Error('Required certRegistrationApiPath configuration');
        // }

        // const apiRequest: CsRequest = new CsRequest.Builder()
        //     .withType(CsHttpRequestType.GET)
        //     .withPath((config ? config.certRegistrationApiPath : this.certRegistrationApiPath) + '/download/' + certificateId)
        //     .withBearerToken(true)
        //     .withUserToken(true)
        //     .build();
        // return this.httpService.fetch<{ result: { printUri: string } }>(apiRequest).pipe(
        //     map((response) => {
        //         return response.body.result;
        //     })
        // );
        return of (undefined)
    }
  
}