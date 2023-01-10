# 虚拟DOM与fiber
React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

## 虚拟DOM（react virtual dom）
用 JavaScript 对象表示 DOM 信息和结构，当状态变更的时候，重新渲染这个 JavaScript 的对象结构。这个 JavaScript 对象称为virtual dom。
![虚拟dom](https://github.com/lujiajian1/geek-notes/blob/main/img/vdom1.png)

#### 传统dom渲染流程
DOM操作很慢，轻微的操作都可能导致页面重新排版，非常耗性能。相对于DOM对象，js对象处理起来更快，而且更简单。通过diff算法对比新旧vdom之间的差异，可以批量的、最小化的执行dom操作，从而提升用户体验。
React中用JSX语法描述视图(View)，~~通过babel-loader转译后它们变为 React.createElement(...)形式，该函数将生成vdom来描述真实dom。将来如果状态变化，vdom将作出相应变化，再通过diff算法对比新老vdom区别从而做出最终dom操作。
![传统dom渲染流程](https://github.com/lujiajian1/geek-notes/blob/main/img/dom.png)

#### JSX
这个有趣的标签语法既不是字符串也不是 HTML，它是 JSX，是一个 JavaScript 的语法扩展，JSX 可以生成 React “元素”。从本质上来说，JSX 并不是一个新的模板语言，而可以认为是一个语法糖。也就是说，不用 JSX 的写法，使用React.createElement也是能够写React 的。

#### 为什么需要JSX
* 为什么不使用 vue 那样的模板语言：React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，React 没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。
* 开发效率：使用 JSX 编写模板简单快速。
* 执行效率：JSX编译为 JavaScript 代码后进行了优化，执行更快。
* 类型安全：在编译过程中就能发现错误。

#### 与vue的异同
* react中虚拟dom+jsx的设计一开始就有，vue则是演进过程中才出现的
* jsx本来就是js扩展，转义过程简单直接的多；vue把 template 编译为 render函数 的过程需要复杂的编译器转换字符串-ast-js函数字符串。

## diffing算法

#### [reconciliation协调](https://zh-hans.reactjs.org/docs/reconciliation.html)
在某一时间节点调用 React 的 `render()` 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 `render()` 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。
这个算法问题有一些通用的解决方案，即生成将一棵树转换成另一棵树的最小操作数。 然而，即使在[最前沿的算法中](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)，该算法的复杂程度为 O(n3)，其中 n 是树中元素的数量。
如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。于是 React 在以下两个假设的基础之上提出了一套 O(n) 的启发式算法，并且在实践中，我们发现以上假设在几乎所有实用的场景下都成立。
1. 两个不同类型的元素会产生出不同的树。
2. 开发者可以通过 `key` prop 来暗示哪些子元素在不同的渲染下能保持稳定。

#### diff 策略
1. 同级比较，Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 拥有不同类型的两个组件将会生成不同的树形结构。例如：div->p, CompA->CompB
3. 开发者可以通过 `key` prop 来暗示哪些子元素在不同的渲染下能保持稳定。

#### diff过程
比对两个虚拟dom时会有三种操作：删除、替换和更新，vnode是现在的虚拟dom，newVnode是新虚拟dom。在实践中也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。
* 删除：newVnode不存在时
* 替换：vnode和newVnode类型不同或key不同时
* 更新：有相同类型和key但vnode和newVnode不同时

## fiber

#### 为什么需要fiber
[React Conf 2017 Fiber介绍视频](https://www.youtube.com/watch?v=ZCuYPiUIONs)
1. 对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就无法立即得到处理，造成视觉上的卡顿，影响用户体验。
2. 任务分解的意义，解决一次递归遍历成本过高问题。
3. 增量渲染（把渲染任务拆分成块，匀到多帧）。
4. 更新时能够暂停，终止，复用渲染任务。
5. 给不同类型的更新赋予优先级。
6. 并发方面新的基础能力
7. 更流畅

#### 什么是fiber
A Fiber is work on a Component that needs to be done or was done. There can be more than one per component.
fiber是指组件上将要完成或者已经完成的任务，每个组件可以一个或者多个。简而言之，fiber就是v16之后的虚拟DOM（React在遍历的节点的时候，并不是真正的DOM，而是采用虚拟的DOM）。
![preview](https://pic2.zhimg.com/v2-d2c7de3c408badd0abeef40367d3fb19_r.jpg)

# fiber构建与任务执行

## 组件类型
* 文本节点
* HTML标签节点
* 函数组件
* 类组件
* 等等
```js
// 源码文件路径：src/react/packages/react-reconciler/src/ReactWorkTags.js
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
```

## fiber结构
![fiber结构](https://github.com/lujiajian1/geek-notes/blob/main/img/fiber.png)

## 生成fiber
```js
import { Placement } from "./utils";
export default function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null, // 原生标签时候指dom节点，类组件时候指的是实例
    child: null, // 第一个子fiber
    sibling: null, // 下一个兄弟fiber
    return: returnFiber, // 父fiber
    // 标记节点是什么类型的
    flags: Placement,
    // 老节点
    alternate: null,
    deletions: null, // 要删除子节点 null或者[]
    index: null, //当前层级下的下标，从0开始
  };
  return fiber;
}
```

## 执行任务
```js
// 原则：深度优先遍历（王朝的故事）
let wip = null;

function performUnitOfWork() {
  // todo 1. 执行当前任务wip
  // 判断wip是什么类型的组件
  const { type } = wip;
  if (isStr(type)) {
    // 原生标签
    updateHostComponent(wip);
  } else if (isFn(type)) {
    type.prototype.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctionComponent(wip);
  }
  // todo 2. 更新wip
  // 深度优先遍历（王朝的故事）
  if (wip.child) {
    wip = wip.child;
    return;
  }
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}
```

## 工具函数
```js
// utils.js
// ! flags定义为二进制，而不是字符串或者单个数字，一方面原因是因为二进制单个数字具有唯一性、某个范围内的组合同样具有唯一性，另一方原因在于简洁方便、且速度快。
export const NoFlags = /*                      */ 0b00000000000000000000;
export const Placement = /*                    */ 0b0000000000000000000010; // 2
export const Update = /*                       */ 0b0000000000000000000100; // 4
export const Deletion = /*                     */ 0b0000000000000000001000; // 8

export function isStr(s) {
  return typeof s === "string";
}

export function isStringOrNumber(s) {
  return typeof s === "string" || typeof s === "number";
}

export function isFn(fn) {
  return typeof fn === "function";
}

export function isArray(arr) {
  return Array.isArray(arr);
}
```

# React如何开始渲染

## ReactDOM.createRoot替换ReactDOM.render
React18中将会使用最新的ReactDOM.createRoot作为根渲染函数，ReactDOM.render作为兼容，依然会存在，但是会成为遗留模式，开发环境下会出现warning。
```jsx
ReactDOM.createRoot(document.getElementById("root")).render(jsx);
```

## 实现ReactDOM.createRoot
```jsx
import createFiber from "./createFiber";
// work in progress; 当前正在工作中的
import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function(children) {
  const root = this._internalRoot;

  updateContainer(children, root);
};

function createRoot(container) {
  const root = {
    containerInfo: container,
  };

  return new ReactDOMRoot(root);
}

function updateContainer(element, container) {
  const {containerInfo} = container;
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo,
  });
  scheduleUpdateOnFiber(fiber);
}

// function render(element, container) {
//   updateContainer(element, {containerInfo: container});
// }

export default {
  // render,
  createRoot,
};
```

# 初次渲染原生节点

## window.requestIdleCallback(callback[, options])
window.requestIdleCallback() 方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。
你可以在空闲回调函数中调用 requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。
* callback：一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 [IdleDeadline](https://developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline) 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
* options 可选：包括可选的配置参数。具有如下属性：
    * timeout：如果指定了 timeout 并具有一个正值，并且尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行，尽管这样很可能会对性能造成负面影响。
Fiber 是 React 16 中新的协调引擎。它的主要目的是使 Virtual DOM 可以进行增量式渲染。一个更新过程可能被打断，所以 React Fiber 一个更新过程被分为两个阶段(Phase)：第一个阶段 Reconciliation Phase 和第二阶段 Commit Phase。

## 提交阶段
```jsx
function workLoop(IdleDeadline) {
  while (wip && IdleDeadline.timeRemaining() > 0) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // 1. 更新自己

  const { flags, stateNode } = wip;

  let parentNode = wip.return.stateNode;
  if (flags && Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }

  // 2. 更新子节点
  commitWorker(wip.child);
  // 2. 更新兄弟节点
  commitWorker(wip.sibling);
}
```

## 更新属性
```jsx
export function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + "";
      }
    } else {
      node[k] = nextVal[k];
    }
  });
}
```

## 遍历子节点
```jsx
import createFiber from "./ReactFiber";
import { isArray, isStringOrNumber, updateNode } from "./utils";

// 原生标签函数
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    // 属性
    updateNode(wip.stateNode, wip.props);
  }
  // 子节点
  reconcileChildren(wip, wip.props.children);
}

function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null; //记录上一次的fiber
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const newFiber = createFiber(newChild, wip);

    if (i === 0) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}
```

# 初次渲染函数组件、类组件、文本节点与Fragment节点

## 标记fiber类型的属性tag
```js
// 所有的tag：src/react/packages/react-reconciler/src/ReactWorkTags.js
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
```
```js
// 标记到fiber上
import { Fragment } from "react";
import {
  HostComponent,
  ClassComponent,
  FunctionComponent,
  HostText,
} from "./ReactWorkTags";
import { isFn, isStr, isUndefined, Placement } from "./utils";

export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    // 原生标签 DOM
    // class组件 实例
    stateNode: null,

    // 第一个子fiber
    child: null,
    // 下一个兄弟fiber
    sibling: null,
    return: returnFiber,

    // 标记fiber任务类型，节点插入、更新、删除
    flags: Placement,

    index: null,
  };

  // 定义tag，标记节点类型
  const { type } = vnode;

  if (isStr(type)) {
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent;
  } else if (isUndefined(type)) {
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }

  return fiber;
}
```

### 判断组件类型执行任务
```js
// 根据fiber.tag判断任务类型
function performUnitOfWork() {
  const { tag } = wip;
  switch (tag) {
    // 原生标签
    case HostComponent:
      updateHostComponent(wip);
      break;
    // 文本
    case HostText:
      updateTextComponent(wip);
      break;
    // 函数组件
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    // 类组件
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
  }

  // 深度优先遍历(国王的故事)
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}
```

## 函数组件
该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数。
```jsx
function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}
```
函数组件的任务执行函数：
```js
// 协调（diff）
function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip);

    if (previousNewFiber === null) {
      // head node
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}

function updateFunctionComponent(wip) {
  const { type, props } = wip;

  const children = type(props);
  reconcileChildren(wip, children);
}
```

## 类组件
React 的组件可以定义为 class 或函数的形式。如需定义 class 组件，需要继承 React.Component 或者 React.PureComponent：
```jsx
class ClassComponent extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}
```
类组件的任务执行函数：
```js
function updateClassComponent(wip) {
  const { type, props } = wip;
  const instance = new type(props);
  const children = instance.render();

  reconcileChildren(wip, children);
}
```

## 类组件源码
![类组件源码](https://github.com/lujiajian1/geek-notes/blob/main/img/classComponent.png)

## 文本节点
当原生标签只有一个文本的时候，这个文本可以当做属性，通过textContent加到dom节点上。当原生标签有别的组件和文本的时候，此时的文本我们通过document.createTextNode生成dom节点。
```jsx
class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <h3>{this.props.name}</h3>
        我是文本
      </div>
    );
  }
}
```
文本节点的任务执行函数：
```js
// 文本
export function updateTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children);
}
```
## Fagment
React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。
```jsx
function FragmentComponent() {
  return (
    <ul>
      <React.Fragment>
        <li>part1</li>
        <li>part2</li>
      </React.Fragment>
    </ul>
  );
}
```
也可以使用一种新的，且更简短的语法来声明 Fragments，它看起来像空标签，除了它不支持 key 或属性。key 是唯一可以传递给 Fragment 的属性。未来可能会添加对其他属性的支持，例如事件。
```jsx
function FragmentComponent() {
  return (
    <ul>
      <>
        <li>part1</li>
        <li>part2</li>
      </>
    </ul>
  );
}
```
Fragment节点我们也只有子节点可以更新了，当然你也可以通过document.createDocumentFragment添加dom片段，只是没必要~
```js
export function updateFragmentComponent(wip) {
  const { type, props } = wip;
  reconcileChildren(wip, wip.props.children);
}
```


































# 链接
1. [React官方文档](https://react.docschina.org/)
2. [React github](https://github.com/facebook/react/)
3. [React18新特性尝试](https://github.com/bubucuo/react18-ice)
4. [React18新特性免费视频教程](https://www.bilibili.com/video/BV1rK4y137D3/)