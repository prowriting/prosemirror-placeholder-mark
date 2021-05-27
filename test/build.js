const { Schema } = require('prosemirror-model')
const { schema: baseSchema } = require('prosemirror-schema-basic')
const { CreateMark } = require('../dist')

let marks = baseSchema.spec.marks
marks = marks.update('placeholder', CreateMark())
let schema = new Schema({
  nodes: baseSchema.spec.nodes,
  marks
})

let e = module.exports = require('prosemirror-test-builder').builders(schema, {
  p: { nodeType: 'paragraph' },
  ph: { markType: 'placeholder' }
})

e.schema = schema;
