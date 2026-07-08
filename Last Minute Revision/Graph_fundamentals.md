# 🏗️ GRAPH FOUNDATIONS — OA & Coding Round Ready

> **Dinesh — your complete graph reference for OAs and on-campus coding rounds.**
> Your `dsa_algorithms_reference.md` has the raw code skeletons. This file goes deeper:
> *how to RECOGNIZE which graph technique a problem needs*, realistic graph structures
> you'll see in OAs, the traps and edge cases, and recently-asked problems with full solutions.

---

# TABLE OF CONTENTS

| # | Pattern | Key Signal in Problem Statement |
|---|---------|-------------------------------|
| 1 | BFS — single & multi-source | "shortest path unweighted", "minimum steps", "nearest distance" |
| 2 | 0-1 BFS (deque trick) | "two costs: 0 and 1 (or 0 and k)" |
| 3 | Grid-as-Graph | "matrix/grid", "move 4/8 directions", "island" |
| 4 | Dijkstra + state augmentation | "shortest with constraints", "at most k stops", "fuel limit" |
| 5 | Topological Sort + DP on DAG | "prerequisites", "longest path in DAG", "course schedule" |
| 6 | DSU (Union-Find) | "connected components", "group queries", "redundant edges" |
| 7 | Cycle Detection | "detect cycle", "valid tree", "circular dependency" |
| 8 | Bipartite Check | "two-color", "odd cycle", "divide into two groups" |
| 9 | MST (Kruskal / Prim) | "minimum cost to connect all", "min spanning" |
| 10 | SCC / Bridges / AP (advanced) | "strongly connected", "critical connection", "single point of failure" |

---
---

# PATTERN 1 — BFS (Single-source & Multi-source)

## The Mental Model
BFS explores **level by level**. Think of it as dropping a stone into water — the ripple expands
outward uniformly. **Every node at distance d is processed before any node at distance d+1.**

This is why BFS = **shortest path in unweighted graphs.** Not "a shortest path algorithm" — THE
shortest path algorithm for unweighted edges. Dijkstra is overkill when all edges cost 1.

## Single-source BFS — you know this. But know WHEN:
```
Signal words: "minimum steps", "shortest path", "fewest moves", "nearest X"
Condition: ALL edges have EQUAL weight (usually 1)
```

## Multi-source BFS — the OA favorite

### Core Idea
Instead of starting BFS from ONE node, start from **ALL source nodes simultaneously**.
Push ALL sources into the queue at distance 0 before the BFS loop begins.
The BFS then expands from all sources in parallel — each cell gets the distance to its
**nearest** source.

### When to Use
```
"Distance of each cell to nearest X" (where X has multiple instances)
"Rotting Oranges" — fire/rot/infection spreading from multiple sources
"Walls and Gates" — nearest gate for each room
Any problem where multiple things expand/spread simultaneously
```

### Why it works
Imagine 3 fires at positions A, B, C. Instead of running 3 separate BFS and taking the minimum,
push A, B, C all at distance 0. The BFS naturally gives each cell the distance to the NEAREST fire
because BFS is level-by-level — the first time a cell is reached IS the shortest distance.

### Realistic Structure
```
Grid:
. . . . F          F = fire source
. # # . .          # = wall
. . . . .          . = empty
F . . # .
. . . . .

Multi-source BFS from both F cells:
0 1 2 1 0          ← distances from nearest F
1 # # 1 1
2 3 2 2 2
0 1 2 # 3
1 2 3 4 4
```

### Code Template
```cpp
// Multi-source BFS — distance from nearest source
vector<vector<int>> multiBFS(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> dist(R, vector<int>(C, -1));
    queue<pair<int,int>> q;

    // Step 1: push ALL sources
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (grid[i][j] == 'F') { dist[i][j] = 0; q.push({i, j}); }

    // Step 2: standard BFS from all sources simultaneously
    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x+dx[d], ny = y+dy[d];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C
                && dist[nx][ny] == -1 && grid[nx][ny] != '#') {
                dist[nx][ny] = dist[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    return dist;
}
```

