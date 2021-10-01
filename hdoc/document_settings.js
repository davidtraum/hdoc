
class DocumentSettings {
    constructor() {
        this.values = {
            verbose: false,
            centered: true,
            defaultStyling: true,
            title: 'Document',
            documentClass: '',
            basePath: ''
        }
    }
    formatValue(value) {
        const lower = value.toLowerCase();
        if(lower === 'true') return true;
        if(lower === 'false') return false;
        return value;
    }
    set(key, value) {
        if(this.values[key] === undefined) {
            throw new Error('Unknown setting: ' + key);
        }
        this.values[key] = this.formatValue(value);
    }
    get(key) {
        return this.values[key];
    }
    getDirectory(key) {
        if(this.values[key].length > 0) {
            if(this.values[key].endsWith('/')) {
                return this.values[key];
            } else {
                return this.values[key] + '/';
            }
        }
        return this.values[key];
    }
}

module.exports = DocumentSettings;