import {Content} from '../content';

export interface PageAssemble {
    name: string;
    id: string;
    sections: Array<PageSections>;
}

export interface PageSections {
    display?: string;
    alt?: string;
    count: number;
    description?: string;
    index: number;
    sectionDataType: string;
    imgUrl?: string;
    resmsgId: string;
    collections?: Content[];
    contents?: Content[];
    searchQuery: string;
    name: string;
    id: string;
    apiId: string;
    group: number;
}
