import { Container, inject, injectable } from "inversify";
import { defer, iif, Observable, of } from "rxjs";
import { CsCertificateServiceConfig } from '../../../index';
import { CsHttpRequestType, CsHttpService, CsRequest } from '../../../core/http-service/interface';
import { InjectionTokens } from '../../../injection-tokens';
import {
  CsCertificateService,
  GetPublicKeyRequest,
  GetPublicKeyResponse,
  DownloadCertificateResponse,
  DownloadCertificateRequest,
  CertificateType
} from "../interface";
import { map } from 'rxjs/operators';
import { CsSystemSettingsService } from "src/services/system-settings";

@injectable()
export class CertificateServiceImpl implements CsCertificateService {
  constructor(
    @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
    @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH) private apiPath: string,
    @inject(InjectionTokens.services.certificate.RC_API_PATH) private rcApiPath: string,
    @inject(InjectionTokens.CONTAINER) private container: Container,
    @inject(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE) private systemSettingsService: CsSystemSettingsService
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
    return of(undefined)
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
    return of(undefined)
  }

  getPublicKey(request: GetPublicKeyRequest, config?: CsCertificateServiceConfig): Observable<GetPublicKeyResponse> {
    const apiRequest: CsRequest = new CsRequest.Builder()
      .withType(CsHttpRequestType.POST)
      .withPath((config ? config.apiPath : this.apiPath) + `/${request.signingKey}`)
      .withBearerToken(true)
      .withUserToken(true)
      .withBody({ request })
      .build();

    return this.httpService.fetch<{ result: { SigningKey: GetPublicKeyResponse } }>(apiRequest)
      .pipe(
        map((response) => {
          return response.body.result.SigningKey;
        })
      );
  }

  getCerificateDownloadURI(request: DownloadCertificateRequest, config?: CsCertificateServiceConfig): Observable<DownloadCertificateResponse> {
    return iif(
      () => (request.type === CertificateType.RC_CERTIFICATE_REGISTRY),
      defer(async () => {
        let schemaName = request.schemaName
        if (!schemaName) {
          try {
            schemaName = await this.systemSettingsService.getSystemSettings("certificate_schema").toPromise();
          } catch(e){
            throw new Error('Schema Name Not found');
          }
        }
        const certificateRegistryRequest: CsRequest = new CsRequest.Builder()
          .withType(CsHttpRequestType.GET)
          .withPath((config ? config.rcApiPath : this.rcApiPath)!!.replace("${schemaName}", schemaName) + '/download/' + request.certificateId)
          .withBearerToken(true)
          .withHeaders({
            'Accept': "image/svg+xml"
          })
          .build();
        return this.httpService.fetch<string>(certificateRegistryRequest).pipe(
          map((response) => {
            return {
              printUri: response.body
            };
          })
        ).toPromise();
      }),
      defer(() => {
        const rcCertficateRequest: CsRequest = new CsRequest.Builder()
          .withType(CsHttpRequestType.GET)
          .withPath((config ? config.apiPath : this.apiPath) + '/download/' + request.certificateId)
          .withBearerToken(true)
          .withUserToken(true)
          .build();
        return this.httpService.fetch<{ result: { printUri: string } }>(rcCertficateRequest).pipe(
          map((response) => {
            return response.body.result;
          })
        );
      })
    );
  }

}