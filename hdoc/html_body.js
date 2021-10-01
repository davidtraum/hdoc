class HTMLBody {
    constructor(settings) {
        this.lines = [];
        this.settings = settings;
    }
    addLine(line) {
        this.lines.push(line);
    }
    wrapperClass() {
        const classes = ['content'];
        if(this.settings.get('centered')) {
            classes.push('centered-content');
        }
        if(this.settings.get('documentClass').length > 0) {
            for(const entry of this.settings.get('documentClass').split(" ")) {
                classes.push(entry);
            }
        } 
        if(classes.length > 0) {
            return `class="${classes.join(' ')}"`
        } else {
            return '';
        }
    }
    text() {
        return `
            <body>
                <div ${this.wrapperClass()}>
                    <div>
                        ${this.lines.join('\n')}
                    </div>
                </div>
            </body>
        `
    }
}

module.exports = HTMLBody;