// Story Innovation Explorer - redesign a standard story on four dimensions
// CANVAS_HEIGHT: 760
// Learners pick a structure, angle, format, and type of example. Any
// differentiated choice is accepted (this is a Create-level task); standard
// choices are flagged. Their choices are assembled into a story concept.

const DIMS = {
    structure: {
        standard: 'Standard linear',
        text: {
            'Standard linear': 'Open with the company\'s situation, then walk through the solution and the 20% result in order.',
            'Reverse chronological': 'Open with the 20% savings already banked, then rewind to show how they got there.',
            'In medias res': 'Open in the middle of the action: the CFO staring at a budget overrun three weeks before the board meeting.',
            'Circular': 'Open and close in the same budget meeting, one year apart, so the change is unmistakable.'
        },
        info: {
            'Standard linear': 'is the default structure buyers have heard a hundred times',
            'Reverse chronological': 'leads with the payoff, then builds curiosity about how it happened',
            'In medias res': 'drops the listener into the tension immediately, which is the strongest attention grabber',
            'Circular': 'makes the transformation vivid by returning to the starting scene'
        }
    },
    angle: {
        standard: 'Vendor-centric',
        text: {
            'Vendor-centric': 'Tell it from our point of view: what our product did.',
            'Customer-centric': 'Tell it through the customer\'s eyes: what their team lived through.',
            'Competitor-centric': 'Frame it against the alternative the customer almost chose instead.',
            'Market-centric': 'Frame it as an industry-wide shift: why cost structures across the sector are breaking and who is adapting first.'
        },
        info: {
            'Vendor-centric': 'puts your product at the center, which is what buyers tune out',
            'Customer-centric': 'makes the customer the hero, which is better practice than vendor-centric',
            'Competitor-centric': 'differentiates sharply but risks sounding negative',
            'Market-centric': 'turns one result into a Challenger-style insight about the whole industry'
        }
    },
    format: {
        standard: 'Presentation',
        text: {
            'Presentation': 'Deliver it as slides in the meeting.',
            'Video': 'Deliver it as a two-minute customer video.',
            'Interactive': 'Deliver it as a choose-your-path walkthrough where the buyer picks which decision to explore first.',
            'Story-in-a-story': 'Nest the customer\'s story inside a story about your own team making a similar mistake.'
        },
        info: {
            'Presentation': 'is the format every competitor uses',
            'Video': 'adds the customer\'s own voice, more memorable than slides',
            'Interactive': 'makes the buyer an active participant, so they remember the story as their own discovery',
            'Story-in-a-story': 'adds depth and vulnerability, but takes more time to tell'
        }
    },
    example: {
        standard: 'Success story',
        text: {
            'Success story': 'Use a straightforward success story.',
            'Failure lesson': 'Use a company that tried to cut costs the old way and failed, as a cautionary tale.',
            'Counterintuitive result': 'Use the counterintuitive result: the customer everyone expected to fail, because they spent more up front, ended up saving the most.',
            'Unexpected hero': 'Make the hero someone unexpected: the procurement analyst who spotted the waste.'
        },
        info: {
            'Success story': 'is expected, so it rarely surprises anyone',
            'Failure lesson': 'creates urgency by showing the cost of the wrong approach',
            'Counterintuitive result': 'breaks the buyer\'s mental model, which is exactly what makes a story memorable',
            'Unexpected hero': 'makes the story human and surprising'
        }
    }
};
const TITLES = { structure: '1. Structure: how will the story unfold?', angle: '2. Angle: whose perspective?', format: '3. Format: how will it be delivered?', example: '4. Example: what kind of case?' };

const CONFIG = {
    title: 'Story Innovation Explorer',
    subtitle: 'Reinvent a standard story by choosing an unconventional option on each dimension.',
    height: 760,
    grid: true,
    scoreNoun: 'dimensions',
    submitLabel: 'Build My Story Concept',
    contextHtml: '<div class="context"><strong>Standard story:</strong> "A company reduced costs by 20% using our solution. You can too."</div>',
    sections: Object.keys(DIMS).map(k => ({
        id: k, title: TITLES[k], type: 'buttons', options: Object.keys(DIMS[k].text),
        grade: v => v !== DIMS[k].standard, info: DIMS[k].info, showInfo: true,
        okLabel: 'Differentiated.', badLabel: 'Standard approach.',
        explain: k === 'structure' ? 'Structure controls attention in the first ten seconds.' : k === 'angle' ? 'The angle decides whether the story is about you or about something bigger than you.' : k === 'format' ? 'The format decides whether the buyer watches or participates.' : 'The example decides whether the story confirms or challenges what the buyer already believes.'
    })),
    resultHtml: (sel, ok) => {
        const fresh = Object.keys(DIMS).filter(k => ok[k]);
        return `<div class="card"><h3>Your story concept</h3>
            <ol style="margin:0;padding-left:20px;line-height:1.5;">${Object.keys(DIMS).map(k => `<li>${DIMS[k].text[sel[k]]}</li>`).join('')}</ol>
            <p style="margin:8px 0 0 0;">Your innovative approach uses ${fresh.length ? fresh.map(k => `<strong>${sel[k].toLowerCase()}</strong>`).join(', ') : 'no unconventional elements'}.
            ${fresh.length === 4 ? 'It differs from the standard story on every dimension. Now test it: is it more memorable, or just different? Innovation must still serve the insight.' : 'The dimensions still marked "standard" are where a competitor\'s story will sound exactly like yours.'}</p></div>`;
    },
    summaryNote: 'innovation is strategic differentiation, not random change. Standard approaches are not wrong, and consistency still matters; innovate where it makes the story more memorable, then measure whether it actually is.'
};

