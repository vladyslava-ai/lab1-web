// Трекер навчання: перемикач теми та інтерактивне демо на головному екрані.
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  /* ---------- Тема ---------- */
  const root = document.documentElement;
  $("#theme").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* сховище недоступне */ }
  });

  /* ---------- Демо трекера ---------- */
  const DAYS = 7;
  const STEP = 30; // хвилин за одне натискання

  const SUBJECTS = [
    { name: "Python", goal: 360 },
    { name: "SQL", goal: 300 },
    { name: "Англійська", goal: 240 },
    { name: "Математика", goal: 180 },
  ];

  // Приклад сесій: [скільки днів тому, індекс предмета, хвилини]
  const SAMPLE = [
    [6, 0, 60], [5, 1, 90], [5, 2, 30], [4, 0, 45], [4, 3, 30], [3, 1, 60],
    [3, 2, 30], [2, 0, 45], [1, 1, 60], [1, 3, 30], [0, 2, 30],
  ];

  let sessions = [];
  const loadSample = () => {
    sessions = SAMPLE.map(([ago, subject, min]) => ({ ago, subject, min }));
  };

  function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} хв`;
    return m ? `${h} год ${m} хв` : `${h} год`;
  }

  function pluralDays(n) {
    const last = n % 10;
    const lastTwo = n % 100;
    if (last === 1 && lastTwo !== 11) return "день";
    if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) return "дні";
    return "днів";
  }

  function dayLabel(ago) {
    if (ago === 0) return "сьогодні";
    const date = new Date();
    date.setDate(date.getDate() - ago);
    return date.toLocaleDateString("uk-UA", { weekday: "short" });
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const subjectsEl = $("#subjects");
  const weekEl = $("#week-chart");
  const totalEl = $("#total");
  const streakEl = $("#streak");

  // Розмітку будуємо один раз, а при кожній зміні лише оновлюємо значення.
  // Так кнопка не перестворюється, і фокус клавіатури не губиться.
  const rows = SUBJECTS.map((subject, index) => {
    const li = make("li");
    const amount = make("span", "amount");
    const add = make("button", "btn small", `+${STEP} хв`);
    add.type = "button";
    add.setAttribute("aria-label", `Додати ${STEP} хвилин до предмета ${subject.name}`);
    add.addEventListener("click", () => {
      sessions.push({ ago: 0, subject: index, min: STEP });
      render();
    });

    const meter = make("div", "meter");
    meter.setAttribute("role", "progressbar");
    meter.setAttribute("aria-label", `${subject.name}, тижнева ціль`);
    meter.setAttribute("aria-valuemin", "0");
    meter.setAttribute("aria-valuemax", String(subject.goal));
    const fill = make("i");
    meter.append(fill);

    li.append(make("span", "name", subject.name), amount, add, meter);
    return { li, amount, meter, fill };
  });
  subjectsEl.append(...rows.map((row) => row.li));

  const columns = Array.from({ length: DAYS }, (_, position) => {
    const ago = DAYS - 1 - position;
    const li = make("li", ago === 0 ? "today" : "");
    const value = make("span", "val");
    const bar = make("span", "bar");
    const fill = make("i");
    bar.append(fill);
    li.append(value, bar, make("span", "day", dayLabel(ago)));
    return { ago, li, value, fill };
  });
  weekEl.append(...columns.map((column) => column.li));

  function render() {
    const perSubject = SUBJECTS.map(() => 0);
    const perDay = Array(DAYS).fill(0);
    for (const session of sessions) {
      perSubject[session.subject] += session.min;
      perDay[session.ago] += session.min;
    }

    totalEl.textContent = formatTime(perDay.reduce((sum, m) => sum + m, 0));

    // Серія днів поспіль: якщо сьогодні ще нічого немає, рахуємо від учорашнього дня.
    let streak = 0;
    for (let ago = perDay[0] > 0 ? 0 : 1; ago < DAYS && perDay[ago] > 0; ago++) streak++;
    streakEl.textContent = streak
      ? `${streak} ${pluralDays(streak)} поспіль`
      : "Серія почнеться з першої сесії";

    rows.forEach((row, i) => {
      const { goal } = SUBJECTS[i];
      const done = perSubject[i];
      row.fill.style.width = `${Math.min(100, (done / goal) * 100)}%`;
      row.meter.setAttribute("aria-valuenow", String(Math.min(done, goal)));
      row.li.classList.toggle("met", done >= goal);
      row.amount.textContent =
        `${formatTime(done)} з ${formatTime(goal)}` + (done >= goal ? ", ціль виконано" : "");
    });

    const scale = Math.max(180, ...perDay);
    columns.forEach((column) => {
      const minutes = perDay[column.ago];
      column.value.textContent = String(minutes);
      column.fill.style.height = `${(minutes / scale) * 100}%`;
    });
  }

  $("#reset").addEventListener("click", () => {
    loadSample();
    render();
  });

  loadSample();
  render();
})();
