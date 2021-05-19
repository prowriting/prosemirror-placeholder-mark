// Returns a command that toggles a placeholder mark, moving the cursor as necessary
// Note that this command is basically a wrapper for toggleMark, extending the transaction it performs
// As a result, this file has an extended version of toggleMark taken from https://github.com/ProseMirror/prosemirror-commands/blob/a0645379d0006679f260ab16e5280eda3c41f4ef/src/commands.js
// This extended version is identical, but returns the transaction so it can be modified before dispatch
import { rangeHasMark } from './helpers'
import { TextSelection } from "prosemirror-state"

function togglePlaceholder(markType) {
  console.log('toggle-mark init', markType)

  return function (state, dispatch) {
    console.log('toggle-mark()', { state, dispatch })
    let { selection } = state
    // Only run if we have a selection, as we don't want placeholder to be a stored mark
    if (selection.$cursor) {
      console.log('toggle-mark() ❌ cursor mode, we dont want to add to stored marks')
      return
    } else {
      if (dispatch) {
        console.log('toggle-mark() toggling placeholder with dispatch')
        let tr = state.tr
        tr = toggleMarkTr(markType)(state, dispatch)(tr)

        let selection = tr.curSelection
        let { from, to } = selection

        // If we find a placeholder inside the selection, move to the start of it
        // Note: We don't bother updating active, the next update will handle that
        if (rangeHasMark(tr.doc, markType, from, to)) {
          console.log('toggle-mark() 🏁 we added a placeholder, move to start as well')

          let resolve = tr.doc.resolve(from)
          let selection = new TextSelection(resolve, resolve)
          tr = tr.setSelection(selection)
          return dispatch(tr)

        } else {

          console.log('toggle-mark() 🏁 no placeholder added, no additional actions')
          return dispatch(tr)
        }

      } else {
        console.log('toggle-mark() 🏁 toggling placeholder without dispatch')
        return toggleMarkTr(markType)(state)
      }
    }
  }
}

// Version of ToggleMark that returns the transaction

function toggleMarkTr(markType, attrs) {
  return function (state, dispatch) {
    let { empty, $cursor, ranges } = state.selection
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks()))
          return (tr) => tr.removeStoredMark(markType)
        else
          return (tr) => tr.addStoredMark(markType.create(attrs))
      } else {
        let has = false
        for (let i = 0; !has && i < ranges.length; i++) {
          let { $from, $to } = ranges[i]
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
        }
        return (tr) => {
          for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i]
            if (has) {
              tr.removeMark($from.pos, $to.pos, markType)
            } else {
              let from = $from.pos, to = $to.pos, start = $from.nodeAfter, end = $to.nodeBefore
              let spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0
              let spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0
              if (from + spaceStart < to) { from += spaceStart; to -= spaceEnd }
              tr.addMark(from, to, markType.create(attrs))
            }
          }
          return tr.scrollIntoView()
        }
      }
    }
    return true
  }
}

function markApplies(doc, ranges, type) {
  for (let i = 0; i < ranges.length; i++) {
    let { $from, $to } = ranges[i]
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

export default togglePlaceholder
