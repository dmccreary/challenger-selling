// Hero's Journey Interactive Map
// CANVAS_HEIGHT: 500
// Click-to-reveal circular map of Campbell's monomyth applied to sales stories.
// A three-question quiz unlocks after the learner has opened all 11 stages.

const stages = [
    { title: 'Ordinary World', lines: ['Ordinary', 'World'], angle: -90,
      description: "The customer's current state before change. In sales, this is the status quo where the customer uses legacy systems or processes. This stage establishes the baseline.",
      salesApp: "Establish the customer's current situation and baseline metrics." },
    { title: 'Call to Adventure', lines: ['Call to', 'Adventure'], angle: -62,
      description: 'The recognition of a problem or opportunity. The customer realizes they need to change. In sales, this is when the customer becomes aware of a challenge your solution addresses.',
      salesApp: 'Help the customer recognize the problem or opportunity.' },
    { title: 'Refusal of the Call', lines: ['Refusal of', 'the Call'], angle: -38,
      description: 'Initial resistance to change. The customer hesitates or questions whether action is needed. In sales, this is the customer\'s skepticism or objections.',
      salesApp: 'Address initial skepticism and objections.' },
    { title: 'Meeting the Mentor', lines: ['Meeting the', 'Mentor'], angle: -16,
      description: 'Encountering a guide who provides expertise. The customer meets a trusted advisor (you) who shows the path forward. In sales, this is when you establish credibility and provide guidance.',
      salesApp: 'Establish credibility and provide expert guidance.' },
    { title: 'Crossing the Threshold', lines: ['Crossing the', 'Threshold'], angle: 8,
      description: 'Committing to the journey. The customer decides to take action. In sales, this is when the customer agrees to a pilot or demonstration.',
      salesApp: 'Get commitment to a pilot or demonstration.' },
    { title: 'Tests, Allies, Enemies', lines: ['Tests, Allies,', 'Enemies'], angle: 36,
      description: 'Facing challenges during implementation. The customer encounters obstacles, finds allies, and deals with opponents. In sales, this is the implementation phase with its challenges.',
      salesApp: 'Support the customer through implementation challenges.' },
    { title: 'Approach to the Inmost Cave', lines: ['Approach to the', 'Inmost Cave'], angle: 66,
      description: 'The final challenge. The customer faces the most difficult part of the change. In sales, this is the critical decision point or final implementation hurdle.',
      salesApp: 'Help the customer prepare for the hardest part of the change.' },
    { title: 'The Ordeal', lines: ['The Ordeal'], angle: 98,
      description: 'The climax of the journey. The customer overcomes the final challenge. In sales, this is when the solution is fully implemented and working.',
      salesApp: 'Show how the customer pushed through the decisive moment.' },
    { title: 'Reward (Seizing the Sword)', lines: ['Reward', '(Seizing the Sword)'], angle: 132,
      description: 'Achieving the outcome. The customer gains the benefit of the change. In sales, this is when the customer achieves the business result.',
      salesApp: 'Quantify the business results achieved.' },
    { title: 'The Road Back', lines: ['The Road', 'Back'], angle: 172,
      description: 'Returning to ordinary life with the elixir. The customer integrates the change into their operations. In sales, this is when the solution becomes part of standard operations.',
      salesApp: 'Help integrate the solution into standard operations.' },
    { title: 'Return with the Elixir', lines: ['Return with', 'the Elixir'], angle: 222,
      description: "Sharing the benefit with others. The customer's success benefits the organization. In sales, this is when the success becomes a case study that influences others.",
      salesApp: 'Turn the success into a case study that influences other buyers.' }
];

const quizQuestions = [
    { question: 'Which stage represents the customer recognizing they have a problem?',
      options: ['Ordinary World', 'Call to Adventure', 'Meeting the Mentor', 'Reward'],
      correct: 'Call to Adventure',
      correctFeedback: 'Right! The Call to Adventure is when the customer recognizes the problem.',
      incorrectFeedback: 'Not quite. The Call to Adventure is the recognition of the problem.' },
    { question: 'In sales storytelling, who is typically the "hero"?',
      options: ['The salesperson', 'The customer', 'The competitor', 'The mentor'],
      correct: 'The customer',
      correctFeedback: 'Exactly! In sales stories, the customer is the hero on a journey.',
      incorrectFeedback: 'Not quite. The customer is typically the hero in sales stories. You play the mentor.' },
    { question: 'Which stage corresponds to the customer agreeing to a pilot project?',
      options: ['Refusal of the Call', 'Crossing the Threshold', 'The Ordeal', 'Return with the Elixir'],
      correct: 'Crossing the Threshold',
      correctFeedback: 'Yes! Crossing the Threshold is committing to action, like a pilot.',
      incorrectFeedback: 'Not quite. Crossing the Threshold is when the customer commits to the journey.' }
];

const SVG_NS = 'http://www.w3.org/2000/svg';
const CX = 260, CY = 215, R = 140, LABEL_R = 166;

const visited = new Set();
let selected = -1;
let quizOrder = [];
let quizIndex = 0;
let score = 0;
let panel, stageEls = [];

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function el(tag, attrs, parent) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
}

