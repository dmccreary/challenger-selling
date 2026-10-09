---
title: Dialogue Flow Designer
description: Learners order six dialogue stages for a CFO sales-practice agent, choose transition conditions including a strong/weak coaching branch, and see a live flowchart of their design.
image: /sims/dialogue-flow-designer/dialogue-flow-designer.png
og:image: /sims/dialogue-flow-designer/dialogue-flow-designer.png
twitter:image: /sims/dialogue-flow-designer/dialogue-flow-designer.png
social:
   cards: false
status: built
---

# Dialogue Flow Designer

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Dialogue Flow Designer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A sales practice agent is a dialogue system: it moves the conversation through stages and decides when to move on. A well-designed flow establishes the persona, presents a challenge, delivers the insight, raises an objection, and then **evaluates** how the salesperson handled it. That evaluation is where the flow should branch. A strong response proceeds to closing; a weak one goes to a coaching loop and the objection is raised again.

In this MicroSim you design that flow for an agent that plays a CFO. You reorder six stages and choose a transition condition between each pair: proceed automatically, wait for the salesperson's reply, or branch on response quality. The flowchart on the right redraws as you work, showing coaching loops as orange dashed arrows. When you submit, stages are colored green or red, and the feedback flags linear flows, a missing evaluation branch, or branches in places where nothing is evaluated.

**Learning objective (Apply, *design*):** Design a dialogue flow for a sales conversation agent by arranging conversation stages and defining transitions.

## How to Use

1. Read the scenario.
2. Reorder the stages by dragging them or with the arrow buttons.
3. Use the dropdown between each pair of stages to set the transition condition.
4. Watch the **Flow diagram** update. A branch adds a Coaching node that loops back to the previous stage.
5. Select **Submit Flow Design** for feedback. Stages turn green or red in the diagram. Refine and resubmit, or select **Reset** to start over.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/dialogue-flow-designer/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
15 minutes

### Prerequisites
- Dialogue Systems and Conversation Flow sections of Chapter 5

### Activities

1. **Design** (6 min): Build a flow and submit it. Refine until the transitions are rated logical.
2. **Analysis** (4 min): Why does the coaching loop return to Objection raising rather than to the Introduction?
3. **Extension** (5 min): Sketch how the flow would change for a CTO persona that raises a technical-risk objection instead of a price objection.

### Common Misconceptions
- Dialogue flow can be linear.
- All conversations follow the same pattern.
- Transitions don't matter.

### Assessment
- All six stages in a logical order.
- Exactly one strong/weak branch, placed after Response evaluation.
- Learner can explain where the conversation must wait for the salesperson.

## References

1. [Dialogue system - Wikipedia](https://en.wikipedia.org/wiki/Dialogue_system) - Architecture of conversational agents.
2. [Finite-state machine - Wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine) - The state-and-transition model behind dialogue flows.
3. [Role-playing - Wikipedia](https://en.wikipedia.org/wiki/Role-playing) - Role-play as a training technique.
