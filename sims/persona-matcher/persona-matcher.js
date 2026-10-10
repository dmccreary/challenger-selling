// Persona Matcher - identify the buyer persona and messaging focus
// CANVAS_HEIGHT: 560
// Step-through practice: read a stakeholder description, pick the persona and
// the messaging focus, then get feedback explaining the match.

const APP_HEIGHT = 560;

const PERSONAS = ['CIO', 'CTO', 'CFO', 'CEO', 'VP of Sales', 'IT Director', 'Procurement Manager'];

// Which persona each messaging focus serves best, used to explain wrong picks
const FOCI = {
    'Technical architecture': 'CTOs and technical stakeholders, who scrutinize technical fit, scalability, and benchmarks',
    'Financial ROI': 'CFOs, who evaluate every investment through cost of the status quo, payback period, and risk-adjusted returns',
    'Strategic positioning': 'CIOs and CEOs, who want the business impact of a decision, not its technical details',
    'Sales productivity': 'VPs of Sales, who judge solutions by deal velocity, win rates, and quota attainment',
    'Implementation process': 'IT Directors, who care how a solution is deployed, supported, and maintained'
};

// Hints for persona picks that are close but wrong
const PERSONA_HINTS = {
    'CTO': 'CTOs want technical depth; this stakeholder explicitly does not.',
    'CEO': 'CEOs own overall business strategy, not the technology strategy specifically.',
    'CIO': 'CIOs own technology strategy; this stakeholder thinks in financial terms.',
    'IT Director': 'IT Directors run day-to-day operations and implementations rather than setting strategy or budgets.',
    'Procurement Manager': 'Procurement Managers manage purchasing terms and vendor risk, not overall financial performance.'
};

const SCENARIOS = [
    {
        text: 'This stakeholder is responsible for technology strategy. They focus on alignment between technology and business objectives, security, and ROI. They want to understand business impact, not technical details.',
        persona: 'CIO',
        focus: 'Strategic positioning',
        reason: 'CIOs balance innovation against stability and delegate technical detail to their teams. Show how your insight supports their technology roadmap, reduces risk, or enables digital transformation.'
    },
    {
        text: 'This stakeholder controls financial resources and focuses on financial performance, risk management, and ROI. They translate everything into financial terms and demand clear justification.',
        persona: 'CFO',
        focus: 'Financial ROI',
        reason: 'CFOs are skeptical of soft benefits. Quantify the cost of the status quo, the financial impact of your solution, and the payback period using their language: TCO, EBITDA, and working capital.'
    },
    {
        text: 'This stakeholder focuses on revenue growth, sales productivity, and sales team performance. They care about deal velocity, win rates, and quota attainment.',
        persona: 'VP of Sales',
        focus: 'Sales productivity',
        reason: 'VPs of Sales are results-oriented and metric-driven. Show how your solution shortens sales cycles and improves win rates, using their own metrics as evidence.'
    }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let index = 0;
    // results[i] = { firstTryCorrect, persona, focus } once submitted
    const results = [];

    function optionList(items) {
        return '<option value="">-- choose --</option>' +
            items.map(v => `<option value="${v}">${v}</option>`).join('');
    }

    function progressDots() {
        return '<div class="progress">' + SCENARIOS.map((s, i) => {
            let cls = 'dot';
            if (results[i]) cls += results[i].firstTryCorrect ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function renderScenario() {
        const s = SCENARIOS[index];
        app.innerHTML = `
            <h2>Persona Matcher</h2>
            <p class="subtitle">Identify the buyer persona, then choose the messaging focus that will resonate.</p>
            ${progressDots()}
            <div class="card">
                <h3>Stakeholder ${index + 1} of ${SCENARIOS.length}</h3>
                <p class="quote">"${s.text}"</p>
            </div>
            <div class="field-row">
                <div class="field">
                    <label for="persona">Persona</label>
                    <select id="persona">${optionList(PERSONAS)}</select>
                </div>
                <div class="field">
                    <label for="focus">Messaging Focus</label>
                    <select id="focus">${optionList(Object.keys(FOCI))}</select>
                </div>
            </div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < SCENARIOS.length - 1 ? 'Next Stakeholder' : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const personaSel = app.querySelector('#persona');
        const focusSel = app.querySelector('#focus');
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');

        const updateSubmit = () => { submit.disabled = !(personaSel.value && focusSel.value); };
        personaSel.addEventListener('change', updateSubmit);
        focusSel.addEventListener('change', updateSubmit);

        submit.addEventListener('click', () => {
            const p = personaSel.value, f = focusSel.value;
            const pOk = p === s.persona, fOk = f === s.focus;
            if (!results[index]) results[index] = { firstTryCorrect: pOk && fOk, persona: p, focus: f };

            if (pOk && fOk) {
                fb.innerHTML = `<div class="feedback ok"><strong>Correct!</strong> This is a <strong>${s.persona}</strong>. The best messaging focus is <strong>${s.focus}</strong> because ${s.reason}</div>`;
            } else {
                let parts = [];
                if (!pOk) parts.push(`This description matches a <strong>${s.persona}</strong>. ${PERSONA_HINTS[p] || ''}`);
                else parts.push(`You identified the <strong>${s.persona}</strong> correctly.`);
                if (!fOk) parts.push(`<strong>${f}</strong> fits ${FOCI[f]}. A better messaging focus would be <strong>${s.focus}</strong> because ${s.reason}`);
                else parts.push(`<strong>${s.focus}</strong> is the right messaging focus.`);
                fb.innerHTML = `<div class="feedback bad"><strong>Not quite.</strong> ${parts.join(' ')}<br><em>Change your selections and submit again to compare, or move on.</em></div>`;
            }
            next.classList.remove('hidden');
            progressRefresh();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < SCENARIOS.length) renderScenario(); else renderSummary();
        });
    }

    function progressRefresh() {
        const old = app.querySelector('.progress');
        if (old) old.outerHTML = progressDots();
    }

    function renderSummary() {
        const score = results.filter(r => r.firstTryCorrect).length;
        const rows = SCENARIOS.map((s, i) => {
            const r = results[i];
            const mark = r.firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td><strong>${s.persona}</strong></td><td>${s.focus}</td><td>${s.reason}</td></tr>`;
        }).join('');
        app.innerHTML = `
            <h2>Persona Matcher: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${SCENARIOS.length}</strong>${score === SCENARIOS.length ? ' (mastery)' : ''}</p>
            <table class="summary">
                <tr><th>#</th><th>Persona</th><th>Messaging Focus</th><th>Why it works</th></tr>
                ${rows}
            </table>
            <div class="feedback warn" style="margin-top:10px;">
                <strong>Remember:</strong> each executive has distinct priorities, and the same title can carry different priorities in different organizations. One message never fits every persona.
            </div>
            <div class="btn-row"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderScenario();
        });
    }

    renderScenario();
});
