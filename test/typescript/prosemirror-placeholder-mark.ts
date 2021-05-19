import { placeholder, CreateMark, ToggleMark } from '../..';

CreateMark({
  className: "placeholder",
  activeClassName: "placeholder-active",
})

let placeholderMark = CreateMark()
ToggleMark(placeholderMark)

placeholder(placeholderMark)
