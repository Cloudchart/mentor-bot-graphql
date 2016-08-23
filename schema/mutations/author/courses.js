import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import Types from '../../types'

import {
  AuthorCourses
} from '../../connections'

import {
  r,
  run,
  Author,
  Course,
} from '../../../stores'


// Add
//
export const Add = mutationWithClientMutationId({

  name: 'AddCourseToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    courseName: {
      type: new GraphQLNonNull(GraphQLString)
    },

    courseAuthor: {
      type: GraphQLString
    }

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    newCourseEdge: {
      type: new GraphQLNonNull(AuthorCourses().edgeType),
      resolve: AuthorCourses().nodeToEdge
    }

  }),

  mutateAndGetPayload: async ({ authorID, courseName, courseAuthor }) => {
    const author_id = fromGlobalId(authorID).id

    const course_id = await run(
      Course.insert({
        name    : courseName,
        author  : courseAuthor,
      })
    ).then(({ generated_keys }) => generated_keys[0])

    await run(
      Author.get(author_id).update({
        courses     : r.row('courses').default([]).append({ id: course_id }),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const course = await Course.load(course_id)

    const author = await Author.load(author_id)

    return {
      author,
      course
    }
  }

})


//
// Remove
export const Remove = mutationWithClientMutationId({

  name: 'RemoveAuthorCourse',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    courseID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    destroyedCourseID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ authorID, courseID }) => {
    const author_id = fromGlobalId(authorID).id
    const course_id = fromGlobalId(courseID).id

    await run(Course.get(course_id).delete())

    Course.clear(course_id)

    await run(
      Author.get(author_id).update({
        courses     : r.row('courses').filter(course => course('id').ne(course_id)),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)

    return {
      author,
      destroyedCourseID : courseID
    }

  }

})
