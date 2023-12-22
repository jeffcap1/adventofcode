import fs from 'fs';

function compareValues(partValueStr, ruleValueStr, symbol) {
  const partValue = parseInt(partValueStr, 10);
  const ruleValue = parseInt(ruleValueStr, 10);
  return symbol === '>' ? partValue > ruleValue : partValue < ruleValue;
}

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

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const [workflows, ratings] = input.split('\n\n');
const workflowLines = workflows.split('\n');
const ratingLines = ratings.split('\n');

const workflowStartingKey = 'in';

const workflow = createWorkflowMap(workflowLines);
const acceptedParts = [];

ratingLines.filter(Boolean).forEach((line) => {
  const parts = JSON.parse(
    `{"${line
      .slice(1, line.length - 1)
      .replace(/=/g, '":"')
      .replace(/,/g, '","')}"}`
  );

  let goto = workflowStartingKey;
  while (goto !== 'A' && goto !== 'R') {
    const rules = workflow[goto];
    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];

      if (rule.part) {
        if (compareValues(parts[rule.part], rule.value, rule.symbol)) {
          goto = rule.goto;
          break;
        }
      } else {
        goto = rule.goto;
        break;
      }
    }
  }

  if (goto === 'A') {
    acceptedParts.push(parts);
  }
});

console.log({ acceptedParts });

const total = acceptedParts.reduce((acc, parts) => {
  const partTotal = Object.values(parts).reduce((agg, part) => agg + parseInt(part, 10), 0);
  return acc + partTotal;
}, 0);

console.log({ total });
