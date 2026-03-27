// モックデータ：全体の要約（電気工事の現場・施工管理・見積・安全への影響）
const globalSummary = {
    site: {
        title: "現場への影響",
        icon: "construction",
        class: "sc-field",
        text: "省エネ機器や蓄電池の小型化・モジュール化が進み、搬入や設置の手間が軽減される見込み。また、ドローンによる高所点検の導入が現場作業の一部になりつつある。"
    },
    management: {
        title: "施工管理への影響",
        icon: "engineering",
        class: "sc-management",
        text: "AIを活用した進捗管理・図面チェックツールの普及により、手戻りの防止や報告書作成の自動化が期待できる。遠隔での現場確認も容易になっている。"
    },
    estimate: {
        title: "見積への影響",
        icon: "request_quote",
        class: "sc-estimate",
        text: "EV充電器や蓄電池の価格競争が激化しており、部材調達コストの変動に注意が必要。新技術（AI、ロボ）導入の初期コストを加味した提案力が求められる。"
    },
    safety: {
        title: "安全面への影響",
        icon: "health_and_safety",
        class: "sc-safety",
        text: "重大事故の事例共有により、作業規定の厳格化が進む。同時に、スマートヘルメットやカメラAIによる危険予知で、事故防止策は大きく高度化している。"
    }
};

// モックデータ：全13カテゴリ
// "電気工事の新技術", "重大事故", "AI", "ロボ", "ドローン", "蓄電池", "EV充電", "EV車", "自動運転", "省エネ", "防災", "規制改正", "宇宙開発"
// 当日の更新がない場合は過去の日付データを持たせる
let newsData = []; // デーモン/ファイルから取得するように変更

function getFormattedDateInfo(dateStr) {
    const today = new Date('2026-03-27T00:00:00'); // モック用の現在日時基準（要件上は現在ですが仕様として固定）
    // 実際の現在の Date オブジェクトで比較する(要件での現在日に合わせる)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(currentDate - targetDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return { text: "今日更新", isNew: true, displayDate: dateStr };
    } else if (diffDays === 1) {
        return { text: "昨日", isNew: false, displayDate: dateStr };
    } else {
        return { text: `${diffDays}日前`, isNew: false, displayDate: dateStr };
    }
}

let selectedDate = '';

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    // 日付設定
    const dateEl = document.getElementById('current-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    selectedDate = `${year}-${month}-${day}`;
    
    dateEl.value = selectedDate;

    // 非同期でニュースデータを取得
    try {
        const response = await fetch('news.json');
        if (response.ok) {
            newsData = await response.json();
            console.log('ニュースデータを読み込みました: ', newsData.length, '件');
        } else {
            console.error('news.jsonの取得に失敗しました');
        }
    } catch (e) {
        console.error('fetch error:', e);
        // フォールバックがないことを明示
    }

    const handleDateChange = (e) => {
        if (e.target.value && e.target.value !== selectedDate) {
            selectedDate = e.target.value;
            renderNews();
        }
    };
    dateEl.addEventListener('change', handleDateChange);
    dateEl.addEventListener('input', handleDateChange);

    // 全体要約の描画
    renderGlobalSummary();

    // ニュースの描画
    renderNews();
});

function renderGlobalSummary() {
    const container = document.getElementById('global-summary-container');

    let html = `
        <div class="summary-header">
            <span class="material-symbols-outlined logo-icon">insights</span>
            <h2>本日のニュースが電気工事に与える影響</h2>
        </div>
        <div class="summary-grid">
    `;

    Object.values(globalSummary).forEach(item => {
        html += `
            <div class="summary-card">
                <span class="material-symbols-outlined summary-card-icon ${item.class}">${item.icon}</span>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderNews() {
    const container = document.getElementById('news-list-container');

    // Filter by selectedDate
    let filteredNews = newsData.filter(news => news.date === selectedDate);
    let isRandom = false;

    if (filteredNews.length === 0) {
        // Pick 5 random items
        const shuffled = [...newsData].sort(() => 0.5 - Math.random());
        filteredNews = shuffled.slice(0, 5).map(news => ({...news, isRandomlySelected: true}));
        isRandom = true;
    }

    // スコアでソート (重要度順)
    const sortedNews = [...filteredNews].sort((a, b) => b.importanceScore - a.importanceScore);

    let html = '';

    if (isRandom) {
        html += `
            <div style="text-align:center; padding: 1rem; margin-bottom: 1.5rem; color: var(--text-secondary); background: rgba(210, 153, 34, 0.05); border-radius: 12px; border: 1px solid rgba(210, 153, 34, 0.2);">
                <span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 0.5rem; color: var(--accent-orange);">shuffle</span>
                選択された日付のニュースがないため、過去の関連記事をランダムに5件表示しています。
            </div>
        `;
    }

    sortedNews.forEach((news, index) => {
        const rank = index + 1;
        const animationDelay = index * 0.1; // 順次フェードイン用

        // 日付・ステータスの取得
        const dateInfo = getFormattedDateInfo(news.date);
        let dateBadgeHtml = '';
        if (dateInfo.isNew) {
            dateBadgeHtml = `<span class="date-badge new"><span class="material-symbols-outlined" style="font-size:14px;">new_releases</span>${dateInfo.text}</span>`;
        } else {
            // 過去ニュースの場合
            dateBadgeHtml = `<span class="date-badge past" title="${dateInfo.displayDate}"><span class="material-symbols-outlined" style="font-size:14px;">history</span>${dateInfo.text}のニュース</span>`;
        }

        if (news.isRandomlySelected) {
            dateBadgeHtml += `<span class="date-badge random"><span class="material-symbols-outlined" style="font-size:14px;">shuffle</span>ランダムピックアップ</span>`;
        }

        // 3行要約の生成
        const summaryHtml = news.lines.map(line => `<span class="summary-line">• ${line}</span>`).join('');

        // タグの生成
        const tagsHtml = news.impacts.map(impact => {
            if (impact === 'cost') return `<span class="impact-badge cost"><span class="material-symbols-outlined" style="font-size:14px;">payments</span>コストの影響</span>`;
            if (impact === 'safety') return `<span class="impact-badge safety"><span class="material-symbols-outlined" style="font-size:14px;">gpp_maybe</span>安全面の影響</span>`;
            if (impact === 'site') return `<span class="impact-badge site"><span class="material-symbols-outlined" style="font-size:14px;">handyman</span>現場への影響</span>`;
            if (impact === 'management') return `<span class="impact-badge cost" style="background: rgba(47, 129, 247, 0.15); color: #79c0ff; border-color: rgba(47, 129, 247, 0.3)"><span class="material-symbols-outlined" style="font-size:14px;">assignment</span>施工管理への影響</span>`;
            return '';
        }).join('');

        // ニュース元とリンクの生成
        const sourceHtml = news.source ? `
            <a href="${news.url || '#'}" target="_blank" class="source-link">
               <span class="material-symbols-outlined" style="font-size:14px;">language</span> ${news.source} 
            </a>` : '';

        html += `
            <article class="news-card" data-rank="${rank}" style="animation-delay: ${animationDelay}s">
                <div class="rank-display">
                    <span class="rank-text">Rank</span>
                    <span class="rank-number">${rank}</span>
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="category-tag">${news.category || 'ニュース'}</span>
                        ${sourceHtml}
                        ${dateBadgeHtml}
                        ${tagsHtml}
                    </div>
                    <h3 class="card-title">${news.title}</h3>
                    <div class="card-summary">
                        ${summaryHtml}
                    </div>
                </div>
            </article>
        `;
    });

    container.innerHTML = html;
}
