# TRIES & ADVANCED STRINGS — OA Foundations

**Purpose:** Everything you need for string-heavy OA problems (Google/Microsoft on-campus).
Your reference file already has basic KMP, Rabin-Karp, and Trie skeletons.
This file goes deeper: the *patterns*, the *traps*, the *OA problems with full solutions*.

---

## TABLE OF CONTENTS

| # | Pattern | Key Problems |
|---|---------|-------------|
| 1 | Trie — Word Dictionary & Prefix Queries | Implement Trie, Search Suggestions, Replace Words |
| 2 | Trie — XOR Maximum | Maximum XOR of Two Numbers, Max XOR Subarray |
| 3 | Trie — Autocomplete / Top-K | Search Suggestions System (LC 1268) |
| 4 | KMP — Pattern Matching & LPS Tricks | Repeated Substring, Shortest Palindrome |
| 5 | Rolling Hash (Rabin-Karp) | Longest Duplicate Substring, Repeated DNA |
| 6 | Z-Algorithm | Pattern matching alternative, period of string |
| 7 | String DP Refresher | Edit Distance, Distinct Subsequences, Palindrome Partitioning |
| 8 | Suffix Array (Lite) | Concept + when you'd reach for it in OA |
| 9 | Manacher's Algorithm | Longest Palindromic Substring in O(n) |

---
---

# PATTERN 1 — TRIE: Word Dictionary & Prefix Queries

## When You See It

- "Given a dictionary of words, check if a word/prefix exists"
- "Replace words with their shortest root from a dictionary"
- "Word search in a grid" (Trie + DFS)
- "Count words with given prefix"
- Any problem where **prefix relationships between strings** matter

## The Core Structure (Enhanced)

Your reference has the basic struct. Here's the OA-ready version with `countPrefix` and `countEnd`:

```cpp
struct TrieNode {
    TrieNode* ch[26] = {};
    int countPrefix = 0; // how many words pass through this node
    int countEnd = 0;    // how many words end exactly here
};

struct Trie {
    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        auto node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->ch[idx]) node->ch[idx] = new TrieNode();
            node = node->ch[idx];
            node->countPrefix++;
        }
        node->countEnd++;
    }

    int countWordsEqualTo(const string& word) {
        auto node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->ch[idx]) return 0;
            node = node->ch[idx];
        }
        return node->countEnd;
    }

    int countWordsStartingWith(const string& prefix) {
        auto node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->ch[idx]) return 0;
            node = node->ch[idx];
        }
        return node->countPrefix;
    }

    // Erase one occurrence of word (call only if word exists)
    void erase(const string& word) {
        auto node = root;
        for (char c : word) {
            int idx = c - 'a';
            node = node->ch[idx];
            node->countPrefix--;
        }
        node->countEnd--;
    }
};
```

## OA Problem: Replace Words (LC 648)

**Statement:** Given a dictionary of roots and a sentence, replace every word in the sentence
with its shortest root (prefix) from the dictionary. If no root exists, keep original.

**Example:** dictionary = ["cat", "bat", "rat"], sentence = "the cattle was rattled by the battery"
→ "the cat was rat by the bat"

**Why Trie:** For each word, walk the trie character by character. The moment you hit a node
where `countEnd > 0`, that's the shortest root — return it immediately.

```cpp
#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* ch[26] = {};
    bool isEnd = false;
};

class Solution {
    TrieNode* root = new TrieNode();

    void insert(const string& w) {
        auto node = root;
        for (char c : w) {
            if (!node->ch[c-'a']) node->ch[c-'a'] = new TrieNode();
            node = node->ch[c-'a'];
        }
        node->isEnd = true;
    }

    string getRoot(const string& w) {
        auto node = root;
        for (int i = 0; i < w.size(); i++) {
            int c = w[i] - 'a';
            if (!node->ch[c]) return w;       // no root matches
            node = node->ch[c];
            if (node->isEnd) return w.substr(0, i + 1); // shortest root
        }
        return w;
    }

public:
    string replaceWords(vector<string>& dict, string sentence) {
        for (auto& d : dict) insert(d);
        string res, word;
        istringstream ss(sentence);
        while (ss >> word) {
            if (!res.empty()) res += ' ';
            res += getRoot(word);
        }
        return res;
    }
};
```

