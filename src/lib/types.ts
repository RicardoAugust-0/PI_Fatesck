export type Role = "aluno" | "professor" | "administrador";
export type View =
  | "inicio"
  | "turmas"
  | "atividades"
  | "mensagens"
  | "usuarios"
  | "configuracoes";
export interface Classroom {
  id: string;
  name: string;
  teacher: string;
  code: string;
  color: string;
  description: string;
  schedule: string;
}
export interface Activity {
  id: string;
  classId: string;
  title: string;
  description: string;
  due: string;
}
export interface Submission {
  activityId: string;
  text: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}
export interface Message {
  id: string;
  classId: string;
  author: string;
  role: Role;
  text: string;
  createdAt: string;
}
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}
export interface DemoState {
  classes: Classroom[];
  activities: Activity[];
  submissions: Submission[];
  messages: Message[];
  users: DemoUser[];
}
export const identities: Record<Role, string> = {
  aluno: "Lucas Oliveira",
  professor: "Marina Santos",
  administrador: "Alex Costa",
};
export const roleLabels: Record<Role, string> = {
  aluno: "Aluno",
  professor: "Professor",
  administrador: "Administrador",
};
