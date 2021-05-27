import Placeholder from './placeholder'

function recurseRangeHasMark(doc, mark, start, end) {
  let resolve = doc.resolve(start)
  let nextNode = resolve.nodeAfter
  if (nextNode) {
    if (nodeHasMark(nextNode, mark)) {
      return true
    } else {
      let nextStart = start + nextNode.nodeSize
      if (nextStart >= end) {
        return false
      } else {
        return recurseRangeHasMark(doc, mark, nextStart, end)
      }
    }
  }
}

function recurseFindMarkEnd(doc, mark, pos, leftward = true) {
  let resolve = doc.resolve(pos)
  let nextNode = leftward ? resolve.nodeBefore : resolve.nodeAfter

  if (nextNode && nodeHasMark(nextNode, mark)) {
    let newPos = leftward ? pos - nextNode.nodeSize : pos + nextNode.nodeSize
    return recurseFindMarkEnd(doc, mark, newPos, leftward)
  } else {
    return pos
  }
}

function findMarkEndsFromPos(doc, mark, pos) {
  return [
    recurseFindMarkEnd(doc, mark, pos),
    recurseFindMarkEnd(doc, mark, pos, false)
  ]
}

function placeholderFromPos(doc, mark, pos) {
  let [start, end] = findMarkEndsFromPos(doc, mark, pos)
  return new Placeholder(start, end)
}

function nodeHasMark(node, markType) {
  return node && node.marks && node.marks.filter(mark => mark.type === markType).length > 0
}

function rangeHasMark(doc, mark, start, end) {
  return recurseRangeHasMark(doc, mark, start, end);
}

function hasDocStateChanged(state, lastState) {
  return !(lastState && lastState.doc.eq(state.doc))
}

function shouldRunOnUpdate(state, lastState, mark, activePlaceholder) {
  let { selection } = state

  // return if we don't get a valid cursor
  if (!selection.$cursor) {
    console.log('helpers(shouldRunOnUpdate) ❌ no valid selection')
    return false
  }

  // return if selection/doc hasn't changed (i.e. cursor not moving)
  // TODO: when moving into a state with a selection, with an active placeholder, clear it
  if (!hasDocStateChanged(state, lastState) && lastState.selection.eq(selection)) {
    console.log('helpers(shouldRunOnUpdate) ❌ unchanged selection/doc')
    return false
  }

  let { pos } = state.selection.$cursor
  let resolve = state.doc.resolve(pos)

  if (!(
    nodeHasMark(resolve.nodeBefore, mark)
    || nodeHasMark(resolve.nodeAfter, mark)
    || activePlaceholder.exists()
  )) {
    console.log('helpers(shouldRunOnUpdate) ❌ not adjacent and no active placeholder')
    return false
  }

  console.log('helpers(shouldRunOnUpdate) ✅')
  return true
}

export {
  nodeHasMark,
  rangeHasMark,
  findMarkEndsFromPos,
  placeholderFromPos,
  hasDocStateChanged,
  shouldRunOnUpdate
}
