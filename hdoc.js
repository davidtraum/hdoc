const fs = require('fs');
const readline = require('readline');

const HTMLBody = require('./hdoc/html_body');
const HTMLHead = require('./hdoc/html_head');
const HDOCTag = require('./hdoc/tag');
const DocumentSettings = require('./hdoc/document_settings');
const Placeholders = require('./hdoc/placeholders');
const TableOfContents = require('./hdoc/toc');
const HDOCTemplateManager = require('./hdoc/template_manager');

class HTMLSCompiler {
    constructor(output) {
        this.output = output;
        this.stack = [];
        this.currentIndent = 0;
        this.indentStep = 1;
        this.indentStepDetected = false;
        this.settings = new DocumentSettings();
        this.body = new HTMLBody(this.settings);
        this.head = new HTMLHead(this.settings);
        this.templates = new HDOCTemplateManager(this.settings);
        this.included = [];
        this.lineCount = 0;
        this.toc = new TableOfContents(this.settings);

        this.open = undefined;
    }
    addLine(line) {
        if (this.templates.active !== undefined) {
            this.templates.addLine(line);
        } else {
            this.body.addLine(line);
        }
    }
    inputTag(tag) {
        if(!this.indentStepDetected && tag.indent > 0) {
            this.debug("Detected indent width", tag.indent);
            this.intentStep = tag.indent;
            this.indentStepDetected = true;
        }
        tag.indent /= this.intentStep;
        if (this.open !== undefined) {
            if (tag.indent <= this.currentIndent) {
                for(let i = 0; i<=this.currentIndent - tag.indent; i++) {
                    this.body.addLine(this.stack.pop().getCloseTag());
                }
                this.open = undefined;
            }
        }
        if (!tag.isPlain) {
            this.addLine(tag.getOpenTag());
            this.open = tag;
            this.stack.push(this.open);
        } else {
            this.addLine(tag.content + '<br>');
        }
        this.currentIndent = tag.indent;
    }
    debug() {
        if (this.settings.get('verbose')) console.log(`[${this.lineCount}]`, Array.from(arguments).join(" "));
    }
    input(str) {
        let trimmed = str.trim();
        this.lineCount++;
        switch (trimmed[0]) {
            case '#':
                {
                    const style = trimmed.substr(1).trim();
                    this.debug("Add style", style)
                    this.head.addStyle(style);
                }
                break;
            case '>':
                {
                    const script = trimmed.substr(1).trim();
                    this.debug("Add script", script);
                    this.head.addScript(script);
                }
                break;
            case '@':
                {
                    const lib = trimmed.substr(1).trim().toLowerCase();
                    this.debug("Add library", lib);
                    this.head.addLib(lib);
                }
                break;
            case '$':
                {
                    const key = trimmed.substr(1).trim().split("=")[0].trim();
                    const value = trimmed.substr(1).trim().split("=")[1].trim();
                    this.debug("Set", key, "=", value);
                    this.settings.set(key, value);
                }
                break;
            case '&':
                {
                    const key = trimmed.substr(1).trim().replace('.hdoc', '');
                    if (!this.included.includes(key)) {
                        let file = this.settings.getDirectory('basePath') + trimmed.substr(1).trim();
                        if (!file.endsWith('.hdoc')) {
                            file += '.hdoc';
                        }
                        this.debug("Include file", file)
                        const read = fs.readFileSync(file).toString();
                        for (const line of read.split("\n")) {
                            this.input(line);
                        }
                    }
                }
                break;
            case '\\':
                {
                    if (this.templates.active !== undefined) {
                        this.templates.end();
                    } else {
                        this.templates.begin(trimmed);
                    }
                }
                break;
            case '/':
                {
                    if (trimmed.includes('.')) {
                        this.input('&' + trimmed.substr(1).split(".")[0]);
                        trimmed = '/' + trimmed.substr(trimmed.indexOf('.') + 1);
                    }
                    for (const line of this.templates.get(trimmed)) {
                        this.input(line);
                    }
                }
                break;
            default:
                if (str.trim().length > 0) {
                    const tag = new HDOCTag(str);
                    this.inputTag(tag);
                    this.debug("Tag", tag.type, "indent", tag.indent);
                }
        }
    }
    end() {
        while (this.stack.length > 0) {
            this.body.addLine(this.stack.pop().getCloseTag());
        }
        this.output.out(this.text());
    }
    text() {
        return Placeholders.replace(`
            <html>
                ${this.head.text()}
                ${this.body.text()}
            </html>
        `, this);
    }
    file(path) {
        let begin = Date.now();
        const data = fs.readFileSync(path).toString();
        for (const line of data.split("\n")) {
            this.input(line);
        }
        this.end();
        console.log("Processed", path, "in", (Date.now() - begin), "ms");
    }
}

class FileOutput {
    constructor(file) {
        this.file = fs.createWriteStream(file);
    }

    out(line) {
        this.file.write(line);
    }
}

const compiler = new HTMLSCompiler(new FileOutput(process.argv[2].replace('.hdoc', '.html')));
compiler.file(process.argv[2]);