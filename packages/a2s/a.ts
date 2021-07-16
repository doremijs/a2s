import { compile, render, templates } from 'eta'
import { formatFileContent } from './src/utils'

// configure({
//   autoTrim: 'nl'
// })

const schema = {
  type: 'object',
  properties: {
    a: {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            b: {
              type: 'string'
            }
          }
        },
        c: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              cc: {
                type: 'number'
              }
            }
          }
        },
        d: {
          type: 'boolean'
        }
      },
      required: ['a', 'd']
    }
  }
}

templates.define('schema.easy', compile(`<%= it.type %>;`))

templates.define(
  'schema.array',
  compile(`
<% if(['string', 'number', 'boolean'].includes(it.items.type)) {
%><%~ include('schema.easy', { type: it.items.type }) %>
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
  %><%~ include('schema.easy', { type: item.type })%>
  <% } else if (item.type === 'array') {
  %><%~ include('schema.array', { items: item.items }) %>
  <% } else if (item.type === 'object') {
  %><%~ include('schema.object', { obj: item }) %>
  <% } %>

<% }) %>
}`)
)

const a = render(`export type AA = <%~ include('schema.object', { obj: it.data }) %>`, {
  data: schema
}) as string

console.log(formatFileContent(a))
// console.log(a)
