export interface Form<Field = {}> {
    type: string;
    subtype: string;
    action: string;
    component: string;
    framework: string;
    data: {
        templateName: string;
        action: string;
        fields: Field[];
    };
    created_on: string;
    last_modified_on?: string;
    rootOrgId: string;
}
