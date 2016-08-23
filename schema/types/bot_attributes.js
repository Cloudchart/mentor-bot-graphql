import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'


const OutputType = new GraphQLObjectType({

  name: 'BotAttributes',

  fields: () => ({

    token: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })

})


const InputType = new GraphQLInputObjectType({

  name: 'BotAttributesInput',

  fields: () => ({

    token: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })

})


export default {
  OutputType,
  InputType,
}
