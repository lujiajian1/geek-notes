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
递推是按照一定的规律来计算序列中的每个项，通常是通过计算前面的一些项来得出序列中的指 定项的值。其思想是把一个复杂的庞大的计算过程转化为简单过程的多次重复，该算法利用了计 算机速度快和不知疲倦的机器特点。
#### 递推关系式
递推关系（Recurrence relation），在数学上也就是差分方程（Difference equation），是一种递推地定义一个序列的方程：序列的每一项目是定义为前若干项的函数。 像斐波那契数即为递推关系：\\chi _{n+2} = \\chi _{n=1} + \\chi _{n} 