// Custom events so that I can fire events from every file
// Improves modularity so I can write events anywhere
// For example I can make a new file, look for login:completed event (hypothetical) and then do something related to that like push a new modal or confetti to a webpage

(() => {
  const target = new EventTarget();

  window.bus = {
    // listen for an event
    on: (event, handler) => {
        target.addEventListener(event, (e) => {
            handler(e.detail)
        })
    },
    // emit an event with data
    emit: (event, data = null) => {
        target.dispatchEvent(new CustomEvent(event, { detail: data }))
    },
    // remove the event listener
    off: (event, handler) => {
        target.removeEventListener(event, handler)
    },
    // emit once and then turn off
    once: (event, handler) => {
        target.addEventListener(event, (e) => { handler(e.detail), { once: true }})
    }
  };
})();
