// MicroSim Type Explorer - match learning scenarios to MicroSim types
// CANVAS_HEIGHT: 540
// Learners read a learning need and pick the MicroSim type that serves it.

const CONFIG = {
    title: 'MicroSim Type Explorer',
    subtitle: 'Which kind of MicroSim best serves each learning need?',
    height: 540,
    itemLabel: 'Scenario',
    fields: [{
        id: 'type', label: 'MicroSim Type', type: 'buttons',
        options: ['p5.js', 'Chart.js', 'vis-network', 'causal-loop', 'concept-classifier']
    }],
    optionInfo: {
        type: {
            'p5.js': 'is a custom code simulation where learners move sliders and watch a system respond',
            'Chart.js': 'is a data visualization for comparing values and datasets',
            'vis-network': 'is a network diagram of nodes and the edges that connect them',
            'causal-loop': 'is a feedback-loop diagram showing reinforcing and balancing cycles',
            'concept-classifier': 'is a sorting quiz where learners place items into categories'
        }
    },
    items: [
        {
            short: 'Variables interacting over time',
            text: 'Students need to understand how variables in a system interact over time through manipulation.',
            correct: { type: 'p5.js' },
            reason: 'This scenario calls for a <strong>p5.js</strong> MicroSim because learners need to <em>manipulate</em> variables with controls and watch the simulated system change over time.',
            why: 'Code simulation with sliders and live response.'
        },
        {
            short: 'Compare datasets',
            text: 'Students need to explore data relationships and compare datasets visually.',
            correct: { type: 'Chart.js' },
            reason: 'This scenario calls for a <strong>Chart.js</strong> MicroSim because comparing datasets is a charting task: bars, lines, and scatter plots make differences visible at a glance.',
            why: 'Data visualization for comparison.'
        },
        {
            short: 'Network connections',
            text: 'Students need to understand network connections and relationship patterns.',
            correct: { type: 'vis-network' },
            reason: 'This scenario calls for a <strong>vis-network</strong> MicroSim because connections and relationship patterns are naturally drawn as nodes and edges that learners can drag and explore.',
            why: 'Nodes and edges.'
        },
        {
            short: 'Feedback loops',
            text: 'Students need to understand feedback loops and system dynamics.',
            correct: { type: 'causal-loop' },
            reason: 'This scenario calls for a <strong>causal-loop</strong> MicroSim because it labels each link as same- or opposite-direction and marks loops as reinforcing or balancing, which a plain network diagram does not show.',
            why: 'Reinforcing and balancing loops.'
        },
        {
            short: 'Categorize concepts',
            text: 'Students need to practice categorizing concepts by dragging items to categories.',
            correct: { type: 'concept-classifier' },
            reason: 'This scenario calls for a <strong>concept-classifier</strong> MicroSim because it is purpose-built for sorting items into categories with immediate feedback.',
            why: 'Sorting quiz with feedback.'
        }
    ],
    summaryNote: 'MicroSims are interactive, not just visual, and different types serve different learning objectives. Match the type to what the learner must DO: manipulate, compare, explore connections, trace loops, or classify.'
};

