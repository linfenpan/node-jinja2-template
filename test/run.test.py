#!/user/bin/env python
# coding: utf-8

from jinja2 import Environment, FileSystemLoader
import json

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

# 将会自动 替换掉所有的 ${ xxx } 的内容

paths = ${paths};
env = Environment(
  loader = FileSystemLoader(paths, encoding = 'utf-8'),
  cache_size = -1,
  autoescape = False
)

dataStr = '{}'
file_object = open(${dataFilepath}, 'r')
try:
  dataStr = file_object.read()
finally:
  file_object.close()
data = json.loads(dataStr)

${contentOther}

# 模板绑定部分，与 node.js 通讯，请保持 print 的输出
def __render(tmp, map):
  result = tmp.render(**map)
  print 'START=============@@@=============START'
  print result, 'by test'
  print 'END=============@@@=============END'

template = env.get_template('${nameTemplate}')
__render(template, data)
