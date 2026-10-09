// Vertical Insight Tailorer - adapt one Challenger insight for three industries
// CANVAS_HEIGHT: 600
// Step-through practice: choose a framing and messaging focus per vertical and
// see the base insight rewritten with that framing.

const APP_HEIGHT = 600;

const BASE_INSIGHT = 'Organizations that maintain legacy data systems spend 40% of their IT budget on maintenance rather than innovation, blocking their ability to compete effectively.';

const FRAMINGS = ['Regulatory compliance focus', 'Patient outcome focus', 'Operational efficiency focus', 'Competitive urgency focus'];

const VERTICALS = [
    {
        name: 'Healthcare',
        foci: ['HIPAA compliance', 'Patient safety', 'Cost reduction', 'Time-to-market'],
        framing: 'Patient outcome focus',
        focus: 'Patient safety',
        reason: 'healthcare organizations prioritize patient safety and outcomes above all. Compliance and efficiency matter, but they are most persuasive when tied to better care.',
        adapted: {
            'Patient outcome focus': 'Hospitals spending 40% of IT budgets keeping legacy records systems alive have less to invest in clinical decision support, and clinicians work from fragmented patient data that puts safety at risk.',
            'Regulatory compliance focus': 'Legacy records systems consume 40% of hospital IT budgets and make HIPAA audits harder to pass.',
            'Operational efficiency focus': 'Legacy data systems consume 40% of hospital IT budgets that could fund efficiency projects.',
            'Competitive urgency focus': 'Hospitals stuck on legacy systems spend 40% of IT budgets on maintenance while rival health systems innovate.'
        }
    },
    {
        name: 'Financial Services',
        foci: ['HIPAA compliance', 'Risk management', 'Cost reduction', 'Time-to-market'],
        framing: 'Regulatory compliance focus',
        focus: 'Risk management',
        reason: 'financial institutions are risk-averse and operate under intense regulatory scrutiny. Show that the status quo is the riskier choice and that your solution reduces risk rather than adding uncertainty.',
        adapted: {
            'Regulatory compliance focus': 'Banks pouring 40% of IT budgets into legacy data systems are running regulatory reporting on aging platforms that are harder to audit and secure, so the status quo itself is a growing compliance and operational risk.',
            'Patient outcome focus': 'Patient outcomes are not a priority for a bank, so this framing does not connect to the buyer at all.',
            'Operational efficiency focus': 'Legacy systems consume 40% of bank IT budgets that could go toward streamlining back-office processing.',
            'Competitive urgency focus': 'Fintech competitors are innovating while legacy banks spend 40% of IT budgets on maintenance.'
        }
    },
    {
        name: 'Technology',
        foci: ['HIPAA compliance', 'Innovation capability', 'Cost reduction', 'Patient safety'],
        framing: 'Competitive urgency focus',
        focus: 'Innovation capability',
        reason: 'technology companies compete on speed-to-market and innovation. An insight that shows maintenance consuming engineering capacity speaks directly to competitive advantage.',
        adapted: {
            'Competitive urgency focus': 'Every engineer-hour spent maintaining legacy data systems (40% of IT budget) is an hour your competitors spend shipping features. In a market with short product cycles, that gap compounds every release.',
            'Regulatory compliance focus': 'Legacy systems consuming 40% of IT budgets can complicate SOC 2 compliance, but compliance is rarely what drives a tech buyer.',
            'Patient outcome focus': 'Patient outcomes are irrelevant to most technology buyers, so this framing misses the audience.',
            'Operational efficiency focus': 'Legacy systems consume 40% of IT budget; modernizing would trim operating costs.'
        }
    }
];

