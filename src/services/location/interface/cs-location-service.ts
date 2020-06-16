import {Observable} from 'rxjs';
import {Location} from '../../../models/location';
import {CsLocationServiceConfig} from '../../../index';

export interface SearchLocationRequests {
    filter?: {
        query?: string;
        type: string;
        parentId?: string;
        code?: string;
        limit?: number;
        offset?: string;
    };
}

export interface CsLocationService {
    searchLocations(request?: SearchLocationRequests, config?: CsLocationServiceConfig): Observable<Location[]>;
}
