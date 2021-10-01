const HDOCTemplate = require('./template');

class HDOCTemplateManager {
    constructor(settings) {
        this.settings = settings;
        this.templates = {};
        this.active = undefined;
    }
    begin(header) {
        if(this.active !== undefined) {
            throw new Error('Template opened before previous closed. ' + header);
        }
        const template = new HDOCTemplate(header);
        this.active = template;
    }
    end() {
        this.templates[this.active.id] = this.active;
        this.active = undefined;
    }
    get(header) {
        let id = '';
        if(header.includes("(")) {
            id = header.substr(1, header.indexOf("(") - 1).trim();
        } else {
            id = header.substr(1).trim();
        }
        if(this.templates[id] !== undefined) {
            let args = '';
            if(header.includes('(')) {
                args = header.substring(header.indexOf("(") + 1, header.lastIndexOf(")"));
            }
            return this.templates[id].getLines(args);
        } else {
            throw new Error('Template not found: ' + id);
        }
    }
    addLine(line) {
        this.active.addLine(line);
    }
}

module.exports = HDOCTemplateManager;