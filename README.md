# Трекер навчання

Сайт проєкту «Трекер навчання»: головний екран із робочим демо, можливості, графік тижня й опис того, як це працює.

## Що в папці

```
lab1/
├── index.html          сторінка
├── style.css           стилі (світла й темна тема, адаптивність)
├── script.js           перемикач теми та інтерактивне демо трекера
├── .vscode/            налаштування й рекомендовані розширення для VS Code
├── .gitignore
└── README.md
```

## Як запустити

1. Відкрийте папку `lab1` у VS Code (File → Open Folder). Коли з'явиться пропозиція встановити рекомендовані розширення, погодьтеся.
2. Правою кнопкою на `index.html`, далі Open with Live Server (або кнопка Go Live внизу). Сторінка відкриється на `http://127.0.0.1:5500` і оновлюватиметься при збереженні файлів.

Без Live Server: у терміналі VS Code (Ctrl+`) виконайте `python -m http.server 8000` і відкрийте `http://localhost:8000`.

## Як опублікувати

Спершу створіть репозиторій на github.com з назвою `lab1-web` (без README, бо він уже є тут). Потім у терміналі VS Code:

```
git init
git add .
git commit -m "Lab 1: base web page"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГІН/lab1-web.git
git push -u origin main
```

Далі на вибір:

**GitHub Pages.** У репозиторії Settings → Pages → Source: Deploy from a branch → гілка `main`, папка `/ (root)` → Save. Через хвилину сайт буде на `https://ВАШ_ЛОГІН.github.io/lab1-web/`.

**Vercel.** На vercel.com увійдіть через GitHub → Add New → Project → виберіть `lab1-web` → Framework Preset: Other → Deploy.

## Скріншоти для опису

1. Сторінка в браузері з адресою `127.0.0.1:5500`.
2. VS Code з відкритою папкою проєкту й результатом `git --version` у терміналі.
3. Репозиторій на GitHub і опублікований сайт за посиланням.
