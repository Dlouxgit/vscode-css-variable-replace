const vscode = require("vscode");

class TreeItem {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.children = [];
  }
}

class TreeData {
  constructor() {
    this.root = new vscode.TreeItem("root");
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  getTreeItem(ele) {
    return new vscode.TreeItem(ele.name);
  }

  getChildren() {
    return this.root.children;
  }
}

function openUrl({ url }) {
  vscode.commands.executeCommand("vscode.open", url);
}

async function removeUrl(config, _, { url }) {
  await vscode.workspace.getConfiguration().update(
    "quickLink.siteList",
    config.siteList.filter(([_, siteUrl]) => siteUrl !== url),
    true
  );
}

async function addUrl(config, _) {
  let name = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    password: false,
    prompt: "set your site name",
  });
  name = name.trim();
  if (name === undefined || name === "") {
    return vscode.window.showInformationMessage("取消操作");
  }

  let url = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    password: false,
    prompt: "set your site url, start with http",
  });

  url = url.trim();

  if (url === undefined || url === "") {
    return vscode.window.showInformationMessage("取消操作");
  }

  await vscode.workspace
    .getConfiguration()
    .update("quickLink.siteList", [...config.siteList, [name, url]], true);
  return;
}

module.exports = {
  TreeItem,
  TreeData,
  openUrl,
  addUrl,
  removeUrl,
};
