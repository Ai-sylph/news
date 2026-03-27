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
const newsData = [
    {
        id: 1,
        category: "規制改正",
        date: "2026-03-27", // 今日
        title: "労働安全衛生法改正案：高所作業でのスマート検知デバイス着用が努力義務に",
        lines: [
            "政府は建設・電気工事現場での墜落事故を防ぐため、新たな労働安全衛生法の改正案を発表。",
            "高所作業員に対して、傾きや急加速をAIで検知し管理者に警告を送るスマートデバイスの着用を努力義務化。",
            "来春の施行に向け、各企業は対応デバイスの選定と導入コストの確保が急務となる。"
        ],
        impacts: ["safety", "cost"],
        importanceScore: 100
    },
    {
        id: 2,
        category: "蓄電池",
        date: "2026-03-27", // 今日
        title: "次世代全固体電池の量産化技術が確立、施工現場の負担軽減へ",
        lines: [
            "国内メーカーが産業用全固体蓄電池の量産化技術を確立し、年内にも住宅・店舗向けを出荷開始。",
            "従来のリチウムイオン電池に比べ重量・体積ともに30%削減され、搬入や壁掛け設置の施工負担が大幅に減少。",
            "発火リスクが極めて低いため、消防法の離隔距離規制が緩和される見通しで、設置場所の自由度も向上する。"
        ],
        impacts: ["site", "safety"],
        importanceScore: 95
    },
    {
        id: 3,
        category: "AI",
        date: "2026-03-24", // 3日前
        title: "施工図の自動生成AI「Auto-Denko」が登場、見積作成も連動",
        lines: [
            "建築平面図を読み込ませるだけで、最適な配線ルートと分電盤配置をAIが自動計算・作図するソフトがリリース。",
            "図面データから必要なケーブル長や部材を自動で拾い出し、そのまま見積書を生成する機能を搭載。",
            "現場調査後の事務作業時間を最大70%削減し、中小の電気工事会社の業務効率化に大きく寄与する見込み。"
        ],
        impacts: ["cost", "management"],
        importanceScore: 88
    },
    {
        id: 4,
        category: "重大事故",
        date: "2026-03-26", // 昨日
        title: "大型商業施設で太陽光パネルからの漏電火災、施工不良が原因か",
        lines: [
            "昨日未明、関東の大型商業施設の屋上に設置された太陽光パネルから出火する事故が発生。",
            "初期調査でケーブルの保護管未設置による被覆劣化と、接続部の圧着不良などの施工ミスが原因と見られる。",
            "業界団体は同型設備の緊急点検を呼びかけており、施工業者に対する責任追及と再発防止策が求められている。"
        ],
        impacts: ["safety", "management"],
        importanceScore: 85
    },
    {
        id: 5,
        category: "EV充電",
        date: "2026-03-27", // 今日
        title: "マンション向けEV充電器の補助金拡充、充電器設置ラッシュへ",
        lines: [
            "経済産業省は、既存マンションにおけるEV充電器の設置補助金を従来の2倍に引き上げると発表。",
            "共用電源からのピークカット制御付きモデルが対象となり、受電設備の容量増設を伴わない施工が主流に。",
            "需要の急増に対し、電気工事士の確保とマンション管理組合との合意形成サポートがビジネスチャンスとなる。"
        ],
        impacts: ["cost", "site"],
        importanceScore: 80
    },
    {
        id: 6,
        category: "ドローン",
        date: "2026-03-20", // 1週間前
        title: "送電線・鉄塔点検特化の自律型ドローン、地方電力で本格稼働",
        lines: [
            "山間部の鉄塔や送電線の点検を、GPSと画像認識AIを搭載した自律型ドローンで完全無人化する運用が開始。",
            "高所作業車の入れない場所での点検作業員の墜落リスクがゼロになり、点検費用も大幅に削減される。",
            "今後は一般の太陽光発電所や大型工場の屋上点検など、民間工事現場への技術転用が期待されている。"
        ],
        impacts: ["safety", "site", "cost"],
        importanceScore: 75
    },
    {
        id: 7,
        category: "ロボ",
        date: "2026-03-15", // 過去
        title: "天井配線アシストロボットの実証実験、負担軽減効果を確認",
        lines: [
            "ゼネコン各社が共同開発した、上向き作業をアシストする配線ロボットの大規模な実証実験が完了した。",
            "作業者の腕の疲労を軽減し、脚立上での不安定な姿勢を無くすことで、作業効率が平均20%向上。",
            "リース価格の低下が進めば、中小規模のオフィス改修工事などでも標準的な機材になる可能性がある。"
        ],
        impacts: ["site", "safety"],
        importanceScore: 70
    },
    {
        id: 8,
        category: "EV車",
        date: "2026-03-26", // 昨日
        title: "商用EVバンの航続距離が大幅向上、電気工事車両のEV化が加速",
        lines: [
            "大手自動車メーカーが、バッテリー容量を従来比1.5倍に引き上げた新型キャンバス型EVを発表。",
            "工事車両として機材をフル積載した状態でも実用十分な航続距離を確保し、現場間の移動不安を解消。",
            "V2L（車から機材への給電機能）を標準搭載しているため、発電機なしで電動工具が利用可能となる。"
        ],
        impacts: ["site", "cost"],
        importanceScore: 68
    },
    {
        id: 9,
        category: "電気工事の新技術",
        date: "2026-03-27", // 今日
        title: "自己修復型ケーブル絶縁シートの開発成功、劣化対策に革新",
        lines: [
            "素材メーカーが、微細な傷を自然修復する特殊ポリマーを用いたケーブル保護シートを発表。",
            "過酷な環境下での紫外線劣化やネズミ被害などによる被覆の損傷を軽減し、漏電リスクを根本から低減。",
            "材料費は既存品の約1.3倍となるが、長寿命化によるランニングコスト削減効果が期待される。"
        ],
        impacts: ["safety", "cost"],
        importanceScore: 82
    },
    {
        id: 10,
        category: "自動運転",
        date: "2026-03-10", // 過去
        title: "資材搬入の無人自動運転トラック、指定ルートでの特区解禁",
        lines: [
            "都心部の大規模再開発エリアにおいて、資材倉庫から現場までの無人自動運転トラックの試験運行が開始。",
            "夜間の自動搬入が可能となり、道路渋滞の回避およびドライバー不足問題の解消を目指す。",
            "現場の受け入れ体制として、荷受けロボットとの連携システムの構築が施工管理者側の課題となる。"
        ],
        impacts: ["management", "site"],
        importanceScore: 65
    },
    {
        id: 11,
        category: "省エネ",
        date: "2026-03-25", // 一昨日
        title: "次世代ZEB向け直流給電システム、都内オフィスビルで初導入",
        lines: [
            "交流変換ロスを無くすビル内DC（直流）給電システムが、新たに建設される大規模ZEBに本格導入。",
            "太陽光パネルや蓄電池からの電力を効率よく消費でき、ビル運用時のランニングコストを約15%削減。",
            "直流専用の分電盤や専用コンセントなど、これまでの交流とは異なる施工基準への対応が急務となる。"
        ],
        impacts: ["site", "cost"],
        importanceScore: 92
    },
    {
        id: 12,
        category: "防災",
        date: "2026-03-27", // 今日
        title: "水没検知で自動遮断・分離する高機能分電盤の義務化議論",
        lines: [
            "毎年のように発生する水害による感電・トラッキング火災を防ぐため、国交省が新たな設備の導入を検討。",
            "浸水をセンサーで検知し、水没エリアの回路のみを物理的に遮断して上層階の電力を維持する分電盤の開発が進む。",
            "既存住宅の改修工事において、防災設備の更新提案が大きな受注増加の機会となる。"
        ],
        impacts: ["safety", "management"],
        importanceScore: 87
    },
    {
        id: 13,
        category: "宇宙開発",
        date: "2026-03-01", // 過去
        title: "月面基地建設の電源配線プロジェクト、地上での模擬施工が開始",
        lines: [
            "国際宇宙探査プロジェクトの一環で、月面の過酷な温度変化に耐える特殊配線網の模擬施工実験がドーム内で開始。",
            "宇宙飛行士の船外活動時間を極小化するため、配線コネクタのワンタッチ接続化技術がメインテーマ。",
            "この極限環境で培われたワンタッチ結線や被覆技術は、将来の地上の電気工事における省力化技術に応用される見込み。"
        ],
        impacts: ["site", "management"],
        importanceScore: 60
    }
];

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
document.addEventListener('DOMContentLoaded', () => {
    // 日付設定
    const dateEl = document.getElementById('current-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    selectedDate = `${year}-${month}-${day}`;
    
    dateEl.value = selectedDate;

    dateEl.addEventListener('change', (e) => {
        if (e.target.value) {
            selectedDate = e.target.value;
            renderNews();
        }
    });

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
    const filteredNews = newsData.filter(news => news.date === selectedDate);

    // スコアでソート (重要度順)
    const sortedNews = [...filteredNews].sort((a, b) => b.importanceScore - a.importanceScore);

    let html = '';

    if (sortedNews.length === 0) {
        html = `
            <div style="text-align:center; padding: 3rem 1rem; color: var(--text-secondary); background: var(--glass-bg); border-radius: 12px; border: 1px solid var(--glass-border);">
                <span class="material-symbols-outlined" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">calendar_today</span>
                <p>選択された日付のニュースはありません。</p>
            </div>
        `;
        container.innerHTML = html;
        return;
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

        html += `
            <article class="news-card" data-rank="${rank}" style="animation-delay: ${animationDelay}s">
                <div class="rank-display">
                    <span class="rank-text">Rank</span>
                    <span class="rank-number">${rank}</span>
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="category-tag">${news.category}</span>
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
