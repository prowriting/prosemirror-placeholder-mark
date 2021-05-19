// Type definitions for prosemirror-placeholder-mark 0.1.0
// Project: https://github.com/prowriting/prosemirror-placeholder-mark
// Definitions by: Richard Washer <https://github.com/rwasher>
import { Mark as ProsemirrorMark } from "prosemirror-model"
import { Plugin } from "prosemirror-state"

export function placeholder(markType: ProsemirrorMark): Plugin
export function CreateMark(options ?: CreateMarkOptions): ProsemirrorMark
export function ToggleMark(markType: ProsemirrorMark): () => void

export interface CreateMarkOptions {
  className: string,
  activeClassName: string
}
