const Fs = require('fs');
const escapeHtml = require('./util').escapeHtml;
const path = require('path');

module.exports = (options, ctx) => {
    return {
        extendMarkdown: md => {
            const name = 'code';
            let file = '';
            md.use(require('markdown-it-container'), name, {
                render: function(tokens, idx) {
                    const token = tokens[idx];
                    if (token.nesting === 1) {
                        let info = token.info.trim().slice(name.length).trim();
                        info = path.join(process.cwd(),info);
                        try {
                            file = escapeHtml(Fs.readFileSync(info, 'utf8'));
                        } catch (e) {
                            console.warn(e);
                            file = '';
                        }
                        return `<div class="markdown-import-code__title">`;
                    } else {
                        const close = `</div><div class="markdown-import-code__content">${file}</div>`;
                        file = '';
                        return close;
                    }
                }
            })
        }
    }
 }