**Complexity:** O(sum of all word lengths) time, O(total chars in dictionary × 26) space.

## OA Problem: Word Search II (LC 212)

**Statement:** Given an m×n board of characters and a list of words, find all words that
can be formed by sequentially adjacent cells (up/down/left/right). Same cell can't be
reused in one word.

**Why Trie:** Inserting all words into a trie lets you prune DFS branches early — if no word
in the dictionary has the current prefix, stop exploring.

```cpp
struct TrieNode {
    TrieNode* ch[26] = {};
    string* word = nullptr; // non-null at word end
};

class Solution {
    TrieNode* root = new TrieNode();
    vector<string> res;
    int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};

    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node) {
        if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size()) return;
        char ch = board[r][c];
        if (ch == '#' || !node->ch[ch-'a']) return;

        node = node->ch[ch-'a'];
        if (node->word) {
            res.push_back(*node->word);
            node->word = nullptr; // de-duplicate
        }

        board[r][c] = '#'; // mark visited
        for (int d = 0; d < 4; d++)
            dfs(board, r + dx[d], c + dy[d], node);
        board[r][c] = ch; // unmark
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        for (auto& w : words) {
            auto node = root;
            for (char c : w) {
                if (!node->ch[c-'a']) node->ch[c-'a'] = new TrieNode();
                node = node->ch[c-'a'];
            }
            node->word = &w;
        }
        for (int i = 0; i < board.size(); i++)
            for (int j = 0; j < board[0].size(); j++)
                dfs(board, i, j, root);
        return res;
    }
};
```

**Complexity:** O(m × n × 4^L) worst case, but trie pruning makes it much faster in practice.

---
---

# PATTERN 2 — TRIE: XOR Maximum (Binary Trie)

## When You See It

- "Maximum XOR of two numbers in an array"
- "Maximum XOR subarray"
- "Count pairs with XOR in range"
- Anything combining **XOR** and **maximize/minimize** or **count**

## The Key Insight

Store numbers bit-by-bit (MSB to LSB) in a trie with children `{0, 1}`.
To maximize XOR with a query number `x`, greedily take the **opposite bit** at each level.

```
Number 5 = 101 stored as: root -> 1 -> 0 -> 1
Number 3 = 011 stored as: root -> 0 -> 1 -> 1

To maximize XOR with 5 (101):
  Bit 2: want 0 (opposite of 1) — go 0 branch ✓
  Bit 1: want 1 (opposite of 0) — go 1 branch ✓
  Bit 0: want 0 (opposite of 1) — go 0? not available, go 1
  Result: 011 ^ 101 = 110 = 6
```

## Code Template: Maximum XOR of Two Numbers (LC 421)

```cpp
#include <bits/stdc++.h>
using namespace std;

struct BitTrie {
    int ch[2] = {-1, -1}; // index into pool
};

class Solution {
    vector<BitTrie> pool;

    void insert(int num) {
        int node = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (pool[node].ch[bit] == -1) {
                pool[node].ch[bit] = pool.size();
                pool.push_back({});
            }
            node = pool[node].ch[bit];
        }
    }

    int query(int num) {
        int node = 0, res = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int want = 1 - bit; // opposite bit maximizes XOR
            if (pool[node].ch[want] != -1) {
                res |= (1 << i);
                node = pool[node].ch[want];
            } else {
                node = pool[node].ch[bit];
            }
        }
        return res;
    }

public:
    int findMaximumXOR(vector<int>& nums) {
        pool.clear();
        pool.push_back({}); // root
        int ans = 0;
        for (int x : nums) insert(x);
        for (int x : nums) ans = max(ans, query(x));
        return ans;
    }
};
```

**Complexity:** O(n × 31) time, O(n × 31) space.

## OA Variant: Maximum XOR Subarray

Given array `a[]`, find subarray `a[l..r]` whose XOR is maximized.

**Trick:** Compute prefix XOR `px[i] = a[0] ^ a[1] ^ ... ^ a[i-1]`.
Then `XOR(l..r) = px[r+1] ^ px[l]`. Problem reduces to: find two values in `px[]` with maximum XOR.
Use the binary trie above — insert prefix XORs one by one, query max XOR against all previously inserted.

