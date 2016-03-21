'use strict';

// Recursion combinator
const Y = f => (...args) => f((...args) => Y(f)(...args), ...args);

export default Y;
