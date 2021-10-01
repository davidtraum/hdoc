const Placeholders = {
    replace(text, compiler) {
        while(text.includes("%%")) {
            let part = text.substr(text.indexOf("%%") + 2);
            let key = part.substring(0,part.indexOf("%%"));
            text = text.replace('%%' + key + '%%', Placeholders.get(key, compiler));
        }
        return text;
    },
    get(key, compiler) {
        switch(key) {
            case 'time':
                return new Date().toUTCString();
            case 'toc':
                return compiler.toc.text();
            default:
                throw new Error('Unknown placeholder: ' + key);
        }
    }
}

module.exports = Placeholders;