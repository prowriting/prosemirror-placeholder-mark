// Type definitions for prosemirror-placeholder-mark 0.1.4
// Project: https://github.com/prowriting/prosemirror-placeholder-mark
// Definitions by: Richard Washer <https://github.com/rwasher>
import { MarkType, MarkSpec } from "prosemirror-model"
import { Plugin, EditorState } from "prosemirror-state"

export function placeholder(mark: MarkType): Plugin
export function CreateMark(options ?: CreateMarkOptions): MarkSpec
export function ToggleMark(mark: MarkType): (state: EditorState, dispatch: () => boolean) => void

export interface CreateMarkOptions {
  className: string,
  activeClassName: string
}
