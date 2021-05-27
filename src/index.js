import CreateMark from "./create-mark"
import ToggleMark from "./toggle-mark"
import PlaceholderPlugin from "./plugin"
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

// All other prosemirror plugins seem to be a callable func at the top level

function placeholder(markType) {
  let plugin = new PlaceholderPlugin(markType)
  return new Plugin({
    key: new PluginKey("placeholder"),
    // view(viewRef) { return plugin  },
    appendTransaction(trs, oldState, state) {
      return plugin.update(state, oldState)
    }
  })
}

export {
  placeholder,
  CreateMark,
  ToggleMark
}
