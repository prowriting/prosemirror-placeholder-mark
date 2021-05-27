import { placeholder, CreateMark, ToggleMark } from '../..';
import { Schema } from 'prosemirror-model'
import { schema as baseSchema } from 'prosemirror-schema-basic'

CreateMark({
  className: 'placeholder',
  activeClassName: 'placeholder-active',
})

let marks = baseSchema.spec.marks
marks = marks.update('placeholder', CreateMark())
let schema = new Schema({
  nodes: baseSchema.spec.nodes,
  marks,
})

ToggleMark(schema.marks.placeholder)
placeholder(schema.marks.placeholder)
