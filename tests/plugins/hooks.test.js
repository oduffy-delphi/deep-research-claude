const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { execSync } = require('child_process');
const { fileExists, dirExists, readJson, getPlugins } = require('./helpers/fs');

const VALID_EVENT_TYPES = ['SessionStart', 'PreToolUse', 'PostToolUse', 'PreCompact', 'Notification', 'Stop'];

function resolveScriptPath(command, pluginDir) {
  const expanded = command.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginDir);
  const tokens = expanded.split(/\s+/);
  for (const token of tokens) {
    if (/\.\w+$/.test(token) && !token.startsWith('-')) return token;
  }
  return null;
}

const plugins = getPlugins();

describe('hook configuration and script validity', () => {
  for (const plugin of plugins) {
    const hooksJsonPath = path.join(plugin.dir, 'hooks', 'hooks.json');
    if (!fileExists(hooksJsonPath)) continue;

    describe(`[${plugin.name}] hooks.json`, () => {
      it('parses as valid JSON', () => {
        const data = readJson(hooksJsonPath);
        assert.ok(data, `hooks.json parsed to falsy value in ${plugin.name}`);
      });

      it('is an object', () => {
        const data = readJson(hooksJsonPath);
        assert.equal(typeof data, 'object', `hooks.json must be an object in ${plugin.name}`);
        assert.ok(!Array.isArray(data), `hooks.json must not be an array in ${plugin.name}`);
      });

      it('event types are valid', () => {
        const data = readJson(hooksJsonPath);
        const eventMap = data.hooks || data;
        const keysToValidate = data.hooks
          ? Object.keys(data.hooks)
          : Object.keys(eventMap).filter(k => k !== 'description' && k !== 'hooks');

        for (const key of keysToValidate) {
          assert.ok(
            VALID_EVENT_TYPES.includes(key),
            `Invalid event type "${key}" in ${plugin.name}. Valid types: ${VALID_EVENT_TYPES.join(', ')}`
          );
        }
      });

      describe('hook entries', () => {
        let eventMap;
        try {
          const data = readJson(hooksJsonPath);
          eventMap = data.hooks || data;
        } catch { return; }

        const eventTypes = Object.keys(eventMap).filter(k => VALID_EVENT_TYPES.includes(k));

        for (const eventType of eventTypes) {
          const matcherGroups = eventMap[eventType];
          if (!Array.isArray(matcherGroups)) continue;

          for (let gi = 0; gi < matcherGroups.length; gi++) {
            const group = matcherGroups[gi];
            const matcherLabel = group.matcher !== undefined ? `matcher="${group.matcher}"` : `group[${gi}]`;
            const hookItems = Array.isArray(group.hooks) ? group.hooks :
                              (group.command ? [group] : []);

            for (let hi = 0; hi < hookItems.length; hi++) {
              const hook = hookItems[hi];
              const hookLabel = `${eventType} ${matcherLabel} hook[${hi}]`;

              describe(`[${plugin.name}] ${hookLabel}`, () => {
                it('has command (string)', () => {
                  assert.equal(typeof hook.command, 'string', `hook command must be a string: ${hookLabel}`);
                });

                it('has timeout (positive number)', () => {
                  assert.equal(typeof hook.timeout, 'number', `hook timeout must be a number: ${hookLabel}`);
                  assert.ok(hook.timeout > 0, `hook timeout must be positive: ${hookLabel}`);
                });

                it('referenced script file exists', () => {
                  if (typeof hook.command !== 'string') return;
                  const scriptPath = resolveScriptPath(hook.command, plugin.dir);
                  if (!scriptPath) return;
                  assert.ok(fileExists(scriptPath), `Script file not found: ${scriptPath}`);
                });

                it('script syntax is valid', () => {
                  if (typeof hook.command !== 'string') return;
                  const scriptPath = resolveScriptPath(hook.command, plugin.dir);
                  if (!scriptPath || !fileExists(scriptPath)) return;

                  if (scriptPath.endsWith('.sh')) {
                    try {
                      execSync(`bash -n "${scriptPath}"`, { stdio: 'pipe', timeout: 10000 });
                    } catch (e) {
                      if (e.status !== null) {
                        assert.fail(`Bash syntax error in ${scriptPath}: ${e.stderr?.toString().trim()}`);
                      }
                    }
                  } else if (scriptPath.endsWith('.js')) {
                    try {
                      execSync(`node --check "${scriptPath}"`, { stdio: 'pipe', timeout: 10000 });
                    } catch (e) {
                      if (e.status !== null) {
                        assert.fail(`Node syntax error in ${scriptPath}: ${e.stderr?.toString().trim()}`);
                      }
                    }
                  }
                });
              });
            }
          }
        }
      });
    });
  }
});