```cpp
int maxXorSubarray(vector<int>& a) {
    int n = a.size();
    vector<int> px(n + 1, 0);
    for (int i = 0; i < n; i++) px[i+1] = px[i] ^ a[i];

    // Now find max XOR pair in px[] using binary trie
    // (same as LC 421 above)
    // Insert px[0], then for each px[i], query max XOR, insert px[i]
    int ans = 0;
    // ... binary trie insert/query loop ...
    return ans;
}
```

---
---

# PATTERN 3 — TRIE: Autocomplete / Search Suggestions

## When You See It

- "Suggest top 3 products after each character typed"
- "Autocomplete with ranking"
- Prefix-based retrieval with ordering

## OA Problem: Search Suggestions System (LC 1268)

**Statement:** Given products array and searchWord, after each character typed, return
the lexicographically smallest 3 products that share the typed prefix.

**Two approaches:**

### Approach A: Sort + Binary Search (simpler, often good enough for OA)

```cpp
vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
    sort(products.begin(), products.end());
    vector<vector<string>> res;
    string prefix;
    for (char c : searchWord) {
        prefix += c;
        auto it = lower_bound(products.begin(), products.end(), prefix);
        vector<string> suggest;
        for (int i = 0; i < 3 && it + i != products.end(); i++) {
            if ((*(it + i)).substr(0, prefix.size()) != prefix) break;
            suggest.push_back(*(it + i));
        }
        res.push_back(suggest);
    }
    return res;
}
```

### Approach B: Trie (when you need real-time inserts too)

Build trie, at each node store a sorted list of up to 3 words passing through it.
Walk trie character by character for each prefix typed.

**OA tip:** Approach A is almost always sufficient. Use Trie only if the problem says
"words are being added dynamically" or "stream of queries."

---
---

# PATTERN 4 — KMP: LPS Array Tricks

## Beyond Basic Pattern Matching

Your reference has the KMP code. The real OA power is in the **LPS array itself**.

### What LPS[i] Actually Means

`LPS[i]` = length of the longest **proper prefix** of `s[0..i]` that is also a **suffix** of `s[0..i]`.

This single array answers questions like:
- Does string `s` have a repeating pattern?
- What's the shortest period of `s`?
- What's the longest prefix of `s` that appears at the end too?

### Key Insight: Period of a String

If `n % (n - LPS[n-1]) == 0`, then `s` has a repeating unit of length `n - LPS[n-1]`.

```
s = "abcabcabc"  (n=9)
LPS = [0,0,0,1,2,3,4,5,6]
LPS[8] = 6
period = n - LPS[n-1] = 9 - 6 = 3  → "abc" repeated 3 times ✓

s = "aabaabaab"  (n=9)
LPS = [0,1,0,1,2,3,4,5,6]
LPS[8] = 6
period = 9 - 6 = 3  → "aab" repeated 3 times ✓

s = "abcd"       (n=4)
LPS = [0,0,0,0]
LPS[3] = 0
period = 4 - 0 = 4  → entire string, no repetition
```

## OA Problem: Repeated Substring Pattern (LC 459)

**Statement:** Given string `s`, check if it can be formed by repeating a substring.

```cpp
bool repeatedSubstringPattern(string s) {
    int n = s.size();
    vector<int> lps(n, 0);
    for (int i = 1, len = 0; i < n;) {
        if (s[i] == s[len]) lps[i++] = ++len;
        else if (len) len = lps[len-1];
        else lps[i++] = 0;
    }
    int period = n - lps[n-1];
    return lps[n-1] > 0 && n % period == 0;
}
```

## OA Problem: Shortest Palindrome (LC 214)

**Statement:** Find the shortest palindrome by adding characters only to the **front** of `s`.

**Trick:** Find the longest palindromic prefix of `s`. Characters after that prefix (reversed)
must be prepended.

How to find longest palindromic prefix? Build `t = s + "#" + reverse(s)`. Compute LPS of `t`.
`LPS[last]` = length of longest palindromic prefix of `s`.

