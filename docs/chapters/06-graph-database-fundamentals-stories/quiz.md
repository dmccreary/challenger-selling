# Quiz: Graph Database Fundamentals & Sales Stories

Test your understanding of graph data models, query languages, use cases, and sales stories for graph databases with these 10 review questions.

---

#### 1. In a graph data model, data is represented as which two fundamental elements?

<div class="upper-alpha" markdown>
1. Tables and rows
2. Nodes and edges
3. JSON documents and collections
4. Keys and values
</div>

??? question "Show Answer"
    The correct answer is **A**. Graph databases represent entities as nodes and relationships as edges. Relational databases use tables and rows, document databases use JSON documents, and key-value stores use keys and values, but none of these match the graph data model.

    **Concept Tested:** Graph Data Model


---

#### 2. In a graph database, edges represent:

<div class="upper-alpha" markdown>
1. Entities or objects in the domain
2. Relationships or connections between entities
3. Key-value properties attached to nodes
4. Database schemas and constraints
</div>

??? question "Show Answer"
    The correct answer is **A**. Edges represent relationships or connections between nodes, such as "purchased," "works for," or "depends on." Nodes represent entities, properties store additional details, and schemas define structure rather than connections.

    **Concept Tested:** Nodes and Edges


---

#### 3. Why do graph databases typically outperform relational databases for multi-hop relationship queries?

<div class="upper-alpha" markdown>
1. They use more expensive hardware by default
2. They store fewer total records
3. They store relationships directly and avoid expensive JOIN operations
4. They limit queries to a single hop
</div>

??? question "Show Answer"
    The correct answer is **C**. Graph databases store relationships as first-class entities, so traversals follow edges directly. Relational databases must reconstruct relationships through JOIN operations across tables, which becomes costly as the number of hops increases.

    **Concept Tested:** Graph Traversal


---

#### 4. A bank wants to identify suspicious transaction patterns among accounts that appear to be coordinating. Which graph database use case is most relevant?

<div class="upper-alpha" markdown>
1. Social Network Analysis
2. Fraud Detection
3. Recommendation Engines
4. Knowledge Graphs
</div>

??? question "Show Answer"
    The correct answer is **B**. Fraud Detection uses graph traversal to find suspicious connection patterns such as shared devices, circular transactions, or coordinated account behavior. Social network analysis maps influence, recommendation engines suggest products, and knowledge graphs organize structured information.

    **Concept Tested:** Fraud Detection


---

#### 5. An e-commerce site wants to recommend products based on what similar customers purchased and viewed. Which use case applies?

<div class="upper-alpha" markdown>
1. Social Network Analysis
2. Fraud Detection
3. Recommendation Engines
4. Knowledge Graphs
</div>

??? question "Show Answer"
    The correct answer is **C**. Recommendation Engines analyze relationship patterns—customers who bought similar products or products frequently purchased together—to generate suggestions. The other use cases address different business problems.

    **Concept Tested:** Recommendation Engines


---

#### 6. A pharmaceutical company wants to connect drugs, diseases, genes, and clinical trials for research queries. Which use case is most appropriate?

<div class="upper-alpha" markdown>
1. Social Network Analysis
2. Fraud Detection
3. Recommendation Engines
4. Knowledge Graphs
</div>

??? question "Show Answer"
    The correct answer is **D**. Knowledge Graphs connect concepts, facts, and entities to enable semantic search and reasoning across complex domains. The scenario describes organizing structured scientific knowledge, not social influence, fraud, or product recommendations.

    **Concept Tested:** Knowledge Graphs


---

#### 7. What makes a property graph particularly valuable for dynamic business environments?

<div class="upper-alpha" markdown>
1. Its flexible schema and rich representation of entities and relationships
2. Its rigid predefined structure
3. Its requirement to separate data from relationships
4. Its limitation to small datasets
</div>

??? question "Show Answer"
    The correct answer is **A**. Property graphs allow both nodes and edges to carry properties and evolve without rigid schema constraints, making them adaptable as business requirements change. Rigid structure, separation of data, and small-scale limitations would reduce their value.

    **Concept Tested:** Property Graph


---

#### 8. A prospect's social network features require friend-of-friend queries that slow down as the user base grows. Which type of graph database sales story is most relevant?

<div class="upper-alpha" markdown>
1. Relational vs Graph Databases story
2. Data Relationship story
3. Performance Comparison story
4. Scalability story
</div>

??? question "Show Answer"
    The correct answer is **D**. The concern is performance degradation at scale, so a Scalability story showing how graph databases maintain query performance as nodes and edges grow is most appropriate. A performance comparison might help, but it does not directly address scaling concerns over time.

    **Concept Tested:** Scalability Stories


---

#### 9. Cypher is a declarative graph query language. Gremlin, by contrast, is best described as:

<div class="upper-alpha" markdown>
1. Another declarative language with SQL-like syntax
2. An imperative, functional traversal language
3. A visual query builder with no text syntax
4. A deprecated predecessor to Cypher
</div>

??? question "Show Answer"
    The correct answer is **B**. Gremlin uses an imperative, functional style where the query specifies each traversal step explicitly, providing fine-grained control. Cypher is declarative and describes the pattern to match, while the other options misrepresent Gremlin's nature.

    **Concept Tested:** Gremlin Query Language


---

#### 10. A company cannot identify early signals of customer churn because the relevant relationships are hidden across many transaction tables. What Challenger insight should you teach?

<div class="upper-alpha" markdown>
1. Replace the database hardware with a faster server
2. Model customer relationships and transactions as a graph and run traversal queries
3. Hire more analysts to manually review every transaction
4. Reduce the amount of customer data being collected
</div>

??? question "Show Answer"
    The correct answer is **B**. The core insight is that churn precursors are relationship patterns in the data. Modeling these as a graph makes the patterns visible and queryable through traversal. Faster hardware or more analysts treat symptoms; reducing data removes the signals entirely.

    **Concept Tested:** Data Relationship Stories


---
