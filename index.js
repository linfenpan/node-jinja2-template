'use strict';

const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const uuid = require('uuid');

class Template {
  // @param {String} [dirsTemplate] 模板文件所在目录列表！
  // @param {String} [jinja2Filepath] jinja2 运行文件的真实路径
  /**
   * 构造函数
   * @param {Array<string>} dirsTemplate 目录列表
   * @param {Object} [options] 参数，{ runFile: '运行文件路径，默认是 ./python/run.py', otherContent: 插入到运行文件的额外内容，默认是空, extraData: 传入到运行文件的额外模板参数 }
   */
  constructor(dirsTemplate, options) {
    this.dirsTemplate = dirsTemplate;
    this.options = Object.assign({
      runFile: path.resolve(__dirname, './python/run.py'),
      otherContent: '',
      extraData: { },
      idGenerator: null
    }, options || {});

    this._selfId = 1;
    this.pythonFilepath = this.options.runFile;
    this.pythonDir = path.dirname(this.pythonFilepath);
  }

  render(templateFilePath, data) {
    return new Promise((resolve, reject) => {
      resolve(this.buid(templateFilePath, data));
    });
  }

  generateId() {
    if (typeof this.options.idGenerator === 'function') {
      if (this._selfId >= 9999999999) {
        this._selfId = 1;
      }
      return this.options.idGenerator().toString() + this._selfId++;
    }
    return uuid.v4() + '-' + Date.now();
  }

  // 生成临时文件，并且运行
  buid(nameTemplate, data) {
    return new Promise((resolve, reject) => {
      const options = this.options;
      const tmpDir = this.pythonDir;
      const fileName = this.generateId();
      // console.log(fileName);
      const runFilepath = path.join(tmpDir, `./.run_${fileName}.py`);
      const dataFilepath = path.join(tmpDir, `./.data_${fileName}.json`);
      fs.ensureFileSync(runFilepath);
      fs.ensureFileSync(dataFilepath);

      const fileTempateStr = fs.readFileSync(this.pythonFilepath).toString();
      const fileTempateOpts = Object.assign({}, options.extraData, {
        paths: JSON.stringify(this.dirsTemplate),
        nameTemplate: nameTemplate,
        dataFilepath: JSON.stringify(dataFilepath),
        contentOther: options.otherContent
      });

      fs.writeFileSync(dataFilepath, JSON.stringify(data, null, 2));
      fs.writeFileSync(runFilepath, fileTempateStr.replace(/\${([^}]+)}/g, (str, key) => {
        return key in fileTempateOpts ? fileTempateOpts[key] : '${'+ key +'}';
      }));
      
      exec(`python ${runFilepath}`, (error, stdout, stderr) => {
        fs.removeSync(runFilepath);
        fs.removeSync(dataFilepath);
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout.replace(/(START)(=+)(@+)\2\1([\s\S]*)(END)\2\3\2\5/g, '$4'));
        }
      });
    });
  }
}

module.exports = Template;