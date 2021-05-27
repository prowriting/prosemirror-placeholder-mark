// Type definitions for prosemirror-placeholder-mark 0.1.6
// Project: https://github.com/prowriting/prosemirror-placeholder-mark
// Definitions by: Richard Washer <https://github.com/rwasher>
import { MarkType, MarkSpec } from "prosemirror-model"
import { Plugin, EditorState } from "prosemirror-state"
import { Transaction } from "prosemirror-commands"

export function placeholder(mark: MarkType): Plugin
export function CreateMark(options ?: CreateMarkOptions): MarkSpec
export function ToggleMark(mark: MarkType): (state: EditorState, dispatch: (tr: Transaction<any>) => void) => void

export interface CreateMarkOptions {
  className: string,
  activeClassName: string
}
