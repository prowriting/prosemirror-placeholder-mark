const ist = require('ist')
const { doc: docgen, p, ph, schema } = require('./build')
const { TextSelection, EditorState } = require('prosemirror-state')
const { ToggleMark } = require('../dist')
function pp(o) { return JSON.stringify(o, null, 2) }

const command = ToggleMark(schema.marks.placeholder)
function test(doc, opts, result) {
  let stateOpts = { doc }
  if (opts.selection) {
    stateOpts.selection = new TextSelection(doc.resolve(opts.selection[0]), doc.resolve(opts.selection[1]))
  }
  let state = EditorState.create(stateOpts)
  let ran = command(state, tr => state = state.apply(tr))
  if (result == null) ist(ran, false)
  else ist(state.doc, result, (a, b) => a.eq(b))
}

describe('toggle-mark', () => {
  it('adds a placeholder to whole doc', () => {
    test(
      docgen(p('hello')),
      { selection: [0, 6] },
      docgen(p(ph('hello'))),
    )
  })

  it('adds a placeholder inside a doc', () => {
    test(
      docgen(p('hello')),
      { selection: [2, 4] },
      docgen(p('h', ph('el'), 'lo')),
    )
  })

  it('adds a placeholder to the end of a doc', () => {
    test(
      docgen(p('hello')),
      { selection: [4, 6] },
      docgen(p('hel', ph('lo'))),
    )
  })

  it('removes a placeholder to whole doc', () => {
    test(
      docgen(p(ph('hello'))),
      { selection: [0, 6] },
      docgen(p('hello')),
    )
  })

  it('removes a placeholder inside a doc', () => {
    test(
      docgen(p('h', ph('el'), 'lo')),
      { selection: [2, 4] },
      docgen(p('hello')),
    )
  })

  it('removes a placeholder to the end of a doc', () => {
    test(
      docgen(p('hel', ph('lo'))),
      { selection: [4, 6] },
      docgen(p('hello')),
    )
  })

  it('does nothing without a selection', () => {
    test(
      docgen(p('hello')),
      { selection: [0, 0] },
      docgen(p('hello')),
    )
  })

  it('does not add to storedMarks without a selection', () => {

  })

  it('when adding a mark, moves the cursor to the start', () => {

  })

  it('when removing a mark, does not move the cursor', () => {

  })
})
