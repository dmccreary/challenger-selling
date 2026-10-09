// Memory Retention Experiment
// CANVAS_HEIGHT: 640
// Step-through experiment: read a story-based and a fact-based presentation of the same
// content, then answer recall questions with the presentations hidden. Results show which
// answers were available from both versions and which only the story supplied.

const scenarios = [
    {
        name: 'Predictive Maintenance',
        story: 'Sarah, a manufacturing VP, was frustrated. Her team worked weekends to fix equipment failures, but customers complained about delays. After adopting predictive maintenance, downtime dropped 60% and her team finally had weekends back. The ROI was $5M in the first year.',
        facts: [
            'Predictive maintenance reduces equipment downtime by 60%.',
            'Manufacturing companies see average ROI of $5M in the first year.',
            '80% of companies report improved team satisfaction after implementation.'
        ],
        questions: [
            { q: 'What was the ROI mentioned in the presentations?', options: ['$5M', '$3M', '$10M'], correct: '$5M', source: 'both' },
            { q: 'What was the percentage reduction in downtime?', options: ['60%', '40%', '80%'], correct: '60%', source: 'both' },
            { q: "What did Sarah's team get back after the change?", options: ['Their weekends', 'A performance bonus', 'A bigger budget'], correct: 'Their weekends', source: 'story' }
        ]
    },
    {
        name: 'Support Ticket Triage',
        story: 'Marcus, a customer-support director, dreaded Monday mornings: a backlog of 4,000 tickets and agents quitting from burnout. After deploying AI-assisted triage, response time fell 45% and he stopped losing his best people. The platform paid back $2M in its first year.',
        facts: [
            'AI-assisted triage reduces support response time by 45%.',
            'Support organizations report average payback of $2M in the first year.',
            '70% of support teams report lower agent attrition after adoption.'
        ],
        questions: [
            { q: 'What first-year payback was mentioned?', options: ['$1M', '$2M', '$4M'], correct: '$2M', source: 'both' },
            { q: 'By how much did response time fall?', options: ['25%', '45%', '65%'], correct: '45%', source: 'both' },
            { q: 'What did Marcus face every Monday morning?', options: ['A 4,000-ticket backlog', 'A board meeting', 'A vendor audit'], correct: 'A 4,000-ticket backlog', source: 'story' }
        ]
    }
];

// Illustrative index used by the chapter specification (fact-based recall = 100).
const STORY_INDEX = 122;

const stepNames = ['Instructions', 'Presentation A', 'Presentation B', 'Recall', 'Results'];
let scenarioIndex = 0;
let step = 0;
let qIndex = 0;
let answers = [];
let card, stepsEl;

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function renderSteps() {
    stepsEl.innerHTML = stepNames.map((n, i) =>
        `<span class="step-dot ${i === step ? 'active' : (i < step ? 'done' : '')}">${i + 1}. ${n}</span>`).join('');
}

function go(n) {
    step = n;
    renderSteps();
    [showIntro, showStory, showFacts, showQuestion, showResults][step]();
}

function nextButton(label, target) {
    return `<button class="next-step" data-target="${target}">${label}</button>`;
}

function wireNext() {
    card.querySelectorAll('.next-step').forEach(b => b.addEventListener('click', () => go(+b.dataset.target)));
}

function showIntro() {
    const s = scenarios[scenarioIndex];
    card.innerHTML = `
        <h3>How well do stories stick?</h3>
        <p>You'll see two presentations about the same topic (<strong>${s.name}</strong>): one as a story, one as facts.
        Then you'll answer recall questions to compare memory retention.</p>
        <p>Read each presentation once at a normal pace. You cannot go back once the recall questions begin,
        so the test reflects what you actually remember.</p>
        ${nextButton('Begin the Experiment', 1)}
    `;
    wireNext();
}

function showStory() {
    card.innerHTML = `
        <span class="tag story">Presentation A: Story-based</span>
        <div class="pres story">${scenarios[scenarioIndex].story}</div>
        <p class="note">Notice the character, the emotion, and the before-and-after.</p>
        ${nextButton('Next: Presentation B', 2)}
    `;
    wireNext();
}

function showFacts() {
    card.innerHTML = `
        <span class="tag facts">Presentation B: Fact-based</span>
        <div class="pres facts"><ul>${scenarios[scenarioIndex].facts.map(f => `<li>${f}</li>`).join('')}</ul></div>
        <p class="note">When you continue, both presentations are hidden.</p>
        ${nextButton('Start the Recall Test', 3)}
    `;
    wireNext();
    qIndex = 0;
    answers = [];
}

