# node-helmet [![Build Status](https://travis-ci.org/LestaD/node-helmet.svg?branch=master)](https://travis-ci.org/LestaD/node-helmet) [![codecov](https://codecov.io/gh/sergeysova/node-helmet/branch/master/graph/badge.svg)](https://codecov.io/gh/sergeysova/node-helmet)


Construct your html for server side rendering without pain.

## Installation

```shell
npm install node-helmet
```


## Usage

```js
const { helmet, meta } = require('node-helmet')

const html = helmet()
  .lang('en_US')
  .class('mac')
  .head(
    meta.charset('utf-8'),
    meta.referrer('origin'),
    meta.httpEquiv('X-UA-Compatible', 'IE=edge'),
    meta('google', { value: 'notranslate' }),
    meta('custom-meta-name', 'content-of-meta'),
  )
  .title('Name of your page')
  .link('icon', '/favicon/svg/32.svg', { type: 'image/svg' })
  .stylesheet('/assets/bundle.css')
  .stylesheet('//mycdn.com/static/resolved/foo-bar.css')
  .script('/assets/bundle.js')
  .inlineScript(myFunc.toString(), { nonce: key }, ['arg1', 'arg2'])

console.log(html.toString()) // or console.log(`${html}`)
```

Result document (formatted):

```html
<html lang="en_US" class="mac">
  <head>
    <meta charset="utf-8" />
    <meta name="referrer" content="origin" />
    <meta content="IE=edge" />
    <meta name="google" value="notranslate" />
    <meta name="custom-meta-name" content="content-of-meta" />
    <title>Name of your page</title>
    <link rel="icon" href="/favicon/svg/32.svg" type="image/svg" />
    <link rel="stylesheet" href="/assets/bundle.css" />
    <link rel="stylesheet" href="//mycdn.com/static/resolved/foo-bar.css" />
  </head>
  <body>
    <script type="application/javascript" src="/assets/bundle.js"></script>
    <script type="application/javascript" charset="utf-8" nonce="2aae6c35c94fcfb415dbe95f408b9ce91ee846ed">
      (function myFunc(a, b) {
        console.log('ok', a + b);
      })(arg1, arg2)
    </script>
  </body>
</html>
```
