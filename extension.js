const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const variableMap = new Map();
const ValueKeyMap = new Map();

/**
 * 递归读取指定目录下的所有.css和.scss文件
 * @param {string} directory 目录路径
 */
function readFilesRecursively(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      readFilesRecursively(fullPath); // 继续深入寻找文件夹
    } else if (file.endsWith(".css") || file.endsWith(".scss")) {
      readCSSFile(fullPath);
    }
  });
}

/**
 * 读取CSS文件内容并查找:root变量
 * @param {string} filePath CSS文件路径
 */
function readCSSFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const rootVariableRegex = /:root\s*\{([^}]*)\}/g;
  const rootVariableMatches = data.match(rootVariableRegex);
  if (rootVariableMatches) {
    const rootVariables = rootVariableMatches[0].replace(/:root\s*\{|\}/g, "").trim();
    // 按照 key: value 写入到Map中
    rootVariables.split(";").forEach((variable) => {
      const [key, value] = variable.split(":");
      if (key.trim() && value.trim()) {
        variableMap.set(key.trim(), value.trim());
        ValueKeyMap.set(value.trim(), key.trim());
      }
    });
  }
}

/**
 * 转义正则表达式特殊字符
 * @param {string} string 
 * @returns {string}
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class MyCodeLensProvider {
  provideCodeLenses(document, token) {
    const text = document.getText();
    const codeLenses = [];

    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let match;
    while ((match = styleTagRegex.exec(text)) !== null) {
      const styleContent = match[1];
      const styleStart = match.index + match[0].indexOf('>') + 1;
      const styleEnd = styleStart + styleContent.length;

      variableMap.forEach((value, key) => {
        const regex = new RegExp(`(?<=\\s|\\()${escapeRegExp(value)}(?=[,;\\)])`, 'g');
        let varMatch;
        while ((varMatch = regex.exec(styleContent)) !== null) {
          const start = styleStart + varMatch.index;
          const end = start + varMatch[0].length;
          const range = new vscode.Range(document.positionAt(start), document.positionAt(end));
          const value = ValueKeyMap.get(varMatch[0]);
          const codeLens = new vscode.CodeLens(range, {
            title: `替换为 var(${value})`,
            command: 'extension.replaceText',
            arguments: [range, `var(${value})`]
          });
          codeLenses.push(codeLens);
        }
      });
    }

    return codeLenses;
  }
}

/**
 * 激活插件时的方法
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // 获取当前工作区的根目录
  const workspacePath = vscode.workspace.rootPath;

  // 读取用户配置的目录
  const additionalDirectories = vscode.workspace.getConfiguration().get('cssReplaceExtension.additionalDirectories', []);
  additionalDirectories.forEach(directory => {
    const fullPath = path.join(workspacePath || '', directory);
    readFilesRecursively(fullPath);
  });

  // 注册 CodeLens 提供程序
  const codeLensProvider = new MyCodeLensProvider();
  vscode.languages.registerCodeLensProvider('vue', codeLensProvider);

  // 检查命令是否已经存在
  const commands = await vscode.commands.getCommands();
  if (!commands.includes('extension.replaceText')) {
    // 处理替换文本命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.replaceText', (range, newText) => {
      vscode.window.activeTextEditor.edit(editBuilder => {
        editBuilder.replace(range, newText);
      });
    }));
  }

  // 注册文档打开事件监听器
  vscode.workspace.onDidOpenTextDocument(document => {
    codeLensProvider.provideCodeLenses(document);
  });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
  readCSSFile,
  readFilesRecursively,
  variableMap,
  MyCodeLensProvider
};
