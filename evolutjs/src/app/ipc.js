/**
 * Contains the ipc channel names.
 *
 * @module app/ipc
 */

/**
 * World ipc channel names.
 *
 * @enum {String}
 * @type {Object}
 * @property {String} World.NextGeneration
 * @property {String} World.TogglePause
 * @property {String} World.ToggleRendering
 */
export const World = {
  NextGeneration:   'world-next-generation',
  TogglePause:      'world-toggle-pause',
  ToggleRendering:  'world-toggle-rendering',
  SaveScreen:       'world-save-screen'
}
