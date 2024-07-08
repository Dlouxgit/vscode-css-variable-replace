const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const cssReplaceExtension = require('../../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension Activation', async () => {
		const context = {
		  subscriptions: []
		};
	  
		await cssReplaceExtension.activate(context);
	  
		assert.ok(cssReplaceExtension.variableMap.size >= 0);
	});

	test('Variable Map Population', () => {
		// Simulate reading CSS files
		const cssContent = `:root { --primary-color: #ff0000; }`;
		const tmpDir = require('os').tmpdir();
		const fs = require('fs');
		const path = require('path');
		const filePath = path.join(tmpDir, 'test.css');
		fs.writeFileSync(filePath, cssContent);
	
		cssReplaceExtension.readCSSFile(filePath);
	
		assert.strictEqual(cssReplaceExtension.variableMap.get('--primary-color'), '#ff0000');
	});

	test('CodeLens Provider Test', () => {
		const document = {
		  getText: () => '<style>:root { --primary-color: #ff0000; }</style>',
		  positionAt: (index) => new vscode.Position(0, index)
		};
		
		const codeLensProvider = new cssReplaceExtension.MyCodeLensProvider();
		const codeLenses = codeLensProvider.provideCodeLenses(document, null);
	  
		assert.strictEqual(codeLenses.length, 1);
		assert.strictEqual(codeLenses[0].command.title, '替换为 var(--primary-color)');
	});
});