function buildMap(container) {
    const svg = el('svg', { viewBox: '0 0 520 430', role: 'img', 'aria-label': "Hero's Journey circular map with 11 stages" }, container);
    el('circle', { class: 'ring', cx: CX, cy: CY, r: R }, svg);
    el('line', { class: 'divider', x1: CX - R - 10, y1: CY, x2: CX + R + 10, y2: CY }, svg);
    el('text', { class: 'world-label', x: CX, y: CY - 14 }, svg).textContent = 'Known World (status quo)';
    el('text', { class: 'world-label', x: CX, y: CY + 24 }, svg).textContent = 'Special World (change)';

    stages.forEach((s, i) => {
        const rad = s.angle * Math.PI / 180;
        const x = CX + R * Math.cos(rad), y = CY + R * Math.sin(rad);
        const g = el('g', { class: 'stage', tabindex: 0, role: 'button', 'aria-label': `Stage ${i + 1}: ${s.title}` }, svg);
        el('circle', { cx: x, cy: y, r: 16 }, g);
        el('text', { class: 'num', x: x, y: y }, g).textContent = i + 1;

        const lx = CX + LABEL_R * Math.cos(rad), ly = CY + LABEL_R * Math.sin(rad);
        const c = Math.cos(rad);
        const anchor = Math.abs(c) < 0.25 ? 'middle' : (c > 0 ? 'start' : 'end');
        const s1 = Math.sin(rad);
        const lineH = 14;
        const startY = Math.abs(c) < 0.25
            ? (s1 < 0 ? ly - (s.lines.length - 1) * lineH - 2 : ly + 10)
            : ly - (s.lines.length - 1) * lineH / 2 + 4;
        const t = el('text', { class: 'label', x: lx, y: startY, 'text-anchor': anchor }, g);
        s.lines.forEach((line, k) => {
            el('tspan', { x: lx, dy: k === 0 ? 0 : lineH }, t).textContent = line;
        });

        g.addEventListener('click', () => selectStage(i));
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectStage(i); } });
        stageEls.push(g);
    });
}

function progressHTML() {
    const pct = Math.round(visited.size / stages.length * 100);
    return `<div class="progress">Stages explored: ${visited.size} of ${stages.length}<div class="bar"><div style="width:${pct}%"></div></div></div>`;
}

function refreshStageClasses() {
    stageEls.forEach((g, i) => {
        g.classList.toggle('visited', visited.has(i));
        g.classList.toggle('selected', i === selected);
    });
}

function selectStage(i) {
    if (quizOrder.length) return;
    selected = i;
    visited.add(i);
    refreshStageClasses();
    const s = stages[i];
    const done = visited.size === stages.length;
    panel.innerHTML = `
        <h3>${i + 1}. ${s.title}</h3>
        <p>${s.description}</p>
        <div class="sales"><strong>In your sales story:</strong> ${s.salesApp}</div>
        ${progressHTML()}
        ${done ? '<p style="margin-top:12px;">You have explored every stage.</p><button id="start-quiz">Start the Quiz</button>' : ''}
    `;
    if (done) document.getElementById('start-quiz').addEventListener('click', startQuiz);
}

function showIntro() {
    panel.innerHTML = `
        <h3>Explore the Journey</h3>
        <p class="hint">Click each stage to learn about the Hero's Journey.</p>
        <p>The journey runs clockwise. Above the dashed line is the customer's known world; below it is the
        world of change they enter when they commit to act.</p>
        <p>Watch for who plays the hero in a sales story, and who plays the mentor.</p>
        ${progressHTML()}
    `;
}

function startQuiz() {
    quizOrder = shuffle(quizQuestions);
    quizIndex = 0;
    score = 0;
    selected = -1;
    refreshStageClasses();
    showQuestion();
}

function showQuestion() {
    if (quizIndex >= quizOrder.length) return showResults();
    const q = quizOrder[quizIndex];
    panel.innerHTML = `
        <div class="qcount">Question ${quizIndex + 1} of ${quizOrder.length}</div>
        <h3>${q.question}</h3>
        <div id="options"></div>
        <div id="feedback"></div>
        <button id="next-btn" style="display:none;">${quizIndex === quizOrder.length - 1 ? 'See My Score' : 'Next Question'}</button>
    `;
    const opts = document.getElementById('options');
    q.options.forEach(option => {
        const b = document.createElement('button');
        b.className = 'option';
        b.textContent = option;
        b.addEventListener('click', () => answer(option, q));
        opts.appendChild(b);
    });
    document.getElementById('next-btn').addEventListener('click', () => { quizIndex++; showQuestion(); });
}

function answer(choice, q) {
    const right = choice === q.correct;
    if (right) score++;
    document.querySelectorAll('.option').forEach(b => {
        b.disabled = true;
        if (b.textContent === q.correct) b.classList.add('correct');
        else if (b.textContent === choice) b.classList.add('wrong');
    });
    const fb = document.getElementById('feedback');
    fb.className = 'feedback ' + (right ? 'ok' : 'bad');
    fb.textContent = right ? q.correctFeedback : q.incorrectFeedback;
    document.getElementById('next-btn').style.display = 'inline-block';
}

function showResults() {
    const perfect = score === quizOrder.length;
    panel.innerHTML = `
        <h3>Quiz Complete</h3>
        <div class="score">${score} / ${quizOrder.length}</div>
        <p>${perfect
            ? 'Mastery shown. You can map a sales story onto the Hero\'s Journey, with the customer as hero and you as mentor.'
            : 'Review the stages you missed on the map, then try again. Mastery is 3 of 3 on the first attempt.'}</p>
        <button id="retry">Retry Quiz</button>
        <button id="review" class="secondary">Review the Map</button>
    `;
    document.getElementById('retry').addEventListener('click', startQuiz);
    document.getElementById('review').addEventListener('click', () => { quizOrder = []; showIntro(); });
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.innerHTML = `
        <h2>Hero's Journey Interactive Map</h2>
        <p class="subtitle">Campbell's monomyth, retold as a customer's journey through change</p>
        <div class="layout"><div id="map"></div><div class="panel" id="panel"></div></div>
    `;
    panel = document.getElementById('panel');
    buildMap(document.getElementById('map'));
    showIntro();
});