### OA Problem — "Rotting Oranges" (LeetCode 994, asked by Google/Amazon)

**Problem:** Grid has 0=empty, 1=fresh orange, 2=rotten orange. Every minute, rotten oranges rot
all 4-adjacent fresh oranges. Return min minutes until no fresh orange remains, or -1 if impossible.

**Solution:** Multi-source BFS from all initial rotten oranges. Answer = max distance in the BFS
result. If any fresh orange is unreachable → -1.

```cpp
int orangesRotting(vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size(), fresh = 0;
    queue<pair<int,int>> q;
    vector<vector<int>> dist(R, vector<int>(C, -1));

    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (grid[i][j] == 2) { dist[i][j] = 0; q.push({i, j}); }
            if (grid[i][j] == 1) fresh++;
        }

    if (fresh == 0) return 0;

    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    int ans = 0;
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x+dx[d], ny = y+dy[d];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C
                && dist[nx][ny] == -1 && grid[nx][ny] == 1) {
                dist[nx][ny] = dist[x][y] + 1;
                ans = max(ans, dist[nx][ny]);
                fresh--;
                q.push({nx, ny});
            }
        }
    }
    return fresh == 0 ? ans : -1;
}
```
**Complexity:** O(R*C) time and space.

---

# PATTERN 2 — 0-1 BFS (Deque BFS)

