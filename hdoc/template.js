
class HDOCTemplate {
    constructor(text) {
        if(text.includes("(")) {
            this.id = text.substr(1, text.indexOf("(") - 1).trim();
            this.params = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")")).split(",").map(entry => entry.trim());
        } else {
            this.id = text.substr(1).trim();
            this.params = [];
        }        this.content = [];
    }
    addLine(line) {
        this.content.push(line);
    }
    rawText() {
        return this.content.join('\n');
    }
    getLines(paramString) {
        const parsedParams = paramString.split(",").map(entry => entry.trim());
        let index = 0;
        let text = this.rawText();
        for(const paramId of this.params) {
            const placeholder = '??' + paramId;
            while(text.includes(placeholder)) text = text.replace(placeholder, index < parsedParams.length ? parsedParams[index] : '');
            index++;
        }
        return text.split('\n');
    }
}

module.exports = HDOCTemplate;