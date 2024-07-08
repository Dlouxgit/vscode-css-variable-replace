# CSS Variable CodeLens for VS Code

This Visual Studio Code extension provides CodeLens for CSS variables defined in your project's `.css` and `.scss` files. It allows you to quickly replace hardcoded CSS values with CSS variables.

English | [简体中文](./README-zh_CN.md)


## Features

- Recursively reads CSS and SCSS files in the specified directories to find CSS variables defined under `:root`.
- Provides CodeLens in Vue `<style>` tags for replacing hardcoded CSS values with CSS variables.
- Supports custom directories specified in the user settings.

## Usage

### CodeLens in Vue Style Tags

When you open a `.vue` file with a `<style>` tag, the extension will provide CodeLens for hardcoded CSS values that match any CSS variable found in the project.

For example, if you have the following CSS variable defined in a CSS file:

```css
:root {
  --primary-color: #ff0000;
}
```

And your Vue file has the following style:

```vue
<style scoped>
.button {
  color: #ff0000;
}
</style>
```

You will see a CodeLens above the `color: #ff0000;` line suggesting to replace it with `var(--primary-color)`.

### Configuration

You can specify additional directories to search for CSS and SCSS files by updating your settings in VS Code.

1. Open the settings (`Ctrl+,` or `Cmd+,` on macOS).
2. Search for `myExtension.additionalDirectories`.
3. Add the directories you want to include in the search for CSS variables.

The default value is `["src"]`.

```json
{
  "myExtension.additionalDirectories": [
    "src",
    "styles",
    "custom-directory"
  ]
}
```

## Development

### Running the Extension

- Press `F5` to open a new VS Code window with your extension loaded.

### Tests

To run the tests:

```sh
npm test
```

## License

MIT

---

Made with ❤️ by Dlouxgit