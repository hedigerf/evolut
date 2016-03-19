'use strict';

// Recursion combinator
const rec = f => (...args) => f((...args) => rec(f)(...args), ...args);

export default rec;
