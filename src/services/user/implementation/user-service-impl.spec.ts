import {CsUserService} from '../interface';
import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {UserServiceImpl} from './user-service-impl';
import {of} from 'rxjs';
import {ConsentStatus, UserDeclarationOperation, UserFeedCategory, UserFeedStatus} from '../../../models/user';

describe('UserServiceImpl', () => {
  let userService: CsUserService;
  const mockHttpService: Partial<CsHttpService> = {};
  const mockApiPath = 'MOCK_API_PATH';

  beforeAll(() => {
    const container = new Container();

    container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
    container.bind<string>(InjectionTokens.services.user.USER_SERVICE_API_PATH).toConstantValue(mockApiPath);

    container.bind<CsUserService>(InjectionTokens.services.user.USER_SERVICE).to(UserServiceImpl).inSingletonScope();

    userService = container.get<CsUserService>(InjectionTokens.services.user.USER_SERVICE);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be able to get an instance from the container', () => {
    expect(userService).toBeTruthy();
  });

  describe('checkUserExists()', () => {
    describe('when captchaResponse is not passed', () => {
      it('should be able to check if user exists with matching fields in request', (done) => {
        mockHttpService.fetch = jest.fn(() => {
          const response = new CsResponse();
          response.responseCode = 200;
          response.body = {
            result: {
              exists: true,
              id: 'SOME_USER_ID',
              userId: 'SOME_USER_ID',
              name: 'SOME_NAME',
              managedBy: 'SOME_OTHER_USER_ID'
            }
          };
          return of(response);
        });

        userService.checkUserExists({
          key: 'userId',
          value: 'SOME_USER_ID'
        }).subscribe((r) => {
          expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'GET',
            path: expect.stringContaining('/exists/userId/SOME_USER_ID')
          }));
          expect(r).toEqual({
            exists: true,
            id: 'SOME_USER_ID',
            userId: 'SOME_USER_ID',
            name: 'SOME_NAME',
            managedBy: 'SOME_OTHER_USER_ID'
          });
          done();
        });
      });
    });

    describe('when captchaResponse is passed', () => {
      it('should be able to check if user exists with matching fields in request with only token', (done) => {
        mockHttpService.fetch = jest.fn(() => {
          const response = new CsResponse();
          response.responseCode = 200;
          response.body = {
            result: {
              exists: true,
              id: 'SOME_USER_ID',
              userId: 'SOME_USER_ID',
              name: 'SOME_NAME',
              managedBy: 'SOME_OTHER_USER_ID'
            }
          };
          return of(response);
        });

        userService.checkUserExists({
          key: 'userId',
          value: 'SOME_USER_ID'
        }, {token: 'SOME_CAPTCHA_RESPONSE_TOKEN'}).subscribe((r) => {
          expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'GET',
            path: expect.stringContaining('/exists/userId/SOME_USER_ID'),
            parameters: {
              captchaResponse: 'SOME_CAPTCHA_RESPONSE_TOKEN',
            }
          }));
          expect(r).toEqual({
            exists: true,
            id: 'SOME_USER_ID',
            userId: 'SOME_USER_ID',
            name: 'SOME_NAME',
            managedBy: 'SOME_OTHER_USER_ID'
          });
          done();
        });
      });

      it('should be able to check if user exists with matching fields in request with token and app type', (done) => {
        mockHttpService.fetch = jest.fn(() => {
          const response = new CsResponse();
          response.responseCode = 200;
          response.body = {
            result: {
              exists: true,
              id: 'SOME_USER_ID',
              userId: 'SOME_USER_ID',
              name: 'SOME_NAME',
              managedBy: 'SOME_OTHER_USER_ID'
            }
          };
          return of(response);
        });

        userService.checkUserExists({
          key: 'userId',
          value: 'SOME_USER_ID'
        }, {token: 'SOME_CAPTCHA_RESPONSE_TOKEN', app: '1'}).subscribe((r) => {
          expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'GET',
            path: expect.stringContaining('/exists/userId/SOME_USER_ID'),
            parameters: expect.objectContaining({
              captchaResponse: 'SOME_CAPTCHA_RESPONSE_TOKEN',
              app: '1'
            })
          }));
          expect(r).toEqual({
            exists: true,
            id: 'SOME_USER_ID',
            userId: 'SOME_USER_ID',
            name: 'SOME_NAME',
            managedBy: 'SOME_OTHER_USER_ID'
          });
          done();
        });
      });
    });

    describe('when configuration is overridden', () => {
      it('should be able to check if user exists with matching fields in request', (done) => {
        mockHttpService.fetch = jest.fn(() => {
          const response = new CsResponse();
          response.responseCode = 200;
          response.body = {
            result: {
              exists: true,
              id: 'SOME_USER_ID',
              userId: 'SOME_USER_ID',
              name: 'SOME_NAME',
              managedBy: 'SOME_OTHER_USER_ID'
            }
          };
          return of(response);
        });

        userService.checkUserExists({
          key: 'userId',
          value: 'SOME_USER_ID'
        }, undefined, {
          apiPath: '/some_path'
        }).subscribe((r) => {
          expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'GET',
            path: expect.stringContaining('/some_path')
          }));
          expect(r).toEqual({
            exists: true,
            id: 'SOME_USER_ID',
            userId: 'SOME_USER_ID',
            name: 'SOME_NAME',
            managedBy: 'SOME_OTHER_USER_ID'
          });
          done();
        });
      });
    });
  });

  describe('updateUserDeclarations()', () => {
    it('should be able update user declarations providing appropriate http request', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {}
        };
        return of(response);
      });

      userService.updateUserDeclarations([
        {
          operation: UserDeclarationOperation.ADD,
          userId: 'SOME_USER_ID',
          orgId: 'SOME_ORG_ID',
          persona: 'SOME_PERSONA',
          info: {}
        },
        {
          operation: UserDeclarationOperation.EDIT,
          userId: 'SOME_USER_ID',
          orgId: 'SOME_ORG_ID',
          persona: 'SOME_PERSONA',
          info: {}
        }
      ]).subscribe(() => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'PATCH',
          path: expect.stringContaining('/declarations'),
          body: {
            request: {
              declarations: expect.arrayContaining([
                expect.objectContaining({
                  operation: UserDeclarationOperation.ADD,
                }),
                expect.objectContaining({
                  operation: UserDeclarationOperation.EDIT,
                })
              ])
            }
          }
        }));
        done();
      });
    });

    describe('when configuration is overridden', () => {
      it('should be able update user declarations providing appropriate http request', (done) => {
        mockHttpService.fetch = jest.fn(() => {
          const response = new CsResponse();
          response.responseCode = 200;
          response.body = {
            result: {}
          };
          return of(response);
        });

        userService.updateUserDeclarations([
          {
            operation: UserDeclarationOperation.ADD,
            userId: 'SOME_USER_ID',
            orgId: 'SOME_ORG_ID',
            persona: 'SOME_PERSONA',
            info: {}
          },
          {
            operation: UserDeclarationOperation.EDIT,
            userId: 'SOME_USER_ID',
            orgId: 'SOME_ORG_ID',
            persona: 'SOME_PERSONA',
            info: {}
          },
        ], {
          apiPath: '/some_path'
        }).subscribe(() => {
          expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'PATCH',
            path: expect.stringContaining('/some_path'),
            body: {
              request: {
                declarations: expect.arrayContaining([
                  expect.objectContaining({
                    operation: UserDeclarationOperation.ADD,
                  }),
                  expect.objectContaining({
                    operation: UserDeclarationOperation.EDIT,
                  })
                ])
              }
            }
          }));
          done();
        });
      });
    });
  });

  describe('updateConsent()', () => {
    it('should be able to update the consent if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            consent: {
              userId: 'SOME_USER_ID'
            },
            message: 'User Consent updated successfully',
          }
        };
        return of(response);
      });

      userService.updateConsent({
        status: ConsentStatus.ACTIVE,
        userId: 'userId',
        objectId: 'SOME_USER_ID',
        objectType: 'SOME_OBJECT_TYPE',
        consumerId: 'SOME_CONSUMER_ID',
        expiry: ''
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('consent/update')
        }));
        expect(r).toEqual({
          consent: {
            userId: 'SOME_USER_ID'
          },
          message: 'User Consent updated successfully',
        });
        done();
      });
    });

    it('should be able to update the consent when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            consent: {
              userId: 'SOME_USER_ID'
            },
            message: 'User Consent updated successfully',
          }
        };
        return of(response);
      });

      userService.updateConsent({
        status: ConsentStatus.ACTIVE,
        userId: 'userId',
        objectId: 'SOME_USER_ID',
        objectType: 'SOME_OBJECT_TYPE',
        consumerId: 'SOME_CONSUMER_ID',
        expiry: ''
      }, {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('consent/update')
        }));
        expect(r).toEqual({
          consent: {
            userId: 'SOME_USER_ID'
          },
          message: 'User Consent updated successfully'
        });
        done();
      });
    });
  });

  describe('getConsent()', () => {
    it('should be able to get consent the if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            consents: [{
              status: ConsentStatus.ACTIVE,
              userId: 'SOME_USER_ID',
              consumerId: 'SOME_CONSUMER_ID',
              objectId: 'SOME_OBJECT_ID',
              objectType: 'SOME_OBJECT_TYPE',
              expiry: 0
            }
            ]
          }
        };
        return of(response);
      });

      userService.getConsent({
        userId: 'userId',
        objectId: 'SOME_USER_ID',
        consumerId: 'SOME_CONSUMER_ID'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('consent/read')
        }));
        expect(r.consents).toEqual([{
          status: ConsentStatus.ACTIVE,
          userId: 'SOME_USER_ID',
          consumerId: 'SOME_CONSUMER_ID',
          objectId: 'SOME_OBJECT_ID',
          objectType: 'SOME_OBJECT_TYPE',
          expiry: 0
        }
        ]);
        done();
      });
    });

    it('should be able to get consent when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            consents: [{
              status: ConsentStatus.ACTIVE,
              userId: 'SOME_USER_ID',
              consumerId: 'SOME_CONSUMER_ID',
              objectId: 'SOME_OBJECT_ID',
              objectType: 'SOME_OBJECT_TYPE',
              expiry: 0
            }
            ]
          }
        };
        return of(response);
      });

      userService.getConsent({
        userId: 'userId',
        objectId: 'SOME_USER_ID',
        consumerId: 'SOME_CONSUMER_ID'
      }, {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('consent/read')
        }));
        expect(r.consents).toEqual([{
          status: ConsentStatus.ACTIVE,
          userId: 'SOME_USER_ID',
          consumerId: 'SOME_CONSUMER_ID',
          objectId: 'SOME_OBJECT_ID',
          objectType: 'SOME_OBJECT_TYPE',
          expiry: 0
        }
        ]);
        done();
      });
    });
  });

  describe('getUserFeed()', () => {
    it('should be able to get the user feed if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: { userFeed: [] }
          }
        };
        return of(response);
      });

      userService.getUserFeed('sample_user_id').subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GET',
          path: expect.stringContaining('/feed/sample_user_id')
        }));
        expect(r).toEqual([]);
        done();
      });
    });

    it('should be able to get the user feed when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: { userFeed: [] }
          }
        };
        return of(response);
      });

      userService.getUserFeed('sample_user_id', {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GET',
          path: expect.stringContaining('/some_path/feed/sample_user_id')
        }));
        expect(r).toEqual([]);
        done();
      });
    });
  });

  describe('updateUserFeedEntry()', () => {
    it('should be able to update user feed entry if response code is 200', (done) => {
      userService.getUserFeed = jest.fn(() => of([
        {
          id: 'sample_feed_id',
          category: UserFeedCategory.NOTIFICATION
        } as any
      ]));
      mockHttpService.fetch = jest.fn((apiRequest) => {
        const response = new CsResponse();
        response.responseCode = 200;
          response.body = {
            result: {
              response: {}
            }
          };
        return of(response);
      });

      userService.updateUserFeedEntry('sample_user_id', 'sample_feed_id', UserFeedCategory.NOTIFICATION, { status: UserFeedStatus.READ})
        .subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
          type: 'PATCH',
          path: expect.stringContaining('/feed/update')
        }));
        expect(r).toEqual({});
        done();
      });
    });

    it('should not invoke the API if the entry is not available in getUserFeed API', (done) => {
      userService.getUserFeed = jest.fn(() => of([
      ]));
      mockHttpService.fetch = jest.fn((apiRequest) => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: {}
          }
        };
        return of(response);
      });

      userService.updateUserFeedEntry('sample_user_id', 'sample_feed_id', UserFeedCategory.NOTIFICATION, { status: UserFeedStatus.READ})
        .subscribe((r) => {
          expect(mockHttpService.fetch).not.toHaveBeenNthCalledWith(1, expect.objectContaining({
            type: 'PATCH',
            path: expect.stringContaining('/feed/update')
          }));
          expect(r).toEqual({});
          done();
        });
    });

    it('should be able to update user feed entry iwhen configuration is overridden', (done) => {
      userService.getUserFeed = jest.fn(() => of([
        {
          id: 'sample_feed_id',
          category: UserFeedCategory.NOTIFICATION
        } as any
      ]));
      mockHttpService.fetch = jest.fn((apiRequest) => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: {}
          }
        };
        return of(response);
      });

      userService.updateUserFeedEntry('sample_user_id',
        'sample_feed_id', UserFeedCategory.NOTIFICATION,
        { status: UserFeedStatus.READ},
        {apiPath: '/some_path'})
        .subscribe((r) => {
          expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
            type: 'PATCH',
            path: expect.stringContaining('/some_path/feed/update')
          }));
          expect(r).toEqual({});
          done();
        });
    });
  });

  describe('deleteUserFeedEntry()', () => {
    it('should be able to delete user feed entry if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: {}
          }
        };
        return of(response);
      });

      userService.deleteUserFeedEntry('sample_user_id', 'sample_feed_id', UserFeedCategory.NOTIFICATION).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('/feed/delete')
        }));
        expect(r).toEqual({});
        done();
      });
    });

    it('should be able to get the user feed when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: {}
          }
        };
        return of(response);
      });

      userService.deleteUserFeedEntry('sample_user_id', 'sample_feed_id', UserFeedCategory.NOTIFICATION, {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'POST',
          path: expect.stringContaining('/some_path/feed/delete')
        }));
        expect(r).toEqual({});
        done();
      });
    });
  });

  describe('getProfileDetails()', () => {
    it('should be able to get profile details if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: {
              userId: 'sample_user_id'
            }
          }
        };
        return of(response);
      });

      userService.getProfileDetails({
        userId: 'sample_user_id',
        requiredFields: ['roles', 'location']
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GET',
          path: expect.stringContaining('read/sample_user_id')
        }));
        expect(r).toEqual({
          userId: 'sample_user_id'
        });
        done();
      });
    });

    it('should be able to get profile when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response:  {
              userId: 'sample_user_id'
            }
          }
        };
        return of(response);
      });

      userService.getProfileDetails({
        userId: 'sample_user_id',
        requiredFields: ['roles', 'location']
      }, {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'GET',
          path: expect.stringContaining('/some_path/read/sample_user_id')
        }));
        expect(r).toEqual({
          userId: 'sample_user_id'
        });
        done();
      });
    });
  });

  describe('updateProfile()', () => {
    it('should be able to update profile if response code is 200', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: 'SUCCESS',
            errors: []
          }
        };
        return of(response);
      });

      userService.updateProfile({
        userId: 'sample_user_id',
        locationCodes: ['101', '102']
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'PATCH',
          path: expect.stringContaining('update')
        }));
        expect(r).toEqual({
          response: 'SUCCESS',
          errors: []
        });
        done();
      });
    });

    it('should be able to update when configuration is overridden', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: 'SUCCESS',
            errors: []
          }
        };
        return of(response);
      });

      userService.updateProfile({
        userId: 'sample_user_id',
        locationCodes: ['101', '102']
      }, {
        apiPath: '/some_path'
      }).subscribe((r) => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: 'PATCH',
          path: expect.stringContaining('/some_path/update')
        }));
        expect(r).toEqual({
          response: 'SUCCESS',
          errors: []
        });
        done();
      });
    });
  });
});
