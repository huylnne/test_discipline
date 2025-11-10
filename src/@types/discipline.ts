export interface Discipline {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder?: number;
  projectId?: string;
  projectCode?: string;
}

export interface DisciplineState {
  list: Discipline[];
  selected?: Discipline;
  loading: boolean;
  error?: string;
}


export interface Project {
  id: string;
  name: string;
}