## Core Idea
When edge weights are **only 0 or 1** (or 0 and some constant), you don't need Dijkstra's
O((V+E)logV) priority queue. Use a **deque** instead:
- Weight-0 edge → push to **front** (it's like staying at the same distance level)
- Weight-1 edge → push to **back** (it's the next level)

This gives **O(V+E)** — same as BFS, but handles two weights.

### When to Use
```
"Grid where some moves cost 0 (e.g., same-color) and others cost 1 (e.g., different-color)"
"Minimum cost, edges are either free or cost 1"
"Minimum obstacles to remove" (wall=1, empty=0)
```

### Code Template
```cpp
vector<int> bfs01(int src, vector<vector<pair<int,int>>>& adj, int n) {
    vector<int> dist(n, INT_MAX);
    deque<int> dq;
    dist[src] = 0; dq.push_back(src);
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto [w, v] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);  // 0-cost → front
                else        dq.push_back(v);   // 1-cost → back
            }
        }
    }
    return dist;
}
```

### OA Problem — "Minimum Obstacle Removals" (LeetCode 2290, Google OA 2024)

**Problem:** Grid of 0s (empty) and 1s (obstacle). Move 4-directionally. Find min obstacles to
remove to reach bottom-right from top-left.

**Solution:** 0-1 BFS. Moving to empty cell = cost 0, moving to obstacle = cost 1 (remove it).

```cpp
int minimumObstacles(vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> dist(R, vector<int>(C, INT_MAX));
    deque<pair<int,int>> dq;
    dist[0][0] = 0; dq.push_back({0, 0});

    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    while (!dq.empty()) {
        auto [x, y] = dq.front(); dq.pop_front();
        for (int d = 0; d < 4; d++) {
            int nx = x+dx[d], ny = y+dy[d];
            if (nx < 0 || nx >= R || ny < 0 || ny >= C) continue;
            int newDist = dist[x][y] + grid[nx][ny];
            if (newDist < dist[nx][ny]) {
                dist[nx][ny] = newDist;
                if (grid[nx][ny] == 0) dq.push_front({nx, ny});
                else                   dq.push_back({nx, ny});
            }
        }
    }
    return dist[R-1][C-1];
}
```
**Complexity:** O(R*C) — much faster than Dijkstra here.

### How to DECIDE: BFS vs 0-1 BFS vs Dijkstra
```
All edges weight 1?       → plain BFS         O(V+E)
Edges weight 0 or 1?      → 0-1 BFS (deque)   O(V+E)
Arbitrary non-negative?   → Dijkstra           O((V+E) log V)
Negative edges?           → Bellman-Ford        O(V*E)
All-pairs needed?         → Floyd-Warshall      O(V³)
```
**Burn this table into memory. This is the #1 OA triage for graph shortest-path problems.**

---

# PATTERN 3 — Grid-as-Graph (the OA bread and butter)

## Mental Model
Every grid problem IS a graph problem. Each cell = node. Adjacent cells = edges.
But you never *build* an adjacency list — you compute neighbors on the fly with `dx[], dy[]`.

### The Standard Grid Setup (copy-paste this into every grid problem)
```cpp
int R = grid.size(), C = grid[0].size();
int dx[] = {0, 0, 1, -1};           // 4-directional
int dy[] = {1, -1, 0, 0};
// For 8-directional, add: {1,1}, {1,-1}, {-1,1}, {-1,-1}

// Bounds check
auto valid = [&](int x, int y) {
    return x >= 0 && x < R && y >= 0 && y < C;
};
```

### The 3 Grid Problem Families

**Family A — "Count/Find connected regions" (Islands)**
- Tool: DFS or BFS flood-fill from each unvisited cell
- Mark visited to avoid re-counting
- Classic: Number of Islands (LC 200), Max Area of Island (LC 695)

**Family B — "Shortest path in grid"**
- All moves cost 1? → BFS
- Moves have varying cost? → Dijkstra or 0-1 BFS
- Classic: Shortest Path in Binary Matrix (LC 1091)

**Family C — "Spread/expand from sources"**
- Multi-source BFS (Pattern 1)
- Classic: Rotting Oranges (LC 994), Walls and Gates (LC 286)

### OA Problem — "Number of Islands" (LC 200, asked everywhere)

```cpp
int numIslands(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size(), count = 0;
    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

    function<void(int,int)> dfs = [&](int x, int y) {
        if (x < 0 || x >= R || y < 0 || y >= C || grid[x][y] != '1') return;
        grid[x][y] = '0';  // mark visited by modifying grid
        for (int d = 0; d < 4; d++) dfs(x+dx[d], y+dy[d]);
    };

    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (grid[i][j] == '1') { count++; dfs(i, j); }
    return count;
}
```

---

# PATTERN 4 — Dijkstra with Augmented State

## Core Idea
Standard Dijkstra state = `(distance, node)`. But many OA problems add a **constraint** —
"at most k stops", "with fuel", "can break k walls". The trick: **expand the state.**

State becomes: `(distance, node, extra_dimension)`
The graph now has `V * states_of_extra_dim` nodes.

### When to Use
```
"Shortest path with at most K stops/edges"     → state = (node, stopsUsed)
"Shortest path, can remove at most K obstacles" → state = (node, wallsBroken)
"Shortest path with fuel that refills at cities" → state = (node, fuelLeft)
Any "shortest path BUT with a resource/constraint"
```

### OA Problem — "Shortest Path with Obstacle Elimination" (LC 1293, Google-style)

**Problem:** Grid of 0s and 1s. You can eliminate at most `k` obstacles. Find shortest path from
top-left to bottom-right.

**This is the EXACT same mechanic as your Q1 (Firebreak Evacuation) K-charges.**

```cpp
int shortestPath(vector<vector<int>>& grid, int k) {
    int R = grid.size(), C = grid[0].size();
    // State: (steps, row, col, obstacles_eliminated)
    // dist[r][c][e] = min steps to reach (r,c) having eliminated e obstacles
    vector<vector<vector<int>>> dist(R, vector<vector<int>>(C, vector<int>(k+1, INT_MAX)));
    // BFS works here because all edges cost 1
    queue<tuple<int,int,int>> q;
    dist[0][0][0] = 0;
    q.push({0, 0, 0});

    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    while (!q.empty()) {
        auto [x, y, e] = q.front(); q.pop();
        int d = dist[x][y][e];

        if (x == R-1 && y == C-1) return d;  // BFS → first reach = shortest

        for (int dir = 0; dir < 4; dir++) {
            int nx = x+dx[dir], ny = y+dy[dir];
            if (nx < 0 || nx >= R || ny < 0 || ny >= C) continue;

            int ne = e + grid[nx][ny];  // if obstacle, costs one elimination
            if (ne <= k && dist[nx][ny][ne] == INT_MAX) {
                dist[nx][ny][ne] = d + 1;
                q.push({nx, ny, ne});
            }
        }
    }
    return -1;
}
```
**Key insight:** because all moves cost 1 step, we use **BFS** (not Dijkstra!) on the augmented
state `(row, col, eliminationsUsed)`. State space = R * C * (k+1).

**If moves had varying costs** (like your Q1 with `w`-cost brush), you'd use **Dijkstra** on the
same augmented state with a priority queue.

### OA Problem — "Cheapest Flights Within K Stops" (LC 787, frequently asked)

**Problem:** `n` cities, weighted flights. Find cheapest price from `src` to `dst` with at most
`k` stops.

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    // Bellman-Ford is cleaner here: relax all edges k+1 times
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        vector<int> temp(dist);  // copy! (prevents using newly relaxed values)
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INT_MAX && dist[u] + w < temp[v])
                temp[v] = dist[u] + w;
        }
        dist = temp;
    }
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}
```
**Why Bellman-Ford here?** Because "at most k stops" = "at most k+1 edges". Bellman-Ford's
i-th iteration gives shortest paths using at most i edges. Run k+1 iterations = done.
**Trap:** must copy `dist` before each iteration (use previous round only), otherwise you
"leak" paths with more edges.

---

# PATTERN 5 — Topological Sort + DP on DAG

## Core Idea
A DAG (Directed Acyclic Graph) has a topological order: every node comes after its dependencies.
Once you have the topo order, you can run DP **in that order** — because by the time you process
a node, ALL its predecessors are already computed.

**This is the single most powerful graph-DP combo for OAs.**

### When to Use
```
"Course schedule" / "can all courses be completed?" → topo sort, check for cycles
"Longest path in a DAG" → topo sort + DP
"Number of paths from A to B in DAG" → topo sort + counting DP
"Order of tasks with dependencies" → topo sort
```

### Key Properties
```
- Topo sort only exists for DAGs (no cycles).
- Kahn's (BFS-based) is preferred in OAs — it's iterative and detects cycles.
- If Kahn's output has < n nodes → CYCLE EXISTS → return -1 / false / impossible.
```

### OA Problem — "Course Schedule II" (LC 210, asked by Google/Microsoft)

**Problem:** n courses, prerequisites list. Return a valid order to take all courses, or [] if
impossible (cycle exists).

```cpp
vector<int> findOrder(int n, vector<vector<int>>& prereqs) {
    vector<vector<int>> adj(n);
    vector<int> inDeg(n, 0);
    for (auto& p : prereqs) {
        adj[p[1]].push_back(p[0]);  // p[1] → p[0] (must take p[1] before p[0])
        inDeg[p[0]]++;
    }

    queue<int> q;
    for (int i = 0; i < n; i++) if (inDeg[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--inDeg[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>{};  // cycle check
}
```

### DP on DAG — "Longest Path in DAG"
After topo sort, compute: `dist[v] = max(dist[u] + weight(u,v))` for all predecessors u of v.
Process nodes in topo order → all predecessors are done.
```cpp
// After getting topo order:
vector<int> dist(n, 0);
for (int u : topoOrder)
    for (auto [w, v] : adj[u])
        dist[v] = max(dist[v], dist[u] + w);
// dist[target] = longest path from any source to target
```

---

# PATTERN 6 — DSU (Union-Find) — The Connectivity Swiss Knife

## Mental Model
DSU answers ONE question ultra-fast: **"Are X and Y in the same connected component?"**
It does this in nearly O(1) per query. It can also count components, detect cycles, and build MST.

### When DSU beats BFS/DFS
```
- ONLINE queries ("add edge, then ask if connected") → DSU
- Graph given as EDGE LIST (not adjacency list) → DSU is natural
- Need to MERGE components → DSU
- BFS/DFS can do the same for STATIC graphs, but DSU handles dynamic edge additions
```

### The Two Optimizations — ALWAYS use both
1. **Path Compression:** `find(x)` flattens the tree so every node points directly to root.
   → Next `find` is O(1).
2. **Union by Rank:** Attach shorter tree under taller tree.
   → Tree stays flat → `find` stays fast.

With both: amortized **O(alpha(N))** per operation. alpha(N) ≤ 4 for any practical N.
**NEVER write DSU without both optimizations in an OA.**

### OA Problem — "Redundant Connection" (LC 684, Microsoft OA)

**Problem:** Tree with n nodes has one extra edge (making exactly one cycle). Return the edge
that, if removed, makes it a tree again. If multiple answers, return the last one in input.

**Key insight:** Process edges one by one. The FIRST edge that connects two already-connected
nodes creates the cycle — that's the redundant edge.

```cpp
vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    DSU dsu(n + 1);  // 1-indexed
    for (auto& e : edges)
        if (!dsu.unite(e[0], e[1]))
            return e;  // already connected → this edge creates cycle
    return {};
}
```

### OA Problem — "Number of Connected Components" (LC 323)
```cpp
int countComponents(int n, vector<vector<int>>& edges) {
    DSU dsu(n);
    int components = n;
    for (auto& e : edges)
        if (dsu.unite(e[0], e[1])) components--;
    return components;
}
```

---

# PATTERN 7 — Cycle Detection

## The Key Distinction: Directed vs Undirected

### Undirected Graph — Cycle Detection
**Method 1: DSU** — Process edges. If `find(u) == find(v)` before uniting → cycle. (See Pattern 6)
**Method 2: DFS** — A back edge to a visited node (that isn't the parent) = cycle.
```cpp
bool hasCycleUndirected(int u, int parent, vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) {
            if (hasCycleUndirected(v, u, adj, vis)) return true;
        } else if (v != parent) return true;  // visited and not parent = back edge = cycle
    }
    return false;
}
```

### Directed Graph — Cycle Detection
**Method 1: Kahn's topo sort** — If output size < n → cycle exists. (Simplest for OAs.)
**Method 2: DFS with 3 colors** — Track `state[u]`: 0=unvisited, 1=in-stack, 2=done.
If you visit a node with state=1 (still being processed) → cycle.
```cpp
bool hasCycleDirected(int u, vector<vector<int>>& adj, vector<int>& state) {
    state[u] = 1;  // in-stack (being processed)
    for (int v : adj[u]) {
        if (state[v] == 1) return true;                        // back edge → cycle!
        if (state[v] == 0 && hasCycleDirected(v, adj, state)) return true;
    }
    state[u] = 2;  // fully processed
    return false;
}
```

### The Trap in OAs
**"Is this a valid tree?"** = undirected graph with n nodes that has exactly n-1 edges AND
is connected AND has no cycle. Check all three (or just: n-1 edges + connected via BFS/DSU).

---

# PATTERN 8 — Bipartite Check (2-Coloring)

## Core Idea
A graph is **bipartite** if you can color all nodes with 2 colors such that no two adjacent
nodes share a color. Equivalent to: **no odd-length cycle exists.**

### When to Use
```
"Can we divide into two groups with no conflicts?"
"Is the graph 2-colorable?"
"Assign teams such that no two friends are on the same team"
```

### Algorithm: BFS/DFS coloring
Assign color 0 to start node. For each neighbor: if uncolored, assign opposite color. If already
colored with SAME color as current node → NOT bipartite.

```cpp
bool isBipartite(vector<vector<int>>& adj, int n) {
    vector<int> color(n, -1);
    for (int i = 0; i < n; i++) {
        if (color[i] != -1) continue;
        queue<int> q;
        color[i] = 0; q.push(i);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;  // same color → not bipartite
            }
        }
    }
    return true;
}
```

### OA Problem — "Is Graph Bipartite?" (LC 785)
Directly apply the above. Watch for **disconnected components** — must check ALL nodes, not just
start from node 0.

---

# PATTERN 9 — MST (Minimum Spanning Tree)

## Which One to Use?

| | Kruskal's | Prim's |
|--|-----------|--------|
| **Approach** | Sort edges, greedily add cheapest non-cycle edge | Greedily extend from a node via cheapest edge |
| **Data structure** | DSU | Min-heap (priority queue) |
| **Better when** | **Sparse graph** (E ~ V), edge list input | **Dense graph** (E ~ V²), adjacency list input |
| **OA frequency** | More common (simpler to code) | Less common |

### The MST Properties to Know for OAs
1. MST has exactly **V-1** edges (for V connected nodes).
2. If you add any non-MST edge, it creates exactly one cycle. The heaviest edge in that cycle
   is ≥ the added edge (otherwise MST could be improved — contradiction).
3. **"Min cost to connect all nodes"** = MST. Always.
4. **Kruskal's = sort + DSU** — 5 lines of code. Preferred in OAs.

### OA Problem — "Min Cost to Connect All Points" (LC 1584, Microsoft)

**Problem:** n points on 2D plane. Cost to connect (i,j) = |xi-xj| + |yi-yj|. Min cost to make
all points connected.

```cpp
int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<tuple<int,int,int>> edges;
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int cost = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1]);
            edges.push_back({cost, i, j});
        }
    sort(edges.begin(), edges.end());

    DSU dsu(n);
    int total = 0, edgesUsed = 0;
    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) {
            total += w;
            if (++edgesUsed == n-1) break;
        }
    }
    return total;
}
```
**Trap:** This generates O(n²) edges. For n ≤ 1000 that's fine. For n ≤ 10⁵, you'd need Prim's
or a smarter edge generation — but OAs rarely push MST past n=1000.

---

# PATTERN 10 — Advanced: SCC, Bridges, Articulation Points

> **OA frequency: LOW for intern rounds, but Google has asked Bridges (LC 1192).**
> Know the CONCEPT and be able to code Bridges. Skip SCC details for tomorrow.

## Bridges (Critical Connections) — LC 1192 (asked by Google)

**A bridge** is an edge whose removal disconnects the graph.
Uses Tarjan's DFS with `disc[]` (discovery time) and `low[]` (lowest reachable ancestor).

**Bridge condition:** Edge u→v is a bridge if `low[v] > disc[u]`.
Meaning: from v's subtree, you can't reach back to u or above — so removing u↔v splits the graph.

```cpp
int timer = 0;
vector<vector<int>> bridges_result;

