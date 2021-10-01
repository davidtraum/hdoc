const fs = require('fs');
const path = require('path');

class HTMLHead {
    constructor(settings) {
        this.styles = [];
        this.scripts = [];
        this.settings = settings;
        this.title = 'Document';
        this.libs = require('./res/libs');
    }
    setTitle(title) {
        this.title = title;
    }
    addStyle(path) {
        if(!this.styles.includes(path)) {
            this.styles.push(path);
        }
    }
    addScript(path) {
        if(!this.scripts.includes(path)) {
            this.scripts.push(path);
        }
    }
    addLib(key) {
        if (!this.libs[key]) {
            throw new Error('Unknown library: ' + key);
        }
        if(this.libs[key].depend) {
            for(const dependency of this.libs[key].depend) {
                this.addLib(dependency);
            }
        }
        if (this.libs[key].styles) {
            for (const style of this.libs[key].styles) {
                this.addStyle(style);
            }
        }
        if (this.libs[key].scripts) {
           for (const script of this.libs[key].scripts) {
                this.addScript(script);
            }
        }
    }
    styleText() {
        let tags = [];
        for (const style of this.styles) {
            tags.push(`<link rel="stylesheet" href="${style}">`);
        }
        return tags.join('\n');
    }
    scriptText() {
        let tags = [];
        for (const script of this.scripts) {
            tags.push(`<script src="${script}"></script>`);
        }
        return tags.join("\n");
    }
    loadStyle() {
        if(this.settings.get('defaultStyling')) {
            return fs.readFileSync(path.join(__dirname, '/res/style.css'));
        } else {
            return '';
        }
    }
    text() {
        return `
            <head>
                <title>${this.settings.get('title')}</title>
                <!-- Version notice -->
                <meta charset="utf-8">
                ${this.styleText()}
                ${this.scriptText()}
                <style>
                    ${this.loadStyle()}
                </style>
            </head>
        `;
    }
}

module.exports = HTMLHead;