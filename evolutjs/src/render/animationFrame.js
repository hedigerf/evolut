/* jshint -W098  */
let animationFrame = () => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback) => {
      return window.setTimeout(callback((1000 / 60)));
    };
};
