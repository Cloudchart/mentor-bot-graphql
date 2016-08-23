import fs from 'fs'
import path from 'path'

import Model from '../base'
import { r, run } from '../db'

const Models = {}
const basename = path.basename(__filename)

fs
  .readdirSync(__dirname)
  .filter(filename => filename !== basename)
  .forEach(filename => {
    let model = require(path.resolve(__dirname, filename)).default
    Models[model.modelName] = model
  })

module.exports = Models

export default Models
