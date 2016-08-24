import {
  GraphQLObjectType
} from 'graphql'

import {
  Create as CreateAuthor,
  Update as UpdateAuthor,
  Destroy as DestroyAuthor,
  AddBot as AddBotToAuthor,
  UpdateBot as UpdateAuthorBot,
  RemoveBot as RemoveBotFromAuthor,

  AddCourse as AddCourseToAuthor,
  RemoveCourse as RemoveAuthorCourse,
} from './author'

import {
  Create as CreateSurvey,
  Destroy as DestroySurvey,
  AddQuestion as AddQuestionToSurvey,
  RemoveQuestion as RemoveQuestionFromSurvey,
  ReorderQuestions as ReorderSurveyQuestions,
  AddAnswer as AddAnswerToSurveyQuestion,
  RemoveAnswer as RemoveAnswerFromSurveyQuestion,
  ReorderAnswers as ReorderSurveyQuestionAnswers,
} from './survey'

import {
  Add as AddScenarioToAuthor
} from './scenario'

import {
  Add as AddCardToCourse,
  Update as UpdateCard,
  Remove as RemoveCardFromCourse,
} from './card'


export default new GraphQLObjectType({

  name: 'MentorMutations',

  fields: () => ({

    createAuthor                    : CreateAuthor,
    updateAuthor                    : UpdateAuthor,
    destroyAuthor                   : DestroyAuthor,
    addBotToAuthor                  : AddBotToAuthor,
    updateAuthorBot                 : UpdateAuthorBot,
    removeBotFromAuthor             : RemoveBotFromAuthor,

    addCourseToAuthor               : AddCourseToAuthor,
    removeAuthorCourse              : RemoveAuthorCourse,

    addScenarioToAuthor             : AddScenarioToAuthor,

    addCardToCourse                 : AddCardToCourse,
    updateCard                      : UpdateCard,
    removeCardFromCourse            : RemoveCardFromCourse,

    // createSurvey                    : CreateSurvey,
    // destroySurvey                   : DestroySurvey,
    // addQuestionToSurvey             : AddQuestionToSurvey,
    // removeQuestionFromSurvey        : RemoveQuestionFromSurvey,
    // reorderSurveyQuestions          : ReorderSurveyQuestions,
    // addAnswerToSurveyQuestion       : AddAnswerToSurveyQuestion,
    // removeAnswerFromSurveyQuestion  : RemoveAnswerFromSurveyQuestion,
    // reorderSurveyQuestionAnswers    : ReorderSurveyQuestionAnswers
  })

})
