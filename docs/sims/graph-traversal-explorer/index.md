---
title: Graph Traversal Explorer
description: Learners pick a start node and a traversal pattern (neighbors, within two hops, or shortest path), predict the result, then reveal it, with each hop compared to a relational JOIN.
image: /sims/graph-traversal-explorer/graph-traversal-explorer.png
og:image: /sims/graph-traversal-explorer/graph-traversal-explorer.png
twitter:image: /sims/graph-traversal-explorer/graph-traversal-explorer.png
social:
   cards: false
status: built
---

# Graph Traversal Explorer

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Graph Traversal Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **graph traversal** answers a question by walking along edges from a starting node. Different traversal patterns answer different questions from the same start: *who is directly connected?* (neighbors), *who is two steps away?* (neighbors of neighbors), and *what is the fastest route to a specific node?* (shortest path).

In this MicroSim you choose a starting node in a six-node graph, choose a pattern, and **predict** the result before revealing it, either by clicking the nodes you expect or by guessing the hop count. The reveal highlights 1-hop and 2-hop nodes in different colors, draws the shortest path in orange, lists any equally short alternative paths, and notes how many JOINs a relational database would need for the same question. After you try all three patterns, a summary appears.

**Learning objective (Apply, *perform*):** Perform graph traversals by selecting starting nodes and traversal patterns to find connected nodes.

## How to Use

1. Click a node in the graph to choose the starting point (it turns gold).
2. Choose a **Traversal Pattern**. For *Shortest path to...*, also choose a target node.
3. Select **Predict**. Click the nodes you expect the traversal to find, or choose a hop count for a shortest path.
4. Select **Reveal** to see the result, the hop count, and whether your prediction matched.
5. Select **Try Another** and repeat with other start nodes and patterns. Try all three patterns to unlock the summary.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/graph-traversal-explorer/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10 minutes

### Prerequisites
- Graph Traversal section of Chapter 6

### Activities

1. **Prediction** (5 min): From node A, predict and reveal all three patterns (shortest path to E). Note which predictions you missed.
2. **Comparison** (2 min): Start at F and run the 2-hop traversal. Why does it find fewer nodes than starting at B?
3. **Discussion** (3 min): A buyer asks "who in my network already uses this product?" Which pattern answers that, and how many JOINs would a relational query need?

### Common Misconceptions
- All traversals are the same.
- Traversal performance doesn't depend on graph size.
- Traversal is the same as JOIN.

### Assessment
- Correct predictions for all three patterns from at least one start node.
- Learner can explain why A-B-D-E and A-C-D-E are both valid shortest paths.

## References

1. [Graph traversal - Wikipedia](https://en.wikipedia.org/wiki/Graph_traversal) - Systematic ways to visit the nodes of a graph.
2. [Breadth-first search - Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search) - The algorithm this MicroSim uses to find hops and shortest paths.
3. [Join (SQL) - Wikipedia](https://en.wikipedia.org/wiki/Join_(SQL)) - How relational databases combine tables, for comparison with traversals.
