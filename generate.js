/**
 * README Generator — reads config.json and produces README.md
 * Run:  node generate.js
 */

const fs   = require('fs');
const path = require('path');

const cfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
);
const t = cfg.theme;           // shorthand for theme colours
const u = cfg.username;

/* ── tiny helpers ─────────────────────────────────────────── */

const enc = (s) => encodeURIComponent(s);

const badge = (name, color, icon, logoColor = 'white') =>
  `![${name}](https://img.shields.io/badge/${enc(name)}-${color}?style=for-the-badge&logo=${icon}&logoColor=${logoColor})`;

const socialBadge = (label, url, icon, color) =>
  `[![${label}](https://img.shields.io/badge/${enc(label)}-${color}?style=for-the-badge&logo=${icon}&logoColor=white)](${url})`;

const divider =
  `<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">`;

function skillSection(title, emoji, items) {
  if (!items || items.length === 0) return '';
  let s = `### ${emoji} ${title}\n<p>\n`;
  items.forEach((i) => { s += `  ${badge(i.name, i.color, i.icon)}\n`; });
  s += `</p>\n\n`;
  return s;
}

/* ── build the markdown ───────────────────────────────────── */

let md = '';

// ── Header banners
md += `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&width=100%25&height=200&fontAlign=50&fontAlignY=40&fontColor=${t.text}&color=20:${t.gradient_start},80:${t.gradient_end}&text=${enc('Welcome to my profile!')}" width="100%" />
</p>\n\n`;

md += `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=venom&width=100%25&height=200&fontAlign=50&fontAlignY=50&fontSize=50&fontColor=${t.accent}&color=0:${t.gradient_start},100:${t.secondary_bg}&text=${enc('I am ' + cfg.name.split(' ')[0])}&animation=fadeIn" width="100%" />
</p>\n\n`;

// ── Typing SVG
const lines = cfg.typing_lines.map(enc).join(';');
md += `<p align="center">
  <a href="${cfg.website}">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=${t.accent}&background=${t.gradient_start}00&center=true&vCenter=true&random=false&width=600&height=100&lines=${lines}" alt="Typing SVG" />
  </a>
</p>\n\n`;

// ── Profile views
if (cfg.show.profile_views) {
  md += `<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${u}&label=Profile%20Views&color=${t.accent}&style=for-the-badge" alt="Profile Views" />
</p>\n\n`;
}

md += divider + '\n\n';

// ── About Me
md += `## <img src="https://media.giphy.com/media/iY8CRBdQXODJSCERIr/giphy.gif" width="30"> About Me\n\n`;
md += `> *${cfg.tagline}*\n\n`;
if (cfg.about.working_on)
  md += `- 🔭 I'm currently working on **${cfg.about.working_on}**\n`;
if (cfg.about.learning)
  md += `- 🌱 I'm currently learning **${cfg.about.learning}**\n`;
if (cfg.location)
  md += `- 📍 Based in **${cfg.location}**\n`;
if (cfg.website)
  md += `- 🌐 Portfolio — **[${cfg.website}](${cfg.website})**\n`;
if (cfg.email)
  md += `- 📫 Reach me at **[${cfg.email}](mailto:${cfg.email})**\n`;
if (cfg.about.fun_fact)
  md += `- ⚡ Fun fact: **${cfg.about.fun_fact}**\n`;
md += '\n' + divider + '\n\n';

// ── Tech Stack
md += `## <img src="https://media2.giphy.com/media/QssGEmpkyEOhBCb7e1/giphy.gif?cid=ecf05e47a0n3gi1bfqntqmob8g9aid1oyj2wr3ds3mg700bl&rid=giphy.gif" width="30"> Tech Stack\n\n`;
md += skillSection('Languages',              '💻', cfg.skills.languages);
md += skillSection('Frameworks & Libraries',  '🧩', cfg.skills.frameworks);
md += skillSection('Databases',              '🗄️', cfg.skills.databases);
md += skillSection('Tools & Platforms',      '🛠️', cfg.skills.tools);
md += skillSection('Learning Soon',          '📚', cfg.skills.learning_soon);
md += divider + '\n\n';

// ── GitHub Stats
md += `## <img src="https://media.giphy.com/media/iY8CRBdQXODJSCERIr/giphy.gif" width="30"> GitHub Stats\n\n`;

const statsQuery = `&bg_color=${t.gradient_start}&title_color=${t.accent}&text_color=${t.text}&icon_color=${t.accent}&border_color=${t.accent}`;

if (cfg.show.stats_card || cfg.show.streak_card) {
  md += `<p align="center">\n`;
  if (cfg.show.stats_card)
    md += `  <img src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true${statsQuery}" width="48%" alt="GitHub Stats" />\n`;
  if (cfg.show.streak_card)
    md += `  <img src="https://streak-stats.demolab.com?user=${u}&background=${t.gradient_start}&ring=${t.accent}&fire=${t.text}&currStreakLabel=${t.accent}&sideLabels=${t.text}&currStreakNum=${t.text}&sideNums=${t.text}&dates=${t.accent}&border=${t.accent}" width="48%" alt="GitHub Streak" />\n`;
  md += `</p>\n\n`;
}

if (cfg.show.top_languages) {
  md += `<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact${statsQuery}" width="40%" alt="Top Languages" />
</p>\n\n`;
}

if (cfg.show.activity_graph) {
  md += `<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&bg_color=${t.gradient_start}&color=${t.text}&line=${t.accent}&point=${t.text}&area=true&area_color=${t.accent}&border_color=${t.accent}" width="95%" alt="Activity Graph" />
</p>\n\n`;
}

md += divider + '\n\n';

// ── Featured Repos
if (cfg.featured_repos.length > 0) {
  md += `## 📌 Featured Repositories\n\n<p align="center">\n`;
  cfg.featured_repos.forEach((repo) => {
    const [owner, name] = repo.split('/');
    md += `  <a href="https://github.com/${repo}">
    <img src="https://github-readme-stats.vercel.app/api/pin/?username=${owner}&repo=${name}${statsQuery}" width="48%" />
  </a>\n`;
  });
  md += `</p>\n\n` + divider + '\n\n';
}

// ── Snake animation
if (cfg.show.snake_animation) {
  md += `## 🐍 Contribution Graph\n\n`;
  md += `<p align="center">
  <img src="https://raw.githubusercontent.com/${u}/${u}/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />
</p>\n\n` + divider + '\n\n';
}

// ── Connect With Me
md += `## 🤝 Connect With Me\n\n<p align="center">\n`;
cfg.socials.forEach((s) => {
  md += `  ${socialBadge(s.platform, s.url, s.icon, s.color)}\n`;
});
md += `</p>\n\n`;

// ── Footer
md += `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&width=100%25&height=200&fontAlign=50&fontAlignY=70&fontColor=${t.text}&color=20:${t.gradient_start},80:${t.gradient_end}&text=${enc("Let's connect!")}&section=footer&reversal=true&animation=fadeIn" width="100%" />
</p>\n`;

/* ── write ────────────────────────────────────────────────── */
fs.writeFileSync(path.join(__dirname, 'README.md'), md, 'utf8');
console.log('✅  README.md generated successfully from config.json');