```cpp
string shortestPalindrome(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    string t = s + "#" + rev;
    int n = t.size();

    vector<int> lps(n, 0);
    for (int i = 1, len = 0; i < n;) {
        if (t[i] == t[len]) lps[i++] = ++len;
        else if (len) len = lps[len-1];
        else lps[i++] = 0;
    }

    int palLen = lps[n-1]; // longest palindromic prefix length
    string add = s.substr(palLen);
    reverse(add.begin(), add.end());
    return add + s;
}
```

**Why the '#' separator:** Without it, the LPS value could cross the boundary between `s` and
`reverse(s)`, giving a wrong answer. The '#' (any char not in `s`) blocks this.

---
---

# PATTERN 5 — ROLLING HASH (Rabin-Karp Extensions)

## Beyond Basic Pattern Matching

Rolling hash shines when you need to **compare many substrings of different positions/lengths**.

### Double Hashing (anti-collision for OA)

Single hash gets hacked. Use two independent (base, mod) pairs:

```cpp
struct DoubleHash {
    static const long long B1 = 131, M1 = 1e9 + 7;
    static const long long B2 = 137, M2 = 1e9 + 9;
    int n;
    vector<long long> h1, h2, p1, p2;

    DoubleHash(const string& s) : n(s.size()), h1(n+1), h2(n+1), p1(n+1), p2(n+1) {
        p1[0] = p2[0] = 1;
        for (int i = 0; i < n; i++) {
            h1[i+1] = (h1[i] * B1 + s[i]) % M1;
            h2[i+1] = (h2[i] * B2 + s[i]) % M2;
            p1[i+1] = p1[i] * B1 % M1;
            p2[i+1] = p2[i] * B2 % M2;
        }
    }

    // Hash of s[l..r] (0-indexed, inclusive)
    pair<long long, long long> get(int l, int r) {
        long long v1 = (h1[r+1] - h1[l] * p1[r-l+1] % M1 + M1 * 2) % M1;
        long long v2 = (h2[r+1] - h2[l] * p2[r-l+1] % M2 + M2 * 2) % M2;
        return {v1, v2};
    }
};
```

## OA Problem: Longest Duplicate Substring (LC 1044)

**Statement:** Given string `s`, find the longest substring that occurs at least twice.

**Approach:** Binary search on answer length + rolling hash to check if any substring of
that length appears twice.

```cpp
class Solution {
    static const long long B = 131, M = 1e9 + 7;

    string check(const string& s, int len) {
        if (len == 0) return "";
        long long h = 0, power = 1;
        for (int i = 0; i < len; i++) {
            h = (h * B + s[i]) % M;
            if (i > 0) power = power * B % M;
        }
        unordered_map<long long, vector<int>> seen;
        seen[h].push_back(0);

        for (int i = len; i < s.size(); i++) {
            h = (h - s[i-len] * power % M + M * 2) % M;
            h = (h * B + s[i]) % M;
            int start = i - len + 1;
            if (seen.count(h)) {
                string cur = s.substr(start, len);
                for (int prev : seen[h]) {
                    if (s.substr(prev, len) == cur) return cur;
                }
            }
            seen[h].push_back(start);
        }
        return "";
    }

public:
    string longestDupSubstring(string s) {
        int lo = 0, hi = s.size() - 1;
        string ans;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            string found = check(s, mid);
            if (!found.empty()) {
                ans = found;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
};
```

**Complexity:** O(n log n) average (binary search × hash check).

---
---

# PATTERN 6 — Z-ALGORITHM

## What It Does

`Z[i]` = length of the longest substring starting at `i` that matches a prefix of the string.

```
s = "aabxaab"
Z = [_, 1, 0, 0, 3, 1, 0]
     ^  a  b  x  aab a  b
     |
    Z[0] is undefined (or set to n)

Z[4] = 3 because s[4..6] = "aab" matches s[0..2] = "aab"
```

## Why It Matters for OA

- **Simpler than KMP** for many problems — same O(n) complexity
- Pattern matching: concatenate `pattern + "$" + text`, compute Z-array.
  Every `i` where `Z[i] == len(pattern)` is a match.
- Period detection: same as KMP but some people find Z more intuitive

## Code Template

```cpp
vector<int> zFunction(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    return z;
}
```

## Pattern Matching with Z-Array

