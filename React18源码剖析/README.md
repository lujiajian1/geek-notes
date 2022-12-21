## 为什么学习源码
* 跳出圈子，停止自满：你和身边的同事的级别相差不会超过2，你平常看的最多的代码就是你自己的，其次是他们的。 这个时候如果你想再进一步，必须跳出自己的小圈子，找些优质代码学习。
* 掌握原理，避免bug，优化项目：知其然知其所以然。
* 为了面试

## 如何调试React源码
* [debugReact](https://github.com/bubucuo/DebugReact)
* [源码文件指引](https://www.processon.com/view/link/60b206c2e0b34d3841931a88#map)

## React中常见的数据结构-Fiber
简而言之，fiber就是v16之后的虚拟DOM（React在遍历的节点的时候，并不是真正的DOM，而是采用虚拟的DOM）

#### 虚拟DOM是如何转化成 Fiber
jsx代码经过babel会编译成React.createElement的形式，之后会走一个beginWork的方法，这个方法会通过tag去判断这段代码的element对象，tag的类型就是判断 element对应那种的 fiber，再之后会调用reconcileChildFibers函数，这个函数就是转化后的fiber结构。
```jsx
const Index = (props)=> {
  return (
    <div>
      Hellow world
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```
#### element、fiber和DOM元素 的关系
* element对象就是我们的jsx代码，上面保存了props、key、children等信息
* DOM元素就是最终呈现给用户展示的效果
* fiber就是充当element和DOM元素的桥梁，简单的说，只要elemnet发生改变，就会通过fiber做一次调和，使对应的DOM元素发生改变

#### fiber 保存了什么？
源码部分在 packages/react-reconciler/src/ReactFiber.old.js 中的 FiberNode。
```js
export type Fiber = {
    // 存储一些对应element元素的属性
    tag: WorkTag,  // 组件的类型，判断函数式组件、类组件等（上述的tag）
    key: null | string, // key
    elementType: any, // 元素的类型
    type: any, // 与fiber关联的功能或类，如<div>,指向对应的类或函数
    stateNode: any, // 真实的DOM节点


    // 存储的是关于fiber链表相关的内容和相关的props、state
    return: Fiber | null, // 指向父节点的fiber
    child: Fiber | null, // 指向第一个子节点的fiber
    sibling: Fiber | null, // 指向下一个兄弟节点的fiber
    index: number, // 索引，是父节点fiber下的子节点fiber中的下表

    ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,  // ref的指向，可能为null、函数或对象

    pendingProps: any,  // 本次渲染所需的props
    memoizedProps: any,  // 上次渲染所需的props
    updateQueue: mixed,  // 类组件的更新队列（setState），用于状态更新、DOM更新
    memoizedState: any, // 类组件保存上次渲染后的state，函数组件保存的hooks信息
    dependencies: Dependencies | null,  // contexts、events（事件源） 等依赖
    mode: TypeOfMode, // 类型为number，用于描述fiber的模式 

    // 副作用相关的内容
    flags: Flags, // 用于记录fiber的状态（删除、新增、替换等）
    subtreeFlags: Flags, // 当前子节点的副作用状态
    deletions: Array<Fiber> | null, // 删除的子节点的fiber
    nextEffect: Fiber | null, // 指向下一个副作用的fiber
    firstEffect: Fiber | null, // 指向第一个副作用的fiber
    lastEffect: Fiber | null, // 指向最后一个副作用的fiber

    // 优先级相关的内容
    lanes: Lanes, // 优先级，用于调度
    childLanes: Lanes,
    alternate: Fiber | null,
    actualDuration?: number,
    actualStartTime?: number,
    selfBaseDuration?: number,
    treeBaseDuration?: number,
}
```
#### 链表之间如何连接的？
在 Fiber 中我们看到有return、child、sibling这三个参数，分别指向父级、子级、兄弟，也就是说每个element通过这三个属性进行连接。

## React中常见的数据结构-Flags
在 React 的渲染流程中，render 阶段从根节点开始处理所有的 fiber 节点，收集有副作用的 fiber 节点(即 fiber.flags 大于 1 的节点)，并构建副作用链表。commit 阶段并不会处理所有的 fiber 节点，而是遍历副作用链表，根据 fiber.flags 的标志进行对应的处理。
PerformedWork 是专门提供给 React Dev Tools 读取的。fiber 节点的副作用从 2 开始。0 表示没有副作用。
对于原生的 HTML 标签，如果需要修改属性，文本等，就视为有副作用。对于类组件，如果类实例实现了 componentDidMount、componentDidUpdate 等生命周期方法，则视为有副作用。对于函数组件，如果实现了 useEffect、useLayoutEffect 等 hook，则视为有副作用。以上这些都是副作用的例子。
React 在 render 阶段给有副作用的节点添加标志，并在 commit 阶段根据 fiber flags 执行对应的副作用操作，比如调用生命周期方法，或者操作真实的 DOM 节点。
```js
// 下面两个运用于 React Dev Tools，不能更改他们的值
const NoFlags = 0b000000000000000000;
const PerformedWork = 0b000000000000000001;

// 下面的 flags 用于标记副作用
const Placement = 0b000000000000000010; // 2 移动，插入
const Update = 0b000000000000000100; // 4
const PlacementAndUpdate = 0b000000000000000110; // 6
const Deletion = 0b000000000000001000; // 8
const ContentReset = 0b000000000000010000; // 16
const Callback = 0b000000000000100000; // 32 类组件的 update.callback
const DidCapture = 0b000000000001000000; // 64
const Ref = 0b000000000010000000; // 128
const Snapshot = 0b000000000100000000; // 256
const Passive = 0b000000001000000000; // 512
const Hydrating = 0b000000010000000000; // 1024

const HydratingAndUpdate = 0b000000010000000100; // 1028 Hydrating | Update

// 这是所有的生命周期方法(lifecycle methods)以及回调(callbacks)相关的副作用标志，其中 callbacks 指的是 update 的回调，比如调用this.setState(arg, callback)的第二个参数
const LifecycleEffectMask = 0b000000001110100100; // 932 Passive | Update | Callback | Ref | Snapshot

// 所有 host effects 的集合
const HostEffectMask = 0b000000011111111111; // 2047

// 下面这些并不是真正的副作用标志
const Incomplete = 0b000000100000000000; // 2048
const ShouldCapture = 0b000001000000000000; // 4096
const ForceUpdateForLegacySuspense = 0b000100000000000000; // 16384
```
#### flags 位操作
```js
// 1.移除所有的生命周期相关的 flags
fiber.flags &= ~LifecycleEffectMask;

// 2.只保留 host effect 相关的副作用，移除其他的副作用位
fiber.flags &= HostEffectMask;

// 3.只保留 "插入" 副作用
fiber.flags &= Placement;

// 4.添加一个 “更新” 副作用，注意和第3点保留 “插入” 副作用的区别
fiber.flags |= Update;

// 5.移除 "插入" 副作用，添加 "更新" 副作用
fiber.flags = (fiber.flags & ~Placement) | Update;
```

## React中常见的数据结构-ReactWorkTag
标记组件类型，对应fiber.tag。
```js
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
export const FundamentalComponent = 20;
export const ScopeComponent = 21;
export const Block = 22;
export const OffscreenComponent = 23;
export const LegacyHiddenComponent = 24;
```

## React中常见的数据结构-React 17&18 Lane
Lane是React中用于表示任务的优先级。优先级分为高优先级与低优先级，当用户操作界面时，为了避免页面卡顿，需要让出线程的执行权，先执行用户触发的事件，这个我们称之为高优先级任务，其它不那么重要的事件我们称之为低优先级任务。
不同优先级的任务间，会存在一种现象：当执行低优先级任务时，突然插入一个高优先级任务，那么会中断低优先级的任务，先执行高优先级的任务，我们可以将这种现象称为任务插队。当高优先级任务执行完，准备执行低优先级任务时，又插入一个高优先级任务，那么又会执行高优先级任务，如果不断有高优先级任务插队执行，那么低优先级任务便一直得不到执行，我们称这种现象为任务饥饿问题。