// ---------------------------------------------------------------------------
// Step-through scenario engine: one scenario at a time, learner selections,
// Submit -> feedback, Next -> following scenario, then a summary table.
// Only the first submission for each scenario counts toward the score.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    let index = 0;
    const results = [];
    const n = C.items.length;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const optsFor = (it, f) => (it.options && it.options[f.id]) || f.options;
    const info = (f, v) => (C.optionInfo && C.optionInfo[f.id] && C.optionInfo[f.id][v]) || '';

    function progressDots() {
        return '<div class="progress">' + C.items.map((s, i) => {
            let cls = 'dot';
            if (results[i]) cls += results[i].firstTryCorrect ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function fieldHtml(f, opts) {
        if (f.type === 'buttons') {
            return `<div class="field full"><label>${f.label}</label><div class="choice-row" data-field="${f.id}">` +
                opts.map(o => `<button type="button" class="choice" data-value="${esc(o)}">${esc(o)}</button>`).join('') +
                '</div></div>';
        }
        return `<div class="field"><label for="f-${f.id}">${f.label}</label><select id="f-${f.id}" data-field="${f.id}">` +
            '<option value="">-- choose --</option>' +
            opts.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('') + '</select></div>';
    }

    function renderItem() {
        const it = C.items[index];
        const sel = {};
        app.innerHTML = `
            <h2>${C.title}</h2>
            <p class="subtitle">${C.subtitle}</p>
            ${C.contextHtml || ''}
            ${progressDots()}
            <div class="card">
                <h3>${C.itemLabel} ${index + 1} of ${n}${it.heading ? ': ' + it.heading : ''}</h3>
                <p class="quote">${it.text}</p>
            </div>
            <div class="field-row">${C.fields.map(f => fieldHtml(f, optsFor(it, f))).join('')}</div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < n - 1 ? 'Next ' + C.itemLabel : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');
        const updateSubmit = () => { submit.disabled = !C.fields.every(f => sel[f.id]); };

        app.querySelectorAll('select[data-field]').forEach(s => s.addEventListener('change', () => {
            sel[s.dataset.field] = s.value;
            updateSubmit();
        }));
        app.querySelectorAll('.choice-row').forEach(row => row.querySelectorAll('button.choice').forEach(b => {
            b.addEventListener('click', () => {
                row.querySelectorAll('button.choice').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                sel[row.dataset.field] = b.dataset.value;
                updateSubmit();
            });
        }));

        submit.addEventListener('click', () => {
            const ok = {};
            C.fields.forEach(f => { ok[f.id] = sel[f.id] === it.correct[f.id]; });
            const allOk = C.fields.every(f => ok[f.id]);
            if (!results[index]) results[index] = { firstTryCorrect: allOk, sel: Object.assign({}, sel) };

            let html;
            if (allOk) {
                html = `<div class="feedback ok"><strong>Correct!</strong> ${it.reason}</div>`;
            } else {
                const parts = C.fields.map(f => {
                    if (ok[f.id]) return `<strong>${f.label}:</strong> ${esc(sel[f.id])} is right.`;
                    const why = info(f, sel[f.id]);
                    return `<strong>${f.label}:</strong> you chose ${esc(sel[f.id])}${why ? ', which ' + why : ''}. The better choice is <strong>${esc(it.correct[f.id])}</strong>.`;
                });
                html = `<div class="feedback bad"><strong>Not quite.</strong> ${parts.join(' ')}<br>${it.reason}` +
                    '<br><em>Change your selections and submit again to compare, or move on.</em></div>';
            }
            if (C.resultHtml) {
                const res = C.resultHtml(it, sel, allOk);
                html = C.resultBeside ? `<div class="two-col">${res}${html}</div>` : res + html;
            }
            fb.innerHTML = html;
            next.classList.remove('hidden');
            const old = app.querySelector('.progress');
            if (old) old.outerHTML = progressDots();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < n) renderItem(); else renderSummary();
        });
    }

    function renderSummary() {
        const score = results.filter(r => r.firstTryCorrect).length;
        const head = `<tr><th>#</th><th>${C.itemLabel}</th>${C.fields.map(f => `<th>${f.label}</th>`).join('')}<th>Why</th></tr>`;
        const rows = C.items.map((it, i) => {
            const mark = results[i].firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td>${it.short}</td>` +
                C.fields.map(f => `<td><strong>${esc(it.correct[f.id])}</strong></td>`).join('') +
                `<td>${it.why}</td></tr>`;
        }).join('');
        app.innerHTML = `
            <h2>${C.title}: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${n}</strong>${score === n ? ' (mastery)' : ''}</p>
            <table class="summary">${head}${rows}</table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> ${C.summaryNote}</div>
            <div class="btn-row"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderItem();
        });
    }

    renderItem();
});
