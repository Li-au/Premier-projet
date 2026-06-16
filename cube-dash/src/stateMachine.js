const TRANSITIONS = {
  title: {ACTION_PRESSED: 'level_select'},
  level_select: {LEVEL_SELECTED: 'playing'},
  playing: {COLLISION: 'game_over', PAUSE: 'paused'},
  paused: {RESUME: 'playing', QUIT_TO_SELECT: 'level_select'},
  game_over: {ACTION_PRESSED: 'playing'},
};

/**
 * @param {string} currentState One of 'title', 'level_select', 'playing',
 *     'paused', 'game_over'.
 * @param {string} event One of 'ACTION_PRESSED', 'LEVEL_SELECTED',
 *     'COLLISION', 'PAUSE', 'RESUME', 'QUIT_TO_SELECT'.
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
