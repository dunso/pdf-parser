var crf = require('./cmap-reader-factory.js');
var pdfJs = require('./pdf.js');
pdfJs.PDFJS.workerSrc = './pdf.worker.js';
pdfJs.PDFJS.disableWorker = false;

pdfJs.PDFJS.cMapUrl = __dirname + '/../lib/cmaps/';
pdfJs.PDFJS.cMapPacked = true;

function timeoutCallbackWrapper(callback, timeout) {
    if(!timeout){
        timeout = 10000;
    }
    var isCalled = false;
    var timer = setTimeout(() => {
        if (!isCalled) {
            callback(null, new Error('timeout after ' + timeout + ' ms'));
            isCalled = true;
        }
    }, timeout);
    return (err, result) => {
        if (!isCalled) {
            isCalled = true;
            clearTimeout(timer);
            return callback(result, err);
        }
    };
}

function composePdfSource(src) {
    var source;
    if (typeof src === 'string') {
        source = { url: src };
    } else if (src && src.byteLength !== undefined) {
        source = { data: src };
    } else if (src instanceof pdfJs.PDFDataRangeTransport) {
        source = { range: src };
    }

    return source && Object.assign(
        source,
        {CMapReaderFactory: crf}
    );
}

function pdf2json(pdfPath, callback) {
    // wrap callback to ensure one-off and set timeout
    var callback = timeoutCallbackWrapper(callback);

    pdfJs.getDocument(
        composePdfSource(pdfPath)
    ).then((document) => {
        var pdf = {pages: []};
        for (var i = 1; i <= document.pdfInfo.numPages; i++) {
            document.getPage(i).then(documentPage => {
                var page = {
                    width: documentPage.pageInfo.view[2],
                    height: documentPage.pageInfo.view[3],
                    pageId: -1,
                    texts: [],
                };
                documentPage.getTextContent().then(textContent => {
                    if (textContent.items.length != 0) {
                        page.pageId = parseInt(textContent.items[0].pageId);
                    }
                    page.texts = textContent.items
                        .filter(item => item.str != null && item.str != "")
                        .map(item => ({
                            text: item.str,
                            direction: item.dir,
                            width: item.width,
                            height: item.height,
                            top: item.transform[5],
                            left: item.transform[4],
                            transform: item.transform,
                            fontSize: item.transform[0],
                            fontName: item.fontName,
                            fontOriginName: item.fontOriginName,
                            bold: item.bold,
                            italic: item.italic,
                            black: item.black,
                            color: '[' + item.color[0] + "," + item.color[1] + "," + item.color[2] + ']'
                        }));
                }).then(() => {
                    pdf.pages.push(page);
                    // callback result when pages is fullfilled
                    if (pdf.pages.length === document.pdfInfo.numPages) {
                        callback(pdf, null)
                    }
                }).catch((error) => {
                    // error in getTextContent promise chain
                    callback(null, error);
                });
            }).catch((error) => {
                // error in getPage promise
                callback(null, error);
            });
        }
    }).catch((error) => {
        // error in getDocument promise chain
        callback(null, error);
    });
};

exports.pdf2json = pdf2json;
