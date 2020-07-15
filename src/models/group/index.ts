import {User} from '../user';

export interface Group {
    identifier: string;
    name: string;
    description: string;
    objectType: string,
    status: string;
    versionKey: string;
    channel: string;
    framework: string;
    board: string;
    subject: string | string[];
    gradeLevel: string | string[];
    medium: string | string[];
    createdOn: string;
    lastUpdatedOn: string;
    createdBy: string;
    members: User[];
}
