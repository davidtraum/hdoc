
class TableOfContents {
    constructor(settings) {
        this.settings = settings;
        this.tree = [];
        this.currentLevel = 1;
    }

    append(text, node) {
        for(const entry of node) {
            if(Array.isArray(entry)) {
                text += this.append(text, entry);
            } else {
                text += `<p>${entry}</p>`;
            }
        }
        return text;
    }

    text() {
        let text = '<div>';
        text += this.append(text, this.tree);
        return text + '</div>';
    }
}

module.exports = TableOfContents;