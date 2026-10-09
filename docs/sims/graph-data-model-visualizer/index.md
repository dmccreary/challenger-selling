---
title: Graph Data Model Visualizer
description: Learners click each node and edge in a small Customer-Order-Product graph to reveal its type and properties, then answer five identification questions about the graph data model.
image: /sims/graph-data-model-visualizer/graph-data-model-visualizer.png
og:image: /sims/graph-data-model-visualizer/graph-data-model-visualizer.png
twitter:image: /sims/graph-data-model-visualizer/graph-data-model-visualizer.png
social:
   cards: false
status: built
---

# Graph Data Model Visualizer

<iframe src="main.html" height="722px" width="100%" scrolling="no"></iframe>

[Run the Graph Data Model Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A graph database stores two kinds of things: **nodes**, which are entities such as a customer or a product, and **edges**, which are the named relationships between them. Both can carry **properties**: key-value pairs such as `name: "Acme Corp"` on a node or `value: "$5,000"` on an edge.

This MicroSim shows a three-node business graph: a Customer *placed* an Order, and the Order *contains* a Product. Click every element to reveal whether it is a node or an edge and what it stores. Once all five are explored, five questions check that you can tell nodes from edges, read a node's properties, interpret an edge's direction, and recognize that edges carry properties too (something a relational table can only do with an extra join table).

**Learning objective (Understand, *explain*):** Explain the graph data model by identifying nodes, edges, and properties in a visual graph representation.

## How to Use

1. Click each of the three nodes and the two edges (the labeled arrows) in the graph.
2. Read the panel under the graph: it names the element type and lists its properties.
3. When all five elements are explored, answer the five questions that appear.
4. Select **Check Answers**. Adjust any wrong answers and check again; a summary table lists every element.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/challenger-selling/sims/graph-data-model-visualizer/main.html"
        height="722px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience
Sales professionals, account executives, sales engineers and business development managers.

### Duration
10 minutes

### Prerequisites
- Graph Data Model and Nodes and Edges sections of Chapter 6

### Activities

1. **Exploration** (3 min): Click all five elements and say out loud whether each is an entity or a relationship.
2. **Identification** (4 min): Answer the five questions and record your score.
3. **Transfer** (3 min): Sketch one of your own accounts as a graph: the company, two stakeholders, and your product. Name each edge and give it one property.

### Common Misconceptions
- Nodes and edges are the same.
- Properties are optional.
- Graph models are the same as relational models.

### Assessment
- All five identification questions correct.
- Learner can explain why `value: "$5,000"` belongs on the *placed* edge rather than on either node.

## References

1. [Graph database - Wikipedia](https://en.wikipedia.org/wiki/Graph_database) - Overview of graph databases and the property graph model.
2. [Graph theory - Wikipedia](https://en.wikipedia.org/wiki/Graph_theory) - The mathematics of vertices (nodes) and edges.
3. [Relational model - Wikipedia](https://en.wikipedia.org/wiki/Relational_model) - The table-based model that graph databases are usually compared against.
