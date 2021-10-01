
class StyleFormatter {
    constructor() {
        this.styles = {};
    }
    set(style, value) {
        this.styles[style] = value;
    }
    text() {
        let attrs = [];
        for(const style in this.styles) {
            attrs.push(`${style}:${this.styles[style]}`);
        }
        return attrs.join(";");
    }
    count() {
        return Object.keys(this.styles).length;
    }
}

module.exports = StyleFormatter;