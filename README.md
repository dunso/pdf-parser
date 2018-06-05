# pdf-parser

The pdf-parser is a parser of PDF content and layout information with [pdf.js](https://github.com/mozilla/pdf.js).

## Getting the Code

To get a local copy of the current code, clone it using git:

    $ git clone https://github.com/dunso/pdf-parser.git
    $ cd pdf-parser

Next, install Node.js via the [official package](http://nodejs.org) or via
[nvm](https://github.com/creationix/nvm).

install all dependencies for pdf-parser:

    $ npm install

## Example

The example is in the file example/node/pdf2json.js.

If you are in the root directory, you can use `node example/node/pdf2json` to run the example.

Or you can `cd example/node` and then `node pdf2json`.

## Usage

```
var pdfParser = require('pdf-parser');

var PDF_PATH = 'test.pdf';

pdfParser.pdf2json(PDF_PATH, function (error, pdf) {
    if(error != null){
        console.log(error);
    }else{
        console.log(JSON.stringify(pdf));
    }
});
```

The tool can convert pdf to json as bellow:

```
{
    "pages":[
        {
            "width":612,
            "height":792,
            "pageId":0,
            "texts":[
                {
                    "text":"Hello World",
                    "direction":"ltr",              //from left to right
                    "width":52.81644000000001,
                    "height":27.96,
                    "top":278.69,
                    "left":296.81,
                    "transform":[27.96,0,0,27.96,296.81,278.69],
                    "fontSize":27.96,
                    "fontName":"Times",
                    "fontOriginName":"TimesNewRomanPSMT",
                    "bold":false,
                    "italic":false,
                    "black":false,
                    "color":"[68,113,196]"
                }
            ]
        }
    ]
}

```

## Java Usage

The usage of how to call the pdf-parser in java : [java-pdf-parser](https://github.com/dunso/java-pdf-parser)

## Questions

File an issue:

+ https://github.com/dunso/pdf-parser/issues/new
