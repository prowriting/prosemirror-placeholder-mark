import CreateMark from "./create-mark"
import ToggleMark from "./toggle-mark"
import PlaceholderPlugin from "./plugin"
import { Plugin, PluginKey } from "prosemirror-state";

// All other prosemirror plugins seem to be a callable func at the top level

function placeholder(markType) {
  return new Plugin({
    key: new PluginKey("placeholder"),
    view(viewRef) { return new PlaceholderPlugin(markType) }
  })
}

export {
  placeholder,
  CreateMark,
  ToggleMark
}
