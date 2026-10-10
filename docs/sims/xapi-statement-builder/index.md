---
title: "xAPI Statement Builder"
description: "Learners turn three plain-English learning events into xAPI statements by choosing the actor, verb, and object, and see the JSON statement they built after each submission."
image: /sims/xapi-statement-builder/xapi-statement-builder.png
og:image: /sims/xapi-statement-builder/xapi-statement-builder.png
twitter:image: /sims/xapi-statement-builder/xapi-statement-builder.png
social:
   cards: false
status: built
---

# xAPI Statement Builder

<iframe src="main.html" height="712px" width="100%" scrolling="no"></iframe>

[Run the xAPI Statement Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The **Experience API (xAPI)** records learning as simple statements: *actor* &ndash; *verb* &ndash; *object*, such as "Alex completed the Story Arc Builder MicroSim." That simple structure can capture any experience, from finishing a simulation to an instructor opening a dashboard, not only test scores.

In this MicroSim you build three statements from dropdowns. After each submission you see the full JSON statement your choices produce, including verb IRIs and, for the quiz question, a `result` block recording that the answer was incorrect. The feedback targets the classic mistakes: using "failed" for one question, or making the system the actor.

**Learning objective (Apply, *construct*):** Construct valid xAPI statements by selecting actors, verbs, and objects for different learning scenarios.

## How to Use

1. Read the learning event.
2. Choose an **Actor**, **Verb**, and **Object** from the dropdowns.
3. Select **Submit**. The JSON statement your choices produce appears with feedback. You can resubmit; only the first try counts.
4. Select **Next Scenario**. After all three, the summary shows the correct statement pattern for each.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/xapi-statement-builder/main.html"
        height="712px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10 minutes

### Prerequisites
- xAPI section of Chapter 8

### Activities

1. **Building** (5 min): Build all three statements and read each JSON output.
2. **Comparison** (2 min): Submit scenario 3 with "failed," then with "answered." What changes in the JSON, and why is the second one better?
3. **Transfer** (3 min): Write an xAPI statement (actor, verb, object) for a sales rep telling a customer story in a discovery call.

### Common Misconceptions
- xAPI only tracks test scores.
- All xAPI statements are the same.
- xAPI requires complex setup.

### Assessment
- All three statements correct on the first try.
- Learner can explain where correctness is recorded in an xAPI statement.

## References

1. [Experience API - Wikipedia](https://en.wikipedia.org/wiki/Experience_API) - Overview of the xAPI specification and learning record stores.
2. [xAPI Specification - ADL (GitHub)](https://github.com/adlnet/xAPI-Spec) - The official statement format, verbs, and result block.
3. [Learning analytics - Wikipedia](https://en.wikipedia.org/wiki/Learning_analytics) - How recorded learning data is analyzed.
