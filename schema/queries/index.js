import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  fromGlobalId
} from 'graphql-relay'

import {
  nodeField
} from '../node'

import {
  Author
} from '../../stores'

import Types from '../types'


export default new GraphQLObjectType({

  name: 'MentorQueries',

  fields: () => ({

    node: nodeField,

    root: {
      type: Types.Root,
      resolve: () => ({})
    },

    author: {
      type: new GraphQLNonNull(Types.Author),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (root, { id }) => Author.load(fromGlobalId(id).id)
    }

  })

})
