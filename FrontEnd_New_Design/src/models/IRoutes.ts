import React, { ComponentType, ReactNode } from "react";

type GuardProps = {
  children: ReactNode;
};

interface LayoutProps {
  loading: (progress: number, value: boolean) => void;
}

type ICommon = {
  exact?: boolean;
  path?: string;
  guard?: React.FunctionComponent<GuardProps>;
  layout?: React.FunctionComponent<GuardProps & LayoutProps>;
  component?: any;
  requireRoles?: string[] | [];
  routes?: ICommon[];
};

export type IRoutes = ICommon & {
  routes?: ICommon[];
};

export type IParams = {
  id?: string;
};
