package com.interviewcopilot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewcopilot.dto.ai.AiQuestionGenerateRequest;
import com.interviewcopilot.model.Question;
import com.interviewcopilot.repository.QuestionRepository;
import com.interviewcopilot.service.ai.LlmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionGenerationService {

    private final QuestionRepository questionRepository;
    private final LlmService llmService;
    private final ObjectMapper objectMapper;

    public List<Question> generateQuestions(String company, String type, String difficulty) {
        List<Question> generated = new ArrayList<>();
        if ("TECHNICAL".equals(type)) generated.addAll(getTechnicalQuestions(company, difficulty));
        else if ("SYSTEM_DESIGN".equals(type)) generated.addAll(getSystemDesignQuestions(company, difficulty));
        else if ("HR".equals(type)) generated.addAll(getHRQuestions(company, difficulty));

        List<Question> saved = new ArrayList<>();
        for (Question q : generated) {
            Question existing = questionRepository.findByTitle(q.getTitle());
            if (existing != null) {
                // If it exists, append the company to targetCompany if it's not already there
                if (!existing.getTargetCompany().contains(q.getTargetCompany())) {
                    existing.setTargetCompany(existing.getTargetCompany() + ", " + q.getTargetCompany());
                    questionRepository.save(existing);
                }
            } else {
                saved.add(questionRepository.save(q));
            }
        }
        log.info("Saved {} new {} questions for {} [{}]", saved.size(), type, company, difficulty);
        return saved;
    }

    public int bulkGenerateAll() {
        String[] global = {"Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix", "Oracle", "Adobe", "Salesforce", "Uber", "Goldman Sachs", "Morgan Stanley", "JP Morgan"};
        String[] indianSvc = {"TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "Cognizant", "LTIMindtree", "Mphasis", "Persistent Systems", "Capgemini India"};
        String[] indianProd = {"Flipkart", "Paytm", "Zomato", "Swiggy", "Razorpay", "PhonePe", "CRED", "Zerodha", "Ola", "Dream11", "Meesho", "ShareChat", "Freshworks", "Zoho", "Jio", "Myntra", "Nykaa", "upGrad", "Unacademy", "BrowserStack"};
        List<String> all = new ArrayList<>();
        all.addAll(Arrays.asList(global)); all.addAll(Arrays.asList(indianSvc)); all.addAll(Arrays.asList(indianProd)); all.add("General");
        String[] types = {"TECHNICAL", "SYSTEM_DESIGN", "HR"};
        String[] diffs = {"EASY", "MEDIUM", "HARD"};
        int total = 0;
        for (String c : all) for (String t : types) for (String d : diffs) total += generateQuestions(c, t, d).size();
        log.info("Bulk generation complete. Total: {}", total);
        return total;
    }

    private List<Question> getTechnicalQuestions(String co, String diff) {
        List<Question> q = new ArrayList<>();
        switch (diff) {
            case "EASY" -> { 
                q.addAll(arraysEasy(co)); q.addAll(stringsEasy(co)); q.addAll(linkedListEasy(co)); 
                q.addAll(treesEasy(co)); q.addAll(stackQueueEasy(co)); q.addAll(mathEasy(co)); 
                q.addAll(dpEasy(co)); q.addAll(bitManipEasy(co)); q.addAll(slidingWindowEasy(co));
                q.addAll(twoPointersEasy(co)); q.addAll(fastSlowPointersEasy(co));
            }
            case "MEDIUM" -> { 
                q.addAll(arraysMedium(co)); q.addAll(stringsMedium(co)); q.addAll(linkedListMedium(co)); 
                q.addAll(treesMedium(co)); q.addAll(graphsMedium(co)); q.addAll(dpMedium(co)); 
                q.addAll(binarySearchMedium(co)); q.addAll(backtrackingMedium(co)); q.addAll(heapMedium(co)); 
                q.addAll(trieMedium(co)); q.addAll(matrixMedium(co)); q.addAll(greedyMedium(co)); 
                q.addAll(unionFindMedium(co)); q.addAll(slidingWindowMedium(co)); q.addAll(twoPointersMedium(co));
                q.add(b("Merge Intervals", "Merge overlapping intervals.", "TECHNICAL", "MEDIUM", co, "Intervals", List.of("Array","Sorting","Intervals")));
                q.add(b("Insert Interval", "Insert a new interval into a sorted array of non-overlapping intervals.", "TECHNICAL", "MEDIUM", co, "Intervals", List.of("Array","Intervals")));
                q.add(b("Cyclic Sort", "Sort an array containing numbers from 1 to N.", "TECHNICAL", "MEDIUM", co, "Cyclic Sort", List.of("Array","Sorting","Cyclic Sort")));
                q.add(b("Find All Duplicates in an Array", "Find all numbers that appear twice in an array of integers 1 to n.", "TECHNICAL", "MEDIUM", co, "Cyclic Sort", List.of("Array","Cyclic Sort")));
                q.add(b("Topological Sort", "Sort a directed acyclic graph.", "TECHNICAL", "MEDIUM", co, "Topological Sort", List.of("Graph","Topological Sort")));
                q.add(b("Daily Temperatures", "Find how many days to wait for a warmer temperature.", "TECHNICAL", "MEDIUM", co, "Monotonic Stack", List.of("Array","Stack","Monotonic Stack")));
            }
            case "HARD" -> { 
                q.addAll(dpHard(co)); q.addAll(graphsHard(co)); q.addAll(arraysHard(co)); 
                q.addAll(treesHard(co)); q.addAll(stringsHard(co)); q.addAll(advancedHard(co)); 
                q.addAll(slidingWindowHard(co));
                q.add(b("Employee Free Time", "Find the free time for all employees given their working hours.", "TECHNICAL", "HARD", co, "Intervals", List.of("Array","Intervals","Heap")));
                q.add(b("First Missing Positive (Cyclic Sort)", "Find smallest missing positive integer in O(n) time, O(1) space.", "TECHNICAL", "HARD", co, "Cyclic Sort", List.of("Array","Cyclic Sort")));
                q.add(b("Largest Rectangle in Histogram", "Find the area of the largest rectangle in a histogram.", "TECHNICAL", "HARD", co, "Monotonic Stack", List.of("Array","Stack","Monotonic Stack")));
            }
        }
        // Incorporate rich domain-specific technical question suites
        q.addAll(javaSpringBootQuestions(co, diff));
        q.addAll(reactFrontendQuestions(co, diff));
        q.addAll(databaseSqlQuestions(co, diff));
        q.addAll(devOpsCloudQuestions(co, diff));
        q.addAll(aiMlPythonQuestions(co, diff));
        return q;
    }

    // ═══════════════ PATTERNS: SLIDING WINDOW ═══════════════
    private List<Question> slidingWindowEasy(String co) {
        return List.of(
            b("Maximum Average Subarray I", "Find a contiguous subarray whose length is equal to k that has the maximum average value.", "TECHNICAL", "EASY", co, "Sliding Window", List.of("Array","Sliding Window"))
        );
    }
    private List<Question> slidingWindowMedium(String co) {
        return List.of(
            b("Longest Substring Without Repeating Characters", "Find length of longest non-repeating substring.", "TECHNICAL", "MEDIUM", co, "Sliding Window", List.of("Sliding Window","Hash Table")),
            b("Max Consecutive Ones III", "Find the longest subarray with at most K zeros.", "TECHNICAL", "MEDIUM", co, "Sliding Window", List.of("Sliding Window","Array")),
            b("Permutation in String", "Return true if s2 contains a permutation of s1.", "TECHNICAL", "MEDIUM", co, "Sliding Window", List.of("Sliding Window","Hash Table"))
        );
    }
    private List<Question> slidingWindowHard(String co) {
        return List.of(
            b("Minimum Window Substring", "Smallest window in s containing all chars of t.", "TECHNICAL", "HARD", co, "Sliding Window", List.of("Sliding Window","Hash Table")),
            b("Sliding Window Maximum", "Return max in each sliding window of size k. Use monotonic deque.", "TECHNICAL", "HARD", co, "Sliding Window", List.of("Sliding Window","Deque","Monotonic Queue"))
        );
    }

    // ═══════════════ PATTERNS: TWO POINTERS ═══════════════
    private List<Question> twoPointersEasy(String co) {
        return List.of(
            b("Valid Palindrome", "Check palindrome ignoring non-alphanumeric chars.", "TECHNICAL", "EASY", co, "Two Pointers", List.of("Two Pointers","String")),
            b("Two Sum II - Input Array Is Sorted", "Find indices of two numbers that add up to target in sorted array.", "TECHNICAL", "EASY", co, "Two Pointers", List.of("Two Pointers","Array")),
            b("Squares of a Sorted Array", "Return array of squares of each number sorted in non-decreasing order.", "TECHNICAL", "EASY", co, "Two Pointers", List.of("Two Pointers","Array"))
        );
    }
    private List<Question> twoPointersMedium(String co) {
        return List.of(
            b("3Sum", "Find all unique triplets summing to zero.", "TECHNICAL", "MEDIUM", co, "Two Pointers", List.of("Array","Two Pointers","Sorting")),
            b("Container With Most Water", "Find two lines forming container with most water.", "TECHNICAL", "MEDIUM", co, "Two Pointers", List.of("Array","Two Pointers","Greedy")),
            b("Remove Duplicates from Sorted Array II", "Remove duplicates such that each element appears at most twice.", "TECHNICAL", "MEDIUM", co, "Two Pointers", List.of("Array","Two Pointers"))
        );
    }

    // ═══════════════ PATTERNS: FAST & SLOW POINTERS ═══════════════
    private List<Question> fastSlowPointersEasy(String co) {
        return List.of(
            b("Linked List Cycle", "Detect cycle using Floyd's tortoise-and-hare.", "TECHNICAL", "EASY", co, "Fast & Slow Pointers", List.of("Linked List","Two Pointers")),
            b("Middle of the Linked List", "Return the middle node of a linked list.", "TECHNICAL", "EASY", co, "Fast & Slow Pointers", List.of("Linked List","Two Pointers")),
            b("Happy Number", "Determine if a number is happy.", "TECHNICAL", "EASY", co, "Fast & Slow Pointers", List.of("Math","Two Pointers"))
        );
    }

    // ═══════════════ ARRAYS ═══════════════
    private List<Question> arraysEasy(String co) {
        return List.of(
            b("Two Sum", "Return indices of two numbers that add up to target.\nInput: [2,7,11,15], target=9 → [0,1]", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Hash Table")),
            b("Best Time to Buy and Sell Stock", "Maximize profit from one buy-sell transaction.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Greedy")),
            b("Contains Duplicate", "Return true if any value appears at least twice.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Hash Table")),
            b("Maximum Subarray (Kadane's)", "Find contiguous subarray with largest sum. Input: [-2,1,-3,4,-1,2,1,-5,4] → 6", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","DP")),
            b("Move Zeroes", "Move all 0's to end maintaining relative order. In-place.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Two Pointers")),
            b("Remove Duplicates from Sorted Array", "Remove duplicates in-place, return new length.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Two Pointers")),
            b("Intersection of Two Arrays II", "Return intersection with frequency counts.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Hash Table","Sorting")),
            b("Plus One", "Increment a large integer represented as digit array.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Math")),
            b("Majority Element", "Find element appearing more than n/2 times. Boyer-Moore voting.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Sorting","Divide and Conquer")),
            b("Missing Number", "Given [0..n] with one missing, find it in O(1) space.", "TECHNICAL", "EASY", co, "Arrays", List.of("Array","Bit Manipulation","Math"))
        );
    }
    private List<Question> arraysMedium(String co) {
        return List.of(
            b("Product of Array Except Self", "Return product array without division in O(n).", "TECHNICAL", "MEDIUM", co, "Arrays", List.of("Array","Prefix Sum")),
            b("Rotate Image", "Rotate n×n matrix 90° clockwise in-place.", "TECHNICAL", "MEDIUM", co, "Matrix", List.of("Array","Matrix","Math")),
            b("Spiral Matrix", "Return all elements of matrix in spiral order.", "TECHNICAL", "MEDIUM", co, "Matrix", List.of("Array","Matrix","Simulation")),
            b("Set Matrix Zeroes", "If element is 0, set entire row and column to 0. O(1) space.", "TECHNICAL", "MEDIUM", co, "Matrix", List.of("Array","Matrix")),
            b("Next Permutation", "Rearrange numbers to next lexicographically greater permutation.", "TECHNICAL", "MEDIUM", co, "Arrays", List.of("Array","Two Pointers")),
            b("Sort Colors (Dutch National Flag)", "Sort array of 0s,1s,2s in-place with one pass.", "TECHNICAL", "MEDIUM", co, "Arrays", List.of("Array","Two Pointers","Sorting")),
            b("4Sum", "Find all unique quadruplets summing to target.", "TECHNICAL", "MEDIUM", co, "Arrays", List.of("Array","Two Pointers","Sorting"))
        );
    }
    private List<Question> arraysHard(String co) {
        return List.of(
            b("Trapping Rain Water", "Compute water trapped between elevations.", "TECHNICAL", "HARD", co, "Arrays", List.of("Array","Two Pointers","Stack")),
            b("Median of Two Sorted Arrays", "Find median of two sorted arrays in O(log(m+n)).", "TECHNICAL", "HARD", co, "Binary Search", List.of("Binary Search","Divide and Conquer"))
        );
    }

    // ═══════════════ STRINGS ═══════════════
    private List<Question> stringsEasy(String co) {
        return List.of(
            b("Valid Anagram", "Check if two strings are anagrams of each other.", "TECHNICAL", "EASY", co, "Strings", List.of("String","Hash Table","Sorting")),
            b("Roman to Integer", "Convert roman numeral to integer.", "TECHNICAL", "EASY", co, "Strings", List.of("String","Math")),
            b("Longest Common Prefix", "Find longest common prefix among array of strings.", "TECHNICAL", "EASY", co, "Strings", List.of("String")),
            b("Implement strStr()", "Find first occurrence of needle in haystack.", "TECHNICAL", "EASY", co, "Strings", List.of("String","Two Pointers"))
        );
    }
    private List<Question> stringsMedium(String co) {
        return List.of(
            b("Group Anagrams", "Group strings that are anagrams of each other.", "TECHNICAL", "MEDIUM", co, "Strings", List.of("Hash Table","String","Sorting")),
            b("Longest Palindromic Substring", "Return longest palindromic substring using expand-around-center or DP.", "TECHNICAL", "MEDIUM", co, "Strings", List.of("String","DP","Two Pointers")),
            b("Find All Anagrams in a String", "Return start indices of all anagrams of p in s.", "TECHNICAL", "MEDIUM", co, "Sliding Window", List.of("Sliding Window","Hash Table")),
            b("String to Integer (atoi)", "Implement atoi with overflow handling and whitespace trimming.", "TECHNICAL", "MEDIUM", co, "Strings", List.of("String","Math"))
        );
    }
    private List<Question> stringsHard(String co) {
        return List.of(
            b("Longest Valid Parentheses", "Length of longest valid parentheses substring.", "TECHNICAL", "HARD", co, "Strings", List.of("DP","Stack","String")),
            b("Regular Expression Matching", "Implement regex with '.' and '*' support.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","String","Recursion"))
        );
    }

    // ═══════════════ LINKED LIST ═══════════════
    private List<Question> linkedListEasy(String co) {
        return List.of(
            b("Reverse Linked List", "Reverse a singly linked list iteratively and recursively.", "TECHNICAL", "EASY", co, "Linked List", List.of("Linked List","Recursion")),
            b("Merge Two Sorted Lists", "Merge two sorted linked lists into one.", "TECHNICAL", "EASY", co, "Linked List", List.of("Linked List","Recursion")),
            b("Remove Nth Node From End", "Remove nth node from end in one pass.", "TECHNICAL", "EASY", co, "Linked List", List.of("Linked List","Two Pointers")),
            b("Palindrome Linked List", "Check if linked list is a palindrome in O(1) space.", "TECHNICAL", "EASY", co, "Linked List", List.of("Linked List","Two Pointers","Stack"))
        );
    }
    private List<Question> linkedListMedium(String co) {
        return List.of(
            b("Add Two Numbers", "Add two numbers represented as reversed linked lists.", "TECHNICAL", "MEDIUM", co, "Linked List", List.of("Linked List","Math")),
            b("Reorder List", "Reorder L0→L1→...→Ln to L0→Ln→L1→Ln-1→...", "TECHNICAL", "MEDIUM", co, "Linked List", List.of("Linked List","Two Pointers","Stack")),
            b("Copy List with Random Pointer", "Deep copy a linked list with random pointers.", "TECHNICAL", "MEDIUM", co, "Linked List", List.of("Linked List","Hash Table")),
            b("Sort List", "Sort a linked list in O(n log n) using merge sort.", "TECHNICAL", "MEDIUM", co, "Linked List", List.of("Linked List","Merge Sort","Two Pointers"))
        );
    }

    // ═══════════════ TREES ═══════════════
    private List<Question> treesEasy(String co) {
        return List.of(
            b("Maximum Depth of Binary Tree", "Return max depth from root to leaf.", "TECHNICAL", "EASY", co, "Trees", List.of("Tree","DFS","BFS")),
            b("Symmetric Tree", "Check if tree is a mirror of itself.", "TECHNICAL", "EASY", co, "Trees", List.of("Tree","BFS","DFS")),
            b("Invert Binary Tree", "Invert/mirror a binary tree.", "TECHNICAL", "EASY", co, "Trees", List.of("Tree","DFS","BFS")),
            b("Subtree of Another Tree", "Check if one tree is a subtree of another.", "TECHNICAL", "EASY", co, "Trees", List.of("Tree","DFS")),
            b("Diameter of Binary Tree", "Find longest path between any two nodes.", "TECHNICAL", "EASY", co, "Trees", List.of("Tree","DFS"))
        );
    }
    private List<Question> treesMedium(String co) {
        return List.of(
            b("Binary Tree Level Order Traversal", "Return level-by-level values using BFS.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","BFS")),
            b("Validate Binary Search Tree", "Determine if tree is a valid BST.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","DFS","BST")),
            b("Lowest Common Ancestor", "Find LCA of two nodes in a binary tree.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","DFS","Recursion")),
            b("Binary Tree Right Side View", "Return values visible from right side.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","BFS","DFS")),
            b("Construct Binary Tree from Preorder and Inorder", "Build tree from traversal arrays.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","Divide and Conquer")),
            b("Kth Smallest Element in a BST", "Find kth smallest value in BST.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","DFS","BST")),
            b("Count Good Nodes in Binary Tree", "Count nodes where path from root has no greater value.", "TECHNICAL", "MEDIUM", co, "Trees", List.of("Tree","DFS"))
        );
    }
    private List<Question> treesHard(String co) {
        return List.of(
            b("Serialize and Deserialize Binary Tree", "Design serialize/deserialize algorithm.", "TECHNICAL", "HARD", co, "Trees", List.of("Tree","DFS","Design")),
            b("Binary Tree Maximum Path Sum", "Find max path sum (any node to any node).", "TECHNICAL", "HARD", co, "Trees", List.of("Tree","DFS","DP"))
        );
    }

    // ═══════════════ STACK & QUEUE ═══════════════
    private List<Question> stackQueueEasy(String co) {
        return List.of(
            b("Valid Parentheses", "Check if brackets are properly matched.", "TECHNICAL", "EASY", co, "Stacks", List.of("Stack","String")),
            b("Min Stack", "Design stack supporting push, pop, top, getMin in O(1).", "TECHNICAL", "EASY", co, "Stacks", List.of("Stack","Design")),
            b("Implement Queue using Stacks", "Implement FIFO queue using two stacks.", "TECHNICAL", "EASY", co, "Stacks", List.of("Stack","Queue","Design"))
        );
    }

    // ═══════════════ MATH & BIT MANIPULATION ═══════════════
    private List<Question> mathEasy(String co) {
        return List.of(
            b("Palindrome Number", "Check if integer is palindrome without string conversion.", "TECHNICAL", "EASY", co, "Math", List.of("Math")),
            b("Fizz Buzz", "Print numbers 1..n replacing multiples of 3,5 with Fizz,Buzz.", "TECHNICAL", "EASY", co, "Math", List.of("Math","String")),
            b("Count Primes", "Count primes less than n using Sieve of Eratosthenes.", "TECHNICAL", "EASY", co, "Math", List.of("Math","Sieve")),
            b("Power of Two", "Check if n is a power of two using bit manipulation.", "TECHNICAL", "EASY", co, "Math", List.of("Math","Bit Manipulation"))
        );
    }
    private List<Question> bitManipEasy(String co) {
        return List.of(
            b("Single Number", "Every element appears twice except one. Find it in O(1) space using XOR.", "TECHNICAL", "EASY", co, "Bit Manipulation", List.of("Bit Manipulation","Array")),
            b("Number of 1 Bits", "Count set bits (Hamming weight) of an unsigned integer.", "TECHNICAL", "EASY", co, "Bit Manipulation", List.of("Bit Manipulation")),
            b("Reverse Bits", "Reverse bits of a 32-bit unsigned integer.", "TECHNICAL", "EASY", co, "Bit Manipulation", List.of("Bit Manipulation"))
        );
    }

    // ═══════════════ DYNAMIC PROGRAMMING (EASY) ═══════════════
    private List<Question> dpEasy(String co) {
        return List.of(
            b("Climbing Stairs", "n steps, climb 1 or 2 each time. Count distinct ways. (Fibonacci variant)", "TECHNICAL", "EASY", co, "Dynamic Programming", List.of("DP","Math","Memoization")),
            b("House Robber", "Rob houses along a street (can't rob adjacent). Maximize money.", "TECHNICAL", "EASY", co, "Dynamic Programming", List.of("DP","Array")),
            b("Min Cost Climbing Stairs", "Each step has a cost. Find minimum cost to reach top.", "TECHNICAL", "EASY", co, "Dynamic Programming", List.of("DP","Array")),
            b("Pascal's Triangle", "Generate first n rows of Pascal's triangle.", "TECHNICAL", "EASY", co, "Dynamic Programming", List.of("DP","Array")),
            b("Is Subsequence", "Check if string s is a subsequence of string t.", "TECHNICAL", "EASY", co, "Dynamic Programming", List.of("Two Pointers","String","DP"))
        );
    }

    // ═══════════════ DYNAMIC PROGRAMMING (MEDIUM) — COMPREHENSIVE ═══════════════
    private List<Question> dpMedium(String co) {
        return List.of(
            // 1D DP
            b("Coin Change", "Fewest coins to make amount. Unbounded knapsack variant.\nInput: coins=[1,5,11], amount=15 → 3", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","BFS")),
            b("Decode Ways", "Count ways to decode digit string (A=1..Z=26).", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String")),
            b("House Robber II", "Houses in a circle. Can't rob adjacent. Maximize profit.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Array")),
            b("Jump Game", "Array of max jump lengths. Can you reach the last index?", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Greedy")),
            b("Jump Game II", "Minimum number of jumps to reach end.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Greedy")),
            b("Maximum Product Subarray", "Find contiguous subarray with largest product. Handle negatives.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Array")),
            b("Word Break", "Can string be segmented into dictionary words?", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Hash Table","String")),
            b("Perfect Squares", "Minimum perfect squares summing to n.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","BFS","Math")),
            b("Ugly Number II", "Find nth ugly number (prime factors only 2,3,5).", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Math","Heap")),
            // 2D DP
            b("Unique Paths", "Count paths in m×n grid from top-left to bottom-right (only right/down).", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Math","Combinatorics")),
            b("Unique Paths II (With Obstacles)", "Count paths avoiding obstacles in grid.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Matrix")),
            b("Minimum Path Sum", "Find path from top-left to bottom-right minimizing sum.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Matrix")),
            b("Longest Common Subsequence (LCS)", "Find length of LCS of two strings.\nInput: 'abcde','ace' → 3", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String")),
            b("Longest Increasing Subsequence (LIS)", "Find length of LIS. Optimize to O(n log n) with patience sorting.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Binary Search")),
            b("Edit Distance", "Min operations (insert/delete/replace) to convert word1 to word2.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String")),
            // Knapsack variants
            b("0/1 Knapsack Problem", "Given weights/values and capacity W, maximize total value. Classic DP.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Knapsack")),
            b("Partition Equal Subset Sum", "Can array be partitioned into two equal-sum subsets? (Subset sum variant)", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Knapsack","Array")),
            b("Target Sum", "Assign +/- to each number to reach target. Count ways.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Knapsack","Backtracking")),
            b("Coin Change II (Count Ways)", "Count number of combinations to make amount.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Knapsack")),
            // Stock DP
            b("Best Time to Buy and Sell Stock II", "Multiple transactions allowed. Maximize profit.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Greedy","Array")),
            b("Best Time to Buy and Sell Stock with Cooldown", "Must cooldown one day after selling.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","State Machine")),
            b("Best Time to Buy and Sell Stock with Transaction Fee", "Each transaction has a fee. Maximize net profit.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Greedy")),
            // Interval/String DP
            b("Palindromic Substrings", "Count total palindromic substrings in string.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String","Two Pointers")),
            b("Longest Palindromic Subsequence", "Find length of longest palindromic subsequence.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String")),
            b("Interleaving String", "Check if s3 is interleaving of s1 and s2.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String")),
            // Tree DP
            b("House Robber III (Tree)", "Rob binary tree nodes (can't rob parent+child). Maximize.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Tree","DFS")),
            // Grid DP
            b("Maximal Square", "Find largest square containing only 1s in binary matrix.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Matrix")),
            b("Count Square Submatrices", "Count square submatrices with all ones.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Matrix")),
            // Subsequence DP
            b("Number of Longest Increasing Subsequences", "Count the number of LIS (not just length).", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","Binary Search")),
            b("Distinct Subsequences", "Count distinct subsequences of s that equal t.", "TECHNICAL", "MEDIUM", co, "Dynamic Programming", List.of("DP","String"))
        );
    }

    // ═══════════════ DYNAMIC PROGRAMMING (HARD) ═══════════════
    private List<Question> dpHard(String co) {
        return List.of(
            b("Word Break II", "Return all possible sentences from dictionary segmentation.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Backtracking","Memoization")),
            b("Burst Balloons", "Maximize coins by bursting balloons in optimal order. Interval DP.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Interval DP")),
            b("Palindrome Partitioning II", "Minimum cuts to partition string into palindromes.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","String")),
            b("Best Time to Buy and Sell Stock III", "At most 2 transactions. Maximize profit.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","State Machine")),
            b("Best Time to Buy and Sell Stock IV", "At most k transactions. Generalized stock DP.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","State Machine")),
            b("Matrix Chain Multiplication", "Find most efficient way to multiply chain of matrices.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Interval DP","Math")),
            b("Wildcard Matching", "Pattern matching with '?' and '*' support.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","String","Greedy")),
            b("Longest Increasing Path in a Matrix", "Find longest increasing path in matrix. DFS + memoization.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","DFS","Matrix","Topological Sort")),
            b("Egg Drop Problem", "Given k eggs and n floors, find minimum trials in worst case.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Binary Search","Math")),
            b("Minimum Cost to Cut a Stick", "Interval DP: minimize total cost of cuts.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Interval DP","Sorting")),
            b("Cherry Pickup", "Collect max cherries going from (0,0) to (n-1,n-1) and back.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","Matrix")),
            b("Minimum Insertion Steps to Make Palindrome", "Min insertions to make string a palindrome.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","String")),
            b("Shortest Common Supersequence", "Find shortest string having both s1 and s2 as subsequences.", "TECHNICAL", "HARD", co, "Dynamic Programming", List.of("DP","String","LCS"))
        );
    }

    // ═══════════════ GRAPHS ═══════════════
    private List<Question> graphsMedium(String co) {
        return List.of(
            b("Number of Islands", "Count islands in binary grid using BFS/DFS.", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","BFS","DFS")),
            b("Course Schedule", "Detect cycles in directed graph (topological sort).", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","Topological Sort")),
            b("Course Schedule II", "Return ordering of courses (topological sort result).", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","Topological Sort","BFS")),
            b("Clone Graph", "Deep copy connected undirected graph.", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","BFS","DFS")),
            b("Pacific Atlantic Water Flow", "Find cells that can flow to both Pacific and Atlantic.", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","DFS","BFS")),
            b("Rotting Oranges", "Multi-source BFS: minimum minutes to rot all oranges.", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","BFS")),
            b("Surrounded Regions", "Capture all regions surrounded by 'X'.", "TECHNICAL", "MEDIUM", co, "Graphs", List.of("Graph","DFS","BFS"))
        );
    }
    private List<Question> graphsHard(String co) {
        return List.of(
            b("Word Ladder", "Shortest transformation sequence from begin to end word.", "TECHNICAL", "HARD", co, "Graphs", List.of("BFS","Graph")),
            b("Alien Dictionary", "Derive character order from sorted alien dictionary.", "TECHNICAL", "HARD", co, "Graphs", List.of("Graph","Topological Sort")),
            b("Cheapest Flights Within K Stops", "Find cheapest price with at most k stops. Bellman-Ford/BFS.", "TECHNICAL", "HARD", co, "Graphs", List.of("Graph","Shortest Path","DP")),
            b("Network Delay Time", "Dijkstra's algorithm: time for signal to reach all nodes.", "TECHNICAL", "HARD", co, "Graphs", List.of("Graph","Dijkstra","Heap"))
        );
    }

    // ═══════════════ BINARY SEARCH ═══════════════
    private List<Question> binarySearchMedium(String co) {
        return List.of(
            b("Search in Rotated Sorted Array", "Find target in rotated sorted array in O(log n).", "TECHNICAL", "MEDIUM", co, "Binary Search", List.of("Binary Search","Array")),
            b("Find Minimum in Rotated Sorted Array", "Find min element in rotated sorted array.", "TECHNICAL", "MEDIUM", co, "Binary Search", List.of("Binary Search","Array")),
            b("Search a 2D Matrix", "Search value in row-sorted, column-sorted matrix.", "TECHNICAL", "MEDIUM", co, "Binary Search", List.of("Binary Search","Matrix")),
            b("Koko Eating Bananas", "Minimum eating speed k to finish all piles in h hours.", "TECHNICAL", "MEDIUM", co, "Binary Search", List.of("Binary Search","Greedy")),
            b("Find Peak Element", "Find any peak element in O(log n).", "TECHNICAL", "MEDIUM", co, "Binary Search", List.of("Binary Search","Array"))
        );
    }

    // ═══════════════ BACKTRACKING ═══════════════
    private List<Question> backtrackingMedium(String co) {
        return List.of(
            b("Subsets", "Return all possible subsets (power set).", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Bit Manipulation")),
            b("Permutations", "Return all permutations of distinct integers.", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Recursion")),
            b("Combination Sum", "Find combinations summing to target (unlimited reuse).", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Array")),
            b("Combination Sum II", "Find combinations summing to target (each number used once).", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Array")),
            b("Word Search", "Find word in grid using adjacent cells.", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Matrix","DFS")),
            b("Palindrome Partitioning", "Partition string into all possible palindrome substrings.", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","DP","String")),
            b("Letter Combinations of a Phone Number", "Return all letter combinations for digit string.", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","String")),
            b("Generate Parentheses", "Generate all valid combinations of n pairs of parentheses.", "TECHNICAL", "MEDIUM", co, "Backtracking", List.of("Backtracking","Recursion","String"))
        );
    }

    // ═══════════════ HEAP ═══════════════
    private List<Question> heapMedium(String co) {
        return List.of(
            b("Kth Largest Element in an Array", "Find kth largest using heap or quickselect.", "TECHNICAL", "MEDIUM", co, "Heap", List.of("Heap","Sorting","Divide and Conquer")),
            b("Top K Frequent Elements", "Return k most frequent elements.", "TECHNICAL", "MEDIUM", co, "Heap", List.of("Heap","Hash Table","Bucket Sort")),
            b("Find Median from Data Stream", "Design class to find running median. Use two heaps.", "TECHNICAL", "MEDIUM", co, "Heap", List.of("Heap","Design","Sorting")),
            b("Task Scheduler", "Schedule tasks with cooldown. Minimum intervals needed.", "TECHNICAL", "MEDIUM", co, "Heap", List.of("Heap","Greedy","Queue"))
        );
    }

    // ═══════════════ TRIE ═══════════════
    private List<Question> trieMedium(String co) {
        return List.of(
            b("Implement Trie (Prefix Tree)", "Implement insert, search, startsWith.", "TECHNICAL", "MEDIUM", co, "Trie", List.of("Trie","Design","String")),
            b("Design Add and Search Words", "Support '.' wildcard in search using Trie + DFS.", "TECHNICAL", "MEDIUM", co, "Trie", List.of("Trie","DFS","Design"))
        );
    }

    // ═══════════════ MATRIX ═══════════════
    private List<Question> matrixMedium(String co) {
        return List.of(
            b("Word Search", "Search word in letter grid using backtracking.", "TECHNICAL", "MEDIUM", co, "Matrix", List.of("Backtracking","Matrix","DFS")),
            b("Game of Life", "Apply rules simultaneously to update cell states.", "TECHNICAL", "MEDIUM", co, "Matrix", List.of("Matrix","Simulation"))
        );
    }

    // ═══════════════ GREEDY ═══════════════
    private List<Question> greedyMedium(String co) {
        return List.of(
            b("Gas Station", "Find starting gas station for circular route.", "TECHNICAL", "MEDIUM", co, "Greedy", List.of("Greedy","Array")),
            b("Partition Labels", "Partition string so each letter appears in at most one part.", "TECHNICAL", "MEDIUM", co, "Greedy", List.of("Greedy","String","Two Pointers")),
            b("Hand of Straights", "Rearrange into groups of consecutive cards of size W.", "TECHNICAL", "MEDIUM", co, "Greedy", List.of("Greedy","Hash Table","Sorting"))
        );
    }

    // ═══════════════ UNION FIND ═══════════════
    private List<Question> unionFindMedium(String co) {
        return List.of(
            b("Number of Connected Components", "Count connected components in undirected graph using Union-Find.", "TECHNICAL", "MEDIUM", co, "Union Find", List.of("Union Find","Graph")),
            b("Redundant Connection", "Find edge to remove to make tree (cycle detection with Union-Find).", "TECHNICAL", "MEDIUM", co, "Union Find", List.of("Union Find","Graph")),
            b("Accounts Merge", "Merge accounts by common emails using Union-Find.", "TECHNICAL", "MEDIUM", co, "Union Find", List.of("Union Find","DFS","Hash Table"))
        );
    }

    // ═══════════════ ADVANCED HARD ═══════════════
    private List<Question> advancedHard(String co) {
        return List.of(
            b("Merge K Sorted Lists", "Merge k sorted lists using min-heap.", "TECHNICAL", "HARD", co, "Heap", List.of("Linked List","Heap","Divide and Conquer")),
            b("N-Queens", "Place n queens on board with no conflicts.", "TECHNICAL", "HARD", co, "Backtracking", List.of("Backtracking","Recursion")),
            b("Sudoku Solver", "Solve 9×9 Sudoku using backtracking.", "TECHNICAL", "HARD", co, "Backtracking", List.of("Backtracking","Matrix")),
            b("LFU Cache", "Design Least Frequently Used cache in O(1).", "TECHNICAL", "HARD", co, "Design", List.of("Design","Hash Table","Linked List")),
            b("Reverse Nodes in k-Group", "Reverse linked list nodes in groups of k.", "TECHNICAL", "HARD", co, "Linked List", List.of("Linked List","Recursion"))
        );
    }

    // ═══════════════ SYSTEM DESIGN ═══════════════
    private List<Question> getSystemDesignQuestions(String co, String diff) {
        List<Question> q = new ArrayList<>();
        if ("EASY".equals(diff)) {
            q.add(b("Design a URL Shortener", "Design TinyURL with hashing, base62 encoding, and read-heavy optimization.", "SYSTEM_DESIGN", "EASY", co, "System Design", List.of("System Design","Hashing")));
            q.add(b("Design a Rate Limiter", "Compare token bucket, leaky bucket, fixed window, sliding window.", "SYSTEM_DESIGN", "EASY", co, "System Design", List.of("System Design","Rate Limiting")));
            q.add(b("Design Pastebin", "Paste text and get shareable short URL.", "SYSTEM_DESIGN", "EASY", co, "System Design", List.of("System Design","Storage")));
            q.add(b("Design a Parking Lot", "OOP design for multi-floor parking with vehicle types.", "SYSTEM_DESIGN", "EASY", co, "OOD", List.of("OOD","Design")));
            q.add(b("Design a Key-Value Store", "Simple distributed KV store with partitioning and replication.", "SYSTEM_DESIGN", "EASY", co, "System Design", List.of("System Design","Storage")));
        } else if ("MEDIUM".equals(diff)) {
            q.add(b("Design Instagram", "Photo-sharing: feed generation, storage, CDN, follower graph.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","CDN")));
            q.add(b("Design a Chat System", "WhatsApp/Slack: WebSockets, message queues, delivery guarantees.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","WebSockets")));
            q.add(b("Design a Notification Service", "Push/email/SMS at scale with delivery tracking.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Message Queue")));
            q.add(b("Design Twitter", "Tweet, follow, timeline with fan-out strategies.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Fan-out")));
            q.add(b("Design an E-Commerce Platform", "Product catalog, cart, checkout, payment, inventory.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Microservices")));
            q.add(b("Design Google Drive", "File chunking, sync, deduplication, versioning.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Storage")));
            q.add(b("Design a Food Delivery System", "Restaurant listing, orders, rider assignment, tracking.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Location")));
            q.add(b("Design a Ride-Sharing Service", "Rider-driver matching, surge pricing, ETA, GPS.", "SYSTEM_DESIGN", "MEDIUM", co, "System Design", List.of("System Design","Geospatial")));
        } else {
            q.add(b("Design Google Search", "Crawling, indexing, PageRank, query processing.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Search")));
            q.add(b("Design YouTube", "Upload, transcoding, CDN, adaptive bitrate, recommendations.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Streaming")));
            q.add(b("Design a Distributed Cache", "Consistent hashing, replication, eviction policies.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Caching")));
            q.add(b("Design Google Maps", "Dijkstra/A*, tile rendering, real-time traffic.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Geospatial")));
            q.add(b("Design a Payment System", "Idempotency, double-spend prevention, ledger, reconciliation.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Fintech")));
            q.add(b("Design a Stock Trading Platform", "Order matching, real-time feeds, portfolio tracking.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Fintech")));
            q.add(b("Design a Distributed Message Queue", "Partitioning, consumer groups, exactly-once delivery.", "SYSTEM_DESIGN", "HARD", co, "System Design", List.of("System Design","Messaging")));
        }
        return q;
    }

    // ═══════════════ HR / BEHAVIORAL ═══════════════
    private List<Question> getHRQuestions(String co, String diff) {
        List<Question> q = new ArrayList<>();
        if ("EASY".equals(diff)) {
            q.add(b("Tell Me About Yourself", "Walk through background, skills, and motivation.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Introduction")));
            q.add(b("Why Do You Want to Work Here?", "Show research and genuine enthusiasm.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Motivation")));
            q.add(b("What Are Your Strengths?", "Top 2-3 strengths with concrete examples.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Self-Awareness")));
            q.add(b("What Are Your Weaknesses?", "Genuine weakness + steps to improve.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Self-Awareness")));
            q.add(b("Where Do You See Yourself in 5 Years?", "Career aspirations and role alignment.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Career Growth")));
            q.add(b("Why Should We Hire You?", "Unique value proposition summary.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Value Proposition")));
            q.add(b("Tell Me About Your Projects", "Significant project: tech stack, contribution, outcome.", "HR", "EASY", co, "Behavioral", List.of("Behavioral","Projects")));
        } else if ("MEDIUM".equals(diff)) {
            q.add(b("Tell Me About a Time You Failed", "Failure + learning using STAR method.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Self-Awareness")));
            q.add(b("Describe a Conflict With a Teammate", "Disagreement + resolution.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Conflict Resolution")));
            q.add(b("A Time You Showed Leadership", "Leading without formal authority.", "HR", "MEDIUM", co, "Leadership", List.of("Behavioral","Leadership")));
            q.add(b("How Do You Handle Tight Deadlines?", "Quality delivery under time pressure.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Time Management")));
            q.add(b("A Time You Went Above and Beyond", "Exceeding expectations.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Initiative")));
            q.add(b("How Do You Prioritize Tasks?", "Handling competing priorities.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Prioritization")));
            q.add(b("Tell Me About Receiving Criticism", "Acting on constructive feedback.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Feedback")));
            q.add(b("Learning Something Quickly", "Picking up new technology under pressure.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Adaptability")));
            q.add(b("Disagreeing With Your Manager", "Professional disagreement navigation.", "HR", "MEDIUM", co, "Behavioral", List.of("Behavioral","Communication")));
        } else {
            q.add(b("Hardest Technical Decision", "Toughest trade-off and reasoning.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Decision Making")));
            q.add(b("Handling Ambiguity at Scale", "Progress with incomplete requirements.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Ambiguity")));
            q.add(b("Convince Me to Use Your Approach", "Persuading a disagreeing team.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Influence")));
            q.add(b("Cross-Team Collaboration", "Coordinating across multiple teams.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Collaboration")));
            q.add(b("Ethical Dilemma in Engineering", "Balancing business vs engineering ethics.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Ethics")));
            q.add(b("Mentoring a Struggling Member", "Helping an underperforming teammate.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Mentoring")));
            q.add(b("Delivering Bad News", "Communicating delays/failures to leadership.", "HR", "HARD", co, "Leadership", List.of("Behavioral","Communication")));
        }
        return q;
    }

    // ═══════════════ DOMAIN 1: JAVA & SPRING BOOT ═══════════════
    private List<Question> javaSpringBootQuestions(String co, String diff) {
        List<Question> list = new ArrayList<>();
        if ("EASY".equals(diff)) {
            list.add(b("JVM Memory Model: Heap vs Stack", "Explain the difference between Heap and Stack memory in the JVM. How are primitive variables and object references stored?", "TECHNICAL", "EASY", co, "Java", List.of("Java", "JVM", "Memory")));
            list.add(b("Java OOP: Abstract Class vs Interface", "Explain when to choose an abstract class over an interface in Java 17+. How do default and static methods impact design?", "TECHNICAL", "EASY", co, "Java", List.of("Java", "OOP", "Architecture")));
            list.add(b("Spring IoC & Bean Scopes", "Explain Spring Inversion of Control (IoC) and Dependency Injection. Compare Singleton, Prototype, Request, and Session scopes.", "TECHNICAL", "EASY", co, "Spring Boot", List.of("Java", "Spring Boot", "IoC")));
        } else if ("MEDIUM".equals(diff)) {
            list.add(b("ConcurrentHashMap Internal Architecture", "How does ConcurrentHashMap achieve lock-free reads and segmented/CAS writes without locking the entire map? Compare with SynchronizedMap.", "TECHNICAL", "MEDIUM", co, "Java", List.of("Java", "Concurrency", "Collections")));
            list.add(b("Spring @Transactional & AOP Proxies", "Explain how Spring creates dynamic AOP proxies for @Transactional. Why does self-invocation within the same class bypass transaction management?", "TECHNICAL", "MEDIUM", co, "Spring Boot", List.of("Java", "Spring Boot", "Transactions")));
            list.add(b("JPA / Hibernate N+1 Query Problem", "Explain the N+1 SELECT query problem in Hibernate. How do JOIN FETCH, Entity Graphs, and BatchSize resolve it? Compare L1 and L2 caches.", "TECHNICAL", "MEDIUM", co, "Spring Boot", List.of("Java", "Hibernate", "JPA")));
        } else {
            list.add(b("JVM Garbage Collection: G1 vs ZGC", "Deep-dive into G1 and ZGC garbage collectors. How does ZGC achieve sub-millisecond pauses with colored pointers and load barriers? How do you diagnose STW spikes?", "TECHNICAL", "HARD", co, "Java", List.of("Java", "JVM", "Performance")));
            list.add(b("Microservices Resilience with Circuit Breaker", "Design a resilient microservice communication layer using Resilience4j circuit breaker, retry with jitter, bulkhead isolation, and fallback queues.", "TECHNICAL", "HARD", co, "Spring Boot", List.of("Java", "Spring Boot", "Microservices")));
        }
        return list;
    }

    // ═══════════════ DOMAIN 2: REACT & FRONTEND ═══════════════
    private List<Question> reactFrontendQuestions(String co, String diff) {
        List<Question> list = new ArrayList<>();
        if ("EASY".equals(diff)) {
            list.add(b("React Hooks: useState vs useRef", "Explain the operational difference between useState and useRef in React. When does an update trigger a re-render versus mutating a ref?", "TECHNICAL", "EASY", co, "React", List.of("React", "Frontend", "JavaScript")));
            list.add(b("CSS Box Model & Flexbox vs Grid", "Explain the CSS Box Model (content, padding, border, margin). When should you choose CSS Grid over Flexbox?", "TECHNICAL", "EASY", co, "Frontend", List.of("CSS", "Frontend", "Web")));
        } else if ("MEDIUM".equals(diff)) {
            list.add(b("React Virtual DOM & Fiber Reconciliation", "Explain how React's Virtual DOM and the Fiber reconciliation algorithm work. How does React diff trees in O(n) and why are keys mandatory?", "TECHNICAL", "MEDIUM", co, "React", List.of("React", "Performance", "Virtual DOM")));
            list.add(b("React useEffect Stale Closures & Memory Leaks", "Explain how stale closures happen in useEffect or useCallback hooks. How do you properly handle dependency arrays and cleanup functions to avoid memory leaks?", "TECHNICAL", "MEDIUM", co, "React", List.of("React", "JavaScript", "Hooks")));
            list.add(b("State Management: Zustand vs Redux vs Context", "Compare Context API, Zustand, and Redux Toolkit. Why does Context cause widespread re-renders and how do atomic selectors in Zustand fix this?", "TECHNICAL", "MEDIUM", co, "React", List.of("React", "State Management", "Architecture")));
        } else {
            list.add(b("Web Performance: Core Web Vitals Optimization", "How do you systematically optimize a React application to achieve top Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)? Cover code splitting, SSR, and bundle analysis.", "TECHNICAL", "HARD", co, "Frontend", List.of("React", "Performance", "Web Vitals")));
            list.add(b("React Server Components (RSC) Architecture", "Explain the architecture of React Server Components (RSC) vs traditional Client-side rendering and SSR. How do Server Components reduce client bundle size?", "TECHNICAL", "HARD", co, "React", List.of("React", "RSC", "Architecture")));
        }
        return list;
    }

    // ═══════════════ DOMAIN 3: DATABASE & SQL ═══════════════
    private List<Question> databaseSqlQuestions(String co, String diff) {
        List<Question> list = new ArrayList<>();
        if ("EASY".equals(diff)) {
            list.add(b("SQL: Clustered vs Non-Clustered Indexes", "Explain the fundamental difference between a Clustered and Non-Clustered index. Why can a table have only one clustered index?", "TECHNICAL", "EASY", co, "Database", List.of("SQL", "Database", "Indexing")));
            list.add(b("SQL Joins & Normalization (1NF to 3NF)", "Explain INNER, LEFT, and FULL OUTER joins. Define 1NF, 2NF, and 3NF, and explain why a production database might be intentionally denormalized.", "TECHNICAL", "EASY", co, "Database", List.of("SQL", "Database", "Normalization")));
        } else if ("MEDIUM".equals(diff)) {
            list.add(b("Database Isolation Levels & Anomalies", "Explain the ANSI SQL isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies each prevents (Dirty Reads, Non-repeatable Reads, Phantoms).", "TECHNICAL", "MEDIUM", co, "Database", List.of("Database", "ACID", "Concurrency")));
            list.add(b("SQL Query Optimization with EXPLAIN ANALYZE", "How do you diagnose and optimize a slow query in PostgreSQL/MySQL using EXPLAIN ANALYZE? Discuss sequential scans, index scans, and composite index column order.", "TECHNICAL", "MEDIUM", co, "Database", List.of("SQL", "Optimization", "Database")));
            list.add(b("NoSQL vs SQL: MongoDB vs PostgreSQL", "Compare relational databases (PostgreSQL) and document datastores (MongoDB). How do you choose between ACID relations and document embedding at high write scale?", "TECHNICAL", "MEDIUM", co, "Database", List.of("Database", "MongoDB", "NoSQL")));
        } else {
            list.add(b("Database Storage Engines: B-Tree vs LSM-Tree", "Deep dive into the storage engine differences between B-Trees (InnoDB) and Log-Structured Merge Trees (Cassandra, RocksDB). Compare write amplification, read latency, and compaction.", "TECHNICAL", "HARD", co, "Database", List.of("Database", "Storage Engines", "Internals")));
            list.add(b("Distributed Database Sharding & Cross-Shard Joins", "Design a sharding strategy for a multi-tenant relational database with 100M+ rows. Compare hash-based, range-based, and directory-based sharding and explain cross-shard queries.", "TECHNICAL", "HARD", co, "Database", List.of("Database", "Distributed Systems", "Sharding")));
        }
        return list;
    }

    // ═══════════════ DOMAIN 4: DEVOPS & CLOUD ═══════════════
    private List<Question> devOpsCloudQuestions(String co, String diff) {
        List<Question> list = new ArrayList<>();
        if ("EASY".equals(diff)) {
            list.add(b("Docker Multi-Stage Builds & Image Optimization", "Why are Docker multi-stage builds important for production containerization? How do they reduce image size and shrink security attack surfaces?", "TECHNICAL", "EASY", co, "DevOps", List.of("Docker", "DevOps", "Containers")));
            list.add(b("CI/CD Pipeline Core Stages", "What are the essential stages of a production CI/CD pipeline? How do automated linting, unit testing, containerization, and staging promotion fit together?", "TECHNICAL", "EASY", co, "DevOps", List.of("CI/CD", "DevOps", "Automation")));
        } else if ("MEDIUM".equals(diff)) {
            list.add(b("Kubernetes Architecture & Pod Lifecycle", "Explain the control plane components of Kubernetes (kube-apiserver, etcd, kube-scheduler) and worker nodes. How do liveness, readiness, and startup probes work?", "TECHNICAL", "MEDIUM", co, "DevOps", List.of("Kubernetes", "DevOps", "Cloud")));
            list.add(b("Zero-Downtime Deployments: Blue-Green vs Canary", "Compare Blue-Green and Canary deployments with Rolling Updates. How do you implement automated rollbacks based on latency and error rate metrics?", "TECHNICAL", "MEDIUM", co, "DevOps", List.of("DevOps", "Deployment", "Kubernetes")));
        } else {
            list.add(b("Distributed Observability: OpenTelemetry & Tracing", "Design an end-to-end distributed observability pipeline across 50+ microservices using OpenTelemetry, Prometheus, Jaeger, and Grafana. Address context propagation and tail-based sampling.", "TECHNICAL", "HARD", co, "DevOps", List.of("DevOps", "Observability", "Microservices")));
        }
        return list;
    }

    // ═══════════════ DOMAIN 5: PYTHON & AI / ML ═══════════════
    private List<Question> aiMlPythonQuestions(String co, String diff) {
        List<Question> list = new ArrayList<>();
        if ("EASY".equals(diff)) {
            list.add(b("Python GIL & Concurrency", "Explain what the Global Interpreter Lock (GIL) is in CPython. How does it affect CPU-bound multithreaded programs and when should you use multiprocessing or asyncio?", "TECHNICAL", "EASY", co, "Python & AI", List.of("Python", "Concurrency", "Internals")));
            list.add(b("Supervised vs Unsupervised Learning & Metrics", "Differentiate supervised, unsupervised, and reinforcement learning. Explain precision, recall, F1-score, and why accuracy is misleading on imbalanced datasets.", "TECHNICAL", "EASY", co, "Python & AI", List.of("AI/ML", "Data Science", "Metrics")));
        } else if ("MEDIUM".equals(diff)) {
            list.add(b("RAG (Retrieval-Augmented Generation) Architecture", "Design a production RAG pipeline for querying enterprise documentation using an LLM. Detail document chunking, embedding generation, vector similarity search, and prompt augmentation.", "TECHNICAL", "MEDIUM", co, "Python & AI", List.of("AI/ML", "LLM", "RAG")));
            list.add(b("Vector Databases & HNSW Similarity Search", "How do vector databases perform approximate nearest neighbor (ANN) search across high-dimensional embeddings using the HNSW graph algorithm?", "TECHNICAL", "MEDIUM", co, "Python & AI", List.of("AI/ML", "Vector DB", "Embeddings")));
        } else {
            list.add(b("LLM Fine-Tuning: LoRA & QLoRA", "Explain parameter-efficient fine-tuning (PEFT) using LoRA and 4-bit Quantized LoRA (QLoRA). How do rank decomposition matrices enable fine-tuning 70B parameter models on commodity GPUs?", "TECHNICAL", "HARD", co, "Python & AI", List.of("AI/ML", "LLM", "Deep Learning")));
        }
        return list;
    }

    // ═══════════════ DYNAMIC AI QUESTION GENERATION (LIVE LLM) ═══════════════
    public List<Question> generateAiQuestions(AiQuestionGenerateRequest request) {
        String role = (request.getRole() != null && !request.getRole().isBlank()) ? request.getRole().trim() : "Software Engineer";
        String company = (request.getCompany() != null && !request.getCompany().isBlank()) ? request.getCompany().trim() : "General";
        String topic = (request.getTopic() != null && !request.getTopic().isBlank()) ? request.getTopic().trim() : "Software Engineering";
        String diff = (request.getDifficulty() != null && !request.getDifficulty().isBlank()) ? request.getDifficulty().trim().toUpperCase() : "MEDIUM";
        String type = (request.getType() != null && !request.getType().isBlank()) ? request.getType().trim().toUpperCase() : "TECHNICAL";
        int count = request.getCount() != null && request.getCount() > 0 ? Math.min(request.getCount(), 5) : 3;

        List<Question> generated = new ArrayList<>();

        // 1. Attempt Live LLM generation via Gemini / OpenAI
        try {
            String prompt = String.format(
                "You are an expert hiring manager and technical interviewer at %s. " +
                "Generate exactly %d unique, highly realistic, and technically rigorous interview questions for a %s candidate. " +
                "The questions must focus on '%s' with difficulty '%s' in category '%s'. %s\n" +
                "CRITICAL: You MUST generate completely new and unique questions every time. DO NOT return standard or generic examples. Be highly creative. (Randomization seed: %s)\n\n" +
                "Return STRICTLY a valid JSON array of objects without markdown formatting or backticks. Follow this exact JSON schema:\n" +
                "[\n" +
                "  {\n" +
                "    \"title\": \"Clear and concise question title\",\n" +
                "    \"content\": \"Comprehensive question problem statement, architectural context, requirements, constraints, and evaluation criteria\",\n" +
                "    \"type\": \"%s\",\n" +
                "    \"difficulty\": \"%s\",\n" +
                "    \"targetCompany\": \"%s\",\n" +
                "    \"topic\": \"%s\",\n" +
                "    \"tags\": [\"%s\", \"%s\", \"AI Generated\"]\n" +
                "  }\n" +
                "]",
                company, count, role, topic, diff, type,
                (request.getCustomPrompt() != null && !request.getCustomPrompt().isBlank()) ? "Additional focus/JD details: " + request.getCustomPrompt().trim() : "",
                java.util.UUID.randomUUID().toString(),
                type, diff, company, topic, topic, role
            );

            String aiResponse = llmService.generate(prompt);
            if (aiResponse != null && !aiResponse.isBlank()) {
                String cleanJson = aiResponse.trim();
                if (cleanJson.startsWith("```json")) {
                    cleanJson = cleanJson.substring(7);
                } else if (cleanJson.startsWith("```")) {
                    cleanJson = cleanJson.substring(3);
                }
                if (cleanJson.endsWith("```")) {
                    cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
                }
                cleanJson = cleanJson.trim();

                JsonNode arrayNode = objectMapper.readTree(cleanJson);
                if (arrayNode.isArray()) {
                    for (JsonNode node : arrayNode) {
                        String title = node.path("title").asText("Interview Question");
                        String content = node.path("content").asText("");
                        
                        List<String> tags = new ArrayList<>();
                        if (node.has("tags") && node.path("tags").isArray()) {
                            for (JsonNode t : node.path("tags")) tags.add(t.asText());
                        }
                        if (tags.isEmpty()) tags = List.of(topic, role, "AI Generated");

                        Question q = Question.builder()
                                .title(title.contains(company) ? title : title + " (" + company + ")")
                                .content(content)
                                .type(type)
                                .difficulty(diff)
                                .targetCompany(company)
                                .topic(topic)
                                .aiGenerated(true)
                                .tags(tags)
                                .build();

                        if (!questionRepository.existsByTitle(q.getTitle())) {
                            generated.add(questionRepository.save(q));
                        }
                    }
                    if (!generated.isEmpty()) {
                        log.info("Successfully generated and saved {} live LLM questions from AI API!", generated.size());
                        return generated;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Live LLM generation encountered an issue, using intelligent fallback: {}", e.getMessage());
        }

        // 2. Intelligent fallback generator if API key is not configured or network issue occurs
        for (int i = 1; i <= count; i++) {
            String title = String.format("%s %s Scenario #%d", topic, role, (int)(Math.random() * 900 + 100));
            String promptDetails = (request.getCustomPrompt() != null && !request.getCustomPrompt().isBlank())
                    ? "\n\nContext / Requirements: " + request.getCustomPrompt().trim()
                    : "";

            String content = String.format(
                "You are interviewing for a %s position at %s.\n\n" +
                "Problem Scenario [%s - %s]:\n" +
                "Demonstrate your in-depth expertise in %s. Walk through your architectural considerations, key design trade-offs, potential edge cases, and implementation strategy.%s\n\n" +
                "Key Evaluation Criteria:\n" +
                "1. Correctness and depth of technical reasoning.\n" +
                "2. Clear explanation of scalability, performance, and failure modes.\n" +
                "3. Industry best practices and real-world trade-off analysis.",
                role, company, type, diff, topic, promptDetails
            );

            Question q = Question.builder()
                    .title(title + " (" + company + ")")
                    .content(content)
                    .type(type)
                    .difficulty(diff)
                    .targetCompany(company)
                    .topic(topic)
                    .aiGenerated(true)
                    .tags(List.of(topic, role, type, diff, "AI Generated"))
                    .build();

            if (!questionRepository.existsByTitle(q.getTitle())) {
                generated.add(questionRepository.save(q));
            }
        }

        log.info("Generated {} questions for role '{}' on topic '{}'", generated.size(), role, topic);
        return generated;
    }

    // ═══════════════ BUILDER ═══════════════
    private Question b(String title, String content, String type, String diff, String co, String topic, List<String> tags) {
        return Question.builder().title(title).content(content).type(type).difficulty(diff).targetCompany(co).topic(topic).aiGenerated(true).tags(tags).build();
    }
}
