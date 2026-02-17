import React from "react";
import { StandardListActions } from "./StandardListActions";

const listWrapperCache = new WeakMap<
  React.ComponentType<any>,
  React.ComponentType<any>
>();

export const withStandardList = <P extends object>(
  ListComponent: React.ComponentType<P>,
): React.ComponentType<P> => {
  const cached = listWrapperCache.get(ListComponent);
  if (cached) return cached as React.ComponentType<P>;

  const WrappedList: React.FC<P> = (props) => (
    <ListComponent {...props} actions={<StandardListActions />} />
  );

  WrappedList.displayName = `WithStandardList(${
    ListComponent.displayName || ListComponent.name || "ListComponent"
  })`;

  listWrapperCache.set(ListComponent, WrappedList);
  return WrappedList;
};