void dfs(int u, int parent, vector<vector<int>>& adj,
         vector<int>& disc, vector<int>& low) {
    disc[u] = low[u] = timer++;
    for (int v : adj[u]) {
        if (disc[v] == -1) {
            dfs(v, u, adj, disc, low);
            low[u] = min(low[u], low[v]);
            if (low[v] > disc[u])
                bridges_result.push_back({u, v});
        } else if (v != parent) {
            low[u] = min(low[u], disc[v]);
        }
    }
}

vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
    vector<vector<int>> adj(n);
    for (auto& c : connections) { adj[c[0]].push_back(c[1]); adj[c[1]].push_back(c[0]); }
    vector<int> disc(n, -1), low(n);
    bridges_result.clear();
    timer = 0;
    dfs(0, -1, adj, disc, low);
    return bridges_result;
}
```

---
---

# 🎯 THE OA GRAPH TRIAGE (60-second decision tree)

When a graph problem appears, ask IN THIS ORDER:

```
1. "Is it a grid?" → Grid-as-Graph (Pattern 3)
     All moves cost 1?    → BFS
     Costs 0 and 1?       → 0-1 BFS
     Varying costs?        → Dijkstra

2. "Shortest path?"
     Unweighted?           → BFS                O(V+E)
     Non-negative weights? → Dijkstra            O((V+E) log V)
     Negative weights?     → Bellman-Ford         O(V*E)
     All-pairs?            → Floyd-Warshall       O(V³)

