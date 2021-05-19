class Placeholder {
  constructor(start = null, end = null) {
    this.update(start, end)
  }

  update(start = null, end = null) {
    console.log('placeholder(update)', start, end)
    this.start = start
    this.end = end
    this.length = end - start || null
  }

  replace(placeholder) {
    console.log('placeholder(replace)', placeholder)
    this.update(placeholder.start, placeholder.end)
  }

  clear() {
    console.log('placeholder(clear)')
    this.update()
  }

  exists() {
    return this.length && this.length > 0
  }

  posAtStart(pos) {
    return this.start === pos
  }

  posAtEnd(pos) {
    return this.end === pos
  }

  posIsAdjacent(pos) {
    return this.start <= pos && pos <= this.end
  }

  overlapsRange(range) {
    return Math.min(this.end - range.end) - Math.max(this.start - range.start) >= 0
  }

  // These methods skip safety checks, both placeholders must be valid

  eq(other) {
    return (
      this.eqStart(other)
      && this.eqEnd(other)
      && this.eqLength(other)
    )
  }

  eqLength(other) {
    return this.length === other.length
  }

  eqStart(other) {
    return this.start === other.start
  }

  eqEnd(other) {
    return this.end === other.end
  }

  isShorterThan(other) {
    return this.length < other.length
  }

  isAfter(other) {
    return this.start > other.start
  }
}

export default Placeholder
