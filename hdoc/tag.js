const TagList = require('./res/taglist');

class HDOCTag {
    constructor(text) {
        this.indent = (text.length - (text.trimStart().length));
        text = text.trim();
        if(text.startsWith('..')) {
            text = 'span' + text.substr(1);
        } else if(text.startsWith('.')) {
            text = 'div' + text;
        }
        const prefix = text.includes("[") ? text.split("[")[0] : text.split(" ")[0];
        const classes = prefix.split(".");
        this.type = classes[0];
        if(TagList.tags.includes(this.type)) {
            this.isPlain = false;
            this.classes = [];
            if (classes.length > 1) {
                for (let i = 1; i < classes.length; i++) {
                    this.classes.push(classes[i]);
                }
            }
            this.params = {};
            if (text.includes("[")) {
                let suffix = text.split("[")[1];
                suffix = suffix.substr(0, suffix.indexOf("]"));
                for (let param of suffix.split(",")) {
                    param = param.trim();
                    if (param.includes("=")) {
                        this.params[param.substr(0,param.indexOf("="))] = param.substr(param.indexOf("=")+1);
                    } else {
                        this.params[param] = undefined;
                    }
                }
            }
            this.content = '';
            if(text.includes("]")) {
                this.content = text.substr(text.indexOf("]") + 1).trim();
            } else if (text.split(" ").length > 1) {
                this.content = text.substr(text.indexOf(" "));
            }
        } else {
            this.content = text;
            this.type = 'Plain text';
            this.isPlain = true;
        }
    }

    getOpenTag() {
        let tag = `<${this.type}`;
        if (this.classes.length > 0) {
            tag += ' class="' + this.classes.join(" ") + '"';
        }
        if (Object.keys(this.params).length > 0) {
            for (const param in this.params) {
                if (this.params[param] !== undefined) {
                    tag += ` ${param}="${this.params[param]}"`;
                } else {
                    tag += ` ${param}`;
                }
            }
        }
        tag += '>' + this.content;
        return tag;
    }

    getCloseTag() {
        if (this.hasCloseTag()) {
            return `</${this.type}>`;
        } else {
            return '';
        }
    }

    hasCloseTag() {
        return !['hr', 'br', 'img'].includes(this.type);
    }
}

module.exports = HDOCTag;