```cpp
vector<int> findPattern(const string& text, const string& pat) {
    string combined = pat + "$" + text;
    auto z = zFunction(combined);
    vector<int> matches;
    int m = pat.size();
    for (int i = m + 1; i < combined.size(); i++) {
        if (z[i] == m) matches.push_back(i - m - 1);
    }
    return matches;
}
```

## When to Use Z vs KMP

| Situation | Prefer |
|-----------|--------|
| Basic pattern matching | Either (Z is easier to code) |
| Need the LPS array for period/prefix tricks | KMP |
| Multiple pattern matching queries | Z (just change what you concatenate) |
| Competitive programming speed | Z (fewer edge cases) |

---
---

# PATTERN 7 — STRING DP (OA Essentials)

## These Come Up Constantly

String DP problems are the **most common string problems in OAs** — more common than
KMP/Trie problems. You already covered DP foundations. Here are the string-specific patterns.

### 7A. Edit Distance (LC 72)

**State:** `dp[i][j]` = min operations to convert `word1[0..i-1]` to `word2[0..j-1]`

**Recurrence:**
```
if word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]           // no op needed
else:
    dp[i][j] = 1 + min(
        dp[i-1][j],     // delete from word1
        dp[i][j-1],     // insert into word1
        dp[i-1][j-1]    // replace
    )
```

```cpp
int minDistance(string w1, string w2) {
    int m = w1.size(), n = w2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = w1[i-1] == w2[j-1]
                ? dp[i-1][j-1]
                : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[m][n];
}
```

### 7B. Longest Common Subsequence (LC 1143)

**State:** `dp[i][j]` = LCS length of `s1[0..i-1]` and `s2[0..j-1]`

```cpp
int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = s1[i-1] == s2[j-1]
                ? dp[i-1][j-1] + 1
                : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

### 7C. Distinct Subsequences (LC 115)

**Statement:** Given `s` and `t`, count the number of distinct subsequences of `s` that equal `t`.

**State:** `dp[i][j]` = number of ways to form `t[0..j-1]` from `s[0..i-1]`

```cpp
int numDistinct(string s, string t) {
    int m = s.size(), n = t.size();
    vector<vector<unsigned long long>> dp(m+1, vector<unsigned long long>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = 1; // empty t can always be formed
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j]; // skip s[i-1]
            if (s[i-1] == t[j-1]) dp[i][j] += dp[i-1][j-1]; // use s[i-1]
        }
    return dp[m][n];
}
```

### 7D. Palindrome Partitioning II (LC 132)

**Statement:** Minimum cuts to partition string into all palindromes.

```cpp
int minCut(string s) {
    int n = s.size();
    // isPal[i][j] = true if s[i..j] is palindrome
    vector<vector<bool>> isPal(n, vector<bool>(n, false));
    for (int i = n-1; i >= 0; i--)
        for (int j = i; j < n; j++)
            isPal[i][j] = (s[i] == s[j]) && (j - i <= 2 || isPal[i+1][j-1]);

    vector<int> dp(n, n); // dp[i] = min cuts for s[0..i]
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) { dp[i] = 0; continue; }
        for (int j = 1; j <= i; j++)
            if (isPal[j][i]) dp[i] = min(dp[i], dp[j-1] + 1);
    }
    return dp[n-1];
}
```

---
---

# PATTERN 8 — SUFFIX ARRAY (Lite)

## When Would This Appear in OA?

Rarely as "build a suffix array." More often as **background knowledge** — the interviewer
expects you to recognize when a problem needs suffix-based thinking and use a simpler
approach (rolling hash, or even `substr` + `set` for smaller constraints).

## What It Is

A suffix array `SA[]` is a sorted array of all suffixes of a string, represented by their
starting indices. Combined with the **LCP array** (Longest Common Prefix between adjacent
sorted suffixes), it answers many substring queries.

**OA-level knowledge needed:**
- Know that suffix array + LCP array can count distinct substrings in O(n)
- Distinct substrings = `n*(n+1)/2 - sum(LCP[i])` for all i
- For OA, if n ≤ 10^5 and you need suffix array, use the O(n log^2 n) version:

```cpp
// Simplified O(n log^2 n) suffix array
vector<int> buildSA(const string& s) {
    int n = s.size();
    vector<int> sa(n), rank_(n), tmp(n);
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++) rank_[i] = s[i];

    for (int k = 1; k < n; k <<= 1) {
        auto cmp = [&](int a, int b) {
            if (rank_[a] != rank_[b]) return rank_[a] < rank_[b];
            int ra = a + k < n ? rank_[a+k] : -1;
            int rb = b + k < n ? rank_[b+k] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i-1]] + cmp(sa[i-1], sa[i]);
        rank_ = tmp;
        if (rank_[sa[n-1]] == n - 1) break;
    }
    return sa;
}
```

**OA Rule of Thumb:** If you see "count distinct substrings" with n ≤ 10^5, suffix array
is the intended approach. For n ≤ 10^3, brute force with `set<string>` works.

---
---

# PATTERN 9 — MANACHER'S ALGORITHM

## When You See It

- "Longest palindromic substring" (not subsequence — that's DP)
- "Count palindromic substrings"
- Any problem needing palindrome radius at every center in O(n)

## How It Works

Expand around centers, but skip redundant expansions by using the symmetry of a previously
found palindrome. Converts string to handle even-length palindromes uniformly by inserting
`#` between characters.

