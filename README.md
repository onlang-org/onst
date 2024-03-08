[npm]: https://www.npmjs.com/package/@onlang-org/onst
[github]: https://github.com/onlang-org/onst
[readme]: https://github.com/onlang-org/onst/blob/main/README.md

<img src="https://raw.githubusercontent.com/rajatasusual/rajatasusual/master/onlang_shorthand.png" alt="onlang_shorthand" height="100">

# @onlang-org/onst (onst) for [ on-lang](https://github.com/onlang-org/onlang)

[![codeQL](https://github.com/onlang-org/onst/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/onlang-org/onst/actions/workflows/github-code-scanning/codeql)
[![deployment](https://github.com/onlang-org/onst/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/onlang-org/onst/actions/workflows/npm-publish.yml)
[![npm version](https://img.shields.io/npm/v/@onlang-org/onst.svg)](https://www.npmjs.com/package/@onlang-org/onst)
[![npm downloads](https://img.shields.io/npm/dm/@onlang-org/onst.svg)](https://www.npmjs.com/package/@onlang-org/onst)
[![license](https://img.shields.io/github/license/onlang-org/onst.svg)](https://github.com/onlang-org/onst/blob/master/LICENSE.md)
[![forks](https://img.shields.io/github/forks/onlang-org/onst.svg)](https://github.com/onlang-org/onst/network)

Helper package for [on-lang](https://github.com/onlang-org/onlang). Provides sample schema and example objects.

This CLI package is designed to fetch relevant schema from @onlang-org/onst GitHub repository based on specified criteria. It leverages the GitHub [Octokit](https://github.com/octokit/octokit.js) API for repository interaction and provides a convenient command-line interface for users to customize their file-fetching experience.

You can fetch schema files, show the schema list, and generate example ONL (ONLang) files from the schema.


> **_This project lives with [on-lang](https://github.com/onlang-org/onlang)_**

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Current Available Schemas](#current-available-schemas)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Prerequisites

Before using the package, ensure you have the following set up:

- Node.js 14+ or higher [https://nodejs.org/en/]
- [npm](https://www.npmjs.com/)

## Installation

Install the package using npm:

```bash
npm install -g @onlang-org/onst
```

## Usage

**Show Help**

```
onst h
```
This command shows help information about the available commands and their usage.

**Show Version**
```
onst v
```
This command displays the version of the ONLang CLI.

**Fetch Schema Files**
```
onst f
```
This command fetches schema files from the onst GitHub repository for ONLang.

**Show Schema List**
```
onst s
```
This command shows the list of schemata available in the onst GitHub repository for ONLang.

**Generate Example ONL**
```
onst g [-s] [-f] [-e] [-n <file>] [-d <destination>]
-s, --save: Save the generated ONL files.
-f, --fake: Use fake values for optional properties.
-e, --example: Use example values for required properties.
-n, --file <path>: Specify the file name for the generated ONL file.
-d, --destination <path>: Specify the destination path where the generated ONL will be saved.
```
This command generates ONL files from the schema.

### Examples

```
onst g -s -f -n example.onl -d ./output
```
This example generates an ONL file, uses fake values for optional properties, saves the file with the name example.onl, and stores it in the ./output directory.

## Current Available Schemas

- Qualtrics
    - [Survey](/schema/qualtrics.survey.d.json)
    - [Dataset](/schema/qualtrics.dataset.d.json)
    - [Contact](/schema/qualtrics.contact.d.json)

## Architecture

**GitHub Interaction**: Utilizes the GitHub API through the Octokit library for fetching repository content.

**User Interaction**: Employs the Inquirer library for interactive command-line prompts.

**File Operations**: Utilizes Node.js File System (fs) for reading, saving, and searching files.

**Configuration**: Relies on environment variables for GitHub credentials and repository details.

**Example Generation**: Generates example ONL files based on the schema and uses [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) and then transpiles it into ONL using [json-to-pretty-yaml](https://www.npmjs.com/package/json-to-pretty-yaml)

## Examples

- [JSON](/examples/json)
- [ONL](/examples/onl)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on the code of conduct.

## License

See [LICENSE.md](LICENSE.md) for details on the license.