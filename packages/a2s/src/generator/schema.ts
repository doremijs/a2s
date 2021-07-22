import { compile, templates } from 'eta'
import { readFileSync } from 'fs'
import { resolve } from 'path'

templates.define(
  'schema.primitive',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.primitive.eta'), 'utf-8'))
)

templates.define(
  'schema.comment',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.comment.eta'), 'utf-8'))
)

templates.define(
  'schema.array',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.array.eta'), 'utf-8'))
)

templates.define(
  'schema.object',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.object.eta'), 'utf-8'))
)

templates.define(
  'schema.ref',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.ref.eta'), 'utf-8'))
)

templates.define(
  'schema.any',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.any.eta'), 'utf-8'))
)