```
Original:  "abacaba"
Modified:  "#a#b#a#c#a#b#a#"

p[i] = radius of palindrome centered at i in modified string
p:     [0,1,0,3,0,1,0,7,0,1,0,3,0,1,0]
                             ^
                        center of "abacaba"
```

## Code Template

```cpp
string longestPalindrome(string s) {
    // Build modified string
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0; // center and right boundary of rightmost palindrome

    for (int i = 0; i < n; i++) {
        if (i < r) p[i] = min(r - i, p[2*c - i]); // mirror
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i-p[i]-1] == t[i+p[i]+1])
            p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
    }

    int maxLen = 0, center = 0;
    for (int i = 0; i < n; i++) {
        if (p[i] > maxLen) { maxLen = p[i]; center = i; }
    }
    int start = (center - maxLen) / 2;
    return s.substr(start, maxLen);
}
```

**Complexity:** O(n) time, O(n) space.

## Count All Palindromic Substrings (LC 647)

Same Manacher, different aggregation:

```cpp
int countSubstrings(string s) {
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0, count = 0;
    for (int i = 0; i < n; i++) {
        if (i < r) p[i] = min(r - i, p[2*c - i]);
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i-p[i]-1] == t[i+p[i]+1])
            p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        // Each palindrome of radius k in modified string
        // corresponds to ceil(k/2) original palindromes
        count += (p[i] + 1) / 2;
    }
    return count;
}
```

---
---

# OA STRING TRIAGE — The 90-Second Decision Tree

When you see a string problem in an OA, walk this:

```
1. Is it asking about SUBSTRINGS (contiguous)?
   ├── Palindromic substring → Manacher or expand-around-center
   ├── Pattern matching → KMP or Z-algorithm
   ├── Duplicate / longest repeated → Rolling hash + binary search
   └── Count distinct substrings → Suffix array (or set for small n)

2. Is it asking about SUBSEQUENCES (not contiguous)?
   ├── Longest common subsequence → DP [i][j]
   ├── Longest palindromic subsequence → DP (reverse trick)
   ├── Count distinct subsequences → DP
   └── Edit distance / transform → DP [i][j]

3. Is it asking about PREFIX matching?
   ├── Dictionary lookups → Trie
   ├── Autocomplete → Trie or sort + binary search
   └── Replace shortest prefix → Trie

4. Is it asking about XOR + numbers?
   └── Maximum XOR pair/subarray → Binary Trie

5. Is it asking about REPETITION / PERIOD?
   └── Repeated pattern, shortest palindrome prefix → KMP LPS array
```

---

# COMMON STRING OA TRAPS

### Trap 1: Confusing Substring vs Subsequence
- **Substring** = contiguous (sliding window, KMP, hash)
- **Subsequence** = skip characters allowed (DP)
- Read the problem statement twice. "Subsequence" in the title changes the entire approach.

### Trap 2: Off-by-One in Hash/KMP
- LPS array is 0-indexed. `LPS[n-1]` is the answer, not `LPS[n]`.
- Rolling hash: when removing leftmost char, multiply by `power = BASE^(len-1)`, not `BASE^len`.