3. "Has a constraint (k stops, k walls, fuel)?"
     → Augmented state Dijkstra/BFS (Pattern 4)
     State = (node, constraint_used)

4. "Dependencies / ordering / prerequisites?"
     → Topological Sort (Kahn's BFS)
     → If also asks "longest path" → Topo + DP

5. "Connectivity / grouping / components?"
     → DSU if edges arrive dynamically
     → BFS/DFS if graph is static

6. "Cycle?"
     Undirected → DSU or DFS(parent check)
     Directed → Kahn's (output < n) or 3-color DFS

7. "Two groups / bipartite / coloring?"
     → BFS 2-color

8. "Connect all nodes at minimum cost?"
     → MST (Kruskal's with DSU)

9. "Spreading / expanding from multiple sources?"
     → Multi-source BFS
```

---

# ⚠️ COMMON OA TRAPS IN GRAPH PROBLEMS

### Trap 1 — Forgetting to handle disconnected components
**Wrong:** Start BFS/DFS from node 0 only.
**Right:** Loop over ALL nodes and start from each unvisited one.
```cpp
for (int i = 0; i < n; i++)
    if (!visited[i]) bfs(i);  // or dfs(i)
```

### Trap 2 — 1-indexed vs 0-indexed nodes
Problem says "nodes 1 to n" but you create `vector<int>(n)` → node n is out of bounds.
**Fix:** Always read the problem. Use `(n+1)` sized arrays for 1-indexed.

### Trap 3 — Directed vs Undirected confusion
**Undirected:** Add BOTH directions: `adj[u].push_back(v); adj[v].push_back(u);`
**Directed:** Add only one: `adj[u].push_back(v);`
Getting this wrong = wrong answer with no compile error. Read the problem.

### Trap 4 — Using `visited` vs `dist == -1` in BFS
Both work for "have I seen this node?", but `dist[]` does double duty (tracks distance AND
visited status). In contest, prefer `dist[v] == -1` as the "unvisited" check — one less array.

### Trap 5 — Dijkstra with negative edges
Dijkstra **silently gives wrong answers** with negative edges — no error, no TLE, just WA.
If you see negative weights → Bellman-Ford. Always.

### Trap 6 — Forgetting `long long` in weighted graphs
If edge weights go up to 10⁹ and paths can have up to 10⁵ edges, total distance can be 10¹⁴.
That overflows `int`. Use `long long` for `dist[]`.

### Trap 7 — BFS on weighted graph
BFS only gives shortest path when ALL edges cost the SAME. If edges have different weights
and you use BFS → wrong answer. Use Dijkstra.

---

# 📚 PRACTICE PROBLEMS — BY PATTERN

| Pattern | Easy → Medium → Hard |
|---------|---------------------|
| **BFS** | LC 994 Rotting Oranges → LC 1091 Shortest Path Binary Matrix → LC 127 Word Ladder |
| **0-1 BFS** | LC 2290 Min Obstacle Removals → LC 1368 Min Cost Grid Path |
| **Grid** | LC 200 Number of Islands → LC 695 Max Area Island → LC 417 Pacific Atlantic Water Flow |
| **Dijkstra+State** | LC 787 Cheapest Flights K Stops → LC 1293 Shortest Path Obstacle Elim → LC 882 Reachable Nodes Subdivided |
| **Topo Sort** | LC 207 Course Schedule → LC 210 Course Schedule II → LC 2050 Parallel Courses III |
| **DSU** | LC 684 Redundant Connection → LC 721 Accounts Merge → LC 1135 Min Cost Connecting Cities |
| **Cycle** | LC 207 Course Schedule → LC 802 Find Eventual Safe States |
| **Bipartite** | LC 785 Is Graph Bipartite → LC 886 Possible Bipartition |
| **MST** | LC 1584 Min Cost Connect Points → LC 1135 Connecting Cities Min Cost |
| **Bridges** | LC 1192 Critical Connections |

---

> **How to use this tonight:** Re-read the triage box (page up), then do ONE problem from each of
> Patterns 1, 3, 4, 5 — those four cover ~80% of OA graph questions. If time permits, do a DSU
> problem (Pattern 6). Skip advanced (Pattern 10) unless you've finished everything else.
