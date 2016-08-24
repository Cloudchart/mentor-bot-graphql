import express from 'express'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import MentorSchema from './schema'


const app = express()


app.use(`${ process.env.PATH_PREFIX || '/graphql' }`, cors(), graphqlHTTP(req => ({
  schema    : MentorSchema,
  graphiql  : true
})))


app.listen(process.env.PORT)
