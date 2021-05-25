const ist = require('ist')
const { doc: docgen, p, ph, schema } = require('./build')
const { TextSelection, EditorState } = require('prosemirror-state')
const isEqual = require('lodash/isEqual')
const { ToggleMark } = require('../dist')

const command = ToggleMark(schema.marks.placeholder)

function docTest(doc, opts = {}, result) {
  let stateOpts = { doc }
  if (opts.selection) {
    stateOpts.selection = new TextSelection(doc.resolve(opts.selection[0]), doc.resolve(opts.selection[1]))
  }
  let state = EditorState.create(stateOpts)
  let ran = command(state, tr => state = state.apply(tr))
  if (result == null) {
    ist(ran, false)
  } else {
    ist(state.doc, result, (a, b) => a.eq(b))
  }
}

function stateTest(doc, opts = {}, accessorFunc, result, cmp = null) {
  let stateOpts = { doc }
  if (opts.selection) {
    stateOpts.selection = new TextSelection(doc.resolve(opts.selection[0]), doc.resolve(opts.selection[1]))
  }
  let state = EditorState.create(stateOpts)
  let ran = command(state, tr => state = state.apply(tr))
  ist(accessorFunc(state), result, cmp)
}

describe('ToggleMark', () => {
  it('adds a placeholder to whole doc', () => {
    docTest(
      docgen(p('hello')),
      { selection: [0, 6] },
      docgen(p(ph('hello'))),
    )
  })

  it('adds a placeholder inside a doc', () => {
    docTest(
      docgen(p('hello')),
      { selection: [2, 4] },
      docgen(p('h', ph('el'), 'lo')),
    )
  })

  it('adds a placeholder to the end of a doc', () => {
    docTest(
      docgen(p('hello')),
      { selection: [4, 6] },
      docgen(p('hel', ph('lo'))),
    )
  })

  it('removes a placeholder to whole doc', () => {
    docTest(
      docgen(p(ph('hello'))),
      { selection: [0, 6] },
      docgen(p('hello')),
    )
  })

  it('removes a placeholder inside a doc', () => {
    docTest(
      docgen(p('h', ph('el'), 'lo')),
      { selection: [2, 4] },
      docgen(p('hello')),
    )
  })

  it('removes a placeholder to the end of a doc', () => {
    docTest(
      docgen(p('hel', ph('lo'))),
      { selection: [4, 6] },
      docgen(p('hello')),
    )
  })

  it('does nothing in cursor mode', () => {
    docTest(
      docgen(p('hello')),
      { selection: [1, 1] },
      docgen(p('hello')),
    )
  })

  it('does not add to storedMarks in cursor mode', () => {
    stateTest(
      docgen(p('hello')),
      { selection: [1, 1] },
      s => s.storedMarks,
      null
    )
  })

  it('when adding a mark, changes the selection to a cursor at the start', () => {
    stateTest(
      docgen(p('hello')),
      { selection: [3, 5] },
      s => s.selection.$cursor.pos,
      3
    )
  })

  it('when removing a mark, does not change the selection', () => {
    stateTest(
      docgen(p('he', ph('ll'), 'o')),
      { selection: [2, 5] },
      s => { return [
        s.selection.anchor,
        s.selection.head
      ]},
      [2, 5],
      isEqual
    )
  })
})
