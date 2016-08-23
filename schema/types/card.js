import {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Interfaces from '../interfaces'


export const CardOrigin = new GraphQLObjectType({

  name: 'CardOrigin',

  fields: () => ({

    title: {
      type: GraphQLString,
    },

    url: {
      type: GraphQLString,
    },

    duration: {
      type: GraphQLInt,
    },

  })

})


export const CardOriginInput = new GraphQLInputObjectType({

  name: 'CardOriginInput',

  fields: () => ({

    title: {
      type: GraphQLString,
    },

    url: {
      type: GraphQLString,
    },

    duration: {
      type: GraphQLInt,
    },

  })

})



const Card = new GraphQLObjectType({

  name: 'Card',

  fields: () => ({

    id: globalIdField(),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    buttons: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: (card) => card.buttons || []
    },

    tags: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    },

    author: {
      type: GraphQLString
    },

    origin: {
      type: new GraphQLNonNull(CardOrigin)
    },

  }),

  interfaces: [Interfaces.Node]

})


Card.Origin = CardOrigin
Card.OriginInput = CardOriginInput

export default Card
