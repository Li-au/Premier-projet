const TRANSITIONS = {
  title: {ACTION_PRESSED: 'playing'},
  playing: {COLLISION: 'game_over'},
  game_over: {ACTION_PRESSED: 'playing'},
};

/**
 * @param {string} currentState One of 'title', 'playing', 'game_over'.
 * @param {string} event One of 'ACTION_PRESSED', 'COLLISION'.
 * @return {string} The next state, or currentState if the event has no
 *     transition defined for the current state.
 */
function transitionGameState(currentState, event) {
  const stateTransitions = TRANSITIONS[currentState];
  if (stateTransitions && stateTransitions[event]) {
    return stateTransitions[event];
  }
  return currentState;
}

if (typeof module !== 'undefined') {
  module.exports = {transitionGameState};
}
