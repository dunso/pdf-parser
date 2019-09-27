const root = __dirname + '/../../';
var crf = require(root + 'src/core/cmap-reader-factory.js');

var pdfJs = require(root + 'lib/pdf.js');
pdfJs.PDFJS.workerSrc = root + 'lib/pdf.worker.js';
pdfJs.PDFJS.disableWorker = false;

pdfJs.PDFJS.cMapUrl = root + 'lib/cmaps/';
pdfJs.PDFJS.cMapPacked = true;

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

async function pdf2json(pdfPath) {
    return pdfJs.getDocument(
        composePdfSource(pdfPath)
    ).then(async (document) => {
        var pdf = {pages: []};
        for (var i = 1; i <= document.pdfInfo.numPages; i++) {
            await document.getPage(i).then(async (documentPage) => {
                var page = {
                    width: documentPage.pageInfo.view[2],
                    height: documentPage.pageInfo.view[3],
                    pageId: -1,
                    texts: [],
                };
                await documentPage.getTextContent().then(async (textContent) => {
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
                })
            })
        }
        return pdf; 
    })
};

exports.pdf2json = pdf2json;
