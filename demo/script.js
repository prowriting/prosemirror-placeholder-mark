// Imports from Placeholder plugin specifically
import { CreateMark as CreatePlaceholderMark, ToggleMark as TogglePlaceholderMark, placeholder } from "../src"
import "../src/placeholder.css"

// Demo imports
import { EditorView } from "prosemirror-view"
import { EditorState } from "prosemirror-state"
import { DOMParser, Schema } from "prosemirror-model"
import { schema as baseSchema } from "prosemirror-schema-basic"
import { keymap } from "prosemirror-keymap"
import { buildMenuItems, buildKeymap, buildInputRules } from "prosemirror-example-setup"
import { MenuItem, icons } from "prosemirror-menu"
import { addListNodes } from "prosemirror-schema-list"
import { baseKeymap } from "prosemirror-commands"
import { gapCursor } from "prosemirror-gapcursor"
import { dropCursor } from "prosemirror-dropcursor"
import { history } from "prosemirror-history"
import { menuBar } from "prosemirror-menu"
import "prosemirror-view/style/prosemirror.css"
import "prosemirror-menu/style/menu.css"
import "prosemirror-example-setup/style/style.css"
import "prosemirror-gapcursor/style/gapcursor.css"
import "./style.css"

const hotkey = "Mod-b"

// Create placeholder mark
let placeholderMark = CreatePlaceholderMark()

// Setup schema
let marks = baseSchema.spec.marks
marks = marks.update('placeholder', placeholderMark)
let nodes = addListNodes(baseSchema.spec.nodes, "paragraph block*", "block")
let schema = new Schema({ nodes, marks })

// Generate the placeholder plugin and command from schema
let togglePlaceholderCmd = TogglePlaceholderMark(schema.marks.placeholder)
let placeholderPlugin = placeholder(schema.marks.placeholder)

// Keymappping
let keymapOverride = { [hotkey]: false }
let exampleKeymap = buildKeymap(schema, keymapOverride)
let placeholderKeymap = { [hotkey]: togglePlaceholderCmd }
let allKeymaps = { ...placeholderKeymap, ...exampleKeymap }

// Setup menu
let menu = buildMenuItems(schema).fullMenu
let placeholderMenuItem = new MenuItem({
  title: "Toggle placeholder",
  icon: icons.selectParentNode,
  run: togglePlaceholderCmd,
  class: "placeholder"
})
menu[0] = [placeholderMenuItem, ...menu[0]]
menu[menu.length - 1] = menu[menu.length - 1].slice(0, -1) // remove selectParentNode
let menuOptions = {
  floating: true,
  content: menu
}

// Get doc from initial HTML
let doc = DOMParser.fromSchema(schema).parse(document.querySelector("#content"))

// let ex = exampleSetup({ schema, menuContent: menu })
// debugger;

// Build Editor
let state = EditorState.create({
  doc,
  plugins: [
    buildInputRules(schema),
    keymap(allKeymaps),
    dropCursor(),
    gapCursor(),
    menuBar(menuOptions),
    placeholderPlugin,
    history()
  ]
})
window.view = new EditorView(document.querySelector("#editor"), { state })
