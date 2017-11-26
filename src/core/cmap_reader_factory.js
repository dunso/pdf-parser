'use strict';

class CMapReaderFactory {
    constructor({baseUrl = null, isCompressed = false,}) {
        this.baseUrl = baseUrl;
        this.isCompressed = isCompressed;
    }

    fetch({name,}) {
        if (!name) {
            return Promise.reject(new Error('CMap name must be specified.'));
        }
        return new Promise((resolve, reject) => {
            let url = this.baseUrl + name + (this.isCompressed ? '.bcmap' : '');

            let fs = require('fs');
            fs.readFile(url, (error, data) => {
                if (error || !data) {
                    reject(new Error('Unable to load ' +
                        (this.isCompressed ? 'binary ' : '') +
                        'CMap at: ' + url));
                    return;
                }
                resolve({
                    cMapData: new Uint8Array(data),
                    compressionType: this.isCompressed ? 1 : 0,
                });
            });
        });
    }
};

module.exports = CMapReaderFactory;