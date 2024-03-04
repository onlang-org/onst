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

Show help:

```bash
onst h
```

Fetch schema files from the onst GitHub repository:

```bash
onst f
```

Show schema list in the onst GitHub repository:

```bash
onst s
```

Show version of @onlang-org/onst package:

```bash
onst v
```

## Current Available Schemas

- Qualtrics
    - [Survey](/schema/qualtrics.survey.d.json)
    - [Dataset](/schema/qualtrics.dataset.d.json)
    - [Contact](/schema/qualtrics.contact.d.json)

## Architecture

### Components

**GitHub Interaction**: Utilizes the GitHub API through the Octokit library for fetching repository content.

**User Interaction**: Employs the Inquirer library for interactive command-line prompts.

**File Operations**: Utilizes Node.js File System (fs) for reading, saving, and searching files.

**Configuration**: Relies on environment variables for GitHub credentials and repository details.

### Workflow

- Fetches a schema list from the GitHub repository to enable users to select specific entities.
- Selected entities are used to search for relevant files in the specified repository path.
- Files matching the specified criteria are saved to the user-specified destination path.

### Notes

- The script fetches a schema list from the repository to enable users to select specific entities.
- Selected entities are used to search for relevant files in the specified repository path.
- Files matching the specified criteria are saved to the user-specified destination path.

## Examples

- [JSON](/examples/json)
- [ONL](/examples/onl)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on the code of conduct.

## License

See [LICENSE.md](LICENSE.md) for details on the license.