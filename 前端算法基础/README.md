## 算法概念
算法（Algorithm）， 是指解决问题的思想与方案，最终是为了解决现实问题服务的。
## 数据结构 
Data Structure，指计算机中存储、组织数据的方式。 例如链表、二叉树、堆栈、红黑树等。
## 算法复杂度 
不同算法也有优劣之分，如消耗时间的长短、占用内存的大小，这也就是我们常说的算法复杂 度。算法复杂度分为时间复杂度和空间复杂度。 
#### 时间复杂度 
Time Complexity，又叫时间复杂性，用来描述该算法的运行时间。常用大O符号表述，如 O(1)、O(n)等。常见的时间复杂度量级有： 
* 常数时间O(1)
* 对数时间O(logN)
* 线性时间O(n)
* 线性对数（准线性）时间O(nlogN)
* 平方时间O(n²)
* 立方时间O(n³) 
如访问数组中的某个下标的元素，时间复杂度就是O(1)；查找乱序数组中的最小值，时间复杂 度就是O(n)，二分搜索的时间复杂度就是O(logN)。 
相同大小的不同输入值仍可能造成算法的运行时间不同，因此时间复杂度又有三种场景区分：最 优情况的时间复杂度、最差情况的时间复杂度以及平均情况时间复杂度。通常情况下，某个算法 的时间复杂度，我们说的都是平均情况时间复杂度。
#### 空间复杂度
Space Complexity，描述该算法或程序运行所需要的存储空间大小。和时间复杂度一样，也常 用大O符号表述，如O(1)、O(n)等。
## 冒泡排序
遍历整个数组，将数组的每一项与其后一项进行对比，如果不符合要求就交换位置，一共遍历 n 轮，n 为数组的长度。n 轮之后，数组得以完全排序。时间复杂度 O(n^2)。
```js
function bubbleSort(arr) {
  //console.time('BubbleSort');
  // 获取数组长度，以确定循环次数。
  let len = arr.length;
  // 遍历数组len次，以确保数组被完全排序。
  for (let i = 0; i < len; i++) {
    // 遍历数组的前len-i项，忽略后面的i项（已排序部分）。
    for (let j = 0; j < len - 1 - i; j++) {
      // 将每一项与后一项进行对比，不符合要求的就换位。
      if (arr[j] > arr[j + 1]) {
        //从小到大排序
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  //console.timeEnd('BubbleSort');
  return arr;
}
```
## 快速排序
在数组中选取一个参考点（pivot），然后对于数组中的每一项，大于 pivot 的项都放到数组右边，小于 pivot 的项都放到左边，左右两边的数组项可以构成两个新的数组（left 和 right），然后继续分别对 left 和 right 进行分解，直到数组长度为 1，最后合并（其实没有合并，因为是在原数组的基础上操作的，只是理论上的进行了数组分解）。
```js
//递归
function quickSort(arr) {
  // 当数组长度不大于1时，返回结果，防止callstack溢出。
  if (arr.length <= 1) return arr;
  return [
    // 递归调用quickSort，通过Array.prototype.filter方法过滤小于arr[0]的值，注意去掉了arr[0]以防止出现死循环。
    ...quickSort(arr.slice(1).filter((item) => item < arr[0])),
    arr[0],
    ...quickSort(arr.slice(1).filter((item) => item >= arr[0])),
  ];
}
//非递归
const quickSort1 = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }
  //取基准点
  const midIndex = Math.floor(arr.length / 2);
  //取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
  const valArr = arr.splice(midIndex, 1);
  const midIndexVal = valArr[0];
  const left = []; //存放比基准点小的数组
  const right = []; //存放比基准点大的数组
  //遍历数组，进行判断分配
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < midIndexVal) {
      left.push(arr[i]); //比基准点小的放在左边数组
    } else {
      right.push(arr[i]); //比基准点大的放在右边数组
    }
  }
  //递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
  return quickSort1(left).concat(midIndexVal, quickSort1(right));
};
const array2 = [5, 4, 3, 2, 1];
console.log("quickSort1 ", quickSort1(array2));
// quickSort1: [1, 2, 3, 4, 5]
```
## 二分
#### 二分查找
Binary Search，也称折半查找，它是一种效率较高的查找方法。但是，折半查找要求线性表必 须采用顺序存储结构，而且表中元素按关键字有序排列。
```js
/**
 * 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜 索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。
 * @param {number[]} nums
 * @param {number} target
 * @return {number} 
*/ 
var search = function(nums, target) { 
    let low = 0, high = nums.length-1;
    while(low<=high) { 
        const mid = (low + high)>>1;
        const num = nums[mid];
        if(num===target) { 
            return mid;
        } else if(num>target) {
            // 值在左边
            high = mid - 1;
        } else {
            // 值在右边
            low = mid + 1;
        } 
    }
    return -1;
};
```
#### 二分法插入排序
相关的还有二分法插入排序，简称二分排序，是在插入第i个元素时，对前面的0～i-1元素进行 折半，先跟他们中间的那个元素比，如果小，则对前半再进行折半，否则对后半进行折半，直到 left \< right，然后再把第i个元素前1位与目标位置之间的所有元素后移，再把第i个元素放在目标 位置上。 动态规划经常会用到二分思想来做优化。
```js
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数 组中，返回它将会被按顺序插入的位置。 请必须使用时间复杂度为 O(log n) 的算法。
var searchInsert = function(nums, target) {
    const n = nums.length;
    let left = 0, right = n - 1, ans = n;
    while (left <= right) {
        let mid = ((right - left) >> 1) + left;
        if (target <= nums[mid]) {
            ans = mid; right = mid - 1;
        } else {
            left = mid + 1;
        } 
    }
    return ans;
};
```
## 递推
递推是按照一定的规律来计算序列中的每个项，通常是通过计算前面的一些项来得出序列中的指 定项的值。其思想是把一个复杂的庞大的计算过程转化为简单过程的多次重复，该算法利用了计算机速度快和不知疲倦的机器特点。
#### 递推关系式
递推关系（Recurrence relation），在数学上也就是差分方程（Difference equation），是一种递推地定义一个序列的方程：序列的每一项目是定义为前若干项的函数。像斐波那契数即为递推关系：
```math
\chi _{n+2} = \chi _{n=1} + \chi _{n}
```
#### 与递归的区别
Recursion，指程序调用自身的编程技巧。有递推使用上有一定的交叉点。
```js
/**
 * 斐波那契数列
 * 写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的 定义如下： F(0) = 0, F(1) = 1 F(N) = F(N - 1) + F(N - 2), 其中 N > 1。斐波那契数列由 0 和 1 开始，之 后的斐波那契数就是由之前的两数相加而得出。 答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
 * @param {number} n 
 * @return {number}
*/
var fib = function(n) {
    const arr = [0, 1];
    for(let i=2; i<=n; i++) {
        arr[i] = arr[i-1] + arr[i-2];
        arr[i] %= (1e9+7);
    }
    return arr[n];
}
```
```js
/**
 * 爬楼梯
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * @param {number} n
 * @return {number} 
*/ 
var climbStairs = function(n) {
    if(n<=3) {
        return n;
    }
    // n>=4 
    //return climbStairs(n-1) + climbStairs(n-2)
    let a = [0, 1, 2, 3];
    for(let i=4; i<n; i++) {
        a[i] = a[i-1] + a[i-2];
    }
    return a[n-1] + a[n-2];
};
```
```c++
/**
 * 放苹果
 * 把M个同样的苹果放在N个同样的盘子里，允许有的盘子空着不放，问共有多少种不同的分法？ （用K表示）5，1，1和1，5，1 是同一种分法。 1<=M，N<=10。
*/
// 简版
#include <iostream>
using namespace std;
int recursion(int m, int n) {//m个苹果， n个盘子 [1,10]
    if(m<0) return 0;
    if(m==0 || n==1) return 1;
    // 1. 每个盘子放置一个苹果
    // 2. 1个盘子空着，也就是m个苹果放到n-1个盘子里
    return recursion(m-n, n) + recursion(m, n-1); 
}
int main() {
    int t;
    int m, n;
    cin>>t;//[0,20]
    while(t--) {
        cin>>m>>n;
        cout<<dp(m, n)<<endl;
    }
    return 0;
}
```
```c++
// 优化版
#include <iostream>
using namespace std;
int recursion(int m, int n) {//m个苹果， n个盘子 [1,10]
    if(m==1 || n==1) return 1;
    if(n>m) n = m;
    //1个和2个盘子的方法
    int k = 1 + (m>>1);
    // i个盘子，逐个递加
    for(int i=3; i<=n; i++) {
        if(m==i) k++;
        else k += recursion(m-n, i);
    }
    return k;
}
int main() {
    int t;
    int m, n;
    cin>>t;//[0,20]
    while(t--) {
        cin>>m>>n;
        cout<<recursion(m, n)<<endl;
    }
    return 0;
}
```
#### 递推套路总结 
遇到大数据量的题，不知道从哪里下手，通常离不开递归与递推公式。 
原则：大事化小小事化了
1. 找隐藏条件，理解题意。 
2. 找极值，比如0或者1的情况下结果是多少。 
3. 拆解找规律，写公式，（缩小数据范围）。
f(m,n) = f(m-n, n) + f(m, n-1) 
1. 所有盘子放满了，f(m-n, n) 
2. 有1个盘子空着，f(m, n-1)
## 动态规划
Dynamic Programming，简称DP，是一种在数学、管理科学、计算机科学、经济学和生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。通常会有暴力解决以及优化解决方案，二者用时差别较大。
#### 与递推、递归
动态规划，通常离不开递推公式、递归。
#### 与数学
求值单个数值的dp题，通常会有数学公式求解法，当然这个需要较高的数学功底，这个通常在竞赛中常见，但是面试一般不做要求，面试中更多考察dp的优化版解法。
#### 动态规划解题套路
1. 大事化小：其实就是把大问题拆解成小问题，多会用到递归。其实就是求状态转移方程。
2. 小事化了：设置边界条件或者求初始值，如n=0时，答案值？
3. 优化：记忆求值、有效求值等：暴力求解时间复杂度通常 \>=O(n^2)。因此经常需要优化，记忆求值经常用到数组和Map，有效求值经常用到二分查找。
```js
/**
 * 使用最小花费爬楼梯 https://leetcode.cn/problems/min-cost-climbing-stairs/
 * 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支 付此费用，即可选择向上爬一个或者两个台阶。 你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。 请你计算并返回达到楼梯顶部的最低花费。
*/
var minCostClimbingStairs = function (cost) {
    const len = cost.length;
    let prev = 0, current = 0, next;
    for (let i = 2; i <= len; i++) {
        next = Math.min(current + cost[i - 1], prev + cost[i - 2]);
        prev = current;
        current = next;
    }
    return current;
};
```
```js
/**
 * 买卖股票的最佳时机 https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
*/
var maxProfit = function (prices) {
    let max = 0;
    const len = prices.length;
    let minPrice = prices[0];
    for (let i = 1; i < len; i++) {
        if (prices[i] < minPrice) { 
            minPrice = prices[i];
        } else {
            // 可以卖出
            max = Math.max(max, prices[i] - minPrice);
        }
    }
    return max;
};
```
```js
/**
 * 最长公共子序列 https://leetcode.cn/problems/qJnOS7/
*/
var longestCommonSubsequence = function (text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = [new Array(n + 1).fill(0)];
    for (let i = 1; i <= m; i++) {
        const c1 = text1[i - 1];
        dp[i] = [0];
        for (let j = 1; j <= n; j++) {
            const c2 = text2[j - 1];
            if (c1 === c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        } 
    }
    return dp[m][n];
};
```
![最长递增子序列](https://github.com/lujiajian1/geek-notes/blob/main/img/lengthOfLIS1.jpg)
![最长递增子序列](https://github.com/lujiajian1/geek-notes/blob/main/img/lengthOfLIS2.jpg)
```js
/**
 * 最长递增子序列  https://leetcode.cn/problems/longest-increasing-subsequence/
*/
// 暴力解
var lengthOfLIS = function(nums) {
    let n = nums.length;
    if(n<=1){
        return n;
    }
    let max = 1;
    let dp = new Array(n).fill(1);
    for(let i=1; i<n;i ++){
        for(let j=i-1; j>=0; j--){
            if(nums[i]>nums[j]){
                dp[i] = Math.max(dp[j]+1, dp[i]);
            }
        }
        max = Math.max(dp[i], max);
    }
    return max;
};
// 二分优化
var lengthOfLIS = function (nums) {
    let n = nums.length;
    if (n <= 1) {
        return n;
    }
    let len = 1;
    let dp = [null, nums[0]];
    for (let i = 1; i < n; i++) {
        if (dp[len] < nums[i]) {
            dp[++len] = nums[i];
            continue;
        }
        // 否则去dp中二分查找，判读插入位置
        let left = 1, right = len, mid, pos = 0; 
        while (left <= right) {
            mid = (left + right) >> 1;
            if (nums[i] > dp[mid]) {
                // 元素在右边
                left = mid + 1;
                pos = mid;
            } else {
                right = mid - 1;
            }
        }
        dp[pos + 1] = nums[i];
    }
    return len;
};
```
```js
/**
 * 鸡蛋掉落-两枚鸡蛋 https://leetcode.cn/problems/egg-drop-with-2-eggs-and-n-floors/
 * https://mp.weixin.qq.com/s/qYOi0DeHo_OLmI7GHAAa2w
*/
var twoEggDrop = function(n) {
    // dp[i][j]代表有i+1个鸡蛋，共j层楼，得到f需要的最小操作次数
    // const dp = [0, 1, 2, ]
    const dp = [[],[]]
    dp[0][0] = dp[1][0] = 0；
    for(let j=0; j<=n; j++) {
        dp[0][j] = j;
    }
    for(let j=1; j<=n; j++) {
        for(let k=1; k<=j; k++) {
            if(isNaN(dp[1][j])) {
                dp[1][j] = Math.max(dp[0][k - 1] + 1, dp[1][j-k] + 1);
            } else {
                dp[1][j] = Math.min(dp[1][j], Math.max(dp[0][k - 1] + 1, d p[1][j-k] + 1));
            }
        }
    }
    return dp[1][n]
};
```
```js
/**
 * 鸡蛋掉落 https://leetcode.cn/problems/super-egg-drop/
 * @param {number} k 个鸡蛋，n层楼
 * @param {number} n 层楼
 * @return {number}
*/
var superEggDrop = function(k, n) {
    const memo = new Map()
    return dp(k, n)
    function dp(k, n){
        if(!(memo.has(n*100+k))) {
            // 计算
            let ans = null
            if(k===0||n===0) {
                ans = 0
            } else if(k===1) {
                ans = n
            } else if(n===1) {
                ans = 1
            } else {
                // 二分查找最优的x
                let low = 1, high = n, ans1, ans2
                while(low+1<high){
                    let x = (low + high) >> 1
                    ans1 = dp(k-1, x-1)
                    ans2 = dp(k, n-x)
                    if(ans1<ans2) {
                        low = x
                    } else if(ans1>ans2) {
                        high = x
                    } else {
                        low = high = x
                    }
                }
                ans1 = Math.max(dp(k-1, low-1), dp(k ,n-low))
                ans2 = Math.max(dp(k-1, high-1), dp(k ,n-high))
                ans = 1 + Math.min(ans1, ans2)
            }
            memo.set(n*100+k, ans)
        }
        return memo.get(n*100+k)
    }
}
```