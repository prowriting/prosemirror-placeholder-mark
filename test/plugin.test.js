const ist = require('ist')
const { doc: docgen, p, ph, schema } = require('./build')
const { TextSelection, EditorState } = require('prosemirror-state')
const isEqual = require('lodash/isEqual')
const { placeholder } = require('../dist')
const { EditorView } = require('prosemirror-view')

const plugins = [
  placeholder(schema.marks.placeholder)
]

function setup(doc) {
  return EditorState.create({ doc, plugins })
}

function stateTest(state, actionFunc, accessorFunc, result, cmp = isEqual) {
  let tr = state.tr
  tr = actionFunc(tr)
  let newState = state.apply(tr)
  // OVerride isEqual as default comparison if comparing doc objects
  if (!cmp && accessorFunc(newState).eq(newState.doc)) {
    cmp = (a, b) => a.eq(b)
  }
  ist(accessorFunc(newState), result, cmp)
  return state
}

describe('plugin', () => {
  it('cursor in placeholder moves to start', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
      s => s.selection.$cursor.pos,
      9,
    )
  })

  it('cursor after placeholder moves to start', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 13, 13)),
      s => s.selection.$cursor.pos,
      9,
    )
  })

  it('cursor after+1 placeholder does not move', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 14, 14)),
      s => s.selection.$cursor.pos,
      14,
    )
  })

  it('cursor before-1 placeholder does not move', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 8, 8)),
      s => s.selection.$cursor.pos,
      8,
    )
  })

  it('placeholder starts inactive', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr,
      s => s.doc.resolve(11).nodeAfter.marks.map(m => m.attrs.active)[0],
      false,
    )
  })

  it('cursor outside placeholder leaves it inactive', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 5, 5)),
      s => s.doc.resolve(11).nodeAfter.marks.map(m => m.attrs.active)[0],
      false,
    )
  })

  it('cursor in placeholder sets it to active', () => {
    stateTest(
      setup(docgen(p('hello my', ph('name')), p('is richard'))),
      tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
      s => s.doc.resolve(11).nodeAfter.marks.map(m => m.attrs.active)[0],
      true,
    )
  })

  it('sets and unsets an active placeholder', () => {
    let state = setup(docgen(p('hello my', ph('name')), p('is richard')))
    let state2 = stateTest(
      state,
      tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
      s => s.doc.resolve(11).nodeAfter.marks.map(m => m.attrs.active)[0],
      true,
    )
    stateTest(
      state2,
      tr => tr.setSelection(TextSelection.create(tr.doc, 5, 5)),
      s => s.doc.resolve(11).nodeAfter.marks.map(m => m.attrs.active)[0],
      false,
    )
  })

  it('typing removes placeholder', () => {
    let state = setup(docgen(p('hello my', ph('name')), p('is richard')))
    let tr = state.tr
    tr.setSelection(TextSelection.create(tr.doc, 10, 10))
    state = state.apply(tr)
    tr = state.tr
    tr.insertText(' x', 9, 9)
    state = state.apply(tr)
    stateTest(
      state,
      tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
      s => s.doc,
      docgen(p('hello my x'), p('is richard')),
      (a, b) => a.eq(b)
    )
  })

  describe('placeholder at start of line', () => {
    it('cursor sets active', () => {
      let state = stateTest(
        setup(docgen(p('hello my name'), p(ph('is ri'), 'chard'))),
        tr => tr.setSelection(TextSelection.create(tr.doc, 16, 16)),
        s => s.doc.resolve(16).nodeAfter.marks.map(m => m.attrs.active)[0],
        true,
      )
    })

    it('typing removes placeholder', () => {
      let state = setup(docgen(p('hello my name'), p(ph('is ri'), 'chard')))
      let tr = state.tr
      tr.setSelection(TextSelection.create(tr.doc, 16, 16))
      state = state.apply(tr)
      tr = state.tr
      tr.insertText('x', 16, 16)
      state = state.apply(tr)
      stateTest(
        state,
        tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
        s => s.doc,
        docgen(p('hello my name'), p('xchard')),
        (a, b) => a.eq(b)
      )
    })

    it('backspace correctly keeps placeholder across lines', () => {
      let state = setup(docgen(p('hello my name'), p(ph('is ri'), 'chard')))
      let tr = state.tr
      tr.setSelection(TextSelection.create(tr.doc, 16, 16))
      state = state.apply(tr)
      tr = state.tr
      tr.delete(14, 16)
      state = state.apply(tr)
      stateTest(
        state,
        tr => tr.setSelection(TextSelection.create(tr.doc, 11, 11)),
        s => s.doc,
        docgen(p('hello my name', ph('is ri'), 'chard')),
        (a, b) => a.eq(b)
      )
    })
  })
})
