// Exports a function for creating a schema mark with the correct params
// TODO: likely more options are needed for wider use cases to expand the behaviour of the returned mark
export default function CreateMark(options = {}) {
  console.log('create-mark()', options)

  options = { ...defaultOptions, ...options }

  return {
    attrs: { active: { default: false } },
    parseDOM: [{ tag: `span.${options.className}` }],
    toDOM: node => {
      let classNames = [options.className]
      if (!!node.attrs.active) classNames.push(options.activeClassName)
      return ['span', { class: classNames.join(' ') }, 0]
    }
  }
}

const defaultOptions = {
  className: "prosemirror-placeholder-mark",
  activeClassName: "prosemirror-placeholder-mark--active"
}
