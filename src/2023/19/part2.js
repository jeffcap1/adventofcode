import fs from 'fs';

function createWorkflowMap(workflowLines) {
  const workflowPieceRegex = /^(.+)\{(.+)\}$/;
  const workflow = {};

  workflowLines.forEach((line) => {
    const [_, key, ruleStatements] = workflowPieceRegex.exec(line);
    const rules = [];

    ruleStatements.split(',').forEach((rule) => {
      if (rule.indexOf(':') > -1) {
        const [cond, goto] = rule.split(':');

        if (cond.indexOf('>') > -1) {
          const [part, value] = cond.split('>');
          rules.push({ part, symbol: '>', value, goto });
        } else {
          const [part, value] = cond.split('<');
          rules.push({ part, symbol: '<', value, goto });
        }
      } else {
        rules.push({ goto: rule });
      }
    });

    workflow[key] = rules;
  });

  return workflow;
}

function walkTree(goto, workflow, values, foundValues = []) {
  const rules = workflow[goto];
  const ruleElseValues = { ...values };
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    const curValues = i === 0 ? values : ruleElseValues;

    if (rule.part) {
      const newValue = rule.symbol === '<' ? [curValues[rule.part][0], parseInt(rule.value, 10) - 1] : [parseInt(rule.value, 10) + 1, curValues[rule.part][1]];
      const newValues = { ...curValues, [rule.part]: newValue };
      const elseNewValue = rule.symbol === '>' ? [curValues[rule.part][0], parseInt(rule.value, 10)] : [parseInt(rule.value, 10), curValues[rule.part][1]];
      ruleElseValues[rule.part] = elseNewValue;

      // accepted part, add to list
      if (rule.goto === 'A') {
        foundValues.push(newValues);
        // eslint-disable-next-line no-continue
        continue;
      }

      // ignore it doesn't count
      if (rule.goto === 'R') {
        // eslint-disable-next-line no-continue
        continue;
      }

      // recurse
      walkTree(rule.goto, workflow, newValues, foundValues);
    } else {
      // accepted part, add to list
      if (rule.goto === 'A') {
        foundValues.push(ruleElseValues);
        // eslint-disable-next-line no-continue
        continue;
      }

      // ignore it doesn't count
      if (rule.goto === 'R') {
        // eslint-disable-next-line no-continue
        continue;
      }

      // recurse
      walkTree(rule.goto, workflow, ruleElseValues, foundValues);
    }
  }

  return foundValues;
}

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const workflows = input.split('\n\n')[0].split('\n');
const workflowStartingKey = 'in';
const workflow = createWorkflowMap(workflows);
const partRange = [1, 4000];
const ratingValues = { x: partRange, m: partRange, a: partRange, s: partRange };

// recursively walk the tree
const partCombinations = walkTree(workflowStartingKey, workflow, ratingValues);

const total = partCombinations.reduce((acc, comobo) => {
  const combos = Object.values(comobo).reduce((agg, part) => agg * (parseInt(part[1], 10) - (parseInt(part[0], 10) - 1)), 1);
  return acc + combos;
}, 0);
console.log({ total });
