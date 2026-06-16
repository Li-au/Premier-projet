/**
 * @param {{elapsedTime: number}} state
 * @param {number} dt Delta time in milliseconds since the last update.
 * @return {{elapsedTime: number}} A new state with elapsedTime advanced by dt.
 */
export function updateGameTime(state, dt) {
  return {...state, elapsedTime: state.elapsedTime + dt};
}
