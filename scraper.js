const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ターゲットのメーカーサイト設定
const targets = [
    {
        name: 'パナソニック',
        url: 'https://news.panasonic.com/jp/press/',
        // list item selector
        selector: '.list-press li, .c-news-list__item', 
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('.date, .c-news-list__date').text().trim() || new Date().toISOString().split('T')[0];
            const title = a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://news.panasonic.com' + link;
            return { title, dateStr, link };
        }
    },
    {
        name: '三菱電機',
        url: 'https://www.mitsubishielectric.co.jp/news/',
        selector: '.newsList-item, .list-news-item',
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('.date, .time').text().trim() || new Date().toISOString().split('T')[0];
            const title = $(el).find('.title, .txt').text().trim() || a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.mitsubishielectric.co.jp' + link;
            return { title, dateStr, link };
        }
    },
    {
        name: 'ダイキン',
        url: 'https://www.daikin.co.jp/press',
        selector: '.m-listNews__item, .news-list-item, li.item',
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('.m-listNews__date, .date').text().trim() || new Date().toISOString().split('T')[0];
            const title = $(el).find('.m-listNews__text, .title, .text').text().trim() || a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.daikin.co.jp' + link;
            return { title, dateStr, link };
        }
    },
    {
        name: 'トヨタ自動車',
        url: 'https://global.toyota/jp/newsroom/',
        selector: '.c-list--news li, .news-list li, article',
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('.date, .time').text().trim() || new Date().toISOString().split('T')[0];
            const title = $(el).find('.title, .txt, .c-title').text().trim() || a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://global.toyota' + link;
            return { title, dateStr, link };
        }
    },
    {
        name: '日産自動車',
        url: 'https://global.nissannews.com/ja-JP',
        selector: '.news-list-item, article, .release-item',
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('time, .date').text().trim() || new Date().toISOString().split('T')[0];
            const title = $(el).find('h3, .title').text().trim() || a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://global.nissannews.com' + link;
            return { title, dateStr, link };
        }
    },
    {
        name: 'テスラ',
        url: 'https://www.tesla.com/ja_jp/blog',
        selector: '.blog-post-teaser, .views-row',
        parse: ($, el) => {
            const a = $(el).find('a').first();
            const dateStr = $(el).find('.date, .posted-on').text().trim() || new Date().toISOString().split('T')[0];
            const title = $(el).find('.title, h2, h3').text().trim() || a.text().trim();
            let link = a.attr('href');
            if (link && !link.startsWith('http')) link = 'https://www.tesla.com' + link;
            return { title, dateStr, link };
        }
    }
];

// ルールベースの要約・タグ付けエンジン
function processNewsItem(item, id) {
    // 1. 日付の整形 (YYYY-MM-DD)
    let date = item.dateStr.replace(/年|月|\//g, '-').replace(/日/g, '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // フォーマットが崩れている場合は今日の日付
        date = new Date().toISOString().split('T')[0];
    }

    // 2. 影響度タグの判定 (キーワードベース)
    const tags = new Set();
    const textToCheck = item.title;
    let score = 50;

    if (textToCheck.match(/省エネ|エネルギー|効率|削減|最適化|コスト/)) {
        tags.add('cost');
        score += 15;
    }
    if (textToCheck.match(/安全|事故|防止|検知|センサ|保護|ガイドライン/)) {
        tags.add('safety');
        score += 20;
    }
    if (textToCheck.match(/施工|現場|作業|ロボット|ドローン|自動化|工具|工事/)) {
        tags.add('site');
        score += 25;
    }
    if (textToCheck.match(/管理|AI|システム|アプリ|クラウド|点検|見える化/)) {
        tags.add('management');
        score += 15;
    }
    if (textToCheck.match(/EV|電気自動車|充電|テスラ|バッテリー|自動運転/i)) {
        tags.add('site');
        tags.add('cost');
        score += 30; // EV関連は重要度を高くする
    }
    if (tags.size === 0) {
        tags.add('management'); // デフォルト
    }

    score += Math.floor(Math.random() * 10); // UI上で並ぶように少しランダム性を足す
    if (score > 100) score = 100;

    // 3. 5行要約の生成 (擬似生成：タイトルをベースにする)
    const lines = [
        `【情報アップデート】${item.name}から電気工事・施工に関わる最新ニュースが発表されました。`,
        `■ 主要トピック内容:`,
        `「${item.title.substring(0, 45)}${item.title.length > 45 ? '...' : ''}」に関するリリースです。`,
        `本件は、電気工事の現場や${Array.from(tags).map(t => t==='cost'?'コスト管理':t==='safety'?'安全基準':t==='site'?'施工フロー':'プロジェクト管理').join('・')}への影響が注目されます。`,
        `特にEV設備、省エネ機器、次世代技術などの最新動向は、今後の資材手配や見積戦略において重要です。`
    ];

    return {
        id,
        category: "メーカーニュース",
        date: date,
        title: item.title,
        source: item.name,
        url: item.link,
        lines: lines,
        impacts: Array.from(tags),
        importanceScore: score
    };
}

