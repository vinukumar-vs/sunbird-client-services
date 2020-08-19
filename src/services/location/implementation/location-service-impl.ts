import {CsLocationService, SearchLocationRequests} from '../interface';
import {CsLocationServiceConfig} from '../../../index';
import {Observable} from 'rxjs';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {Location} from '../../../models/location';
import {map} from 'rxjs/operators';

@injectable()
export class LocationServiceImpl implements CsLocationService {

    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.location.LOCATION_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    searchLocations(request?: SearchLocationRequests, config?: CsLocationServiceConfig): Observable<Location[]> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath((config ? config.apiPath : this.apiPath) + '/search')
            .withBearerToken(true)
            .withUserToken(false)
            .withBody({request})
            .build();

        return this.httpService.fetch<{ result: { response: Location[] } }>(apiRequest).pipe(
            map((success) => {
                return success.body.result.response;
            })
        );
    }

}
