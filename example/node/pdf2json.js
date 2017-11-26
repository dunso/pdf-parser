const root = __dirname + '/../../';

var pdfParser = require(root + 'src/pdf2json/pdf2json.js');

var PDF_PATH = root + 'files/test.pdf';

pdfParser.pdf2json(PDF_PATH, function (error, pdf) {
    if(error != null){
        console.log(error);
    }else{
        console.log(JSON.stringify(pdf));
    }
});