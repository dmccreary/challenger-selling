// xAPI Statement Builder - assemble actor-verb-object statements
// CANVAS_HEIGHT: 710
// Learners turn a plain-English learning event into an xAPI statement by
// choosing the actor, verb, and object. The JSON statement they built is
// shown after each submission so they can see the structure.

const SITE = 'https://dmccreary.github.io/challenger-selling';

const VERB_IRIS = {
    completed: 'http://adlnet.gov/expapi/verbs/completed',
    viewed: 'http://id.tincanapi.com/verb/viewed',
    answered: 'http://adlnet.gov/expapi/verbs/answered',
    failed: 'http://adlnet.gov/expapi/verbs/failed',
    launched: 'http://adlnet.gov/expapi/verbs/launched'
};

const OBJECT_IDS = {
    'Story Arc Builder MicroSim': SITE + '/sims/story-arc-builder',
    'Learning Analytics dashboard': SITE + '/analytics/dashboard',
    'Question 5': SITE + '/chapters/01-challenger-methodology-insights/quiz#q5',
    'Quiz Question 3': SITE + '/quiz#q3',
    'Chapter 1': SITE + '/chapters/01-challenger-methodology-insights',
    'Chapter 2': SITE + '/chapters/02-storytelling-fundamentals-psychology',
    'MicroSim': SITE + '/sims'
};

function statementJson(sel, it) {
    const actor = sel.actor === 'System'
        ? { objectType: 'Agent', name: 'System', account: { homePage: SITE, name: 'system' } }
        : { objectType: 'Agent', name: sel.actor, mbox: 'mailto:' + sel.actor.toLowerCase() + '@example.com' };
    const stmt = {
        actor: actor,
        verb: { id: VERB_IRIS[sel.verb], display: { 'en-US': sel.verb } },
        object: { objectType: 'Activity', id: OBJECT_IDS[sel.object], definition: { name: { 'en-US': sel.object } } }
    };
    if (it.result) stmt.result = it.result;
    return JSON.stringify(stmt, null, 1).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

const CONFIG = {
    title: 'xAPI Statement Builder',
    subtitle: 'Translate each learning event into an actor &ndash; verb &ndash; object statement.',
    height: 710,
    resultBeside: true,
    itemLabel: 'Scenario',
    fields: [
        { id: 'actor', label: 'Actor (who)' },
        { id: 'verb', label: 'Verb (did what)' },
        { id: 'object', label: 'Object (to what)' }
    ],
    optionInfo: {
        verb: {
            completed: 'means the learner finished the whole activity',
            viewed: 'means the person looked at something without finishing or answering it',
            answered: 'means the learner responded to a question (the result records right or wrong)',
            failed: 'means the learner did not pass a whole assessment, not a single question',
            launched: 'means the activity was opened or started'
        },
        actor: { System: 'is the platform itself; xAPI actors are the people who had the experience' }
    },
    items: [
        {
            short: 'Alex finishes a MicroSim',
            text: 'A student named Alex completed the Story Arc Builder MicroSim.',
            options: {
                actor: ['Alex', 'Instructor', 'System'],
                verb: ['completed', 'viewed', 'answered', 'failed'],
                object: ['Story Arc Builder MicroSim', 'Chapter 2', 'Quiz Question 3']
            },
            correct: { actor: 'Alex', verb: 'completed', object: 'Story Arc Builder MicroSim' },
            reason: '<em>Alex completed Story Arc Builder MicroSim</em> is a valid xAPI statement: the person who learned, what they did, and the specific activity.',
            why: 'Completion of an interactive activity, not just a test.'
        },
        {
            short: 'Sarah opens the dashboard',
            text: 'Instructor Sarah viewed the Learning Analytics dashboard.',
            options: {
                actor: ['Alex', 'Sarah', 'System'],
                verb: ['completed', 'viewed', 'answered', 'launched'],
                object: ['Learning Analytics dashboard', 'Chapter 1', 'MicroSim']
            },
            correct: { actor: 'Sarah', verb: 'viewed', object: 'Learning Analytics dashboard' },
            reason: '<em>Sarah viewed Learning Analytics dashboard</em> is valid. Instructors are actors too: xAPI captures any experience, not only student test scores.',
            why: 'Any person, any experience.'
        },
        {
            short: 'Jordan misses Question 5',
            text: 'Jordan answered Question 5 incorrectly on the Challenger Methodology quiz.',
            options: {
                actor: ['Alex', 'Jordan', 'System'],
                verb: ['completed', 'viewed', 'answered', 'failed'],
                object: ['Question 5', 'Chapter 1', 'MicroSim']
            },
            correct: { actor: 'Jordan', verb: 'answered', object: 'Question 5' },
            result: { success: false, response: 'B' },
            reason: '<em>Jordan answered Question 5</em> is valid, and the <code>result</code> block records that the answer was incorrect. "Failed" would describe the whole quiz, not one question.',
            why: 'Verb = answered; correctness goes in the result block.'
        }
    ],
    resultHtml: (it, sel) => `<div class="result"><strong>Your statement:</strong> ${sel.actor} &rarr; ${sel.verb} &rarr; ${sel.object}<pre class="code">${statementJson(sel, it)}</pre></div>`,
    summaryNote: 'every xAPI statement follows the same simple actor-verb-object structure, with an optional result block for scores and correctness. Because the pattern is so simple, it can capture any learning experience, from finishing a MicroSim to opening a dashboard.'
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
