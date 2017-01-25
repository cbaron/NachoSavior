module.exports = p => {

const sharePrefix = `http://${process.env.DOMAIN}:${process.env.PORT}`

const prefix = p.isSecure
    ? `https://${process.env.DOMAIN}:${process.env.SECURE_PORT}`
    : `${sharePrefix}`

const title = p.item.title ? p.item.title : 'Tiny Handed'
const relativeImagePath = p.item.image ? p.item.image + '-og.png' : '/static/img/logo-share.png'
const image = `${sharePrefix}${relativeImagePath}`

const js = p.isDev
    ? `<script src="${prefix}/static/js/vendor.js.gz"></script><script src="${prefix}/static/js/debug.js.gz"></script>`
    : `<script src="${prefix}/static/js/bundle.js.gz"></script>`

return `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="${prefix}/static/css/main.css.gz">

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta property="og:url" content="${sharePrefix}${p.request.url}" />
        <meta property="og:title" content="${ title }" />
        <meta property="og:description" content="Unpresidented." />
        <meta property="og:image" content="${image}" />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@tinyhanded">
        <meta name="twitter:title" content="${ title }">
        <meta name="twitter:description" content="Unpresidented.">
        <meta name="twitter:creator" content="@tinyhanded">
        <meta name="twitter:image" content="${image}">

        ${js}
        <title>${title}</title>
    </head>

    <body>
        <div class="container-fluid">
           <div class="row" id="content"></div>
        </div>
    </body>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', '${process.env.GOOGLE_ANALYTICS}', 'auto');
      ga('send', 'pageview');

    </script>

    ${p.isDev?`<script src="//${process.env.DOMAIN}:35729/livereload.js?snipver=1"/></script>`:''}

</html>`
}
