import Placeholder from "./placeholder"
import {
  placeholderFromPos,
  hasDocStateChanged,
  shouldRunOnUpdate,
  rangeHasMark
} from "./helpers"
import {
  deleteRange,
  removeMarkFromRange,
  markRangeActivePlaceholder,
  markRangeInactivePlaceholder,
  moveCursorToPos
} from "./tr-helpers"
const logging = true

class PlaceholderPlugin {
  constructor(markType) {
    console.log('plugin(constructor)', { ...arguments })
    this.markType = markType
    this.activePlaceholder = new Placeholder()
  }

  update(state, lastState) {
    if (logging) console.log('plugin(update) ------------------------')
    let { selection } = state
    if (selection.$cursor) {
      if (logging) console.log('plugin(update) pos', selection.$cursor.pos)
    } else {
      if (logging) console.log('plugin(update) selection', selection.anchor, selection.head)
    }

    let tr = state.tr
    if (!shouldRunOnUpdate(state, lastState, this.markType, this.activePlaceholder)) return tr

    let { pos } = state.selection.$cursor
    let dispatch = t => {
      // console.log('plugin(dispatch)', t)
      return t
    }

    if (logging) console.log('plugin(update) run, pos:', pos, ', activePlaceholder:', this.activePlaceholder)

    // Calculate the placeholder as determined by current position
    let placeholder = placeholderFromPos(tr.doc, this.markType, pos)

    // Everything is simple if the doc hasn't changed
    if (!hasDocStateChanged(state, lastState)) {
      if (logging) console.log('plugin(update) 🟢 doc has not changed')

      if (placeholder.posIsAdjacent(pos)) {
        if (!this.activePlaceholder.exists()) {

          // Moving into a placeholder without changing the doc
          if (logging) console.log('plugin(update) 🏁 no changes to doc, moving into placeholder from empty')
          tr = tr.setMeta('addToHistory', false)
          tr = markRangeActivePlaceholder(tr, this.markType, placeholder.start, placeholder.end)
          this.activePlaceholder.replace(placeholder)
          tr = moveCursorToPos(tr, placeholder.start)
          return dispatch(tr)

        } else {

          // Edgecase: if we just removed a placeholder by selection, the activePlaceholder is invalid
          if (rangeHasMark(tr.doc, this.markType, this.activePlaceholder.start, this.activePlaceholder.end)) {
            // Next simplest: moving between placeholders (could be the same one)
            if (logging) console.log('plugin(update) 🏁 no changes to doc, moving between placeholders')
            tr = tr.setMeta('addToHistory', false)
            tr = markRangeInactivePlaceholder(tr, this.markType, this.activePlaceholder.start, this.activePlaceholder.end)
            this.activePlaceholder.clear()
            tr = markRangeActivePlaceholder(tr, this.markType, placeholder.start, placeholder.end)
            this.activePlaceholder.replace(placeholder)
            tr = moveCursorToPos(tr, placeholder.start)
            return dispatch(tr)
          } else {
            // Next simplest: moving between placeholders (could be the same one)
            if (logging) console.log('plugin(update) 🏁 no changes to doc, moving between placeholders with invalid activePlaceholder')
            tr = tr.setMeta('addToHistory', false)
            this.activePlaceholder.clear()
            tr = markRangeActivePlaceholder(tr, this.markType, placeholder.start, placeholder.end)
            this.activePlaceholder.replace(placeholder)
            tr = moveCursorToPos(tr, placeholder.start)
            return dispatch(tr)
          }
        }
      } else {

        // Moving the caret away from the active placeholder
        if (logging) console.log('plugin(update) 🏁 no changes to doc, no placeholder adjacency, moving to empty')
        tr = tr.setMeta('addToHistory', false)
        tr = markRangeInactivePlaceholder(tr, this.markType, this.activePlaceholder.start, this.activePlaceholder.end)
        this.activePlaceholder.clear()
        return dispatch(tr)
      }
    }

    if (logging) console.log('plugin(update) 🟠 doc has changed')

    // Calculate placeholder diff
    if (placeholder.eq(this.activePlaceholder)) {
      if (logging) console.log('plugin(update) ❌ no change in placeholder')
      return tr
    } else {
      if (logging) console.log('plugin(update) placeholder has changed')

      // Case Group 1: Placeholder length has not changed
      if (placeholder.eqLength(this.activePlaceholder)) {
        if (logging) console.log('plugin(update) placeholder length has not changed')

        if (placeholder.isAfter(this.activePlaceholder)) {
          if (logging) console.log('plugin(update) 🏁 placeholder has moved later, removing placeholder')
          tr = deleteRange(tr, placeholder.start, placeholder.end)
          return dispatch(tr)
        } else {
          if (logging) console.log('plugin(update) 🏁 placeholder has moved earlier, updating activePlaceholder')
          this.activePlaceholder.replace(placeholder)
          return tr
        }

      } else {
        // Case Group 2: Placeholder length has changed
        if (logging) console.log('plugin(update) placeholder length has changed')

        if (placeholder.posAtStart(pos)) {
          if (logging) console.log('plugin(update) 🏁 pos is at start, mark it active anyway')
          tr = tr.setMeta('addToHistory', false)
          tr = markRangeActivePlaceholder(tr, this.markType, placeholder.start, placeholder.end)
          this.activePlaceholder.replace(placeholder)
          return dispatch(tr)

        } else {

          if (!this.activePlaceholder.exists()) {
            // This can happen if you backspace to the end of a placeholder
            if (logging) console.log('plugin(update) 🏁 pos is at end, no active placeholder, mark active at move to start')
            tr = markRangeActivePlaceholder(tr, this.markType, placeholder.start, placeholder.end)
            this.activePlaceholder.replace(placeholder)
            tr = moveCursorToPos(tr, placeholder.start)
            return dispatch(tr)

          } else {
            // This can happen if the text that just got entered counted as inside the same textnode (start of line)
            if (logging) console.log('plugin(update) 🏁 pos is inside placeholder, delete after pos and unmark before')
            tr = deleteRange(tr, pos, placeholder.end)
            tr = removeMarkFromRange(tr, this.markType, placeholder.start, pos)
            return dispatch(tr)
          }
        }
      }
    }
  }
}

export default PlaceholderPlugin
