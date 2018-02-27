'use strict';
const pkg = require('../package.json');
const path = require('path');
const Jinja2Template = require('../index');

const template1 = new Jinja2Template([ path.resolve('./template') ]);

template1.render('index.html', { name: pkg.author })
  .then(function(res) {
    console.log(res.trim());
    console.assert(res.trim() === `Hi ${pkg.author}`, '结果不正确');
  });


// 更改运行的文件
// 可以在新的运行文件中，尝试添加各种 filter，extension
const template2 = new Jinja2Template([ path.resolve('./template') ], {
  runFile: path.resolve('./run.test.py')
});
template2.render('index.html', { name: pkg.author })
  .then(function(res) {
    console.log(res.trim());
    console.assert(res.trim() === `Hi ${pkg.author} by test`, '结果不正确');
  });