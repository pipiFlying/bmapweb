export function throttle(func, wait, immediate = true) {
  let lastTime = 0;
  let timeout;

  return function (...args) {
    const now = Date.now();
    if (!lastTime && immediate) {
      lastTime = now;
      func.apply(this, args);
    } else {
      const remaining = wait - (now - lastTime);
      if (remaining <= 0) {
        lastTime = now;
        func.apply(this, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          lastTime = now;
          func.apply(this, args);
          timeout = null;
        }, remaining);
      }
    }
  };
}

export function loadBMapGL(callback) {
  const script = document.createElement("script");
  script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${process.env.VUE_APP_BMAK}&callback=onMapReady`;
  document.body.appendChild(script);
  window.onMapReady = () => {
    callback();
  };
}