function showQuestion() {
    const q = scenarios[scenarioIndex].questions[qIndex];
    const last = qIndex === 2;
    card.innerHTML = `
        <p class="note">Question ${qIndex + 1} of 3. The presentations are hidden.</p>
        <h3>${q.q}</h3>
        <div id="options"></div>
        <div id="feedback"></div>
        <button class="next-step" id="q-next" style="display:none;">${last ? 'See My Results' : 'Next Question'}</button>
    `;
    const opts = card.querySelector('#options');
    shuffle(q.options).forEach(o => {
        const b = document.createElement('button');
        b.className = 'option';
        b.textContent = o;
        b.addEventListener('click', () => answer(o, q));
        opts.appendChild(b);
    });
    card.querySelector('#q-next').addEventListener('click', () => {
        if (last) go(4); else { qIndex++; showQuestion(); }
    });
}

function answer(choice, q) {
    const right = choice === q.correct;
    answers.push(right);
    card.querySelectorAll('.option').forEach(b => {
        b.disabled = true;
        if (b.textContent === q.correct) b.classList.add('correct');
        else if (b.textContent === choice) b.classList.add('wrong');
    });
    const fb = card.querySelector('#feedback');
    fb.className = 'feedback ' + (right ? 'ok' : 'bad');
    const where = q.source === 'both' ? 'Both presentations included this fact.' : 'Only the story included this detail.';
    fb.textContent = (right ? 'Correct. ' : `Not quite. The answer was "${q.correct}". `) + where;
    card.querySelector('#q-next').style.display = 'inline-block';
}

function chartSVG() {
    const W = 520, H = 120, L = 150, maxW = W - L - 20, scale = maxW / 130;
    const bars = [
        { label: 'Fact-based recall', value: 100, color: '#546e7a' },
        { label: 'Story-based recall', value: STORY_INDEX, color: '#8e24aa' }
    ];
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart: story-based recall index ${STORY_INDEX} versus fact-based 100">`;
    bars.forEach((b, i) => {
        const y = 14 + i * 46, w = b.value * scale;
        svg += `<text class="bar-label" x="${L - 8}" y="${y + 22}" text-anchor="end">${b.label}</text>`;
        svg += `<rect x="${L}" y="${y}" width="${w}" height="32" rx="4" fill="${b.color}"/>`;
        svg += `<text class="bar-value" x="${L + w - 8}" y="${y + 21}" text-anchor="end">${b.value}</text>`;
    });
    svg += `<line class="axis" x1="${L}" y1="8" x2="${L}" y2="${H - 12}"/></svg>`;
    return svg;
}

function showResults() {
    const s = scenarios[scenarioIndex];
    const score = answers.filter(Boolean).length;
    const rows = s.questions.map((q, i) => `
        <tr><td>${q.q}</td>
        <td><span class="tag ${q.source}">${q.source === 'both' ? 'Story + Facts' : 'Story only'}</span></td>
        <td class="${answers[i] ? 'yes' : 'no'}">${answers[i] ? 'Recalled' : 'Missed'}</td></tr>`).join('');
    card.innerHTML = `
        <h3>You correctly answered ${score} of 3 questions.</h3>
        <table class="recap"><tr><th>Question</th><th>Available in</th><th>You</th></tr>${rows}</table>
        <p>The third question could only be answered from the story. The fact list never mentioned it, yet a
        concrete, emotional detail like that is often the easiest thing to recall. Story-based presentations are
        typically remembered about 22% better than fact-based ones.</p>
        <div class="chart">${chartSVG()}</div>
        <p class="note">Illustrative recall index (fact-based = 100) from the chapter's summary of story-memory research.
        Narrative creates more memory associations and emotional engagement, leading to better recall.
        Published effect sizes vary by study and setting.</p>
        <div class="row">
            <button id="new-scenario">Try a New Scenario</button>
            <button id="repeat" class="secondary">Repeat This Scenario</button>
        </div>
    `;
    card.querySelector('#new-scenario').addEventListener('click', () => {
        scenarioIndex = (scenarioIndex + 1) % scenarios.length;
        go(0);
    });
    card.querySelector('#repeat').addEventListener('click', () => go(0));
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.innerHTML = `
        <h2>Memory Retention Experiment</h2>
        <div class="steps" id="steps"></div>
        <div class="card" id="card"></div>
    `;
    stepsEl = document.getElementById('steps');
    card = document.getElementById('card');
    go(0);
});
