import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsDiscussionService} from '../interface';
import {of} from 'rxjs';
import {DiscussionServiceImpl} from './discussion-service-impl';
import { CsFormService } from '../../form/interface/cs-form-service';

describe('DiscussionServiceImpl', () => {
    let discussionService: CsDiscussionService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';
    const mockFormService: Partial<CsFormService> = {};

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.discussion.DISCUSSION_SERVICE_API_PATH).toConstantValue(mockApiPath);

        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);
        container.bind<CsDiscussionService>(InjectionTokens.services.discussion.DISCUSSION_SERVICE).to(DiscussionServiceImpl).inSingletonScope();
        container.bind<CsFormService>(InjectionTokens.services.form.FORM_SERVICE).toConstantValue(mockFormService as CsFormService);

        discussionService = container.get<CsDiscussionService>(InjectionTokens.services.discussion.DISCUSSION_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(discussionService).toBeTruthy();
    });

    describe('fetchAllTags()', () => {
        it('should fetch all tags with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    tags: ['some_tag']
                };
                return of(response);
            });

            discussionService.fetchAllTags().subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    tags: ['some_tag']
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch all tags with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        tags: ['some_tag']
                    };
                    return of(response);
                });

                discussionService.fetchAllTags({apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/tags'
                    }));
                    expect(r).toEqual({
                        tags: ['some_tag']
                    });
                    done();
                });
            });
        });
    });

    describe('createPost()', () => {
        it('should be able to create a post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
            };

            discussionService.createPost(request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        ...request
                    }
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to create a post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                const request = {
                    name: 'SOME_NAME',
                };

                discussionService.createPost(request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/topics',
                        body: {
                            ...request
                        }
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('fetchAllCategories()', () => {
        it('should fetch all categories with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    categories: [{name: 'some_name'}]
                };
                return of(response);
            });

            discussionService.fetchAllCategories().subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    categories: [{name: 'some_name'}]
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch all categories with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        categories: [{name: 'some_name'}]
                    };
                    return of(response);
                });

                discussionService.fetchAllCategories({apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/categories'
                    }));
                    expect(r).toEqual({
                        categories: [{name: 'some_name'}]
                    });
                    done();
                });
            });
        });
    });

    describe('fetchSingleCategoryDetails()', () => {
        it('should fetch all categories with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    categories: [{name: 'some_name'}]
                };
                return of(response);
            });

            discussionService.fetchSingleCategoryDetails('some_cid').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    categories: [{name: 'some_name'}]
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch all categories with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        categories: [{name: 'some_name'}]
                    };
                    return of(response);
                });

                discussionService.fetchSingleCategoryDetails('some_cid', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/category/some_cid'
                    }));
                    expect(r).toEqual({
                        categories: [{name: 'some_name'}]
                    });
                    done();
                });
            });
        });
    });

    describe('votePost()', () => {
        it('should be able to create a post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
            };

            discussionService.votePost(10, request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        ...request
                    }
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to create a post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                const request = {
                    name: 'SOME_NAME',
                };

                discussionService.votePost(10, request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/posts/10/vote',
                        body: {
                            ...request
                        }
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('deleteVotePost()', () => {
        it('should delete post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            discussionService.deleteVotePost(10).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'DELETE',
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should delete post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.deleteVotePost(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'DELETE',
                        path: '/some_api_path/v2/posts/10/vote'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('bookmarkPost()', () => {
        it('should be able to bookmark a post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
            };

            discussionService.bookmarkPost(10).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST'
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to bookmark a post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });


                discussionService.bookmarkPost(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/posts/10/bookmark'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('deleteBookmarkPost()', () => {
        it('should delete bookmark post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            discussionService.deleteBookmarkPost(10).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'DELETE',
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should delete bookmark post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.deleteBookmarkPost(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'DELETE',
                        path: '/some_api_path/v2/posts/10/bookmark'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should create a user in nodebb', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.createUser(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/user/v1/create'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch the unread post count', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchUnreadCOunt({apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/topics/unread/total'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch the unread post count', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchProfileInfo('SOME_SLUG', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/users/SOME_SLUG/about'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch the unread post count', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchUpvoted('SOME_SLUG', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/SOME_SLUG/upvoted'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch the unread post count', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchDownvoted('SOME_SLUG', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/SOME_SLUG/downvoted'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch the unread post count', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchSaved('SOME_SLUG', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/SOME_SLUG/bookmarks'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('replyPost()', () => {
        it('should be able reply to a post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
            };

            discussionService.replyPost(10, request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        ...request
                    }
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able reply to a post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                const request = {
                    name: 'SOME_NAME',
                };

                discussionService.replyPost(10, request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/topics/10',
                        body: {
                            ...request
                        }
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('fetchRecentD()', () => {
        it('should fetch recent Id with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    postId: 'SOME_POST_ID'
                };
                return of(response);
            });

            discussionService.fetchRecentD(10).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    postId: 'SOME_POST_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch recent Id with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        postId: 'SOME_POST_ID'
                    };
                    return of(response);
                });

                discussionService.fetchRecentD(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/topics/recent/?page=10'
                    }));
                    expect(r).toEqual({
                        postId: 'SOME_POST_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('fetchUnreadCOunt()', () => {
        it('should fetch unread count with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    count: 10
                };
                return of(response);
            });

            discussionService.fetchUnreadCOunt().subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    count: 10
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch unread count with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        count: 10
                    };
                    return of(response);
                });

                discussionService.fetchUnreadCOunt({apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/topics/unread/total'
                    }));
                    expect(r).toEqual({
                        count: 10
                    });
                    done();
                });
            });
        });
    });

    describe('fetchProfileInfo()', () => {
        it('should fetch profile info with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    name: 'some_name'
                };
                return of(response);
            });

            discussionService.fetchProfileInfo('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    name: 'some_name'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch profile info with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        name: 'some_name'
                    };
                    return of(response);
                });

                discussionService.fetchProfileInfo('some_id', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/users/some_id/about'
                    }));
                    expect(r).toEqual({
                        name: 'some_name'
                    });
                    done();
                });
            });
        });
    });

    describe('fetchUpvoted()', () => {
        it('should fetch upvoted info with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    count: 10
                };
                return of(response);
            });

            discussionService.fetchUpvoted('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    count: 10
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch upvoted info with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        count: 10
                    };
                    return of(response);
                });

                discussionService.fetchUpvoted('some_id', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/some_id/upvoted'
                    }));
                    expect(r).toEqual({
                        count: 10
                    });
                    done();
                });
            });
        });
    });

    describe('fetchDownvoted()', () => {
        it('should fetch downvoted info with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    count: 10
                };
                return of(response);
            });

            discussionService.fetchDownvoted('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    count: 10
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch downvoted info with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        count: 10
                    };
                    return of(response);
                });

                discussionService.fetchDownvoted('some_id', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/some_id/downvoted'
                    }));
                    expect(r).toEqual({
                        count: 10
                    });
                    done();
                });
            });
        });
    });

    describe('fetchSaved()', () => {
        it('should fetch saved count with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    count: 10
                };
                return of(response);
            });

            discussionService.fetchSaved('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    count: 10
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch saved count with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        count: 10
                    };
                    return of(response);
                });

                discussionService.fetchSaved('some_id', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/some_id/bookmarks'
                    }));
                    expect(r).toEqual({
                        count: 10
                    });
                    done();
                });
            });
        });
    });

    describe('fetchNetworkProfile()', () => {
        it('should fetch network profile with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    name: 'some_name'
                };
                return of(response);
            });

            discussionService.fetchNetworkProfile('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    name: 'some_name'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch network profile with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        name: 'some_name'
                    };
                    return of(response);
                });

                discussionService.fetchNetworkProfile('some_id', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/some_id'
                    }));
                    expect(r).toEqual({
                        name: 'some_name'
                    });
                    done();
                });
            });
        });
    });

    describe('getContextBasedTopic()', () => {
        it('should fetch context based topic with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    name: 'some_name'
                };
                return of(response);
            });

            discussionService.getContextBasedTopic('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    name: 'some_name'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch context based topic with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        name: 'some_name'
                    };
                    return of(response);
                });

                discussionService.getContextBasedTopic('some_context', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/category/some_context'
                    }));
                    expect(r).toEqual({
                        name: 'some_name'
                    });
                    done();
                });
            });
        });
    });

    describe('getUserDetails()', () => {
        it('should fetch user details with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    name: 'some_name'
                };
                return of(response);
            });

            discussionService.getUserDetails('some_id').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    name: 'some_name'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch user details with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        name: 'some_name'
                    };
                    return of(response);
                });

                discussionService.getUserDetails('some_name', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/user/some_name'
                    }));
                    expect(r).toEqual({
                        name: 'some_name'
                    });
                    done();
                });
            });
        });
    });

    describe('editPost()', () => {
        it('should be able to edit a post with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    topicId: 'SOME_TOPIC_ID'
                };
                return of(response);
            });

            const request = {
                name: 'SOME_NAME',
            };

            discussionService.editPost(7, request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        ...request
                    }
                }));
                expect(r).toEqual({
                    topicId: 'SOME_TOPIC_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to create a post with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        topicId: 'SOME_TOPIC_ID'
                    };
                    return of(response);
                });

                const request = {
                    name: 'SOME_NAME',
                };

                discussionService.editPost(7 , request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/posts/7',
                        body: {
                            ...request
                        }
                    }));
                    expect(r).toEqual({
                        topicId: 'SOME_TOPIC_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('deleteTopic()', () => {
        it('should delete topic with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    topicId: 'SOME_TOPIC_ID'
                };
                return of(response);
            });

            discussionService.deletePost(10, 20).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'DELETE',
                }));
                expect(r).toEqual({
                    topicId: 'SOME_TOPIC_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should delete topic with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        topicId: 'SOME_TOPIC_ID'
                    };
                    return of(response);
                });

                discussionService.deletePost(10, 20, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'DELETE',
                        path: '/some_api_path/v2/posts/10?uid=20'
                    }));
                    expect(r).toEqual({
                        topicId: 'SOME_TOPIC_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('createForum()', () => {
        it('should create forum to group with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    forumId: 'SOME_FORUM_ID'
                };
                return of(response);
            });
            const req = {
                sbType: 'some_type',
                sbIdentifier: 'id',
                cid: 1
            }
            discussionService.createForum(req).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                }));
                expect(r).toEqual({
                    forumId: 'SOME_FORUM_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should create forum to group with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        forumId: 'SOME_FORUM_ID'
                    };
                    return of(response);
                });
                const req = {
                    sbType: 'some_type',
                    sbIdentifier: 'id',
                    cid: 1
                }

                discussionService.createForum(req, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/forum/v3/create'
                    }));
                    expect(r).toEqual({
                        forumId: 'SOME_FORUM_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('attachForum', () => {
        it('It should attach forum', () => {
            const formData = {
                data: {
                    fields: [
                        {
                            uid: 40,
                            category: {
                                context: ''
                            }
                        }
                    ]
                }
            }
            mockFormService.getForm = jest.fn(() => of(formData)as any )
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: ['SOME_FORUM_ID']
                };
                return of(response);
            });
            const req = {
                type: 'group',
                context: {
                    type: 'group',
                    identifier: 'some_id'
                }
            }
            discussionService.attachForum(req).subscribe((resp) => {
                expect(resp).toEqual('SOME_FORUM_ID');
            })
        });
    })

    describe('deleteTopic()', () => {
        it('should delete topic with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    forumId: 'SOME_TOPIC_ID'
                };
                return of(response);
            });
            discussionService.deleteTopic(10).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'DELETE',
                }));
                expect(r).toEqual({
                    forumId: 'SOME_TOPIC_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should delete with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        forumId: 'SOME_TOPIC_ID'
                    };
                    return of(response);
                });
                discussionService.deleteTopic(10, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'DELETE',
                        path: '/some_api_path/v2/topics/10'
                    }));
                    expect(r).toEqual({
                        forumId: 'SOME_TOPIC_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('editTopic()', () => {
        it('should edit a topic with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    forumId: 'SOME_TOPIC_ID'
                };
                return of(response);
            });
            const req = {
                sbType: 'some_type',
                sbIdentifier: 'id',
                cid: 1
            }
            discussionService.editTopic(10, req).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                }));
                expect(r).toEqual({
                    forumId: 'SOME_TOPIC_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should edit a topic with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        forumId: 'SOME_TOPIC_ID'
                    };
                    return of(response);
                });
                const req = {
                    sbType: 'some_type',
                    sbIdentifier: 'id',
                    cid: 1
                }

                discussionService.editTopic(10, req, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/topics/10'
                    }));
                    expect(r).toEqual({
                        forumId: 'SOME_TOPIC_ID'
                    });
                    done();
                });
            });
        });
    });

});
