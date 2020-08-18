import {CsGroupActivityAggregationMetric, CsGroupActivityService} from '../interface';
import {CsHttpService, CsResponse} from '../../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';
import {GroupActivityServiceImpl} from './group-activity-service-impl';
import {of, throwError} from 'rxjs';
import {Group} from '../../../../models/group';
import {CsHttpClientError} from '../../../../core/http-service/errors';

describe('GroupActivityServiceImpl', () => {
    let activityService: CsGroupActivityService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockDataApiPath = 'MOCK_DATA_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.group.GROUP_SERVICE_DATA_API_PATH).toConstantValue(mockDataApiPath);

        container.bind<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE).to(GroupActivityServiceImpl).inSingletonScope();

        activityService = container.get<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(activityService).toBeTruthy();
    });

    describe('getDataAggregation()', () => {
        it('should be able to get data aggregation of a group activity', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        'activity': {
                            'agg': [
                                {
                                    'metric': 'enrolmentCount',
                                    'lastUpdatedOn': '1594734425894',
                                    'value': 1
                                }
                            ],
                            'id': 'do_11305913172235878411827',
                            'type': 'course'
                        },
                        'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                        'members': [
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 1
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'checkdevuser103 checkdevuser103',
                                'userId': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'status': 'active'
                            }
                        ]
                    }
                };
                return of(response);
            });

            const activity = {
                id: 'SOME_ACTIVITY_ID',
                type: 'SOME_ACTIVITY_TYPE'
            };

            activityService.getDataAggregation('SOME_GROUP_ID', activity).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            activityId: 'SOME_ACTIVITY_ID',
                            activityType: 'SOME_ACTIVITY_TYPE'
                        }
                    }
                }));
                done();
            });
        });

        it('should merge missing members into response when mergeGroup provided', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        'activity': {
                            'agg': [
                                {
                                    'metric': 'enrolmentCount',
                                    'lastUpdatedOn': '1594734425894',
                                    'value': 1
                                }
                            ],
                            'id': 'do_11305913172235878411827',
                            'type': 'course'
                        },
                        'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                        'members': [
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 10
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'member2',
                                'userId': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'status': 'active'
                            }
                        ]
                    }
                };
                return of(response);
            });

            const activity = {
                id: 'SOME_ACTIVITY_ID',
                type: 'SOME_ACTIVITY_TYPE'
            };

            const mergeGroup = {
                'activities': [],
                'members': [
                    {
                        'userId': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member1'
                    },
                    {
                        'userId': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member2'
                    },
                    {
                        'userId': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member3'
                    }
                ]
            } as Partial<Group>;

            activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group).subscribe((response) => {
                expect(response.members).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        agg: expect.arrayContaining([
                            expect.objectContaining({
                                metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT,
                                value: 0
                            })
                        ]),
                        name: 'member1'
                    }),
                    expect.objectContaining({
                        agg: expect.arrayContaining([
                            expect.objectContaining({
                                metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT,
                                value: 10
                            })
                        ]),
                        name: 'member2'
                    }),
                    expect.objectContaining({
                        agg: expect.arrayContaining([
                            expect.objectContaining({
                                metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT,
                                value: 0
                            })
                        ]),
                        name: 'member3'
                    }),
                ]));
                done();
            });
        });

        it('should exclude duplicate metrics, taking higher value with precedence', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        'activity': {
                            'agg': [
                                {
                                    'metric': 'enrolmentCount',
                                    'lastUpdatedOn': '1594734425894',
                                    'value': 1
                                }
                            ],
                            'id': 'do_11305913172235878411827',
                            'type': 'course'
                        },
                        'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                        'members': [
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 10
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'member2',
                                'userId': 'member2',
                                'status': 'active'
                            },
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 20
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'member2',
                                'userId': 'member2',
                                'status': 'active'
                            },
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 0
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'member3',
                                'userId': 'member3',
                                'status': 'active'
                            },
                            {
                                'agg': [
                                    {
                                        'metric': 'completedCount',
                                        'lastUpdatedOn': 1594734198,
                                        'value': 40
                                    }
                                ],
                                'role': 'admin',
                                'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                'name': 'member3',
                                'userId': 'member3',
                                'status': 'active'
                            }
                        ]
                    }
                };
                return of(response);
            });

            const activity = {
                id: 'SOME_ACTIVITY_ID',
                type: 'SOME_ACTIVITY_TYPE'
            };

            const mergeGroup = {
                'activities': [],
                'members': [
                    {
                        'userId': 'member3',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member3'
                    },
                    {
                        'userId': 'member1',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member1'
                    },
                    {
                        'userId': 'member2',
                        'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                        'role': 'admin',
                        'status': 'active',
                        'createdOn': '2020-07-15 11:44:07:291+0000',
                        'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                        'name': 'member2'
                    }
                ]
            } as Partial<Group>;

            activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group).subscribe((response) => {
                expect(response.members.map((m) => m.name + '-' + m.agg[0].value)).toEqual(['member3-40', 'member1-0', 'member2-20']);
                done();
            });
        });

        describe('when leafNodeCount available', () => {
            it('should add progress metric when leafNodeCount available via mergeGroup only', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            'activity': {
                                'agg': [
                                    {
                                        'metric': 'enrolmentCount',
                                        'lastUpdatedOn': '1594734425894',
                                        'value': 1
                                    }
                                ],
                                'id': 'do_11305913172235878411827',
                                'type': 'course'
                            },
                            'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                            'members': [
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 110
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member1',
                                    'userId': 'member1',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 10
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member2',
                                    'userId': 'member2',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 20
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member2',
                                    'userId': 'member2',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 0
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member3',
                                    'userId': 'member3',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 40
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member3',
                                    'userId': 'member3',
                                    'status': 'active'
                                }
                            ]
                        }
                    };
                    return of(response);
                });

                const activity = {
                    id: 'do_11305913172235878411827',
                    type: 'Course'
                };

                const mergeGroup = {
                    'activities': [
                        {
                            id: 'do_11305913172235878411827',
                            type: 'Course',
                            activityInfo: {
                                identifier: 'do_21301074192677273611434',
                                appIcon: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127814568517795841477/artifact/100x100_1560236432219.jpg',
                                name: ' "Courses Batches" ',
                                organisation: ['Odisha'],
                                topic: ['Teaching and Classroom Management', 'Leadership Management', 'ICT'],
                                language: ['English'],
                                mimeType: 'application/vnd.ekstep.content-collection',
                                contentType: 'Course',
                                objectType: 'Content',
                                resourceType: 'Course',
                                leafNodesCount: 100
                            }
                        }
                    ],
                    'members': [
                        {
                            'userId': 'member3',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member3'
                        },
                        {
                            'userId': 'member1',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member1'
                        },
                        {
                            'userId': 'member2',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member2'
                        }
                    ]
                } as Partial<Group>;

                activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group).subscribe((response) => {
                    expect(response.members).toEqual([
                        expect.objectContaining({
                            name: 'member3',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 40
                                }),
                            ]),
                        }),
                        expect.objectContaining({
                            name: 'member1',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 100
                                }),
                            ]),
                        }),
                        expect.objectContaining({
                            name: 'member2',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 20
                                }),
                            ]),
                        })
                    ]);
                    done();
                });
            });

            it('should add progress metric when leafNodeCount available via request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            'activity': {
                                'agg': [
                                    {
                                        'metric': 'enrolmentCount',
                                        'lastUpdatedOn': '1594734425894',
                                        'value': 1
                                    }
                                ],
                                'id': 'do_11305913172235878411827',
                                'type': 'course'
                            },
                            'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                            'members': [
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 110
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member1',
                                    'userId': 'member1',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 10
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member2',
                                    'userId': 'member2',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 20
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member2',
                                    'userId': 'member2',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 0
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member3',
                                    'userId': 'member3',
                                    'status': 'active'
                                },
                                {
                                    'agg': [
                                        {
                                            'metric': 'completedCount',
                                            'lastUpdatedOn': 1594734198,
                                            'value': 40
                                        }
                                    ],
                                    'role': 'admin',
                                    'createdBy': 'ec861024-c55f-4ca0-80fa-17e1575718d9',
                                    'name': 'member3',
                                    'userId': 'member3',
                                    'status': 'active'
                                }
                            ]
                        }
                    };
                    return of(response);
                });

                const activity = {
                    id: 'do_11305913172235878411827',
                    type: 'Course'
                };

                const mergeGroup = {
                    'activities': [
                        {
                            id: 'do_11305913172235878411827',
                            type: 'Course',
                            activityInfo: {
                                identifier: 'do_21301074192677273611434',
                                appIcon: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127814568517795841477/artifact/100x100_1560236432219.jpg',
                                name: ' "Courses Batches" ',
                                organisation: ['Odisha'],
                                topic: ['Teaching and Classroom Management', 'Leadership Management', 'ICT'],
                                language: ['English'],
                                mimeType: 'application/vnd.ekstep.content-collection',
                                contentType: 'Course',
                                objectType: 'Content',
                                resourceType: 'Course',
                                leafNodesCount: 1000
                            }
                        }
                    ],
                    'members': [
                        {
                            'userId': 'member3',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member3'
                        },
                        {
                            'userId': 'member1',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member1'
                        },
                        {
                            'userId': 'member2',
                            'groupId': 'fee4fc21-dbef-4b32-bc31-de6f7b07c587',
                            'role': 'admin',
                            'status': 'active',
                            'createdOn': '2020-07-15 11:44:07:291+0000',
                            'createdBy': '1c8b6384-27aa-4dcf-a7e7-c2cecb7db26a',
                            'name': 'member2'
                        }
                    ]
                } as Partial<Group>;

                activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group, 100).subscribe((response) => {
                    expect(response.members).toEqual([
                        expect.objectContaining({
                            name: 'member3',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 40
                                }),
                            ]),
                        }),
                        expect.objectContaining({
                            name: 'member1',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 100
                                }),
                            ]),
                        }),
                        expect.objectContaining({
                            name: 'member2',
                            agg: expect.arrayContaining([
                                expect.objectContaining({
                                    metric: CsGroupActivityAggregationMetric.PROGRESS,
                                    lastUpdatedOn: expect.anything(),
                                    value: 20
                                }),
                            ]),
                        })
                    ]);
                    done();
                });
            });
        });

        it('should merge missing metric leafNodesCount into response when mergeGroup provided', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        'activity': {
                            'agg': [
                                {
                                    'metric': 'enrolmentCount',
                                    'lastUpdatedOn': '1594734425894',
                                    'value': 1
                                }
                            ],
                            'id': 'do_11305913172235878411827',
                            'type': 'course'
                        },
                        'groupId': 'f5fd09d5-7697-4c54-bb25-28758c9a2a45',
                        'members': []
                    }
                };
                return of(response);
            });

            const activity = {
                id: 'do_11305913172235878411827',
                type: 'Course'
            };

            const mergeGroup = {
                activities: [
                    {
                        id: 'do_11305913172235878411827',
                        type: 'Course',
                        activityInfo: {
                            identifier: 'do_21301074192677273611434',
                            appIcon: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127814568517795841477/artifact/100x100_1560236432219.jpg',
                            name: ' "Courses Batches" ',
                            organisation: ['Odisha'],
                            topic: ['Teaching and Classroom Management', 'Leadership Management', 'ICT'],
                            language: ['English'],
                            mimeType: 'application/vnd.ekstep.content-collection',
                            contentType: 'Course',
                            objectType: 'Content',
                            resourceType: 'Course',
                            leafNodesCount: 100
                        }
                    }
                ],
                members: []
            } as Partial<Group>;

            activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group).subscribe((response) => {
                expect(response.activity).toEqual(expect.objectContaining({
                    agg: expect.arrayContaining([
                        expect.objectContaining({
                            metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT,
                            lastUpdatedOn: '1594734425894',
                            value: 1
                        }),
                        expect.objectContaining({
                            metric: CsGroupActivityAggregationMetric.LEAF_NODES_COUNT,
                            value: 100
                        })
                    ]),
                }));
                done();
            });
        });

        it('should build empty response for client error - "No member found in this group"', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 400;
                response.body = {
                    'id': 'api.group.activity.agg',
                    'ver': 'v1',
                    'ts': '2020-07-15 09:51:14:366+0000',
                    'params': {
                        'resmsgid': null,
                        'msgid': '5e04c8b7-9fac-4f14-9158-7a63d5292c1b',
                        'err': null,
                        'status': 'SERVER_ERROR',
                        'errmsg': 'No member found in this group.'
                    },
                    'responseCode': 'CLIENT_ERROR',
                    'result': {}
                };
                return throwError(new CsHttpClientError('CLIENT_ERROR', response));
            });

            const activity = {
                id: 'do_11305913172235878411827',
                type: 'Course'
            };

            const mergeGroup = {
                activities: [
                    {
                        id: 'do_11305913172235878411827',
                        type: 'Course',
                        activityInfo: {
                            identifier: 'do_21301074192677273611434',
                            appIcon: 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127814568517795841477/artifact/100x100_1560236432219.jpg',
                            name: ' "Courses Batches" ',
                            organisation: ['Odisha'],
                            topic: ['Teaching and Classroom Management', 'Leadership Management', 'ICT'],
                            language: ['English'],
                            mimeType: 'application/vnd.ekstep.content-collection',
                            contentType: 'Course',
                            objectType: 'Content',
                            resourceType: 'Course',
                            leafNodesCount: 100
                        }
                    }
                ],
                members: []
            } as Partial<Group>;

            activityService.getDataAggregation('SOME_GROUP_ID', activity, mergeGroup as Group).subscribe((response) => {
                expect(response).toEqual(expect.objectContaining({
                    activity: {
                        agg: expect.arrayContaining([
                            expect.objectContaining({
                                metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT as any,
                                value: 0
                            }),
                            expect.objectContaining({
                                metric: CsGroupActivityAggregationMetric.LEAF_NODES_COUNT as any,
                                value: 100
                            })
                        ]),
                        id: activity.id,
                        type: activity.type
                    },
                    groupId: 'SOME_GROUP_ID',
                    members: []
                }));
                done();
            });
        });
    });
});
