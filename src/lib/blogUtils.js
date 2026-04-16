import xss from 'xss';

export function sanitizeContent(html) {
    return xss(html, {
        whiteList: {
            ...xss.whiteList,
            h1: ['style', 'class'],
            h2: ['style', 'class'],
            h3: ['style', 'class'],
            h4: ['style', 'class'],
            h5: ['style', 'class'],
            h6: ['style', 'class'],
            p: ['style', 'class'],
            div: ['style', 'class'],
            span: ['style', 'class'],
            img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
            iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'style', 'class'],
            blockquote: ['style', 'class'],
            pre: ['style', 'class'],
            code: ['style', 'class'],
            ul: ['style', 'class'],
            ol: ['style', 'class'],
            li: ['style', 'class'],
            table: ['style', 'class', 'border'],
            thead: [],
            tbody: [],
            tr: ['style', 'class'],
            td: ['style', 'class', 'colspan', 'rowspan'],
            th: ['style', 'class', 'colspan', 'rowspan'],
            a: ['href', 'title', 'target', 'style', 'class', 'rel'],
            br: [],
            b: [],
            i: [],
            u: [],
            strong: [],
            em: [],
            s: []
        },
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script', 'style'] // Careful with style tags if you want custom css
    });
}

export function calculateReadTime(html) {
    // Strip HTML tags to get text
    const text = html.replace(/<[^>]*>/g, ' ');
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
}
