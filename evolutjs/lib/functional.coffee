_ = {}

nop = ->

# identity function
id = (x) ->
  x

# turn any native function into a regular function
builtin = (f) ->
  nop.call.bind f

# returns the arguments as array
variadic = (as...) ->
  as

apply = (f, as...) ->
  f [].concat.apply([], as)...

notF = (f) -> (as...) ->
  not f as...

curry = (f) -> (as...) ->
  if as.length < f.length
    f.bind [null, as...]...
  else
    f as...

partial = (f, as...) -> (bs...) ->
  args = as.concat bs
  i = args.length
  while i--
    if args[i] is _
      args[i] = args.splice(-1, 1)[0]
  f args...

compose = (fs...) -> fs.reduce (f, g) -> (as...) ->
  f g as...

flip = curry (f, x, y) -> f [y, x]...
flipN = (f) -> (as...) -> f as.reverse()...

sequence = flipN compose

root = exports ? this
root._ = _
root.nop = nop
root.id = id
root.builtin = builtin
root.variadic = variadic
root.apply = apply
root.notF = notF
root.curry = curry
root.partial = partial
root.compose = compose
root.flip = flip
root.flipN = flipN
root.sequence = sequence