// Short explanations of each messaging focus, used when a pick is wrong
const FOCUS_NOTES = {
    'HIPAA compliance': 'HIPAA is a US healthcare privacy regulation, so it does not apply outside healthcare and is secondary to patient outcomes within it.',
    'Patient safety': 'Patient safety is the top healthcare priority but has no meaning for most other industries.',
    'Cost reduction': 'Cost reduction is a generic message. It is strongest in thin-margin industries like manufacturing and retail.',
    'Time-to-market': 'Time-to-market is a speed message that fits technology companies best.',
    'Risk management': 'Risk management is the core message for risk-averse, regulated buyers like financial services.',
    'Innovation capability': 'Innovation capability is the core message for technology buyers who compete on new capabilities.'
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let index = 0;
    const results = [];

    const optionList = items => '<option value="">-- choose --</option>' +
        items.map(v => `<option value="${v}">${v}</option>`).join('');

    function progressDots() {
        return '<div class="progress">' + VERTICALS.map((v, i) => {
            let cls = 'dot';
            if (results[i] !== undefined) cls += results[i] ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}" title="${v.name}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function renderVertical() {
        const v = VERTICALS[index];
        app.innerHTML = `
            <h2>Vertical Insight Tailorer</h2>
            <p class="subtitle">Adapt one Challenger insight so it lands in each industry.</p>
            ${progressDots()}
            <div class="card">
                <h3>Base Insight</h3>
                <p class="quote">"${BASE_INSIGHT}"</p>
            </div>
            <div class="card">
                <h3>Vertical ${index + 1} of ${VERTICALS.length}: ${v.name}</h3>
                <div class="field-row" style="margin-bottom:0;">
                    <div class="field">
                        <label for="framing">Framing</label>
                        <select id="framing">${optionList(FRAMINGS)}</select>
                    </div>
                    <div class="field">
                        <label for="focus">Messaging Focus</label>
                        <select id="focus">${optionList(v.foci)}</select>
                    </div>
                </div>
            </div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < VERTICALS.length - 1 ? 'Next Vertical' : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const framingSel = app.querySelector('#framing');
        const focusSel = app.querySelector('#focus');
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');

        const update = () => { submit.disabled = !(framingSel.value && focusSel.value); };
        framingSel.addEventListener('change', update);
        focusSel.addEventListener('change', update);

        submit.addEventListener('click', () => {
            const fr = framingSel.value, fo = focusSel.value;
            const ok = fr === v.framing && fo === v.focus;
            if (results[index] === undefined) results[index] = ok;

            if (ok) {
                fb.innerHTML = `<div class="feedback ok"><strong>Correct!</strong> For ${v.name}, the best approach is <strong>${v.framing}</strong> with <strong>${v.focus}</strong> because ${v.reason}
                    <br><br><strong>Adapted insight:</strong> <em>"${v.adapted[v.framing]}"</em></div>`;
            } else {
                const focusNote = fo !== v.focus ? ` ${FOCUS_NOTES[fo]}` : '';
                fb.innerHTML = `<div class="feedback bad"><strong>Not quite.</strong> Your version would read: <em>"${v.adapted[fr]}"</em>${focusNote}
                    <br><br>For ${v.name}, a better approach would be <strong>${v.framing}</strong> with <strong>${v.focus}</strong> because ${v.reason}
                    <br><br><strong>Stronger adaptation:</strong> <em>"${v.adapted[v.framing]}"</em></div>`;
            }
            next.classList.remove('hidden');
            app.querySelector('.progress').outerHTML = progressDots();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < VERTICALS.length) renderVertical(); else renderSummary();
        });
    }

    function renderSummary() {
        const score = results.filter(Boolean).length;
        const rows = VERTICALS.map((v, i) => `
            <tr><td>${results[i] ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} <strong>${v.name}</strong></td>
            <td>${v.framing}<br><em>${v.focus}</em></td>
            <td>"${v.adapted[v.framing]}"</td></tr>`).join('');
        app.innerHTML = `
            <h2>Vertical Insight Tailorer: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${VERTICALS.length}</strong>${score === VERTICALS.length ? ' (mastery)' : ''}</p>
            <div class="card" style="padding:8px 12px;"><strong>Same fact, three insights.</strong> The 40% maintenance statistic never changed. Only the consequence it points to did.</div>
            <table class="summary">
                <tr><th>Vertical</th><th>Framing / Focus</th><th>Adapted Insight</th></tr>
                ${rows}
            </table>
            <div class="btn-row" style="margin-top:10px;"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderVertical();
        });
    }

    renderVertical();
});
