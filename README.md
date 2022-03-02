# JSON Utility

![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/json-utility-icon.png?raw=true)

JSON Utility is VSCode extension which is helps to 
 * Convert TypeScript Interface to JSON Sample
 * JSON to TypeScript Interface
 * Fix the JSON Object
 * Beautify the JSON String (Prettify & Minify)

## 📦 Install
  * Install via VSCode Extensions 
    * Open VSCode Extensions panel using `Cmd+Shift+X` shortcut.
    * Type `JSON Utility` in Search bar.
    * Select the `JSON Utility` and install the extension.

## 💡 Features

### 1) Convert TypeScript Interface to JSON Sample (`Ctrl + Alt + J`)

  * Select the TypeScript Interface from the file (If you didn't select it then JSON Utility takes the full content in the file as input)
  * Run the extension using any one of the option in below.
    * Use the Command Palette (`Cmd+Shift+P`) -> Type `JSON Utility` -> Select `JSON Utility: Convert Interface to JSON Sample`
    * Use the shortcut `Ctrl + Alt + J`

  ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/TS_to_JSON.gif?raw=true)

### 2) Convert JSON to TypeScript Interface (`Ctrl + Alt + T`)
  * Select the JSON from the file (If you didn't select it then JSON Utility takes the full content in the file as input)
  * Run the extension using any one of the option in below.
    * Use the Command Palette (`Cmd+Shift+P`) -> Type `JSON Utility` -> Select `JSON Utility: Convert JSON to Interface`
    * Use the shortcut `Ctrl + Alt + T`

  ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/JSON_to_TS.gif?raw=true)

### 3) Fix the JSON Object (`Ctrl + Alt + F`)
  * Select the JSON from the file (If you didn't select it then JSON Utility takes the full content in the file as input)
  * Run the extension using any one of the option in below.
    * Use the Command Palette (`Cmd+Shift+P`) -> Type `JSON Utility` -> Select `JSON Utility: Fix the JSON`
    * Use the shortcut `Ctrl + Alt + F`

  ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/JSON_Fix.gif?raw=true)

### 4) Beautify the JSON String (Prettify: `Ctrl + Alt + P` ,  Minify: `Ctrl + Alt + M`)
  1. Prettify the JSON
  * Select the JSON from the file (If you didn't select it then JSON Utility takes the full content in the file as input)
  * Run the extension using any one of the option in below.
    * Use the Command Palette (`Cmd+Shift+P`) -> Type `JSON Utility` -> Select `JSON Utility: Prettify the JSON`.
    * Use the shortcut `Ctrl + Alt + P`

  ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/Prettify_JSON.gif?raw=true)
  
  2. Minify the JSON
  * Select the JSON from the file (If you didn't select it then JSON Utility takes the full content in the file as input)
  * Run the extension using any one of the option in below.
    * Use the Command Palette (`Cmd+Shift+P`) -> Type `JSON Utility` -> Select `JSON Utility: Minify the JSON`
    * Use the shortcut `Ctrl + Alt + M`

  ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/Minify_JSON.gif?raw=true)


## ⚙️ Configuration

JSON Utility has few configurations. If you want to change the default configuration, select the required option.

|Name | Setting | Default | Description |
|-----|---------|------------|------------|
|Output|json-utility.output|New Window|Either open the result in new window or same input file|
|Type In UnionTypes|json-utility.typeInUnionTypes|Random Type|Which type needs to select in the union types for JSON output? <br /> Example: <br />```interface Test ```<br />```{ ```<br />&nbsp;&nbsp; &nbsp; &nbsp;```name : (string \| number \| boolean)```<br />```}``` <br />Here the `name` property can have `string` or `number` or `boolean` type. In the JSON output, the value of `name` property should be belongs to which type. The type will be picked rondomly from these three types. You can change to First Type(Here `string`) as default for JSON output.|

 ![json-utility Screenshot](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/images/configuration.png?raw=true)

## 📝 Changelog
See the [release notes](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/CHANGELOG.md) for the full set of changes.

## ✒️ Author
[Ganesan Chandran](https://ganesan-chandran.github.io/)

## 📜 License
See the [license](https://github.com/Ganesan-Chandran/vscode-json-utility/blob/master/LICENSE) details.

## 👍 Contribution
Feel free to submit a pull request if you find any bugs (To see a list of active issues, visit the [Issues section](https://github.com/Ganesan-Chandran/vscode-json-utility/issues)). Please make sure all commits are properly documented.