// Starter code boilerplate templates matching LeetCode conventions

// Common problem signatures
const COMMON_TEMPLATES = {
  'two sum': {
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`
  },
  'valid palindrome': {
    java: `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}`,
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass`,
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        
    }
};`,
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    
};`
  },
  'valid parentheses': {
    java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`
  },
  'maximum subarray': {
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`,
    python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        
    }
};`,
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    
};`
  }
};

/**
 * Returns an idiomatic starter template for a given question and language.
 */
export const getStarterTemplate = (questionTitle = '', language = 'java') => {
  const normalizedTitle = questionTitle.toLowerCase().trim();

  // Check known titles
  for (const [key, templates] of Object.entries(COMMON_TEMPLATES)) {
    if (normalizedTitle.includes(key)) {
      return templates[language] || templates.java;
    }
  }

  // Derive function name from title (e.g. "Merge Two Sorted Lists" -> "mergeTwoLists")
  const words = normalizedTitle.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  let methodName = 'solve';
  if (words.length > 0) {
    methodName = words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }

  const genericTemplates = {
    java: `class Solution {
    public Object ${methodName}() {
        // Write your solution here
        
    }
}`,
    python: `class Solution:
    def ${methodName}(self):
        # Write your solution here
        pass`,
    cpp: `class Solution {
public:
    void ${methodName}() {
        // Write your solution here
        
    }
};`,
    javascript: `/**
 * LeetCode solution template
 */
var ${methodName} = function() {
    // Write your solution here
    
};`
  };

  return genericTemplates[language] || genericTemplates.java;
};

