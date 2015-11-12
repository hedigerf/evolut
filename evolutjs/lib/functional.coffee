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
			args[i] = args.splice(-1)[0]
	f args...

compose = (fs...) -> fs.reduce (f, g) -> (as...) ->
	f g as...

flip = curry (f, x, y) -> f [y, x]...
flip3 = curry (f, x, y, z) -> f [z, y, x]...
flipN = (f) -> (as...) -> f as.reverse()...

sequence = flipN compose

module.exports._ = _
module.exports.nop = nop
module.exports.id = id
module.exports.builtin = builtin
module.exports.variadic = variadic
module.exports.apply = apply
module.exports.notF = notF
module.exports.curry = curry
module.exports.partial = partial
module.exports.compose = compose
module.exports.flip = flip
module.exports.flip3 = flip3
module.exports.flipN = flipN
module.exports.sequence = sequence
