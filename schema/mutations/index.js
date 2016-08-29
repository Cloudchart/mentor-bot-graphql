import {
  GraphQLObjectType
} from 'graphql'

import {
  Create as CreateAuthor,
  Update as UpdateAuthor,
  Destroy as DestroyAuthor,

  AddCourse as AddCourseToAuthor,
  RemoveCourse as RemoveAuthorCourse,
} from './author'

import {
  Add as AddCardToCourse,
  Update as UpdateCard,
  Remove as RemoveCardFromCourse,
} from './card'

import {
  AddTelegramBotToAuthor,
  AddMessengerBotToAuthor,
  RemoveBotFromAuthor,
} from './bots'

import {
  AddScenarioToAuthor
} from './scenarios'


export default new GraphQLObjectType({

  name: 'MentorMutations',

  fields: () => ({

    createAuthor                    : CreateAuthor,
    updateAuthor                    : UpdateAuthor,
    destroyAuthor                   : DestroyAuthor,

    addCourseToAuthor               : AddCourseToAuthor,
    removeAuthorCourse              : RemoveAuthorCourse,

    addCardToCourse                 : AddCardToCourse,
    updateCard                      : UpdateCard,
    removeCardFromCourse            : RemoveCardFromCourse,

    addTelegramBotToAuthor          : AddTelegramBotToAuthor,
    addMessengerBotToAuthor         : AddMessengerBotToAuthor,
    removeBotFromAuthor             : RemoveBotFromAuthor,

    addScenarioToAuthor             : AddScenarioToAuthor,
  })

})
