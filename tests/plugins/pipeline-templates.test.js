const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { REPO_ROOT, fileExists } = require('./helpers/fs');

const PIPELINES_DIR = path.join(REPO_ROOT, 'pipelines');
const COMMANDS_DIR = path.join(REPO_ROOT, 'commands');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function extractConditionalBlocks(content) {
  const opens = [];
  const closes = [];
  const openRe = /\[IF ([A-Z_ ]+):\]/g;
  const closeRe = /\[END IF ([A-Z_ ]+)\]/g;
  let match;
  while ((match = openRe.exec(content)) !== null) { opens.push(match[1].trim()); }
  while ((match = closeRe.exec(content)) !== null) { closes.push(match[1].trim()); }
  return { opens, closes };
}

describe('Pipeline template integrity', () => {

  describe('Pipeline B (repo research) templates exist', () => {
    const expectedTemplates = [
      'repo-scout-prompt-template.md',
      'repo-specialist-prompt-template.md',
      'repo-synthesizer-prompt-template.md',
      'repo-atlas-prompt-template.md',
      'repo-team-protocol.md',
    ];

    for (const template of expectedTemplates) {
      it(`${template} exists`, () => {
        const p = path.join(PIPELINES_DIR, template);
        assert.ok(fileExists(p), `Missing template: ${p}`);
      });
    }

    it('repo.md command exists', () => {
      const p = path.join(COMMANDS_DIR, 'repo.md');
      assert.ok(fileExists(p), `Missing command: ${p}`);
    });
  });

  describe('Pipeline A (web research) templates exist', () => {
    const expectedTemplates = [
      'scout-prompt-template.md',
      'specialist-prompt-template.md',
      'team-protocol.md',
    ];

    for (const template of expectedTemplates) {
      it(`${template} exists`, () => {
        const p = path.join(PIPELINES_DIR, template);
        assert.ok(fileExists(p), `Missing template: ${p}`);
      });
    }

    it('web.md command exists', () => {
      const p = path.join(COMMANDS_DIR, 'web.md');
      assert.ok(fileExists(p), `Missing command: ${p}`);
    });

    it('research.md command exists', () => {
      const p = path.join(COMMANDS_DIR, 'research.md');
      assert.ok(fileExists(p), `Missing command: ${p}`);
    });
  });

  describe('Pipeline C (structured research) templates exist', () => {
    const expectedTemplates = [
      'structured-scout-prompt-template.md',
      'structured-verifier-prompt-template.md',
      'structured-synthesizer-prompt-template.md',
      'structured-team-protocol.md',
    ];

    for (const template of expectedTemplates) {
      it(`${template} exists`, () => {
        const p = path.join(PIPELINES_DIR, template);
        assert.ok(fileExists(p), `Missing template: ${p}`);
      });
    }

    it('structured.md command exists', () => {
      const p = path.join(COMMANDS_DIR, 'structured.md');
      assert.ok(fileExists(p), `Missing command: ${p}`);
    });
  });

  describe('repo.md references Pipeline B templates', () => {
    if (!fileExists(path.join(COMMANDS_DIR, 'repo.md'))) return;
    const repoMd = readFile(path.join(COMMANDS_DIR, 'repo.md'));

    const expectedRefs = [
      'repo-scout-prompt-template.md',
      'repo-specialist-prompt-template.md',
      'repo-synthesizer-prompt-template.md',
      'repo-atlas-prompt-template.md',
    ];

    for (const ref of expectedRefs) {
      it(`references ${ref}`, () => {
        assert.ok(repoMd.includes(ref), `repo.md does not reference ${ref}`);
      });
    }
  });

  describe('conditional block matching', () => {
    const templates = [
      'repo-specialist-prompt-template.md',
      'repo-atlas-prompt-template.md',
      'repo-synthesizer-prompt-template.md',
    ].filter(t => fileExists(path.join(PIPELINES_DIR, t)));

    for (const template of templates) {
      it(`${template} has matched IF/END IF blocks`, () => {
        const content = readFile(path.join(PIPELINES_DIR, template));
        const { opens, closes } = extractConditionalBlocks(content);

        for (const open of opens) {
          assert.ok(closes.includes(open), `[IF ${open}:] has no matching [END IF ${open}] in ${template}`);
        }
        for (const close of closes) {
          assert.ok(opens.includes(close), `[END IF ${close}] has no matching [IF ${close}:] in ${template}`);
        }
        assert.strictEqual(opens.length, closes.length,
          `Mismatched IF/END IF count in ${template}: ${opens.length} opens, ${closes.length} closes`);
      });
    }
  });

  describe('repo.md step numbering', () => {
    if (!fileExists(path.join(COMMANDS_DIR, 'repo.md'))) return;
    const content = readFile(path.join(COMMANDS_DIR, 'repo.md'));

    it('has sequential step numbers without gaps', () => {
      const stepRe = /^## Step (\d+(?:\.\d+)?)\b/gm;
      const steps = [];
      let match;
      while ((match = stepRe.exec(content)) !== null) { steps.push(match[1]); }
      const wholeSteps = steps.filter(s => !s.includes('.')).map(Number);
      for (let i = 1; i < wholeSteps.length; i++) {
        assert.ok(
          wholeSteps[i] === wholeSteps[i - 1] + 1,
          `Step numbering gap: Step ${wholeSteps[i - 1]} followed by Step ${wholeSteps[i]}`
        );
      }
    });

    it('has no duplicate step numbers', () => {
      const stepRe = /^## Step (\d+(?:\.\d+)?)\b/gm;
      const steps = [];
      let match;
      while ((match = stepRe.exec(content)) !== null) { steps.push(match[1]); }
      const unique = new Set(steps);
      assert.strictEqual(steps.length, unique.size, `Duplicate step numbers: ${steps.join(', ')}`);
    });
  });

  describe('synthesizer deduplication rule', () => {
    if (!fileExists(path.join(PIPELINES_DIR, 'repo-synthesizer-prompt-template.md'))) return;
    const synthTemplate = readFile(path.join(PIPELINES_DIR, 'repo-synthesizer-prompt-template.md'));

    it('has deduplication rule section', () => {
      assert.ok(synthTemplate.includes('Deduplication Rule'), 'Missing Deduplication Rule section');
    });

    it('deduplication rule is scoped to comparison mode', () => {
      assert.ok(synthTemplate.includes('comparison mode only'), 'Deduplication rule should be scoped to comparison mode only');
    });

    it('preserves actionable recommendations', () => {
      assert.ok(
        synthTemplate.includes('Recommendations must be SPECIFIC and ACTIONABLE'),
        'Must preserve actionable recommendations principle'
      );
    });
  });

  describe('specialist atlas validation markers', () => {
    if (!fileExists(path.join(PIPELINES_DIR, 'repo-specialist-prompt-template.md'))) return;
    const specialistTemplate = readFile(path.join(PIPELINES_DIR, 'repo-specialist-prompt-template.md'));

    const markers = ['CONFIRMED', 'REFUTED', 'MISSING'];

    for (const marker of markers) {
      it(`specialist template instructs ${marker} marker usage`, () => {
        assert.ok(specialistTemplate.includes(`[${marker}`), `Missing [${marker}] marker instruction`);
      });
    }

    if (fileExists(path.join(PIPELINES_DIR, 'repo-atlas-prompt-template.md'))) {
      it('atlas refinement template consumes validation markers', () => {
        const atlasTemplate = readFile(path.join(PIPELINES_DIR, 'repo-atlas-prompt-template.md'));
        for (const marker of markers) {
          assert.ok(atlasTemplate.includes(`[${marker}]`), `Atlas template missing [${marker}] consumption`);
        }
      });
    }
  });
});
