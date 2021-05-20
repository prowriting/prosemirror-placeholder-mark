# ProseMirror placeholder module

This module add support to prosemirror for a placeholder by defining a schema mark, a command for setting the mark and a plugin to provide underlying behaviour.

Placeholder content is inline and can overlap with other inline content, but has several key behaviours when being edited:

- A cursor that moves into a placeholder is moved to the start of the placeholder
- A placeholder adjacent to the current cursor has an active class applied
- Editing a placeholder results in it's removal

This module also contains a demo to preview behaviour, which can also be viewed at [https://prowriting.github.io/prosemirror-placeholder-mark/](https://prowriting.github.io/prosemirror-placeholder-mark/)

## Maintained by ProWritingAid

ProWritingAid is the only platform that offers world-class grammar and style checking combined with more in-depth reports to help you strengthen your writing.

Come check us out at [prowritingaid.com](prowritingaid.com)!

## Commands

- `npm run demo`: Livereloading demo server with behaviour logs, placeholder support added to an example prosemirror configuration, served from `/demo_dist`
- `npm run build`: Compile the module for release
- `npm run test`: Compile and test the module

## Documentation

### Installation

```
npm install prosemirror-placeholder-mark
```

then

```
import { CreateMark as CreatePlaceholderMark, ToggleMark as TogglePlaceholderMark, placeholder } from "prosemirror-placeholder-mark"
import "prosemirror-placeholder-mark/dist/placeholder.css
```

### Exports

The module exports:

#### `CreateMark(options ?: CreateMarkOptions) -> mark:<Mark>`

The first thing you'll want to do is configure and create the placeholder mark, then add it to your schema.

##### Interface

```
CreateMarkOptions {
  className ?: string,
  activeClassName ?: string
}
```

#### `ToggleMark(mark: Mark) -> Command:<function>`

Returns a command that can be used to apply the placeholder mark. A small extension to the internal ToggleMark from `prosemirror-commands`.

Pass it to e.g. keymaps just like toggleMark

#### `placeholder(mark: Mark) -> Plugin:<instance>`

Returns the plugin code that has all the behaviour extensions to the prosemirror transaction/update cycle. Add it to the plugins section of your editor instance.
