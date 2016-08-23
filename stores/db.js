import r from 'rethinkdb'

const connection = r.connect({
  host      : 'localhost',
  post      : '28015',
  db        : 'courses',
  user      : 'admin',
  password  : ''
})

const run = async (query) => query.run(await connection)

export {
  r, run
}
