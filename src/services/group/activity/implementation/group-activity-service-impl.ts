import {CsGroupActivityDataAggregation, CsGroupActivityService} from '../interface';
import {Observable} from 'rxjs';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../../core/http-service/interface';
import {map} from 'rxjs/operators';
import {CsGroupServiceConfig} from '../../../../cs-module';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';
import {GroupActivity} from '../../../../models/group';

@injectable()
export class GroupActivityServiceImpl implements CsGroupActivityService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.group.GROUP_SERVICE_DATA_API_PATH) private dataApiPath: string
    ) {
    }

    getDataAggregation(groupId: string, activity: Pick<GroupActivity, 'id' | 'type'>, config?: CsGroupServiceConfig): Observable<CsGroupActivityDataAggregation> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.dataApiPath : this.dataApiPath}/activity/agg`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activityId: activity.id,
                    activityType: activity.type
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupActivityDataAggregation }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }
}
