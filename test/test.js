require("mocha/mocha")

// declare global: mocha
mocha.setup("bdd")

// require("./toggle-mark.test")
// require("./create-mark.test")
require("./plugin.test")

mocha.run()
