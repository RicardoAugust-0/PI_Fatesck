import type { DemoState } from "./types";
// Dados fictícios. Datas relativas mantêm a demonstração útil nos próximos semestres.
export function createDemoData(): DemoState {
  const date = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return {
    classes: [
      {
        id: "web",
        name: "Desenvolvimento Web",
        teacher: "Marina Santos",
        code: "WEB-2026",
        color: "blue",
        description: "Interfaces, componentes e aplicações para a web.",
        schedule: "Segunda e quarta · 19h às 20h40",
      },
      {
        id: "bd",
        name: "Banco de Dados",
        teacher: "Marina Santos",
        code: "BDD-2026",
        color: "orange",
        description: "Modelagem de dados, SQL e organização da informação.",
        schedule: "Terça · 19h às 22h30",
      },
      {
        id: "es",
        name: "Engenharia de Software",
        teacher: "Marina Santos",
        code: "ENG-2026",
        color: "purple",
        description: "Do levantamento de requisitos à entrega do projeto.",
        schedule: "Quinta · 19h às 22h30",
      },
    ],
    activities: [
      {
        id: "a1",
        classId: "web",
        title: "Primeira interface com React",
        description:
          "Crie uma página com cabeçalho, navegação e um componente reutilizável. Entregue o link do repositório e explique as decisões de organização do código.",
        due: date(2),
      },
      {
        id: "a2",
        classId: "bd",
        title: "Modelo entidade-relacionamento",
        description:
          "Modele alunos, professores, turmas e atividades. Descreva os relacionamentos e suas cardinalidades. Inclua o link para o seu diagrama.",
        due: date(5),
      },
      {
        id: "a3",
        classId: "es",
        title: "Levantamento de requisitos",
        description:
          "Liste cinco requisitos funcionais e três não funcionais do Fatesck. Explique como cada um poderá ser validado.",
        due: date(7),
      },
      {
        id: "a4",
        classId: "web",
        title: "Estrutura semântica em HTML",
        description:
          "Descreva como você utilizou elementos semânticos na página inicial do projeto.",
        due: date(-2),
      },
    ],
    submissions: [
      {
        activityId: "a4",
        text: "Organizei a página com header, nav, main e footer. Cada seção tem um título que descreve seu conteúdo.",
        submittedAt: new Date().toISOString(),
        grade: 9,
        feedback:
          "Boa organização! Continue cuidando da hierarquia dos títulos.",
      },
    ],
    messages: [
      {
        id: "m1",
        classId: "web",
        author: "Marina Santos",
        role: "professor",
        text: "Olá, turma! A primeira atividade já está disponível. Podem usar este espaço para conversar sobre o projeto.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        classId: "bd",
        author: "Marina Santos",
        role: "professor",
        text: "Na próxima aula vamos revisar os relacionamentos do modelo de dados.",
        createdAt: new Date().toISOString(),
      },
    ],
    users: [
      {
        id: "u1",
        name: "Lucas Oliveira",
        email: "lucas@example.com",
        role: "aluno",
        active: true,
      },
      {
        id: "u2",
        name: "Marina Santos",
        email: "marina@example.com",
        role: "professor",
        active: true,
      },
      {
        id: "u3",
        name: "Alex Costa",
        email: "alex@example.com",
        role: "administrador",
        active: true,
      },
    ],
  };
}
