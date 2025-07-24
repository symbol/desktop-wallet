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

## Release
1. For local use, build Symbol Wallet Electron app (only Electron version support Ledger wallets), default build for MacOS, Windows and Linux

<pre>
# to skip code signing
export CSC_IDENTITY_AUTO_DISCOVERY=false

npm run release
</pre>

2. Release for distribution: (Code signing for Apple builds - requires `Developer ID Certificate`)

    2.1 On a MacOS machine, download the zip file containing the app signing certificates (ask team)

    2.2 Extract the certificates and double click each one of them to add to the keychain (ask the team for private key password)

    2.3 Starting with MacOS 10.14.5, all signed applications by new `Developer ID Certificate` will need to be notarized. This is an automated step in the process. You'll need to enable notarization by setting the following env vars.

    <pre>
    export DESKTOP_APP_NOTARIZE=true
    export DESKTOP_APP_APPLE_ID=VALID_APPLE_DEV_ID
    export DESKTOP_APP_APPLE_PASSWORD=VALID_APPLE_DEV_PASSWORD
    export DESKTOP_APP_APPLE_TEAM_ID=VALID_APPLE_TEAM_ID
    </pre>

    2.4 Enable auto discovery for code signing process to pick up the certificates from the keychain

    <pre>export CSC_IDENTITY_AUTO_DISCOVERY=true</pre>

    2.5 Run release
    <pre>npm run release</pre>

    2.6 Validate if the app is signed with a `Developer ID Certificate` and notarized

    <pre>spctl -a -t exec -v ./release/mac/Symbol\ Wallet.app
    # Output(Success): ./release/mac/Symbol Wallet.app: accepted source=Notarized Developer ID
    # Output(Failure): ./release/mac/Symbol Wallet.app: rejected source=Unnotarized Developer ID
    </pre>

## Getting help

Use the following available resources to get help:

- [Symbol Documentation][docs]
- Join the community [discord group][discord]
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated.
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

(C) Symbol Contributors 2022

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/symbol/desktop-wallet
[docs]: https://docs.symbol.dev
[issues]: https://github.com/symbol/desktop-wallet/issues
[discord]: https://discord.gg/NMA9YQ55td