### Trap 3: Hash Collision = Wrong Answer
- Single hash with `mod 1e9+7` can be hacked. Use double hash for safety.
- Or verify with actual string comparison when hashes match (Rabin-Karp style).

### Trap 4: Trie Memory
- 26 children per node × millions of nodes = MLE.
- If alphabet is large or strings are long, consider hash map children instead of array.
- For binary trie (XOR), only 2 children per node — memory is fine.

### Trap 5: String DP Space
- Edit Distance / LCS for strings of length 10^4 needs O(n^2) space in 2D.
- Space-optimize to O(n) using two rows. Remember the diagonal trap from DP foundations.

### Trap 6: Empty String / Single Character
- Always handle `s.empty()` or `s.size() == 1` as base cases.
- Palindrome problems: single character is always a palindrome.

---

# PRACTICE PROBLEMS BY PATTERN

## Trie
| Problem | Difficulty | Key Idea |
|---------|-----------|----------|
| LC 208 - Implement Trie | Medium | Basic structure |
| LC 648 - Replace Words | Medium | Shortest prefix lookup |
| LC 212 - Word Search II | Hard | Trie + grid DFS |
| LC 421 - Max XOR of Two Numbers | Medium | Binary trie |
| LC 1268 - Search Suggestions | Medium | Trie or sort+BS |
| LC 211 - Design Add and Search Words | Medium | Trie + DFS for '.' wildcard |

## KMP / Z-Algorithm
| Problem | Difficulty | Key Idea |
|---------|-----------|----------|
| LC 28 - Find Index of First Occurrence | Easy | Basic KMP/Z |
| LC 459 - Repeated Substring Pattern | Easy | LPS period trick |
| LC 214 - Shortest Palindrome | Hard | KMP on s + # + rev(s) |
| LC 686 - Repeated String Match | Medium | KMP with cyclic matching |

## Rolling Hash
| Problem | Difficulty | Key Idea |
|---------|-----------|----------|
| LC 1044 - Longest Duplicate Substring | Hard | Binary search + hash |
| LC 187 - Repeated DNA Sequences | Medium | Rolling hash on length 10 |
| LC 1316 - Distinct Echo Substrings | Hard | Hash all even-length substrings |

## String DP
| Problem | Difficulty | Key Idea |
|---------|-----------|----------|
| LC 72 - Edit Distance | Medium | Classic 2D DP |
| LC 1143 - Longest Common Subsequence | Medium | 2D DP |
| LC 115 - Distinct Subsequences | Hard | Count DP |
| LC 132 - Palindrome Partitioning II | Hard | Precompute isPal + 1D DP |
| LC 516 - Longest Palindromic Subsequence | Medium | LCS of s and reverse(s) |
| LC 5 - Longest Palindromic Substring | Medium | Expand or Manacher |
| LC 647 - Palindromic Substrings | Medium | Manacher or expand |

## Priority for OA (study in this order)
1. String DP (Edit Distance, LCS) — appears in ~40% of string OA problems
2. Trie basics + Word Search II — appears in ~25%
3. KMP LPS tricks — appears in ~15%
4. Rolling Hash + Binary Search — appears in ~10%
5. Manacher, Z-Algorithm, Suffix Array — rare but devastating when they appear

---

# QUICK REFERENCE: Algorithm Selection

| I need to... | Use | Time |
|--------------|-----|------|
| Find pattern in text | KMP or Z | O(n+m) |
| Find all occurrences of pattern | KMP | O(n+m) |
| Check if string has repeating unit | KMP LPS | O(n) |
| Longest palindromic substring | Manacher | O(n) |
| Longest palindromic subsequence | DP (LCS trick) | O(n^2) |
| Edit distance | DP 2D | O(n*m) |
| Longest common subsequence | DP 2D | O(n*m) |
| Longest duplicate substring | Hash + binary search | O(n log n) |
| Prefix lookups in dictionary | Trie | O(L) per query |
| Maximum XOR pair | Binary Trie | O(n * 31) |
| Count distinct substrings | Suffix Array + LCP | O(n log n) |
| Word search in grid | Trie + DFS | O(m*n * 4^L) |
