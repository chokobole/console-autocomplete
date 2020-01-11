# Console Autocompletion

This is a sub project for c++ flag parser [console](https://github.com/chokobole/console). But it can be used for general purpose.

## How to use

* Install the package.

```bash
npm install -g console-autocompletion
```

* Prepare json file describing your flgas.

```json
[
  {
    "shortName": "-n1",
    "longName": "--number1",
    "needsValue": true
  },
  {
    "shortName": "-n2",
    "longName": "--number2",
    "needsValue": true
  }
]
```

* Copy to `~/.console-autocompletion/`.

```bash
cp /path/to/json ~/.console-autocompletion/
```

* Generate `bash_completion` and activate it.

```bash
console-autocompletion-installer program_name /path/to/bash_completion
source /path/to/bash_completion
```

## Flag

* `name`: name of the flag, if `name` is set, `shortName` or `longName` should not be set. At this locaiton, value should be come. It means it's a positional flag.
* `shortName`: '-' prefixed name, if `shortName` is set, `name` should not be set. It means it's an optional flag.
* `longName`: '--' prefixed name, if `longName` is set, `name` should not be set. It means it's an optional flag.
* `needsValue`: If it is set to **true**, this optional flag should be followed by value.
* `isSequential`: If it is set to **true**, this optional flag can be come multiple times.
* `subFlags`: If it is set, after this positional flag, the subarray will be parsed.