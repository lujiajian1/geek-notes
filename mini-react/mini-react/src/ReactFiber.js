import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";
import { isFn, isStr, isUndefined, Placement } from "./utils";

export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,

    // 不同类型的组件，stateNode 也不同
    // 原生标签 DOM节点
    // class组件 实例
    // 函数组件没有用到stateNode 是 null
    stateNode: null,

    // 第一个子fiber
    child: null,
    // 下一个兄弟fiber
    sibling: null,
    // 父节点
    return: returnFiber,

    // 标记fiber任务类型，节点插入、更新、删除
    flags: Placement,

    // 记录节点在当前层级的位置 
    index: null,

    // old fiber
    alternate: null,
  };

  // 判断tag，判断fiber任务节点类型
  const { type } = vnode;
  if (isStr(type)) {
    // 原生标签
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    // 函数组件、类组件
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