// ---------------------------------------------------------------------------
// Design-and-review engine: every decision is visible at once. The learner
// completes all sections, selects Submit, and gets per-section feedback plus
// a generated result (diagram, assembled story, or analysis). Learners can
// change any answer and resubmit; the first-attempt score is kept.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const sel = {};
    const notes = {};
    let firstScore = null;

    function inputHtml(s) {
        if (s.type === 'select') {
            return `<select data-s="${s.id}"><option value="">-- choose --</option>${s.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select>`;
        }
        if (s.type === 'checks') {
            return `<div class="checklist">${s.options.map(o => `<label><input type="checkbox" data-s="${s.id}" value="${esc(o)}"> <span>${esc(o)}</span></label>`).join('')}</div>`;
        }
        return `<div class="choice-row" data-s="${s.id}">${s.options.map(o => `<button type="button" class="choice" data-value="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
    }

    function render() {
        app.innerHTML = `
            <h2>${C.title}</h2>
            <p class="subtitle">${C.subtitle}</p>
            ${C.contextHtml || ''}
            <div class="${C.grid ? 'q-grid' : ''}">
            ${C.sections.map(s => `
                <div class="card" data-card="${s.id}">
                    <h3>${s.title}</h3>
                    ${s.prompt ? `<p style="margin:0 0 6px 0;font-size:0.92em;">${s.prompt}</p>` : ''}
                    ${inputHtml(s)}
                    ${s.text ? `<textarea data-note="${s.id}" rows="2" style="margin-top:6px;" placeholder="${esc(s.text)}"></textarea>` : ''}
                    <div class="s-fb"></div>
                </div>`).join('')}
            </div>
            <div class="btn-row"><button id="submit" disabled>${C.submitLabel || 'Submit'}</button></div>
            <div id="result"></div>
        `;
        const submit = app.querySelector('#submit');
        const update = () => {
            submit.disabled = !C.sections.every(s =>
                (s.type === 'checks' ? (sel[s.id] || []).length > 0 : sel[s.id]) && (!s.text || (notes[s.id] || '').length >= 3));
        };
        app.querySelectorAll('select[data-s]').forEach(x => x.addEventListener('change', () => { sel[x.dataset.s] = x.value; update(); }));
        app.querySelectorAll('input[type=checkbox][data-s]').forEach(x => x.addEventListener('change', () => {
            sel[x.dataset.s] = [...app.querySelectorAll(`input[data-s="${x.dataset.s}"]:checked`)].map(c => c.value);
            update();
        }));
        app.querySelectorAll('.choice-row[data-s]').forEach(row => row.querySelectorAll('button.choice').forEach(b => b.addEventListener('click', () => {
            row.querySelectorAll('button.choice').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            sel[row.dataset.s] = b.dataset.value;
            update();
        })));
        app.querySelectorAll('textarea[data-note]').forEach(t => t.addEventListener('input', () => { notes[t.dataset.note] = t.value.trim(); update(); }));
        submit.addEventListener('click', evaluate);
    }

    function grade(s) {
        const v = sel[s.id];
        if (s.grade) return s.grade(v);
        if (s.type === 'checks') {
            const want = [...s.correct].sort().join('|');
            return [...v].sort().join('|') === want;
        }
        return v === s.correct;
    }

    function wrongDetail(s) {
        const v = sel[s.id];
        const info = o => (s.info && s.info[o]) ? ` (${s.info[o]})` : '';
        if (s.type === 'checks') {
            const missing = s.correct.filter(o => !v.includes(o));
            const extra = v.filter(o => !s.correct.includes(o));
            return (missing.length ? `Missing: ${missing.map(o => `<strong>${esc(o)}</strong>${info(o)}`).join('; ')}. ` : '') +
                (extra.length ? `Remove: ${extra.map(o => `<strong>${esc(o)}</strong>${info(o)}`).join('; ')}. ` : '');
        }
        if (s.correct === undefined) return `You chose <strong>${esc(v)}</strong>${info(v)}. `;
        return `You chose <strong>${esc(v)}</strong>${info(v)}. The better choice is <strong>${esc(s.correct)}</strong>. `;
    }

    function evaluate() {
        const ok = {};
        C.sections.forEach(s => {
            ok[s.id] = grade(s);
            const card = app.querySelector(`[data-card="${s.id}"]`);
            card.querySelector('.s-fb').innerHTML = `<div class="feedback ${ok[s.id] ? 'ok' : 'bad'}" style="margin:8px 0 0 0;">` +
                (ok[s.id] ? `<strong>${s.okLabel || 'Good choice.'}</strong> ${s.showInfo && s.info && s.info[sel[s.id]] ? 'You chose <strong>' + esc(sel[s.id]) + '</strong>: ' + s.info[sel[s.id]] + '. ' : ''}` : `<strong>${s.badLabel || 'Not quite.'}</strong> ${wrongDetail(s)}`) +
                `${s.explain || ''}</div>`;
        });
        const score = C.sections.filter(s => ok[s.id]).length;
        const n = C.sections.length;
        if (firstScore === null) firstScore = score;
        const res = app.querySelector('#result');
        res.innerHTML = `
            <div class="feedback ${score === n ? 'ok' : 'warn'}">
                <strong>${score} of ${n}</strong> ${C.scoreNoun || 'decisions'} match the recommended approach
                (first attempt: ${firstScore} of ${n}).${score < n ? ' Adjust the flagged sections and submit again.' : ''}
            </div>
            ${C.resultHtml ? C.resultHtml(sel, ok, notes) : ''}
            <div class="feedback warn"><strong>Remember:</strong> ${C.summaryNote}</div>`;
        app.scrollTop = res.offsetTop - 8;
    }

    render();
});
