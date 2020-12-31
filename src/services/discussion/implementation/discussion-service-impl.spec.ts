import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsDiscussionService} from '../interface';
import {of} from 'rxjs';
import {DiscussionServiceImpl} from './discussion-service-impl';

describe('DiscussionServiceImpl', () => {
    let discussionService: CsDiscussionService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.discussion.DISCUSSION_SERVICE_API_PATH).toConstantValue(mockApiPath);

        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);
        container.bind<CsDiscussionService>(InjectionTokens.services.discussion.DISCUSSION_SERVICE).to(DiscussionServiceImpl).inSingletonScope();

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

                discussionService.fetchAllTags({apiPath: '/some_api_path', dataApiPath: '/some_api_path'}).subscribe((r) => {
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
                        request: request
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

                discussionService.createPost(request, {apiPath: '/some_api_path', dataApiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/topics',
                        body: {
                            request: request
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
                        request: request
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

                discussionService.votePost(10, request, {apiPath: '/some_api_path', dataApiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/v2/posts/10/vote',
                        body: {
                            request: request
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

});
