# CSS 变量 CodeLens for VS Code

这个 Visual Studio Code 扩展为项目中的 `.css` 和 `.scss` 文件中定义的 CSS 变量提供 CodeLens。它允许您快速将硬编码的 CSS 值替换为 CSS 变量。

[English](./README.md) | 简体中文

## 特性

- 递归读取指定目录中的 CSS 和 SCSS 文件，以查找在 `:root` 下定义的 CSS 变量。
- 在 Vue `<style>` 标签中提供 CodeLens，用于将硬编码的 CSS 值替换为 CSS 变量。
- 支持在用户设置中指定自定义目录。

## 使用

### Vue 样式标签中的 CodeLens

当您打开带有 `<style>` 标签的 `.vue` 文件时，该扩展将为匹配项目中找到的任何 CSS 变量的硬编码 CSS 值提供 CodeLens。

例如，如果您在 CSS 文件中定义了以下 CSS 变量：

```css
:root {
  --primary-color: #ff0000;
}
```

并且您的 Vue 文件具有以下样式：

```vue
<style scoped>
.button {
  color: #ff0000;
}
</style>
```

您将在 `color: #ff0000;` 行上方看到一个 CodeLens，建议将其替换为 `var(--primary-color)`。

### 配置

您可以通过在 VS Code 中更新设置来指定要搜索 CSS 和 SCSS 文件的附加目录。

1. 打开设置（在 macOS 上使用 `Ctrl+,` 或 `Cmd+,`）。
2. 搜索 `myExtension.additionalDirectories`。
3. 添加您希望包含在 CSS 变量搜索中的目录。

默认值为 `["src"]`。

```json
{
  "myExtension.additionalDirectories": [
    "src",
    "styles",
    "custom-directory"
  ]
}
```

## 开发

### 运行扩展

按 `F5` 键以打开一个新的 VS Code 窗口并加载您的扩展。

### 测试

运行测试：

```sh
npm test
```

## 许可

MIT

---

由 Dlouxgit 制作 ❤️