import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  offsetToCursor,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import {
  Authors
} from '../../connections'

import {
  r,
  run,
  Author
} from '../../../stores'


const nodeOffset = ({ id }) =>
  run(Author.orderBy('name')('id').offsetsOf(id)).then(cursor => cursor.next())


// Create
//
export const Create = mutationWithClientMutationId({

  name: 'CreateAuthor',

  inputFields: () => ({

    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    root: {
      type: new GraphQLNonNull(Types.Root)
    },

    newAuthorEdge: {
      type: new GraphQLNonNull(Authors().edgeType),

      resolve: async ({ author }) => ({
        node    : author,
        cursor  : offsetToCursor(await nodeOffset(author))
      })
    }

  }),

  mutateAndGetPayload: async ({ name }) => {
    const author_id = await run(
      Author.insert({
        name        : name,
        created_at  : new Date
      })
    ).then(({ generated_keys }) => generated_keys[0])

    const author = await Author.load(author_id)

    return {
      root: {},
      author,
    }
  }

})


// Update
//
export const Update = mutationWithClientMutationId({

  name: 'UpdateAuthor',

  inputFields: {

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  },

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    }

  }),

  mutateAndGetPayload: async ({ authorID, name }) => {
    const author_id = fromGlobalId(authorID).id

    await run(
      Author.get(author_id).update({ name })
    )

    Author.clear(author_id)

    return {
      author: await Author.load(author_id)
    }

  }

})


// Destroy
//
export const Destroy = mutationWithClientMutationId({

  name: 'DestroyAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    root: {
      type: new GraphQLNonNull(Types.Root)
    },

    destroyedAuthorID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ authorID }) => {
    const author_id = fromGlobalId(authorID).id

    await run(
      Author.get(author_id).delete()
    )

    Author.clear(author_id)

    return {
      root: {},
      destroyedAuthorID: authorID
    }
  }

})