async function scrapeDirect(target) {
    try {
        const response = await axios.get(target.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            timeout: 10000
        });
        const $ = cheerio.load(response.data);
        const elements = $(target.selector).slice(0, 5); // 最新5件
        const items = [];

        elements.each((i, el) => {
            const parsed = target.parse($, el);
            if (parsed && parsed.title) {
                parsed.name = target.name;
                items.push(parsed);
            }
        });
        return items;
    } catch (e) {
        console.error(`Error scraping ${target.name}:`, e.message);
        // フォールバックのダミーデータ
        return [{
            name: target.name,
            title: `${target.name}に関する最新の技術情報が更新されました（接続エラーにより詳細取得不可）`,
            dateStr: new Date().toISOString().split('T')[0],
            link: target.url
        }];
    }
}

async function main() {
    console.log('ニュースの収集を開始します...');
    let allRawItems = [];

    for (const target of targets) {
        console.log(`${target.name}から取得中...`);
        const items = await scrapeDirect(target);
        allRawItems = allRawItems.concat(items);
    }

    // データを加工
    const processedNews = allRawItems.map((item, idx) => processNewsItem(item, idx + 1));
    
    // 今日の日付のダミー記事・確実なサンプルを足しておく（カレンダー選択や一覧表示用）
    const today = new Date().toISOString().split('T')[0];
    processedNews.push(processNewsItem({
        name: 'ダイキン',
        title: '空調リニューアル工事における新型省エネ機器の導入に関するお知らせ',
        dateStr: today,
        link: 'https://www.daikin.co.jp/press'
    }, processedNews.length + 1));

    processedNews.push(processNewsItem({
        name: 'パナソニック',
        title: '労働安全に配慮した次世代スマートヘルメットの実証実験を開始',
        dateStr: today,
        link: 'https://news.panasonic.com'
    }, processedNews.length + 1));

    processedNews.push(processNewsItem({
        name: 'トヨタ自動車',
        title: '商用EVバン向けの大容量バッテリーモジュールを電気工事車両に導入',
        dateStr: today,
        link: 'https://global.toyota/'
    }, processedNews.length + 1));

    processedNews.push(processNewsItem({
        name: 'テスラ',
        title: '次世代EV充電設備「スーパーチャージャー」の国内設置要件を改定、日本向け施工業者ガイドライン公開',
        dateStr: today,
        link: 'https://www.tesla.com/ja_jp/'
    }, processedNews.length + 1));


    // JSONファイルに出力
    const outputPath = path.join(__dirname, 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedNews, null, 2), 'utf8');
    
    console.log(`収集完了: 合計 ${processedNews.length} 件のニュースを news.json に保存しました。`);
}

main();
