# Contributing to @onlang-org/onst

Thank you for considering contributing to @onlang-org/onst! Your contributions help improve the functionality and usability of this tool.

## How to Contribute

If you would like to contribute to @onlang-org/onst, follow these steps:

1. Fork the repository.

2. Create a new branch to work on your changes:

    ```bash
    git checkout -b feature/my-feature
    ```

3. Make your changes and commit them:

    ```bash
    git add .
    git commit -m "Add new feature"
    ```

4. Push your changes to your fork:

    ```bash
    git push origin feature/my-feature
    ```

5. Open a pull request (PR) against the `main` branch of the original repository.

## Pull Request Checklist

To ensure a smooth review process, make sure your pull request includes the following:

- [ ] A clear and descriptive title for your PR.
- [ ] Detailed description of the changes made.
- [ ] Code that adheres to the project's coding standards.
- [ ] Unit tests (if applicable).
- [ ] Documentation updates (if applicable).

## Adding to the Schema

If you want to add new entities to the schema list, follow these steps:

1. Locate the `schemaList.json` file in the repository.

2. Edit the file to include your new entity. Follow the existing format:

    ```json
    [
        {
            "EntityName": "regex_pattern"
        }
    ]
    ```

    Replace "EntityName" with the name of your entity and "regex_pattern" with the appropriate regular expression pattern.

3. Submit a pull request with your changes.
Please refer to [pull_request_template.md](pull_request_template.md) for more details.

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) while participating in this project.

## Questions or Issues

If you have questions or encounter issues, please create an [issue](https://github.com/onlang-org/onst/issues).

Thank you for contributing to @onlang-org/onst!
