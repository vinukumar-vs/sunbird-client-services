import {CsPrimaryCategoryMapper} from './cs-primary-category-mapper';
import {CsContentType, CsMimeType, CsPrimaryCategory, CsResourceType} from '../../interface';

describe('CsPrimaryCategoryMapper', () => {
    it('should return primaryCaterory = EXPLANATION_CONTENT if contentType = Resource and mimeType is video', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.VIDEO, CsResourceType.TEACH)).toEqual(CsPrimaryCategory.EXPLANATION_CONTENT);
    });

    it('should return primaryCaterory = LEARNING_RESOURCE if contentType = Resource and mimeType is H5P', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.H5P, CsResourceType.TEACH)).toEqual(CsPrimaryCategory.LEARNING_RESOURCE);
    });

    it('should return primaryCaterory = LEARNING_RESOURCE if contentType = Resource , mimeType is PDF and  resourceType is EXPERIMENT', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.EPUB, CsResourceType.EXPERIMENT)).toEqual(CsPrimaryCategory.LEARNING_RESOURCE);
    });

    it('should return primaryCaterory = TEACHER_RESOURCE if contentType = Resource , mimeType is PDF and  resourceType is LESSON_PLAN', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.PDF, CsResourceType.LESSON_PLAN)).toEqual(CsPrimaryCategory.TEACHER_RESOURCE);
    });

    it('should return primaryCaterory = TEACHER_RESOURCE if contentType = Resource , mimeType is PDF and  resourceType is LESSON_PLAN', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.PDF, undefined)).toEqual(CsPrimaryCategory.LEARNING_RESOURCE);
    });

    it('should return primaryCaterory = LEARNING_RESOURCE if contentType = Resource , mimeType is PDF and  resourceType is LESSON_PLAN', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, CsMimeType.PDF, undefined)).toEqual(CsPrimaryCategory.LEARNING_RESOURCE);
    });

    it('should return primaryCaterory = TEACHER_RESOURCE if resourceType is unknown', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.RESOURCE, 'SOMETHING_NEW', undefined)).toEqual(CsPrimaryCategory.LEARNING_RESOURCE);
    });

    it('should return primaryCaterory = DIGITAL_TEXTBOOK if contentType is not Resource', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          CsContentType.TEXTBOOK.toLowerCase(), CsMimeType.COLLECTION, undefined)).toEqual(CsPrimaryCategory.DIGITAL_TEXTBOOK);
    });

    it('should return primaryCaterory  as it is if mapping is not there', () => {
        expect(CsPrimaryCategoryMapper.getPrimaryCategory(
          'SOMETHING_NEW', CsMimeType.COLLECTION, undefined)).toEqual('SOMETHING_NEW');
    });
});
