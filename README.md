# node-jinja2-template

在 `node` 中，运行 `jinja2` 模板，并返回运行后的结果。

# 使用前准备

1. 确保运行机器，已经安装 `python`
2. 确保已经安装了 `jinja2`

# 使用
```javascript
const path = require('path');
const Jinja2Template = require('../index');

const template = new Jinja2Template(
  [ 
    // jinja 文件，放置的目录列表
    path.resolve('./template') 
  ],
  {
    runFile: '被运行的 py 文件模板，请参考 python/run.py 进行编写，如果不指定，就使用默认的运行模板',
    idGenerator() {
      // 自定义每次运行的 文件 id，可不设置，保留 null
      return Date.now();
    }
  }
);

// .render('模板名字', 模板渲染的数据) => Promise
template.render('index.html', { name: 'da宗熊' })
  .then(function(res) {
    console.log(res.trim());
  });
```

# 原理
实际，使用子进程运行命令 `python xxx.py`，运行后将在控制台，print 出以下内容:
```text
START=============@@@=============START
<div>我是jinja2生成的内容</div>
END=============@@@=============END
```
之后，通过正则，匹配出 `jinja` 生成的内容。

所以，调整 `runFile` 时，保持 `print` 的格式，是非常重要的~