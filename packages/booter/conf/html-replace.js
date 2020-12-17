require("dotenv").config();

// resources (may be retrieved from somewhere)
const res = {
    js: {
      jquery: 'http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
      tether: 'http://cdn.bootcss.com/tether/1.3.7/js/tether.min.js',
      bootstrap: 'http://cdn.bootcss.com/bootstrap/4.0.0-alpha.3/js/bootstrap.min.js'
      // ...
    },
    css: {
      tether: 'http://cdn.bootcss.com/tether/1.3.7/css/tether.min.css',
      bootstrap: 'http://cdn.bootcss.com/bootstrap/4.0.0-alpha.3/css/bootstrap.min.css'
      // ...
    },
    img: {
      nicePicture: 'https://foo/bar.jpg'
      // ...
    }
  }
  
  const tpl = {
    img: '<img src="%s">',
    css: '<link rel="stylesheet" type="text/css" href="%s">',
    js: '<script type="text/javascript" src="%s"></script>'
  }
  
  module.exports = [
    {
      pattern: '@@title',
      replacement: process.env.TITLE
    },
    {
      pattern: '@@author',
      replacement: process.env.AUTHOR
    },
    {
      pattern: '@@description',
      replacement: process.env.DESCRIPTION
    },
    {
      pattern: '@@monetization',
      replacement: process.env.MONETIZATION
    },
    {
      pattern: '@@gtag_id',
      replacement: process.env.GTAG_ID
    },
    {
      pattern: '@@url',
      replacement: process.env.URL
    },
    {
      pattern: '@@og_image',
      replacement: process.env.OG_IMAGE
    },
    {
      pattern: '@@short_name',
      replacement: process.env.SHORT_NAME
    },
    {
      pattern: '@@theme_color',
      replacement: process.env.THEME_COLOR
    },
    {
      pattern: '@@background_color',
      replacement: process.env.BACKGROUND_COLOR
    },
    {
      pattern: '@@start_url',
      replacement: process.env.START_URL
    }

  ]
  