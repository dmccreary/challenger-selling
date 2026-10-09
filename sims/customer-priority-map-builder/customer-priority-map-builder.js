// Customer Priority Map Builder
// CANVAS_HEIGHT: 850

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    
    // Stakeholder data
    const stakeholders = [
        {
            id: 'cfo',
            name: 'CFO',
            focus: 'Cost control, ROI, financial risk'
        },
        {
            id: 'cto',
            name: 'CTO',
            focus: 'Technical fit, security, innovation capability'
        },
        {
            id: 'coo',
            name: 'COO',
            focus: 'Operational efficiency, reliability, supply chain optimization'
        }
    ];

    // Priorities to rank
    const priorities = [
        'Reduce IT infrastructure costs',
        'Improve system reliability and uptime',
        'Enable faster product launches',
        'Strengthen cybersecurity',
        'Support innovation and R&D'
    ];

    // Correct rankings (1 = highest priority, 5 = lowest)
    const correctRankings = {
        cfo: [1, 2, 4, 3, 5],  // CFO: cost, reliability, security, launches, innovation
        cto: [5, 2, 4, 1, 3],  // CTO: security, reliability, innovation, launches, cost
        coo: [4, 1, 2, 3, 5]   // COO: reliability, launches, security, cost, innovation
    };

    let userRankings = {
        cfo: [null, null, null, null, null],
        cto: [null, null, null, null, null],
        coo: [null, null, null, null, null]
    };

    let currentStakeholderIndex = 0;

    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="text-align: center; color: #1976d2; margin-bottom: 10px;">Customer Priority Map Builder</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">You're selling data infrastructure to a manufacturing company. Rank priorities for each stakeholder (1 = highest, 5 = lowest).</p>
    `;
    container.appendChild(header);

    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    mainContainer.style.cssText = 'max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 12px;';
    container.appendChild(mainContainer);

    function renderStakeholder(index) {
        if (index >= stakeholders.length) {
            showCompletedMap();
            return;
        }

        const stakeholder = stakeholders[index];
        const currentRankings = userRankings[stakeholder.id];
        
        // Get unassigned priorities
        const usedPriorities = currentRankings.filter(p => p !== null);
        const availablePriorities = priorities.filter((_, i) => !usedPriorities.includes(i));

        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Stakeholder ${index + 1} of ${stakeholders.length}: ${stakeholder.name}</h3>
            <p style="color: #666; margin-bottom: 20px;"><strong>Focus:</strong> ${stakeholder.focus}</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #333;">Drag priorities to rank them:</h4>
                <div id="unassigned" style="min-height: 60px; padding: 15px; background: #e3f2fd; border-radius: 6px; margin-bottom: 20px; border: 2px dashed #1976d2;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 0.9em;">Unassigned priorities:</p>
                    <div id="unassigned-items" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
                </div>
                
                <div id="ranking-slots" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
            
            <button id="submit-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Submit Rankings</button>
            
            <div id="feedback" style="margin-top: 15px; padding: 10px; border-radius: 8px; display: none;"></div>
            
            <button id="next-btn" style="display: none; width: 100%; margin-top: 15px; padding: 12px; background: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Next Stakeholder</button>
        `;

        // Render unassigned items
        const unassignedContainer = document.getElementById('unassigned-items');
        availablePriorities.forEach((priorityIndex, i) => {
            const item = createPriorityItem(priorityIndex, priorityIndex, false);
            unassignedContainer.appendChild(item);
        });

        // Render ranking slots
        const slotsContainer = document.getElementById('ranking-slots');
        for (let rank = 1; rank <= 5; rank++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.rank = rank;
            slot.style.cssText = `
                padding: 12px;
                background: #f5f5f5;
                border: 2px dashed #ccc;
                border-radius: 6px;
                min-height: 50px;
                display: flex;
                align-items: center;
            `;
            slot.innerHTML = `<span style="color: #666; margin-right: 10px; font-weight: bold;">Rank ${rank}:</span>`;
            
            const currentPriority = currentRankings[rank - 1];
            if (currentPriority !== null) {
                const item = createPriorityItem(currentPriority, currentPriority, true);
                slot.appendChild(item);
            }
            
            slotsContainer.appendChild(slot);
        }

        // Setup drag and drop
        setupDragAndDrop();

        document.getElementById('submit-btn').addEventListener('click', () => {
            // Validate all rankings assigned
            if (currentRankings.includes(null)) {
                const feedback = document.getElementById('feedback');
                feedback.style.display = 'block';
                feedback.style.background = '#fff3cd';
                feedback.textContent = 'Please assign all priorities before submitting.';
                return;
            }

            const feedback = document.getElementById('feedback');
            feedback.style.display = 'block';
            
            // Check correctness
            const correct = correctRankings[stakeholder.id];
            const allCorrect = currentRankings.every((val, i) => val === correct[i]);
            
            if (allCorrect) {
                feedback.style.background = '#c8e6c9';
                feedback.textContent = 'Excellent! Your priority ranking matches the stakeholder\'s focus.';
            } else {
                feedback.style.background = '#ffcdd2';
                feedback.textContent = 'Not quite. Here\'s a hint: Consider what this stakeholder focuses on most and assign the highest priority accordingly.';
            }

            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'block';
            
            document.getElementById('next-btn').addEventListener('click', () => {
                currentStakeholderIndex++;
                renderStakeholder(currentStakeholderIndex);
            });
        });
    }

    function createPriorityItem(priorityIndex, actualIndex, isRanked) {
        const item = document.createElement('div');
        item.draggable = true;
        item.dataset.priorityIndex = priorityIndex;
        item.textContent = priorities[priorityIndex];
        item.style.cssText = `
            padding: 8px 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 4px;
            cursor: grab;
            font-size: 0.9em;
            user-select: none;
        `;
        
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', priorityIndex);
            e.dataTransfer.setData('source', isRanked ? 'slot' : 'unassigned');
            item.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
        });
        
        return item;
    }

    function setupDragAndDrop() {
        const unassigned = document.getElementById('unassigned');
        const slots = document.querySelectorAll('.slot');
        
        // Allow dropping on unassigned area
        unassigned.addEventListener('dragover', (e) => {
            e.preventDefault();
            unassigned.style.background = '#bbdefb';
        });
        
        unassigned.addEventListener('dragleave', () => {
            unassigned.style.background = '#e3f2fd';
        });
        
        unassigned.addEventListener('drop', (e) => {
            e.preventDefault();
            unassigned.style.background = '#e3f2fd';
            const priorityIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const source = e.dataTransfer.getData('source');
            
            if (source === 'slot') {
                // Remove from slot
                const currentStakeholder = stakeholders[currentStakeholderIndex];
                const rankIndex = userRankings[currentStakeholder.id].indexOf(priorityIndex);
                userRankings[currentStakeholder.id][rankIndex] = null;
                renderStakeholder(currentStakeholderIndex);
            }
        });
        
        // Allow dropping on slots
        slots.forEach((slot, slotIndex) => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.style.background = '#e8f5e9';
            });
            
            slot.addEventListener('dragleave', () => {
                slot.style.background = '#f5f5f5';
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.style.background = '#f5f5f5';
                const priorityIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const source = e.dataTransfer.getData('source');
                const rank = parseInt(slot.dataset.rank);
                
                const currentStakeholder = stakeholders[currentStakeholderIndex];
                
                // Check if slot already has an item
                if (userRankings[currentStakeholder.id][rank - 1] !== null) {
                    // Swap items
                    const existingPriority = userRankings[currentStakeholder.id][rank - 1];
                    if (source === 'unassigned') {
                        // Move existing to unassigned
                        userRankings[currentStakeholder.id][rank - 1] = priorityIndex;
                    } else {
                        // Swap
                        const sourceRank = userRankings[currentStakeholder.id].indexOf(priorityIndex);
                        userRankings[currentStakeholder.id][sourceRank] = existingPriority;
                        userRankings[currentStakeholder.id][rank - 1] = priorityIndex;
                    }
                } else {
                    userRankings[currentStakeholder.id][rank - 1] = priorityIndex;
                }
                
                renderStakeholder(currentStakeholderIndex);
            });
        });
    }

    function showCompletedMap() {
        mainContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Customer Priority Map Complete!</h3>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #333;">Your Completed Priority Map</h4>
                ${stakeholders.map(s => `
                    <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
                        <h5 style="margin: 0 0 10px 0; color: #1976d2;">${s.name} - Focus: ${s.focus}</h5>
                        <ol style="margin: 0; padding-left: 20px; color: #666;">
                            ${userRankings[s.id].map(idx => `<li>${priorities[idx]}</li>`).join('')}
                        </ol>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #333;">Insight Alignment Analysis</h4>
                <p style="color: #666; line-height: 1.6; margin-bottom: 10px;"><strong>Your teaching insight:</strong> "Brittle data infrastructure blocks innovation."</p>
                <p style="color: #666; line-height: 1.6; margin-bottom: 10px;"><strong>Alignment:</strong></p>
                <ul style="color: #666; line-height: 1.6; padding-left: 20px; margin-bottom: 10px;">
                    <li><strong>CTO:</strong> Aligns well - speaks to innovation capability and technical fit</li>
                    <li><strong>COO:</strong> Partially aligns - relates to faster product launches but may create tension with reliability focus</li>
                    <li><strong>CFO:</strong> Creates tension - may initially see innovation as cost rather than investment</li>
                </ul>
                <p style="color: #666; line-height: 1.6;"><strong>Tailored Messaging:</strong></p>
                <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
                    <li><strong>To CFO:</strong> Frame innovation as competitive advantage that drives revenue, not just cost</li>
                    <li><strong>To CTO:</strong> Emphasize how modern infrastructure reduces technical debt and enables new capabilities</li>
                    <li><strong>To COO:</strong> Show how reliability improves while also enabling faster launches</li>
                </ul>
            </div>
            
            <button id="retry-btn" style="width: 100%; padding: 12px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em;">Try Again</button>
        `;
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            currentStakeholderIndex = 0;
            userRankings = {
                cfo: [null, null, null, null, null],
                cto: [null, null, null, null, null],
                coo: [null, null, null, null, null]
            };
            renderStakeholder(0);
        });
    }

    // Start with first stakeholder
    renderStakeholder(0);
});
