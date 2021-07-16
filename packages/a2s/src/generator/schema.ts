import { compile, render, templates } from 'eta'
import { JSONSchema7 } from 'json-schema'
import { formatFileContent } from '.'

templates.define('schema.primitive', compile(`<%= it.type %>;`))

templates.define(
  'schema.array',
  compile(`
<% if(['string', 'number', 'boolean'].includes(it.items.type)) {
%><%~ include('schema.primitive', { type: it.items.type }) %>
<% } else if (it.items.type === 'array') {
%><%~ include('schema.array', { items: it.items.items }) %>
<% } else if (it.items.type === 'object') {
%><%~ include('schema.object', { obj: it.items }) %>
<% } %>[]`)
)

templates.define(
  'schema.object',
  compile(`{
<% Object.keys(it.obj.properties).forEach(key => {
%><% var item = it.obj.properties[key] %>
  <%= key %><% if (!(it.obj.required || []).includes(key)) {
  %>?<% } %>: <%
  if(['string', 'number', 'boolean'].includes(item.type)) {
  %><%~ include('schema.primitive', { type: item.type })%>
  <% } else if (item.type === 'array') {
  %><%~ include('schema.array', { items: item.items }) %>
  <% } else if (item.type === 'object') {
  %><%~ include('schema.object', { obj: item }) %>
  <% } %>

<% }) %>
}`)
)

export function renderSchema(schemaName: string, schema: JSONSchema7) {
  const str = render(
    `export interface <%= it.schemaName %> {
      <% if (it.schema.type === 'array') { %>
        <%~ include('schema.array', { items: it.schema.items })
      <% } else if (it.schema.type === 'object') { %>
        <%~ include('schema.object', { obj: it.schema })
      <% } else { %>
        <%~ include('schema.primitive', { type: it.schema.type })%>
      <% } %>
    %>`,
    {
      schema,
      schemaName
    }
  ) as string

  return formatFileContent(str)
}
