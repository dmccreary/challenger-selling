// Channel Story Adapter - adapt one customer story for four channels
// CANVAS_HEIGHT: 670
// Learners pick a length, format, and focus for each channel and see a
// description of the adapted story they designed.

const BASE_STORY = 'A manufacturing company reduced downtime by 60% using predictive maintenance, saving $2M annually.';

const FOCUS_TEXT = {
    'Brief summary': 'states the result and the $2M savings in a few lines and links to the full case study',
    'Full detail': 'walks through the before, the turning point, and the after, with the 60% downtime drop as the climax',
    'Hook only': 'leads with one striking number ("60% less downtime") to make the reader want more'
};

const CONFIG = {
    title: 'Channel Story Adapter',
    subtitle: 'Adapt the same story for each channel by choosing length, format, and focus.',
    height: 670,
    itemLabel: 'Channel',
    contextHtml: `<div class="context"><strong>Base story:</strong> "${BASE_STORY}"</div>`,
    fields: [
        { id: 'length', label: 'Length', options: ['100-200 words', '300-500 words', '500-1000 words'] },
        { id: 'format', label: 'Format' },
        { id: 'focus', label: 'Focus', options: Object.keys(FOCUS_TEXT) }
    ],
    optionInfo: {
        length: {
            '100-200 words': 'suits channels where readers skim, such as email and social',
            '300-500 words': 'suits channels where you hold attention for a few minutes, such as a presentation or short video',
            '500-1000 words': 'suits long-form channels such as a written case study, and is too long for these four'
        },
        format: {
            'Text with bullets': 'suits skimmable written channels such as email',
            'Visual-rich': 'suits channels where the image carries the message, such as slides and social posts',
            'Hybrid': 'splits the difference and rarely fits any one channel best',
            'Script only': 'leaves out the visuals that make video work',
            'Visual with narration': 'pairs a voiceover with footage or charts, which is what video does best',
            'Short punchy': 'works for a caption but drops the visual that stops the scroll'
        },
        focus: {
            'Brief summary': 'fits busy readers who want the result first',
            'Full detail': 'fits a captive audience that will follow the whole story arc',
            'Hook only': 'fits fast-scrolling feeds where the job is to earn a click'
        }
    },
    items: [
        {
            heading: 'Email', short: 'Email',
            text: 'You are sending this story in a follow-up email to a VP of Operations you met last week.',
            options: { format: ['Text with bullets', 'Visual-rich', 'Hybrid'] },
            correct: { length: '100-200 words', format: 'Text with bullets', focus: 'Brief summary' },
            reason: 'For email, <strong>100-200 words</strong> of <strong>text with bullets</strong> as a <strong>brief summary</strong> is appropriate because busy readers skim on a phone; give them the result and a link.',
            why: 'Skimmable, result first.'
        },
        {
            heading: 'Presentation', short: 'Presentation',
            text: 'You are telling this story during a 30-minute discovery presentation to the operations leadership team.',
            options: { format: ['Text with bullets', 'Visual-rich', 'Hybrid'] },
            correct: { length: '300-500 words', format: 'Visual-rich', focus: 'Full detail' },
            reason: 'For a presentation, <strong>300-500 words</strong> spoken over <strong>visual-rich</strong> slides with <strong>full detail</strong> is appropriate because the audience is captive and the downtime chart can carry the emotional turn.',
            why: 'Captive audience, visuals carry the arc.'
        },
        {
            heading: 'Video', short: 'Video',
            text: 'Marketing is producing a 2-3 minute customer-story video for the website.',
            options: { format: ['Script only', 'Visual with narration', 'Hybrid'] },
            correct: { length: '300-500 words', format: 'Visual with narration', focus: 'Full detail' },
            reason: 'For video, about <strong>300-500 words</strong> of narration (roughly 2-3 minutes) as <strong>visual with narration</strong> and <strong>full detail</strong> is appropriate because video can show the plant floor while the voiceover tells the full story.',
            why: '2-3 minutes of narration over footage.'
        },
        {
            heading: 'Social Media', short: 'Social Media',
            text: 'You are posting this story on LinkedIn to reach operations leaders you have not met.',
            options: { format: ['Text with bullets', 'Visual-rich', 'Short punchy'] },
            correct: { length: '100-200 words', format: 'Visual-rich', focus: 'Hook only' },
            reason: 'For social media, <strong>100-200 words</strong>, <strong>visual-rich</strong>, <strong>hook only</strong> is appropriate because the image must stop the scroll and the post\'s job is to earn a click, not tell everything.',
            why: 'Stop the scroll, earn the click.'
        }
    ],
    resultHtml: (it, sel) => `<div class="result"><strong>Your ${it.short} version:</strong> about ${sel.length}, ${sel.format.toLowerCase()}, that ${FOCUS_TEXT[sel.focus]}.</div>`,
    summaryNote: 'each channel has different constraints. Shorter is not always better, and visuals are essential in some channels. Adapt length, format, and focus to fit the medium while preserving the core message.'
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
