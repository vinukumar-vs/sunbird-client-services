import {CsContentType, CsMimeType, CsPrimaryCategory, CsResourceType} from '../../interface';

export class CsPrimaryCategoryMapper {
  private static readonly CATEGORY_MAP = {
    [CsContentType.ASSET.toLowerCase()]: CsPrimaryCategory.ASSET,
    [CsContentType.CLASSROOM_TEACHING_VIDEO.toLowerCase()]: CsPrimaryCategory.EXPLANATION_CONTENT,
    [CsContentType.CONCEPT_MAP.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.COURSE.toLowerCase()]: CsPrimaryCategory.COURSE,
    [CsContentType.COURSE_UNIT.toLowerCase()]: CsPrimaryCategory.COURSE_UNIT,
    [CsContentType.CURIOSITY_QUESTION_SET.toLowerCase()]: CsPrimaryCategory.PRACTICE_QUESTION_SET,
    [CsContentType.E_TEXTBOOK.toLowerCase()]: CsPrimaryCategory.E_TEXTBOOK,
    [CsContentType.EXPERIENTIAL_RESOURCE.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.EXPLANATION_RESOURCE.toLowerCase()]: CsPrimaryCategory.EXPLANATION_CONTENT,
    [CsContentType.EXPLANATION_VIDEO.toLowerCase()]: CsPrimaryCategory.EXPLANATION_CONTENT,
    [CsContentType.FOCUS_SPOT.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.LEARNING_OUTCOME_DEFINITION.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.MARKING_SCHEME_RUBRIC.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.ONBOARDING_RESOURCE.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.PEDAGOGY_FLOW.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.PRACTICE_QUESTION_SET.toLowerCase()]: CsPrimaryCategory.PRACTICE_QUESTION_SET,
    [CsContentType.PRACTICE_RESOURCE.toLowerCase()]: CsPrimaryCategory.PRACTICE_QUESTION_SET,
    [CsContentType.READING_MATERIAL.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.SELF_ASSESS.toLowerCase()]: CsPrimaryCategory.COURSE_ASSESSMENT,
    [CsContentType.TEACHING_METHOD.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.PLUGIN.toLowerCase()]: CsPrimaryCategory.PLUGIN,
    [CsContentType.TEXTBOOK.toLowerCase()]: CsPrimaryCategory.DIGITAL_TEXTBOOK,
    [CsContentType.TEXTBOOK_UNIT.toLowerCase()]: CsPrimaryCategory.TEXTBOOK_UNIT,
    [CsContentType.TEMPLATE.toLowerCase()]: CsPrimaryCategory.TEMPLATE,
    [CsContentType.COLLECTION.toLowerCase()]: CsPrimaryCategory.CONTENT_PLAYLIST,
    [CsContentType.EXPLANATION_READING_MATERIAL.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.LEARNING_ACTIVITY.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.LESSON_PLAN.toLowerCase()]: CsPrimaryCategory.CONTENT_PLAYLIST,
    [CsContentType.LESSON_PLAN_RESOURCE.toLowerCase()]: CsPrimaryCategory.TEACHER_RESOURCE,
    [CsContentType.LESSON_PLAN_UNIT.toLowerCase()]: CsPrimaryCategory.LESSON_PLAN_UNIT,
    [CsContentType.PREVIOUS_BOARD_EXAM_PAPERS.toLowerCase()]: CsPrimaryCategory.LEARNING_RESOURCE,
    [CsContentType.TV_LESSION.toLowerCase()]: CsPrimaryCategory.EXPLANATION_CONTENT,
  };


  public static getPrimaryCategory(contentType: string, mimeType: string, respurceType: string | undefined): string {
    if (contentType && contentType.toLowerCase() === CsContentType.RESOURCE.toLowerCase()) {
      switch (mimeType) {
        case  CsMimeType.VIDEO:
        case  CsMimeType.YOUTUBE:
        case  CsMimeType.WEBM:
          return CsPrimaryCategory.EXPLANATION_CONTENT;
        case  CsMimeType.H5P:
        case  CsMimeType.HTML:
        case  CsMimeType.APK:
          return CsPrimaryCategory.LEARNING_RESOURCE;
        case  CsMimeType.EPUB:
        case  CsMimeType.PDF:
        case  CsMimeType.ECML:
        case  CsMimeType.TXT_X_URL:
          return CsPrimaryCategoryMapper.getResourcePrimaryCategory(respurceType);
        default:
          return CsPrimaryCategory.LEARNING_RESOURCE;
      }
    }
    return CsPrimaryCategoryMapper.CATEGORY_MAP[contentType] || contentType;
  }

  private static getResourcePrimaryCategory(resourceType: string | undefined) {
    switch (resourceType) {
      case  CsResourceType.EXPERIMENT:
      case  CsResourceType.LEARN:
      case  CsResourceType.PLAY:
      case  CsResourceType.PRACTICE:
      case  CsResourceType.READ:
      case  CsResourceType.TEST:
        return CsPrimaryCategory.LEARNING_RESOURCE;
      case  CsResourceType.LESSON_PLAN:
      case  CsResourceType.TEACH:
        return CsPrimaryCategory.TEACHER_RESOURCE;
      default:
        return CsPrimaryCategory.LEARNING_RESOURCE;
    }
  }
}
