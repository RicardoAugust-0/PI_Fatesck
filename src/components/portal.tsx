"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  Send,
  Menu,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Shield,
  ChevronRight,
} from "lucide-react";
import { createDemoData } from "@/lib/demo-data";
import { demoRepository, formatDate, isLate } from "@/lib/demo-repository";
import {
  identities,
  roleLabels,
  type Role,
  type View,
  type DemoState,
  type Activity,
} from "@/lib/types";
import { Modal, Badge, Empty } from "./ui";
const navigation = [
  { id: "inicio", label: "Visão geral", icon: LayoutDashboard },
  { id: "turmas", label: "Turmas", icon: BookOpen },
  { id: "atividades", label: "Atividades", icon: ClipboardList },
  { id: "mensagens", label: "Mensagens", icon: MessageSquare },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "configuracoes", label: "Configurações", icon: Settings },
] as const;

export function Portal() {
  const [data, setData] = useState<DemoState | null>(null);
  const [role, setRole] = useState<Role>("aluno");
  const [signed, setSigned] = useState(false);
  const [view, setView] = useState<View>("inicio");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [room, setRoom] = useState("web");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const [modal, setModal] = useState<"class" | "activity" | "reset" | null>(
    null,
  );
  const [selected, setSelected] = useState<Activity | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  useEffect(() => {
    try {
      setData(demoRepository.load());
    } catch {
      setData(createDemoData());
      setStorageError(
        "Não foi possível recuperar os dados locais. A demonstração continua nesta sessão.",
      );
    }
  }, []);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  const update = (next: DemoState) => {
    setData(next);
    try {
      demoRepository.save(next);
      setStorageError("");
    } catch {
      setStorageError(
        "O navegador não salvou as alterações. Elas serão perdidas ao sair desta página.",
      );
    }
  };
  const go = (next: View) => {
    setView(next);
    setMenu(false);
    setDetail(null);
    setQuery("");
    setClassFilter("all");
    setStatusFilter("all");
  };
  if (!data)
    return (
      <main className="loading" role="status">
        Carregando Fatesck…
      </main>
    );
  const pending = data.activities.filter(
    (a) => !data.submissions.some((s) => s.activityId === a.id),
  );
  const reviewed = data.submissions.filter((s) => s.grade !== undefined);
  const currentClass = data.classes.find((c) => c.id === detail);
  const currentRoom =
    data.classes.find((c) => c.id === room) ?? data.classes[0];
  const status = (a: Activity) => {
    const s = data.submissions.find((s) => s.activityId === a.id);
    return s
      ? s.grade !== undefined
        ? "Avaliada"
        : "Entregue"
      : isLate(a.due)
        ? "Atrasada"
        : "Pendente";
  };
  const tone = (a: Activity) =>
    ({
      Avaliada: "green",
      Entregue: "blue",
      Atrasada: "red",
      Pendente: "orange",
    })[status(a)];
  function createClass(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const code = String(f.get("code")).trim().toUpperCase();
    if (!name || !code) return;
    if (data.classes.some((c) => c.code === code)) {
      setNotice("Já existe uma turma com esse código.");
      return;
    }
    update({
      ...data,
      classes: [
        ...data.classes,
        {
          id: crypto.randomUUID(),
          name,
          code,
          teacher: identities.professor,
          color: "blue",
          description: String(f.get("description")).trim(),
          schedule: String(f.get("schedule")).trim() || "Horário a definir",
        },
      ],
    });
    setModal(null);
    setNotice("Turma criada.");
  }
  function createActivity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title")).trim();
    const description = String(f.get("description")).trim();
    if (!title || !description) return;
    update({
      ...data,
      activities: [
        ...data.activities,
        {
          id: crypto.randomUUID(),
          title,
          description,
          classId: String(f.get("classId")),
          due: String(f.get("due")),
        },
      ],
    });
    setModal(null);
    setNotice("Atividade publicada na turma.");
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected || !data) return;
    const f = new FormData(e.currentTarget);
    const text = String(f.get("text")).trim();
    if (!text) return;
    update({
      ...data,
      submissions: [
        ...data.submissions.filter((s) => s.activityId !== selected.id),
        {
          activityId: selected.id,
          text,
          submittedAt: new Date().toISOString(),
        },
      ],
    });
    setSelected(null);
    setNotice("Entrega salva nesta demonstração.");
  }
  function grade(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected || !data) return;
    const f = new FormData(e.currentTarget);
    update({
      ...data,
      submissions: data.submissions.map((s) =>
        s.activityId === selected.id
          ? {
              ...s,
              grade: Number(f.get("grade")),
              feedback: String(f.get("feedback")).trim(),
            }
          : s,
      ),
    });
    setSelected(null);
    setNotice("Avaliação salva.");
  }
  function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data || !message.trim() || !currentRoom) return;
    update({
      ...data,
      messages: [
        ...data.messages,
        {
          id: crypto.randomUUID(),
          classId: currentRoom.id,
          author: identities[role],
          role,
          text: message.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setMessage("");
  }
  const ActivityRow = ({ a }: { a: Activity }) => (
    <button className="activity-row" onClick={() => setSelected(a)}>
      <span
        className={`activity-icon ${data.classes.find((c) => c.id === a.classId)?.color}`}
      >
        <ClipboardList size={19} />
      </span>
      <span className="row-main">
        <strong>{a.title}</strong>
        <small>{data.classes.find((c) => c.id === a.classId)?.name}</small>
      </span>
      <span className="due">{formatDate(a.due)}</span>
      <Badge tone={tone(a)}>{status(a)}</Badge>
      <ChevronRight size={17} className="row-chevron" />
    </button>
  );
  const ClassCard = ({ id }: { id: string }) => {
    const c = data.classes.find((c) => c.id === id)!;
    return (
      <button
        className="class-card"
        onClick={() => {
          go("turmas");
          setDetail(c.id);
        }}
      >
        <div className={`class-cover ${c.color}`}>
          <BookOpen size={28} />
          <span>{c.code}</span>
        </div>
        <div className="class-body">
          <h3>{c.name}</h3>
          <p>Prof. {c.teacher}</p>
          <div className="class-bottom">
            <span>
              {data.activities.filter((a) => a.classId === c.id).length}{" "}
              atividades
            </span>
            <ArrowUpRight size={19} />
          </div>
        </div>
      </button>
    );
  };
  if (!signed)
    return (
      <main className="login">
        <section className="login-intro">
          <div className="brand">
            <span className="brand-icon">
              <GraduationCap size={28} />
            </span>
            fatesck<span className="brand-dot">.</span>
          </div>
          <Badge tone="light">PROJETO ACADÊMICO</Badge>
          <h1>
            Um espaço para
            <br />
            aprender juntos.
          </h1>
          <p>
            Suas turmas, atividades e conversas.
            <br />
            Tudo no mesmo lugar.
          </p>
          <div className="login-feature">
            <BookOpen /> Acompanhe suas disciplinas
          </div>
          <div className="login-feature">
            <ClipboardList /> Organize as suas entregas
          </div>
          <div className="login-feature">
            <MessageSquare /> Converse com a turma
          </div>
          <small>Versão inicial · Plataforma educacional</small>
        </section>
        <section className="login-panel">
          <div className="login-box">
            <span className="eyebrow">BEM-VINDO AO FATESCK</span>
            <h2>Vamos começar?</h2>
            <p>Escolha um perfil para explorar o projeto.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSigned(true);
              }}
            >
              <label htmlFor="role">Perfil de demonstração</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                {Object.entries(roleLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <div className="demo-identity">
                <span className="avatar">
                  {identities[role]
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </span>
                <div>
                  <strong>{identities[role]}</strong>
                  <small>Conta fictícia · {roleLabels[role]}</small>
                </div>
              </div>
              <button className="primary full">
                Entrar na demonstração <ArrowRight size={18} />
              </button>
            </form>
            <div className="demo-note">
              <Shield size={19} />
              <p>
                Ambiente de demonstração, sem autenticação real ou criptografia
                ponta a ponta. Use apenas dados fictícios.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  return (
    <div className="app-shell">
      <a href="#content" className="skip-link">
        Ir para o conteúdo
      </a>
      {menu && (
        <button
          className="scrim"
          aria-label="Fechar menu"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("inicio");
          }}
          className="brand"
        >
          <span className="brand-icon">
            <GraduationCap size={25} />
          </span>
          fatesck<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">PORTAL ACADÊMICO</div>
        <nav aria-label="Menu principal">
          {navigation
            .filter((n) => n.id !== "usuarios" || role === "administrador")
            .map((n) => (
              <button
                key={n.id}
                className={`nav-item ${view === n.id ? "active" : ""}`}
                aria-current={view === n.id ? "page" : undefined}
                onClick={() => go(n.id)}
              >
                <n.icon size={20} />
                {n.label}
                {n.id === "atividades" && pending.length > 0 && (
                  <span className="nav-count">{pending.length}</span>
                )}
              </button>
            ))}
        </nav>
        <div className="sidebar-footer">
          <div className="version">
            <span /> Versão de demonstração
          </div>
          <p>
            Um projeto em construção.
            <br />
            Uma turma de cada vez.
          </p>
          <button
            className="nav-item"
            onClick={() => {
              setSigned(false);
              go("inicio");
            }}
          >
            <LogOut size={19} />
            Sair da demonstração
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label="Abrir menu"
              aria-expanded={menu}
            >
              <Menu />
            </button>
            <span>Meu espaço</span>
            <ChevronRight size={15} />
            <strong>{navigation.find((n) => n.id === view)?.label}</strong>
          </div>
          <div className="top-profile">
            <span className="demo-tag">DEMO</span>
            <span className="profile-text">
              <strong>{identities[role]}</strong>
              <small>{roleLabels[role]}</small>
            </span>
            <span className="avatar">
              {identities[role]
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </span>
          </div>
        </header>
        <main id="content" className="content">
          <div className="demo-banner">
            <Shield size={16} />
            <span>
              Dados fictícios, salvos neste navegador. Mensagens sem
              criptografia nesta versão.
            </span>
          </div>
          {storageError && (
            <p className="error" role="alert">
              {storageError}
            </p>
          )}
          {view === "inicio" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">SEU SEMESTRE, MAIS ORGANIZADO</span>
                  <h1>
                    Olá, {identities[role].split(" ")[0]}{" "}
                    <span className="hello-dot">✷</span>
                  </h1>
                  <p>
                    {role === "aluno"
                      ? "Veja o que está acontecendo nas suas turmas."
                      : "Acompanhe as turmas e as entregas dos alunos."}
                  </p>
                </div>
                <button className="secondary" onClick={() => go("atividades")}>
                  <CalendarDays size={17} />
                  Ver atividades
                </button>
              </div>
              <div className="stats">
                <div>
                  <span className="stat-icon blue">
                    <BookOpen />
                  </span>
                  <div>
                    <strong>{data.classes.length}</strong>
                    <span>Turmas ativas</span>
                  </div>
                </div>
                <div>
                  <span className="stat-icon orange">
                    <Clock3 />
                  </span>
                  <div>
                    <strong>{pending.length}</strong>
                    <span>Atividades pendentes</span>
                  </div>
                </div>
                <div>
                  <span className="stat-icon green">
                    <CheckCircle2 />
                  </span>
                  <div>
                    <strong>{data.submissions.length}</strong>
                    <span>Entregas realizadas</span>
                  </div>
                </div>
                <div>
                  <span className="stat-icon purple">
                    <GraduationCap />
                  </span>
                  <div>
                    <strong>
                      {reviewed.length
                        ? (
                            reviewed.reduce((n, s) => n + (s.grade ?? 0), 0) /
                            reviewed.length
                          )
                            .toFixed(1)
                            .replace(".", ",")
                        : "—"}
                    </strong>
                    <span>Média das avaliações</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-grid">
                <section>
                  <div className="section-heading">
                    <h2>Próximas entregas</h2>
                    <button
                      className="text-button"
                      onClick={() => go("atividades")}
                    >
                      Ver todas <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="panel">
                    {pending.length ? (
                      pending
                        .slice()
                        .sort((a, b) => a.due.localeCompare(b.due))
                        .slice(0, 4)
                        .map((a) => <ActivityRow a={a} key={a.id} />)
                    ) : (
                      <Empty>Tudo em dia! Não há atividades pendentes.</Empty>
                    )}
                  </div>
                  <div className="section-heading space-top">
                    <h2>Suas turmas</h2>
                    <button
                      className="text-button"
                      onClick={() => go("turmas")}
                    >
                      Ver todas <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="class-grid">
                    {data.classes.slice(0, 3).map((c) => (
                      <ClassCard id={c.id} key={c.id} />
                    ))}
                  </div>
                </section>
                <aside className="right-column">
                  <section className="semester-card">
                    <span className="eyebrow">PASSO A PASSO</span>
                    <h2>
                      Seu projeto começa
                      <br />
                      com uma entrega.
                    </h2>
                    <p>
                      Acompanhe as atividades e reserve um tempo para avançar em
                      cada disciplina.
                    </p>
                    <button onClick={() => go("atividades")}>
                      Continuar estudando <ArrowRight size={17} />
                    </button>
                  </section>
                  <section className="panel overview">
                    <h2>Últimas conversas</h2>
                    {data.messages
                      .slice(-3)
                      .reverse()
                      .map((m) => (
                        <button
                          key={m.id}
                          className="conversation-preview"
                          onClick={() => {
                            go("mensagens");
                            setRoom(m.classId);
                          }}
                        >
                          <span className="small-avatar">{m.author[0]}</span>
                          <span>
                            <strong>{m.author}</strong>
                            <small>{m.text}</small>
                            <em>
                              {
                                data.classes.find((c) => c.id === m.classId)
                                  ?.name
                              }
                            </em>
                          </span>
                        </button>
                      ))}
                  </section>
                </aside>
              </div>
            </>
          )}
          {view === "turmas" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>{currentClass ? currentClass.name : "Turmas"}</h1>
                  <p>
                    {currentClass
                      ? currentClass.description
                      : "Suas disciplinas e os materiais de cada turma."}
                  </p>
                </div>
                {role !== "aluno" && (
                  <button className="primary" onClick={() => setModal("class")}>
                    <Plus size={18} />
                    Nova turma
                  </button>
                )}
              </div>
              {currentClass ? (
                <>
                  <button
                    className="text-button mb"
                    onClick={() => setDetail(null)}
                  >
                    ← Voltar para turmas
                  </button>
                  <div className="panel class-detail">
                    <Badge tone={currentClass.color}>{currentClass.code}</Badge>
                    <p>Prof. {currentClass.teacher}</p>
                    <p>
                      <CalendarDays size={18} />
                      {currentClass.schedule}
                    </p>
                    <button
                      className="secondary"
                      onClick={() => {
                        setRoom(currentClass.id);
                        go("mensagens");
                      }}
                    >
                      <MessageSquare size={17} />
                      Abrir conversa da turma
                    </button>
                  </div>
                  <div className="section-heading">
                    <h2>Atividades da turma</h2>
                    {role !== "aluno" && (
                      <button
                        className="text-button"
                        onClick={() => setModal("activity")}
                      >
                        Nova atividade <Plus size={17} />
                      </button>
                    )}
                  </div>
                  <div className="panel">
                    {data.activities.filter(
                      (a) => a.classId === currentClass.id,
                    ).length ? (
                      data.activities
                        .filter((a) => a.classId === currentClass.id)
                        .map((a) => <ActivityRow a={a} key={a.id} />)
                    ) : (
                      <Empty>Nenhuma atividade publicada nesta turma.</Empty>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="toolbar">
                    <div className="search">
                      <Search size={18} />
                      <input
                        aria-label="Buscar turma"
                        placeholder="Buscar turma ou código…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <span>{data.classes.length} turmas</span>
                  </div>
                  <div className="class-grid wide">
                    {data.classes
                      .filter((c) =>
                        `${c.name} ${c.code}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((c) => (
                        <ClassCard key={c.id} id={c.id} />
                      ))}
                  </div>
                  {!data.classes.some((c) =>
                    `${c.name} ${c.code}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  ) && <Empty>Nenhuma turma encontrada.</Empty>}
                </>
              )}
            </>
          )}
          {view === "atividades" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Atividades</h1>
                  <p>
                    {role === "aluno"
                      ? "Organize os prazos e acompanhe suas entregas."
                      : "Publique atividades e avalie as entregas da turma."}
                  </p>
                </div>
                {role !== "aluno" && (
                  <button
                    className="primary"
                    onClick={() => setModal("activity")}
                  >
                    <Plus size={18} />
                    Nova atividade
                  </button>
                )}
              </div>
              <div className="toolbar wrap">
                <div className="search">
                  <Search size={18} />
                  <input
                    aria-label="Buscar atividade"
                    placeholder="Buscar atividade…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filtrar por turma"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="all">Todas as turmas</option>
                  {data.classes.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filtrar por status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  {["Pendente", "Entregue", "Avaliada", "Atrasada"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="panel">
                {(() => {
                  const rows = data.activities.filter(
                    (a) =>
                      (classFilter === "all" || a.classId === classFilter) &&
                      (statusFilter === "all" || status(a) === statusFilter) &&
                      a.title.toLowerCase().includes(query.toLowerCase()),
                  );
                  return rows.length ? (
                    rows.map((a) => <ActivityRow a={a} key={a.id} />)
                  ) : (
                    <Empty>
                      Nenhuma atividade encontrada com esses filtros.
                    </Empty>
                  );
                })()}
              </div>
            </>
          )}
          {view === "mensagens" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Mensagens</h1>
                  <p>Converse sobre as aulas e o andamento do projeto.</p>
                </div>
                <Badge>Conversa local de demonstração</Badge>
              </div>
              <div className="chat panel">
                <aside className="rooms">
                  <h2>Conversas das turmas</h2>
                  {data.classes.map((c) => (
                    <button
                      key={c.id}
                      className={currentRoom?.id === c.id ? "selected" : ""}
                      onClick={() => setRoom(c.id)}
                    >
                      <span className={`activity-icon ${c.color}`}>
                        <MessageSquare size={18} />
                      </span>
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.code}</small>
                      </span>
                    </button>
                  ))}
                </aside>
                <section className="chat-main">
                  <div className="chat-heading">
                    <h2>{currentRoom?.name}</h2>
                    <small>As mensagens ficam apenas neste navegador.</small>
                  </div>
                  <div
                    className="messages"
                    aria-label="Histórico de mensagens"
                    role="log"
                  >
                    {data.messages
                      .filter((m) => m.classId === currentRoom?.id)
                      .map((m) => (
                        <div
                          key={m.id}
                          className={`message ${m.role === role ? "mine" : ""}`}
                        >
                          <strong>{m.author}</strong>
                          <p>{m.text}</p>
                          <small>
                            {formatDate(m.createdAt)} ·{" "}
                            {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                      ))}
                    {!data.messages.some(
                      (m) => m.classId === currentRoom?.id,
                    ) && <Empty>Comece a conversa desta turma.</Empty>}
                  </div>
                  <form className="message-form" onSubmit={send}>
                    <input
                      aria-label="Mensagem"
                      placeholder="Escreva uma mensagem…"
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="primary"
                      disabled={!message.trim()}
                      aria-label="Enviar mensagem"
                    >
                      <Send size={19} />
                    </button>
                  </form>
                </section>
              </div>
            </>
          )}
          {view === "usuarios" && role === "administrador" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Usuários</h1>
                  <p>Contas fictícias para testar a gestão de acesso.</p>
                </div>
                <Badge>{data.users.length} usuários</Badge>
              </div>
              <div className="panel table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th>Ação demonstrativa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{roleLabels[u.role]}</td>
                        <td>
                          <Badge tone={u.active ? "green" : "neutral"}>
                            {u.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td>
                          <button
                            className="text-button"
                            disabled={u.role === "administrador"}
                            onClick={() => {
                              update({
                                ...data,
                                users: data.users.map((x) =>
                                  x.id === u.id
                                    ? { ...x, active: !x.active }
                                    : x,
                                ),
                              });
                              setNotice(
                                "Status demonstrativo atualizado. O acesso real depende do backend.",
                              );
                            }}
                          >
                            {u.active ? "Desativar" : "Ativar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="muted mt">
                Este cadastro é demonstrativo. Alterar o status não bloqueia a
                seleção de perfis da demonstração.
              </p>
            </>
          )}
          {view === "configuracoes" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Configurações</h1>
                  <p>Explore os perfis e conheça os limites desta versão.</p>
                </div>
              </div>
              <div className="settings-grid">
                <section className="panel settings-card">
                  <h2>Perfil de demonstração</h2>
                  <p>
                    Troque de perfil para testar cada parte do projeto. Os dados
                    de exemplo são compartilhados neste navegador.
                  </p>
                  <label htmlFor="switch-role">Visualizar como</label>
                  <select
                    id="switch-role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as Role);
                      setNotice("Perfil alterado.");
                    }}
                  >
                    {Object.entries(roleLabels).map(([k, v]) => (
                      <option value={k} key={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <div className="demo-identity">
                    <span className="avatar">{identities[role][0]}</span>
                    <div>
                      <strong>{identities[role]}</strong>
                      <small>{roleLabels[role]}</small>
                    </div>
                  </div>
                </section>
                <section className="panel settings-card">
                  <h2>Segurança e dados</h2>
                  <p>
                    A documentação prevê criptografia ponta a ponta. Esta
                    primeira versão valida apenas as telas e os fluxos.
                  </p>
                  <ul className="plain-list">
                    <li>Autenticação real: pendente</li>
                    <li>Criptografia de mensagens e arquivos: pendente</li>
                    <li>Integração com servidor: pendente</li>
                    <li>Dados locais: somente para demonstração</li>
                  </ul>
                </section>
                <section className="panel settings-card">
                  <h2>Recomeçar a demonstração</h2>
                  <p>
                    Remove as alterações locais e restaura as turmas, atividades
                    e mensagens de exemplo.
                  </p>
                  <button
                    className="danger-button"
                    onClick={() => setModal("reset")}
                  >
                    Restaurar dados de exemplo
                  </button>
                </section>
              </div>
            </>
          )}
          <footer className="content-footer">
            <span>Fatesck · Projeto acadêmico</span>
            <span>Feito para aprender e evoluir.</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {modal === "class" && (
        <Modal title="Nova turma" onClose={() => setModal(null)}>
          <form className="form" onSubmit={createClass}>
            <label>
              Nome da disciplina
              <input name="name" required maxLength={80} />
            </label>
            <label>
              Código da turma
              <input
                name="code"
                required
                maxLength={20}
                placeholder="Ex.: WEB-2026"
              />
            </label>
            <label>
              Descrição
              <textarea name="description" required maxLength={300} />
            </label>
            <label>
              Horário das aulas
              <input
                name="schedule"
                maxLength={100}
                placeholder="Ex.: Segunda · 19h às 20h40"
              />
            </label>
            <button className="primary">Criar turma</button>
          </form>
        </Modal>
      )}
      {modal === "activity" && (
        <Modal title="Nova atividade" onClose={() => setModal(null)}>
          <form className="form" onSubmit={createActivity}>
            <label>
              Título
              <input name="title" required maxLength={100} />
            </label>
            <label>
              Turma
              <select
                name="classId"
                defaultValue={detail ?? data.classes[0]?.id}
              >
                {data.classes.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prazo de entrega
              <input type="date" name="due" required />
            </label>
            <label>
              Orientações
              <textarea name="description" rows={4} required maxLength={4000} />
            </label>
            <button className="primary">Publicar atividade</button>
          </form>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="Restaurar a demonstração?" onClose={() => setModal(null)}>
          <p>
            As turmas criadas, entregas, avaliações e mensagens locais serão
            removidas.
          </p>
          <div className="dialog-actions">
            <button className="secondary" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button
              className="danger-button"
              onClick={() => {
                update(createDemoData());
                setRoom("web");
                setModal(null);
                setNotice("Dados de exemplo restaurados.");
              }}
            >
              Sim, restaurar
            </button>
          </div>
        </Modal>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="activity-meta">
            <Badge tone={tone(selected)}>{status(selected)}</Badge>
            <span>Entrega até {formatDate(selected.due)}</span>
          </div>
          <p className="activity-description">{selected.description}</p>
          {(() => {
            const s = data.submissions.find(
              (s) => s.activityId === selected.id,
            );
            return (
              <>
                {s && (
                  <div className="submission">
                    <strong>Entrega de {identities.aluno}</strong>
                    <p>{s.text}</p>
                    <small>Enviada em {formatDate(s.submittedAt)}</small>
                    {s.grade !== undefined && (
                      <div className="feedback">
                        <strong>
                          Nota: {s.grade.toFixed(1).replace(".", ",")} / 10
                        </strong>
                        <p>{s.feedback || "Sem comentário adicional."}</p>
                      </div>
                    )}
                  </div>
                )}
                {role === "aluno" ? (
                  s?.grade !== undefined ? (
                    <p className="muted">Esta entrega já foi avaliada.</p>
                  ) : (
                    <form className="form" onSubmit={submit}>
                      <label>
                        {s ? "Editar entrega" : "Sua entrega"}
                        <textarea
                          name="text"
                          defaultValue={s?.text ?? ""}
                          rows={4}
                          required
                          maxLength={5000}
                          placeholder="Escreva sua resposta ou cole o link do repositório…"
                        />
                      </label>
                      <small className="muted">
                        Nesta versão, a entrega aceita texto e links. Arquivos
                        serão implementados depois.
                      </small>
                      <button className="primary">
                        {s ? "Atualizar entrega" : "Enviar atividade"}
                      </button>
                    </form>
                  )
                ) : s ? (
                  <form className="form" onSubmit={grade}>
                    <label>
                      Nota (0 a 10)
                      <input
                        type="number"
                        name="grade"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        defaultValue={s.grade}
                      />
                    </label>
                    <label>
                      Comentário
                      <textarea
                        name="feedback"
                        maxLength={2000}
                        defaultValue={s.feedback}
                      />
                    </label>
                    <button className="primary">Salvar avaliação</button>
                  </form>
                ) : (
                  <Empty>Aguardando a entrega do aluno.</Empty>
                )}
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
