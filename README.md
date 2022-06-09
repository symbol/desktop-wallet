# Symbol Desktop Wallet

[![build][wallet-desktop-build]][wallet-desktop-job]
[![lint][wallet-desktop-lint]][wallet-desktop-job]
[![test][wallet-desktop-test]][wallet-desktop-job]
[![][wallet-desktop-cov]][wallet-desktop-cov-link]
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[wallet-desktop-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Symbol%2FWallets%2Fdesktop-wallet/activity/?branch=dev
[wallet-desktop-build]: https://jenkins.symboldev.com/buildStatus/icon?job=Symbol%2FWallets%2Fdesktop-wallet%2Fdev
[wallet-desktop-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Symbol%2FWallets%2Fdesktop-wallet%2Fdev&config=wallet-desktop-lint
[wallet-desktop-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Symbol%2FWallets%2Fdesktop-wallet%2Fdev&config=wallet-desktop-test
[wallet-desktop-cov]: https://codecov.io/gh/symbol/desktop-wallet/branch/dev/graph/badge.svg?token=SSYYBMK0M7&flag=wallet-desktop
[wallet-desktop-cov-link]: https://codecov.io/gh/symbol/desktop-wallet/tree/dev/

Cross-platform client for Symbol to manage accounts, mosaics, namespaces, and issue transactions.

## Installation

Symbol Desktop Wallet is available for Mac, Windows, and as a web application.

1. Download Symbol Desktop Wallet from the [releases section](https://github.com/symbol/desktop-wallet/releases).

2. Launch the executable file and follow the installation instructions.

3. Create a profile. Remember to save the mnemonic somewhere safe (offline).

## Building instructions

Symbol CLI require **Node.js 16 LTS** to execute.

1. Clone the project.

```
git clone https://github.com/symbol/desktop-wallet.git
```

2. Install the dependencies.
```
cd symbol-desktop-wallet
npm install
```

3. Start the development server.

```
npm run dev
```

4. Visit http://localhost:8080/#/ in your browser.

## Getting help

Use the following available resources to get help:

- [Symbol Documentation][docs]
- Join the community [discord group][discord], [slack group (#sig-client)][slack]
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated.
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

Copyright 2018-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/symbol/desktop-wallet
[docs]: https://docs.symbolplatform.com
[issues]: https://github.com/symbol/desktop-wallet/issues
[discord]: https://discord.gg/xymcity
[slack]: https://join.slack.com/t/nem2/shared_invite/enQtMzY4MDc2NTg0ODgyLWZmZWRiMjViYTVhZjEzOTA0MzUyMTA1NTA5OWQ0MWUzNTA4NjM5OTJhOGViOTBhNjkxYWVhMWRiZDRkOTE0YmU
