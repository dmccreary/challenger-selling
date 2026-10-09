// Cognitive Bias Simulator
// CANVAS_HEIGHT: 560
// For each customer scenario the learner picks the cognitive bias at work and the story
// strategy that addresses it. Mastery is all three scenarios correct on the first attempt.

const biases = ['Cognitive Ease', 'Decision Fatigue', 'Anchoring Effect', 'Availability Heuristic',
    'Confirmation Bias', 'Loss Aversion', 'Status Quo Bias'];

const scenarios = [
    {
        text: "You're selling to a CFO who has reviewed 12 proposals today. She's overwhelmed and says \"I can't evaluate all of this right now.\" She's asking you to simplify to 3 key points.",
        bias: 'Decision Fatigue',
        strategies: ['Provide a simple narrative with 3 key points', 'Emphasize competitive urgency', 'Tell a story about similar CFOs who benefited'],
        strategy: 'Provide a simple narrative with 3 key points',
        reason: 'a short narrative with three clear points lowers the cognitive load on a depleted decision-maker, so she can process your insight and act on it instead of deferring'
    },
    {
        text: "A customer says \"Your solution looks good, but our current system works fine. Why should we change?\" They're comfortable with the status quo even though their competitors are gaining market share.",
        bias: 'Status Quo Bias',
        strategies: ['Emphasize cost savings', 'Tell a story about a competitor who failed without change', 'Tell a story about similar companies that succeeded'],
        strategy: 'Tell a story about a competitor who failed without change',
        reason: 'a peer who lost ground by standing still makes the cost of inaction vivid; it leverages loss aversion, which is roughly twice as motivating as an equivalent gain, to break the inertia of "works fine"'
    },
    {
        text: "A customer focuses only on a single competitor's low price and can't see beyond that comparison. They're anchored on price and missing the total cost of ownership consideration.",
        bias: 'Anchoring Effect',
        strategies: ['Tell a competitor success story', 'Tell a story about total cost of ownership', 'Emphasize risk of the cheaper option'],
        strategy: 'Tell a story about total cost of ownership',
        reason: 'a total-cost-of-ownership story sets a new, broader anchor, so the sticker price is judged against lifetime cost rather than against the competitor\'s quote alone'
    }
];

let idx = 0;
let firstTry = [];
let attempted = false;
let card;

function lc(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

function progressHTML() {
    return '<div class="progress">' + scenarios.map((_, i) => {
        const cls = i < firstTry.length ? (firstTry[i] ? 'ok' : 'bad') : (i === idx ? 'active' : '');
        return `<div class="pip ${cls}"></div>`;
    }).join('') + '</div>';
}

function optionList(items) {
    return '<option value="" disabled selected>Select one...</option>' +
        items.map(o => `<option value="${o}">${o}</option>`).join('');
}

function showScenario() {
    const s = scenarios[idx];
    attempted = false;
    card.innerHTML = `
        ${progressHTML()}
        <div class="scenario-label">Scenario ${idx + 1} of ${scenarios.length}</div>
        <div class="scenario">${s.text}</div>
        <div class="field"><label for="bias">1. Which bias is influencing this customer?</label>
            <select id="bias">${optionList(biases)}</select></div>
        <div class="field"><label for="strategy">2. Which story strategy addresses it?</label>
            <select id="strategy">${optionList(s.strategies)}</select></div>
        <div class="controls">
            <button id="submit" disabled>Submit</button>
            <button id="next" style="display:none;">${idx === scenarios.length - 1 ? 'See Summary' : 'Next Scenario'}</button>
        </div>
        <div id="feedback"></div>
    `;
    const biasSel = card.querySelector('#bias'), stratSel = card.querySelector('#strategy');
    const submit = card.querySelector('#submit');
    const update = () => {
        submit.disabled = !(biasSel.value && stratSel.value);
        biasSel.className = stratSel.className = '';
    };
    biasSel.addEventListener('change', update);
    stratSel.addEventListener('change', update);
    submit.addEventListener('click', () => check(biasSel, stratSel));
    card.querySelector('#next').addEventListener('click', () => {
        idx++;
        if (idx < scenarios.length) showScenario(); else showSummary();
    });
}

function check(biasSel, stratSel) {
    const s = scenarios[idx];
    const biasOK = biasSel.value === s.bias, stratOK = stratSel.value === s.strategy;
    if (!attempted) { firstTry.push(biasOK && stratOK); attempted = true; }
    biasSel.className = biasOK ? 'right' : 'wrong';
    stratSel.className = stratOK ? 'right' : 'wrong';

    const fb = card.querySelector('#feedback');
    if (biasOK && stratOK) {
        fb.className = 'feedback ok';
        fb.innerHTML = `<strong>Correct!</strong> This customer is experiencing ${s.bias}. Your strategy of "${lc(s.strategy)}" works because ${s.reason}.`;
    } else {
        fb.className = 'feedback ' + (biasOK || stratOK ? 'partial' : 'bad');
        const part = biasOK ? 'You identified the bias correctly, but the strategy misses. '
            : stratOK ? 'Your strategy is right, but the bias is misidentified. ' : '';
        fb.innerHTML = `<strong>Not quite.</strong> ${part}This customer is actually experiencing ${s.bias}. ` +
            `A better strategy would be "${lc(s.strategy)}" because ${s.reason}. You can change your selections and resubmit to compare feedback.`;
    }
    const prog = card.querySelector('.progress');
    prog.outerHTML = progressHTML();
    card.querySelector('#next').style.display = 'inline-block';
}

function showSummary() {
    const score = firstTry.filter(Boolean).length;
    const rows = scenarios.map((s, i) => `
        <tr><td>${i + 1}</td><td>${s.bias}</td><td>${s.strategy}</td>
        <td class="${firstTry[i] ? 'yes' : 'no'}">${firstTry[i] ? 'Yes' : 'No'}</td></tr>`).join('');
    card.innerHTML = `
        ${progressHTML()}
        <h3 style="margin:0;">Summary: Matching Biases to Story Strategies</h3>
        <div class="score">${score} / ${scenarios.length} correct on first attempt</div>
        <table class="summary"><tr><th>#</th><th>Bias</th><th>Story strategy</th><th>First try</th></tr>${rows}</table>
        <p style="font-size:14px; line-height:1.45;">Each bias calls for a different story: reduce load for a fatigued buyer,
        make inaction costly for a status-quo buyer, and reset the reference point for an anchored buyer.
        ${score === scenarios.length ? 'You have shown mastery of this skill.' : 'Mastery is all three correct on the first attempt. Try again.'}</p>
        <button id="restart">Start Over</button>
    `;
    card.querySelector('#restart').addEventListener('click', () => { idx = 0; firstTry = []; showScenario(); });
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.innerHTML = `
        <h2>Cognitive Bias Simulator</h2>
        <p class="subtitle">Diagnose the bias behind the buyer's hesitation, then choose the story that addresses it</p>
        <div class="card" id="card"></div>
    `;
    card = document.getElementById('card');
    showScenario();
});
