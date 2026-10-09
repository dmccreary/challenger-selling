// Training Program Designer - build an 8-week storytelling training program
// CANVAS_HEIGHT: 760
// Learners select 4-6 training components, arrange them in sequence, choose a
// practice format for each hands-on component, then see the resulting weekly
// schedule with feedback on balance, progression, and practice mix.

const APP_HEIGHT = 760;

const COMPONENTS = [
    { id: 'fund', label: 'Storytelling fundamentals workshop', kind: 'theory', weight: 1 },
    { id: 'insight', label: 'Challenger insight development session', kind: 'theory', weight: 1 },
    { id: 'role', label: 'Role-playing practice', kind: 'practice', weight: 2 },
    { id: 'peer', label: 'Peer story sharing', kind: 'practice', weight: 2 },
    { id: 'coach', label: 'Story delivery coaching', kind: 'feedback', weight: 2 },
    { id: 'adv', label: 'Advanced techniques workshop', kind: 'advanced', weight: 1 }
];
const RANK = { theory: 0, practice: 1, feedback: 2, advanced: 3 };
const PRACTICE_TYPES = ['Individual practice', 'Small group', 'Team-wide', 'Cross-team', 'Expert feedback'];
const INDIVIDUAL = ['Individual practice', 'Expert feedback'];
const WEEKS = 8;

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let sequence = [];           // ordered component ids
    const practiceType = {};     // id -> practice format
    const byId = id => COMPONENTS.find(c => c.id === id);
    const tag = k => `<span class="tag k-${k}">${k}</span>`;

    function renderDesigner() {
        app.innerHTML = `
            <h2>Training Program Designer</h2>
            <p class="subtitle">Design a program, sequence it, and choose how reps will practice.</p>
            <div class="context"><strong>Training objective:</strong> "Bring a sales team from novice to intermediate storytelling proficiency in 8 weeks."</div>
            <div class="two-col">
                <div class="card checklist">
                    <h3>Step 1: Select 4&ndash;6 components</h3>
                    ${COMPONENTS.map(c => `<label><input type="checkbox" value="${c.id}" ${sequence.includes(c.id) ? 'checked' : ''}> <span>${c.label} ${tag(c.kind)}</span></label>`).join('')}
                    <div id="count" style="font-size:0.85em;color:var(--muted);margin-top:4px;"></div>
                </div>
                <div class="card">
                    <h3>Steps 2&ndash;3: Sequence and practice format</h3>
                    <div id="seq"></div>
                </div>
            </div>
            <div class="btn-row"><button id="submit" disabled>Build Schedule</button></div>
            <div id="feedback"></div>
        `;
        app.querySelectorAll('.checklist input').forEach(b => b.addEventListener('change', () => {
            if (b.checked) sequence.push(b.value);
            else sequence = sequence.filter(id => id !== b.value);
            renderSeq();
        }));
        app.querySelector('#submit').addEventListener('click', evaluate);
        renderSeq();
    }

    function renderSeq() {
        const box = app.querySelector('#seq');
        box.innerHTML = sequence.length ? sequence.map((id, i) => {
            const c = byId(id);
            const needsType = c.kind === 'practice' || c.kind === 'feedback';
            return `<div class="seq-item">
                <span class="seq-num">${i + 1}</span>
                <span class="seq-label">${c.label} ${tag(c.kind)}</span>
                ${needsType ? `<select data-id="${id}"><option value="">format...</option>${PRACTICE_TYPES.map(p => `<option ${practiceType[id] === p ? 'selected' : ''}>${p}</option>`).join('')}</select>` : ''}
                <button class="secondary small" data-up="${i}" ${i === 0 ? 'disabled' : ''} title="Move up">&uarr;</button>
                <button class="secondary small" data-down="${i}" ${i === sequence.length - 1 ? 'disabled' : ''} title="Move down">&darr;</button>
            </div>`;
        }).join('') : '<p style="color:var(--muted);font-size:0.9em;margin:0;">Selected components appear here. Use the arrows to reorder them, and choose a practice format for each hands-on component.</p>';
        box.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => swap(+b.dataset.up, -1)));
        box.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => swap(+b.dataset.down, 1)));
        box.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { practiceType[s.dataset.id] = s.value; updateSubmit(); }));
        updateSubmit();
    }

    function swap(i, d) {
        [sequence[i], sequence[i + d]] = [sequence[i + d], sequence[i]];
        renderSeq();
    }

    function hands(seq) { return seq.filter(id => ['practice', 'feedback'].includes(byId(id).kind)); }

    function updateSubmit() {
        const n = sequence.length;
        app.querySelector('#count').innerHTML = `Selected: ${n}${n > 6 ? '' : n < 4 && n > 0 ? ' (choose at least 4)' : ''}`;
        app.querySelector('#submit').disabled = !(n >= 4 && n <= 6 && hands(sequence).every(id => practiceType[id]));
    }

    function evaluate() {
        const kinds = sequence.map(id => byId(id).kind);
        const problems = [];
        if (!kinds.includes('theory')) problems.push('There is no theory component. Reps need the fundamentals before they can practice them.');
        if (!kinds.includes('practice')) problems.push('There is no practice component. Theory alone does not build storytelling skill; reps must tell stories out loud.');
        const outOfOrder = [];
        for (let i = 1; i < sequence.length; i++) {
            if (RANK[kinds[i]] < RANK[kinds[i - 1]]) outOfOrder.push(`"${byId(sequence[i]).label}" (${kinds[i]}) comes after "${byId(sequence[i - 1]).label}" (${kinds[i - 1]})`);
        }
        if (outOfOrder.length) problems.push('The sequence is not progressive (theory &rarr; practice &rarr; feedback &rarr; advanced): ' + outOfOrder.join('; ') + '.');
        const types = hands(sequence).map(id => practiceType[id]);
        const hasInd = types.some(t => INDIVIDUAL.includes(t));
        const hasGroup = types.some(t => !INDIVIDUAL.includes(t));
        if (!(hasInd && hasGroup)) problems.push(`Practice formats are all ${hasInd ? 'individual' : 'group'}. Mix individual practice (or expert feedback) with group practice so reps get both personal reps and peer learning.`);
        const tips = [];
        if (!kinds.includes('feedback')) tips.push('Consider adding <strong>Story delivery coaching</strong>: practice without feedback tends to repeat the same mistakes.');
        if (sequence.includes('coach') && practiceType.coach !== 'Expert feedback') tips.push('Coaching works best as <strong>Expert feedback</strong>.');
        if (kinds.includes('advanced') && sequence.length < 5) tips.push('Jumping to advanced techniques with few practice sessions may be too fast for novices.');

        const fb = app.querySelector('#feedback');
        if (problems.length) {
            fb.innerHTML = `<div class="feedback bad"><strong>Not a valid program yet.</strong><ul style="margin:4px 0;padding-left:20px;">${problems.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
            app.scrollTop = app.scrollHeight;
            return;
        }
        renderSchedule(tips);
    }

    function allocateWeeks() {
        // largest-remainder allocation of 8 weeks by component weight, minimum 1 week each
        const total = sequence.reduce((s, id) => s + byId(id).weight, 0);
        const raw = sequence.map(id => byId(id).weight * WEEKS / total);
        const weeks = raw.map(r => Math.max(1, Math.floor(r)));
        let left = WEEKS - weeks.reduce((a, b) => a + b, 0);
        const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
        for (let k = 0; left > 0; k = (k + 1) % order.length, left--) weeks[order[k][1]]++;
        while (weeks.reduce((a, b) => a + b, 0) > WEEKS) {
            const i = weeks.indexOf(Math.max(...weeks));
            weeks[i]--;
        }
        return weeks;
    }

    function renderSchedule(tips) {
        const weeks = allocateWeeks();
        let w = 1;
        const rows = sequence.map((id, i) => {
            const c = byId(id);
            const range = weeks[i] === 1 ? `Week ${w}` : `Weeks ${w}&ndash;${w + weeks[i] - 1}`;
            w += weeks[i];
            return `<tr><td>${range}</td><td>${c.label} ${tag(c.kind)}</td><td>${practiceType[id] || '&mdash;'}</td></tr>`;
        }).join('');
        app.innerHTML = `
            <h2>Training Program Designer: Schedule</h2>
            <p class="subtitle">Objective: novice &rarr; intermediate storytelling proficiency in 8 weeks</p>
            <div class="feedback ok">
                <strong>Valid program.</strong> Your training program includes ${sequence.length} components in a progressive sequence
                (${sequence.map(id => byId(id).kind).filter((k, i, a) => a.indexOf(k) === i).join(' &rarr; ')}).
                Practice activities: ${hands(sequence).map(id => `${byId(id).label.toLowerCase()} (${practiceType[id].toLowerCase()})`).join('; ')}.
                ${tips.length ? '<br><em>Tips:</em> ' + tips.join(' ') : ''}
            </div>
            <table class="summary">
                <tr><th>When</th><th>Component</th><th>Practice format</th></tr>
                ${rows}
                <tr><td>Week 9 onward</td><td>Monthly story clinic <span class="tag k-feedback">ongoing</span></td><td>Small group + expert feedback</td></tr>
            </table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> training is not a one-time event. Theory opens the program, practice builds the skill, feedback refines it, and advanced work comes last. The ongoing clinic keeps stories fresh after week 8.</div>
            <div class="btn-row"><button id="edit">Edit Program</button><button id="restart" class="secondary">Start Over</button></div>
        `;
        app.querySelector('#edit').addEventListener('click', renderDesigner);
        app.querySelector('#restart').addEventListener('click', () => {
            sequence = [];
            Object.keys(practiceType).forEach(k => delete practiceType[k]);
            renderDesigner();
        });
    }

    renderDesigner();
});
