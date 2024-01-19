export interface IProjectHealth {
  date: string;
  clientId: string;
  projectId: string;
  projectHealthRate: string;
  comments: string;
  isActive: boolean;
}

export const projectHealthValues: IProjectHealth = {
  date: '',
  clientId: '',
  projectId: '',
  projectHealthRate: '',
  comments: '',
  isActive: true,
};
