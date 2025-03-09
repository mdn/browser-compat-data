name: Node.js CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version-file: .nvmrc
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Format code
      run: npx prettier --write .

    - name: Run tests
      run: npm test
