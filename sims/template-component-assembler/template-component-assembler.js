// Template Component Assembler - pick and order modular story components
// CANVAS_HEIGHT: 760
// Learners pick one component from each library category (shown in scrambled
// order), arrange the picks into story order, and check the assembly for
// both structure and fit with the objective (a CFO, IT costs, cloud).

const APP_HEIGHT = 760;
const ORDER = ['Hook', 'Problem', 'Agitation', 'Solution', 'Social Proof', 'Call to Action'];
const DISPLAY = ['Social Proof', 'Hook', 'Call to Action', 'Problem', 'Solution', 'Agitation'];

const LIB = {
    'Hook': [
        { key: 'A', name: 'Financial pressure', text: 'Your IT budget grew 12% last year, and almost none of that increase bought anything new.', fit: true },
        { key: 'B', name: 'Competitive threat', text: 'Your two largest competitors launched new digital services this year.', fit: false, why: 'opens a competitive-strategy story, which is not what a cost-focused CFO is measured on' },
        { key: 'C', name: 'Innovation opportunity', text: 'AI is opening possibilities nobody had five years ago.', fit: false, why: 'opens an innovation story; it does not connect to IT cost' }
    ],
    'Problem': [
        { key: 'A', name: 'Legacy systems', text: 'Most of that spend goes to keeping aging on-premises servers and licenses alive.', fit: true },
        { key: 'B', name: 'Skill gap', text: 'Your team lacks the cloud skills to modernize on its own.', fit: false, why: 'is a real issue, but it is not the cost problem that cloud migration solves for a CFO' },
        { key: 'C', name: 'Security risk', text: 'Outdated systems leave you exposed to attacks.', fit: false, why: 'leads to a security story, not a cost story' }
    ],
    'Agitation': [
        { key: 'A', name: 'Budget waste', text: 'Every year you wait, about $1.2M goes to hardware refreshes and maintenance contracts that add no business value.', fit: true },
        { key: 'B', name: 'Slow time-to-market', text: 'New projects wait months for servers to be provisioned.', fit: false, why: 'agitates speed, which matters more to a CTO than to a CFO focused on cost' },
        { key: 'C', name: 'Compliance risk', text: 'Auditors are already flagging unsupported systems.', fit: false, why: 'agitates compliance rather than the cost of the status quo' }
    ],
    'Solution': [
        { key: 'A', name: 'Cloud migration', text: 'A phased cloud migration retires the legacy servers and turns fixed infrastructure costs into pay-as-you-go spend.', fit: true },
        { key: 'B', name: 'Training program', text: 'A cloud skills training program upskills your current team.', fit: false, why: 'does not reduce IT costs by itself; it is not the objective\'s solution' },
        { key: 'C', name: 'Security audit', text: 'A full security audit identifies every vulnerability.', fit: false, why: 'answers a security problem, not the cost objective' }
    ],
    'Social Proof': [
        { key: 'A', name: '$2M savings', text: 'A manufacturer of similar size saved $2M over three years after migrating.', fit: true },
        { key: 'B', name: '50% faster', text: 'Another client now deploys new applications 50% faster.', fit: false, why: 'proves speed, but the CFO needs proof of savings' },
        { key: 'C', name: 'Zero breaches', text: 'Our clients have had zero breaches since moving.', fit: false, why: 'proves security, which does not support a cost story' }
    ],
    'Call to Action': [
        { key: 'A', name: 'ROI analysis', text: 'Let\'s build a three-year ROI model with your actual infrastructure numbers.', fit: true },
        { key: 'B', name: 'Demo', text: 'Let me show you a demo of the platform.', fit: false, why: 'shows features; a CFO wants to see the financial case first' },
        { key: 'C', name: 'Proof of concept', text: 'Let\'s run a proof of concept on one workload.', fit: false, why: 'is a reasonable later step, but a CFO typically wants the ROI case before committing resources to a pilot' }
    ]
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    const pick = {};          // category -> component key
    let order = [];           // categories in learner's story order
    let attempts = 0;

    function render() {
        app.innerHTML = `
            <h2>Template Component Assembler</h2>
            <p class="subtitle">Pick one component from each category, then arrange your picks into a story.</p>
            <div class="context"><strong>Story objective:</strong> "Create a story for a CFO about reducing IT costs through cloud migration."</div>
            <div class="two-col">
                <div class="card">
                    <h3>Step 1: Component library</h3>
                    ${DISPLAY.map(cat => `
                        <div class="field" style="margin-bottom:6px;">
                            <label for="c-${cat}">${cat}</label>
                            <select id="c-${cat}" data-cat="${cat}"><option value="">-- choose --</option>${LIB[cat].map(c => `<option value="${c.key}" ${pick[cat] === c.key ? 'selected' : ''}>${cat} ${c.key}: ${c.name}</option>`).join('')}</select>
                        </div>`).join('')}
                </div>
                <div class="card">
                    <h3>Step 2: Arrange your story</h3>
                    <div id="order"></div>
                </div>
            </div>
            <div class="btn-row"><button id="check" disabled>Check Assembly</button></div>
            <div id="result"></div>
        `;
        app.querySelectorAll('select[data-cat]').forEach(s => s.addEventListener('change', () => {
            const cat = s.dataset.cat;
            if (s.value) { pick[cat] = s.value; if (!order.includes(cat)) order.push(cat); }
            else { delete pick[cat]; order = order.filter(c => c !== cat); }
            renderOrder();
        }));
        app.querySelector('#check').addEventListener('click', check);
        renderOrder();
    }

    function comp(cat) { return LIB[cat].find(c => c.key === pick[cat]); }

    function renderOrder() {
        const box = app.querySelector('#order');
        box.innerHTML = order.length ? order.map((cat, i) => `
            <div class="seq-item">
                <span class="seq-num">${i + 1}</span>
                <span class="seq-label"><strong>${cat}:</strong> ${comp(cat).name}</span>
                <button class="secondary small" data-up="${i}" ${i === 0 ? 'disabled' : ''} title="Move up">&uarr;</button>
                <button class="secondary small" data-down="${i}" ${i === order.length - 1 ? 'disabled' : ''} title="Move down">&darr;</button>
            </div>`).join('') : '<p style="margin:0;color:var(--muted);font-size:0.9em;">Your picks appear here in the order you choose them. Use the arrows to put them in story order.</p>';
        box.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => move(+b.dataset.up, -1)));
        box.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => move(+b.dataset.down, 1)));
        app.querySelector('#check').disabled = order.length !== ORDER.length;
    }

    function move(i, d) {
        [order[i], order[i + d]] = [order[i + d], order[i]];
        renderOrder();
    }

    function check() {
        attempts++;
        const orderOk = order.every((c, i) => c === ORDER[i]);
        const misfits = ORDER.filter(cat => !comp(cat).fit);
        const all = orderOk && misfits.length === 0;
        const res = app.querySelector('#result');
        let html = `<div class="feedback ${all ? 'ok' : 'bad'}">`;
        if (all) {
            html += `<strong>Coherent story${attempts === 1 ? ' on the first try' : ''}!</strong> Your story uses ${ORDER.map(c => `${c} ${pick[c]}`).join(', ')}. Every component serves the CFO cost objective, and they follow the story structure.`;
        } else {
            html += '<strong>Not yet.</strong><ul style="margin:4px 0;padding-left:20px;">';
            if (!orderOk) html += `<li><strong>Structure:</strong> your order is ${order.join(' &rarr; ')}. Stories flow ${ORDER.join(' &rarr; ')}: attention, then the pain, then the cost of the pain, then the relief, then proof, then the ask.</li>`;
            misfits.forEach(cat => { const c = comp(cat); html += `<li><strong>${cat} ${c.key} (${c.name})</strong> ${c.why}.</li>`; });
            html += '</ul><em>Fix the flagged items and check again.</em>';
        }
        html += '</div>';
        html += `<div class="card"><h3>Your assembled story</h3>${order.map(cat => {
            const c = comp(cat);
            return `<p style="margin:0 0 6px 0;line-height:1.5;"><span class="tag ${c.fit ? 'k-practice' : 'k-advanced'}" style="margin:0 6px 0 0;">${cat}</span>${c.text}</p>`;
        }).join('')}</div>`;
        html += '<div class="feedback warn"><strong>Remember:</strong> modular components save time, but they only work when they share one theme and follow the story structure. Assembly is a starting point: customize the assembled story for the specific CFO before you tell it.</div>';
        res.innerHTML = html;
        app.scrollTop = res.offsetTop - 8;
    }

    render();
});
