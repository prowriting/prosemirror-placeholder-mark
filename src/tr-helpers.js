import { TextSelection } from "prosemirror-state"

function deleteRange(tr, start, end) {
  console.log('tr(deleteRange)', start, end)
  tr = tr.delete(start, end)
  return tr
}

function removeMarkFromRange(tr, mark, start, end) {
  console.log('tr(removeMarkFromRange)', start, end)
  tr = tr.removeMark(start, end, mark)
  return tr
}

function markRangeActivePlaceholder(tr, mark, start, end) {
  console.log('tr(markRangeActivePlaceholder)', start, end)
  let activeMark = mark.create({ active: true });
  tr = tr.addMark(start, end, activeMark)
  return tr
}

function markRangeInactivePlaceholder(tr, mark, start, end) {
  console.log('tr(markRangeInactivePlaceholder)', start, end)
  let activeMark = mark.create({ active: false });
  tr = tr.addMark(start, end, activeMark)
  return tr
}

function moveCursorToPos(tr, pos) {
  console.log('tr(moveCursorToPos)', pos)
  let resolve = tr.doc.resolve(pos)
  let selection = new TextSelection(resolve, resolve)
  tr = tr.setSelection(selection)
  return tr
}

export {
  deleteRange,
  removeMarkFromRange,
  markRangeActivePlaceholder,
  markRangeInactivePlaceholder,
  moveCursorToPos
}
