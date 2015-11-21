f = _: {}

f.nop = ->

# identity function
f.id = (x) ->
  x

# turn any native function into a regular function
f.builtin = (f) ->
  f.nop.call.bind f

# returns the arguments as array
f.variadic = (as...) ->
  as

f.apply = (f, as...) ->
  f [].concat.apply([], as)...

f.notF = (f) -> (as...) ->
  not f as...

f.curry = (f) -> (as...) ->
  if as.length < f.length
    f.bind [null, as...]...
  else
    f as...

f.partial = (f, as...) -> (bs...) ->
  args = as.concat bs
  i = args.length
  while i--
    if args[i] is f._
      args[i] = args.splice(-1, 1)[0]
  f args...

f.compose = (fs...) -> fs.reduce (f, g) -> (as...) ->
  f g as...

f.flip = f.curry (f, x, y) -> f [y, x]...
f.flipN = (f) -> (as...) -> f as.reverse()...

f.sequence = f.flipN f.compose

exports = module.exports = f
