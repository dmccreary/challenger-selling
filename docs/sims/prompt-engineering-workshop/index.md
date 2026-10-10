---
title: "Prompt Engineering Workshop"
description: "Learners select, order and refine prompt elements to build an AI prompt that generates a sales story for a manufacturing CTO, with feedback on completeness, focus and structure."
image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
og:image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
twitter:image: /sims/prompt-engineering-workshop/prompt-engineering-workshop.png
social:
   cards: false
status: built
---

# Prompt Engineering Workshop

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Prompt Engineering Workshop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A large language model writes the story you *ask* for, so the structure of the prompt shapes the structure of the output. An effective story prompt moves from **context** (who the audience is and what industry they work in) to the **Challenger insight**, then the **story structure**, then the **tone**, and finally **specific requirements** such as metrics or length.

In this MicroSim you build a prompt for a sales story aimed at a manufacturing CTO. You pick elements from a list, arrange them, and can add your own text. The assembled prompt updates as you work. Two of the elements are traps: they add context, but irrelevant context dilutes the model's focus. When you submit, you get feedback on missing elements, distracting elements, and ordering. Category tags then appear so you can refine and resubmit; iteration is part of the skill.

**Learning objective (Apply, *construct*):** Construct effective AI prompts for story generation by selecting and arranging prompt elements in the correct structure.

## How to Use

1. Read the scenario.
2. Check the prompt elements you want to include. They appear in the **Arrange your prompt** list.
3. Reorder elements by dragging them or with the arrow buttons. Remove one with **&times;**.
4. Optionally type custom text and select **Add**.
5. With at least four elements selected, select **Submit Prompt**. Read the feedback, refine, and resubmit.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/prompt-engineering-workshop/main.html"
        height="642px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10-15 minutes

### Prerequisites
- Prompt Engineering section of Chapter 5

### Activities

1. **Construction** (5 min): Build and submit a first prompt. Note what the feedback flagged.
2. **Iteration** (4 min): Refine until the prompt is rated effective. How many iterations did it take?
3. **Transfer** (5 min): Paste your final prompt into an AI assistant and compare the story to the six components from Chapter 4.

### Common Misconceptions
- More context is always better.
- Any prompt structure works.
- One iteration is sufficient.

### Assessment
- Final prompt includes persona, industry, insight, structure, tone and at least one specific requirement, with no distractors.
- Elements ordered from context through requirements.

## References

1. [Prompt engineering - Wikipedia](https://en.wikipedia.org/wiki/Prompt_engineering) - Overview of prompt design techniques.
2. [Large language model - Wikipedia](https://en.wikipedia.org/wiki/Large_language_model) - How LLMs generate text from prompts.
3. [Technical debt - Wikipedia](https://en.wikipedia.org/wiki/Technical_debt) - Background for the CTO-focused requirement.
