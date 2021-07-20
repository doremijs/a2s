import { compile, templates } from 'eta'
import { readFileSync } from 'fs'
import { resolve } from 'path'

templates.define('schema.primitive', compile(`<%= it.type === 'integer' ? 'number' : it.type %>`))

templates.define(
  'schema.array',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.array.eta'), 'utf-8'))
)

templates.define(
  'schema.object',
  compile(readFileSync(resolve(__dirname, '../templates/partials/schema.object.eta'), 'utf-8'))
)

// export function renderSchema(schemaName: string, schema: OpenAPIV3.SchemaObject) {
//   const str = render(
//     `export interface <%= it.schemaName %> {
//       <% if (it.schema.type === 'array') { %>
//         <%~ include('schema.array', { items: it.schema.items })
//       <% } else if (it.schema.type === 'object') { %>
//         <%~ include('schema.object', { obj: it.schema })
//       <% } else { %>
//         <%~ include('schema.primitive', { type: it.schema.type })%>
//       <% } %>
//     %>`,
//     {
//       schema,
//       schemaName
//     }
//   ) as string

//   return formatFileContent(str)
// }
