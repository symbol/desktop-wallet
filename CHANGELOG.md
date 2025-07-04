# CHANGELOG
All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0][v1.1.0] - 05-Jul-2025
### Milestone: Added mosaic revokable support, language improvements and dependency upgrades

#### Changed
- Updated symbol-sdk version to 2.0.4 [#1975](https://github.com/symbol/desktop-wallet/pull/1975)
- Improve and fix Japanese translation [#1902](https://github.com/symbol/desktop-wallet/pull/1902)
- Improve and fix Japanese translation [#1923](https://github.com/symbol/desktop-wallet/pull/1923)
- Removed login background video and dependency [#1958](https://github.com/symbol/desktop-wallet/pull/1958)
- Enable Dependabot automerge [#1929](https://github.com/symbol/desktop-wallet/pull/1929)
- Added test for delegated harvesting form [#1914](https://github.com/symbol/desktop-wallet/pull/1914)
- One step harvesting impl and unit test improvements [#1903](https://github.com/symbol/desktop-wallet/pull/1903)
- Some dependencies upgrades

#### Fixed
- Fixed offline transaction: fill information about available plugins for mainnet and testnet [#1981](https://github.com/symbol/desktop-wallet/pull/1981)
- Fixed unable to switch nodes and changes the default max fee [#1969](https://github.com/symbol/desktop-wallet/pull/1969)
- Removed duplicate message property from en-US.json [#1962](https://github.com/symbol/desktop-wallet/pull/1962)

#### Added
- Added information about mosaic revokable flag [#1971](https://github.com/symbol/desktop-wallet/pull/1971)
- Added support for mosaic supply revocation transaction [#1967](https://github.com/symbol/desktop-wallet/pull/1967)

## [1.0.13][v1.0.13] - 03-Nov-2022
### Milestone: Testnet reset

#### Changed
- Updated Testnet generation hash after the testnet network reset.

## [1.0.12][v1.0.12] - 25-Oct-2022
### Milestone: Dependency version upgrade

#### Changed
- Upgraded the dependency `symbol-sdk` version to `v2.0.3`

## [1.0.11][v1.0.11] - 19-Aug-2022
### Milestone: Bug fixes and security protection improvements

#### Added
- Added the blacklist/whitelist support for address book. Improved the multisig transaction co-signature form [#1739](https://github.com/symbol/desktop-wallet/issues/1739).
- Added the scam alert link to the docs in the harvesting view [#1860](https://github.com/symbol/desktop-wallet/pull/1860).
- Added nyc integration and enabled ci coverage check [#1869](https://github.com/symbol/desktop-wallet/pull/1869).
- Added unit tests [#1871](https://github.com/symbol/desktop-wallet/pull/1871).
- Added new multisig tree presentation and improved graph construction [#1881](https://github.com/symbol/desktop-wallet/pull/1881).
- Added property to the advanced settings to allow/disallow signing multisig transactions from unknown accounts [#1880](https://github.com/symbol/desktop-wallet/issues/1880).
- Added a signer public key field to the transaction details view [#1840](https://github.com/symbol/desktop-wallet/issues/1840).
- Added link to explorer for addresses in the transaction details view [#1843](https://github.com/symbol/desktop-wallet/issues/1843).
- Added option to block new contact [#1826](https://github.com/symbol/desktop-wallet/issues/1826).

#### Changed
- Removed dashes from addresses [#1841](https://github.com/symbol/desktop-wallet/pull/1841).

#### Fixed
- Improved localization in Japanese [#1819](https://github.com/symbol/desktop-wallet/pull/1819).
- Fixed the metadata non-ascii text update failure and the view refresh issue [#1837](https://github.com/symbol/desktop-wallet/pull/1837).
- Fixed the multisig graph sorting issue [#1890](https://github.com/symbol/desktop-wallet/pull/1890).
- Fixed an issue with editing the contact address in address book [#1834](https://github.com/symbol/desktop-wallet/issues/1834).
- Fixed an issue with address book import [#1827](https://github.com/symbol/desktop-wallet/issues/1827).
- Fixed the wrong contact names presented in the transaction list [#1831](https://github.com/symbol/desktop-wallet/issues/1831).
- Fixed the transaction detail "From" field is not replaced with a contact name [#1842](https://github.com/symbol/desktop-wallet/issues/1842).
- Fixed the signer from multilevel multisig tree presented as an unknown account in the multisig transaction co-signature form [#1848](https://github.com/symbol/desktop-wallet/issues/1848).
- Migrated to Jenkins and fixed failing unit tests [#1868](https://github.com/symbol/desktop-wallet/pull/1868).

## [1.0.9][v1.0.9] - 10-Dec-2021
### Milestone: Stabilize and bug fix

#### Added
- Added OpenAPI client integration [#1776](https://github.com/symbol/desktop-wallet/pull/1776)
- Added Korean language [#1794](https://github.com/symbol/desktop-wallet/pull/1794)
- Show update warning when users are on old versions [#1393](https://github.com/symbol/desktop-wallet/issues/1393)

#### Changed
- Used OpenAPI client for statistics-service API calls [#1777](https://github.com/symbol/desktop-wallet/pull/1777)
- Updated symbol-sdk version to 1.0.3 [#1756](https://github.com/symbol/desktop-wallet/pull/1756)
- Replaced old explorer URL with the new one [#1766](https://github.com/symbol/desktop-wallet/pull/1766)
- Harvesting page improvements: find node by `nodePublicKey` from statistics service instead of local storage, multi-device operation support [#1781](https://github.com/symbol/desktop-wallet/pull/1781)
#### Fixed
- Fixed outdated README [#1764](https://github.com/symbol/desktop-wallet/issues/1764)
- Fixed login error when selected node is broken or Websocket is failing. [#1767](https://github.com/symbol/desktop-wallet/issues/1767)
- Fixed transfer form shows not enough balance [#1771](https://github.com/symbol/desktop-wallet/issues/1771)
- Fixed expired mosaic is visible on supply change transaction page [#1663](https://github.com/symbol/desktop-wallet/issues/1663)
- Fixed leading zeros are ignored if there is no decimal point [#1730](https://github.com/symbol/desktop-wallet/issues/1730)
- Fixed offline transactions page ERROR_EMPTY_RESPONSE error [#1674](https://github.com/symbol/desktop-wallet/issues/1674)
- Allowed pasting option in password fields [#1780](https://github.com/symbol/desktop-wallet/issues/1780)
- Fixed non-ability of initializing an aggregate with a single transaction [#1803](https://github.com/symbol/desktop-wallet/issues/1803)
- Removed NxL and nemfoundation references [#1761](https://github.com/symbol/desktop-wallet/issues/1761)
- Updated translations

## [1.0.8][v1.0.8] - 1-Nov-2021

### Milestone: Stabilize and bug fix

#### Added
- Added secret lock and secret proof transaction to transaction details[#1726](https://github.com/symbol/desktop-wallet/issues/1726)
- Added a new button for transfer transaction input allows users to use maximum value in the wallet.

#### Changed
- Improved mosaic input in transfer transaction form [#1562](https://github.com/symbol/desktop-wallet/issues/1562)
- Removed news section [#1752](https://github.com/symbol/desktop-wallet/issues/1752)
- Removed hardcoded nodes urls [#1735](https://github.com/symbol/desktop-wallet/issues/1735)
- Changed faucet and explorer urls.

#### Fixed
- Fixed multisig multilevel account creation.
- Fixed aggregate transactions builder issue [#1748](https://github.com/symbol/desktop-wallet/issues/1748)

## [1.0.7][v1.0.7] - 30-Sep-2021

### Milestone: Stabilize and bug fix

#### Added

- Added accessible terms and privacy policy links[#814](https://github.com/symbol/desktop-wallet/issues/814)

#### Changed
- Disable Ledger profile menu item in browser version [#1590](https://github.com/symbol/desktop-wallet/issues/1590)
- Enhanced signer selector UI/UX [#1688](https://github.com/symbol/desktop-wallet/issues/1688)

#### Fixed
- Fixed aggregate bonded announced by third party address issue [#1719](https://github.com/symbol/desktop-wallet/issues/1719)
- Fixed aggregate bonded - Failure_Core_Future_Deadline issue [#1490](https://github.com/symbol/desktop-wallet/issues/1490)
- Fixed multisig account owned mosaic actions visibility [#1679](https://github.com/symbol/desktop-wallet/issues/1679)
- Fixed Ledger harvesting VRF and Remote keys not being saved [#1692](https://github.com/symbol/desktop-wallet/issues/1692)
- Fixed pagination in transaction history [#1652](https://github.com/symbol/desktop-wallet/issues/1652)
- Fixed multilevel multisig behavior when account is a cosigner of multiple trees [#1687](https://github.com/symbol/desktop-wallet/issues/1687)
- Fixed partial transactions aren't shown correctly [#1697](https://github.com/symbol/desktop-wallet/issues/1697)
- Fixed mosaic/namespace metadata listing on signer change [#1668](https://github.com/symbol/desktop-wallet/issues/1668)[#1669](https://github.com/symbol/desktop-wallet/issues/1669)[#1670](https://github.com/symbol/desktop-wallet/issues/1670)
- Fixed infinite REST calls when a transaction is sent to an expired namespace alias [1695](https://github.com/symbol/desktop-wallet/issues/1695)
- Reload mosaics only when signer is changed in transaction form [#1684](https://github.com/symbol/desktop-wallet/issues/1684)
- Fixed form resetting when a transaction is confirmed [#1683](https://github.com/symbol/desktop-wallet/issues/1683)
- Fixed axios dependency alert issue
- Improved Japanese language translation
- Updated README.md

## [1.0.6][v1.0.6] - 06-Sep-2021

### Milestone: Stabilize and bug fix

#### Added

- Added Russian translation [#1591](https://github.com/symbol/desktop-wallet/pull/1591)
- Added support for signing multisig multilevel transactions [#1350](https://github.com/symbol/desktop-wallet/issues/1350)
- Added address next to alias in transaction confirmation screen for clarity [#1151](https://github.com/symbol/desktop-wallet/issues/1151)
- Added SupplyAmount component in the Create Mosaic Form [#1561](https://github.com/symbol/desktop-wallet/issues/1561)

#### Changed

- Changing signer to a multi-sig account will stick until changed again by user [#1664](https://github.com/symbol/desktop-wallet/issues/1664)

#### Fixed

- Use AggregateComplete instead of AggregateBonded if minimalApproval is 1[#1344](https://github.com/symbol/desktop-wallet/issues/1344)
- Fixed co-signer cannot be removed [#1646](https://github.com/symbol/desktop-wallet/issues/1646)
- Fixed parent namespaces list update when current signer changed [#1587](https://github.com/symbol/desktop-wallet/issues/1587)
- Fixed low fees when average fee is zero [#1609](https://github.com/symbol/desktop-wallet/pull/1609)
- Prevent private key loss during Account key link transactions [#1476](https://github.com/symbol/desktop-wallet/issues/1476)
- Fixed news page broken link [#1592](https://github.com/symbol/desktop-wallet/issues/1592)
- Fixed transfer transaction form unnecessarily getting reset after confirming multisig transaction [#1577](https://github.com/symbol/desktop-wallet/issues/1577)
- Fixed private key validation when adding new account into profile [#1614](https://github.com/symbol/desktop-wallet/issues/1614)
- Fixed no notification for cosigners when creating multisig [#1655](https://github.com/symbol/desktop-wallet/issues/1655)
- Fixed Link is overlaid by warning on offline tx page [#1553](https://github.com/symbol/desktop-wallet/issues/1553)
- Created sub-namespace - visible namespaces for other account if selected account is cosigner [#1587](https://github.com/symbol/desktop-wallet/issues/1587)
- Fixed mosaic is not visible on Supply Change Transaction Page [#1644](https://github.com/symbol/desktop-wallet/issues/1644)
- Fixed Ledger X - not able to sign transaction with 21 transfer txs [#1645](https://github.com/symbol/desktop-wallet/issues/1645)
- Fixed Mosaics list supply column formatting [#1650](https://github.com/symbol/desktop-wallet/issues/1650)
- Fixed Aggregate - by default empty From selector [#1666](https://github.com/symbol/desktop-wallet/issues/1666)
- Fixed Multisig account transfer view - mosaics not visible [#1675](https://github.com/symbol/desktop-wallet/issues/1675)
- Fixed Multilevel multisig - complete instead of bonded [#1676](https://github.com/symbol/desktop-wallet/issues/1676)
- Fixed Aggregate complete - invalid date of send transaction [#1677](https://github.com/symbol/desktop-wallet/issues/1677)
- Fixed Mosaics - not able to edit supply or link alias for mosaic owned by multisig [#1679](https://github.com/symbol/desktop-wallet/issues/1679)
- Fixed Ledger harvesting - VRF and Remote private keys not saved [#1692](https://github.com/symbol/desktop-wallet/issues/1692)
- Fixed translation typos
- Fixed UI/UX issues

## [1.0.5][v1.0.5] - 21-Jul-2021

### Milestone: Minor bug fix

#### Fixed

- Not able unlink VRF key link for multisig account [#1435](https://github.com/symbol/desktop-wallet/issues/1435)
- Corrupted profile with invalid mnemonic created [#1596](https://github.com/symbol/desktop-wallet/issues/1596)

## [1.0.4][v1.0.4] - 7-Jul-2021

### Milestone: Stabilize and bug fix

#### Added

- Added mosaic envelop icon and tooltips for transaction list
- Added the possibility to check if aggregate transaction has to be signed without opening details
- Added skip button for mnemonic confirmation on Testnet
- Added minRemoval and minApproval values on the multisig tree

#### Changed

- Copy paste password on profile creation now is not accepted
- Custom nodes now are assigned to a profile and not removed when switching between networks
- Changed icon size and positions to make them more consistent
- Changed QR code image for failure when transactions are too big

#### Fixed

- Fix input focus error on FormProfileUnlock
- Fixed amount validation when sending big quantities
- Fix encrypted message console error
- Fixed fee multiplier for offline transaction mode
- Fix transaction signing icon doesn't show up immediately after signing
- Fixed ledger translation
- Fixed account restrictions modal UI
- Fix harvesting not showing 25% of the beneficiary
- Fix decimal separator causing problems between locales
- Fixed copy paste password input
- Fix harvesting node not showing while activated on different devices
- Fixed Scanning a QR Code for a Transfer Transaction without Mosaics breaks the Wallet
- Fix harvesting node not visible if connected to it
- Removed redundant space in mosaics amount when imported from QR code with the prepared invoice
- Fixed profile creation in Ledger caused some crashes
- Fixed error covering import QR code button in offline mode
- Fixed harvesting screen tabs not aligned and scrollable
- Ordered fee selection option
- Removed fee selector redundant caption for min fee multipliers
- Fixed partial aggregate transactions disappearing when signing
- Fixed unable to add new node when all nodes are offline
- Fixed users could try changing symbol.xym properties
- Fixed harvesting screen not showing correct status for node operators
- Fixed when importing QR code for a transaction slow fee changed to slowest
- Fixed the balance was sometimes not shown on wallet selection page
- Fixed some form items were not aligned
- Fixed duration of Namespace rental adds 1 day.
- Fixed bug when entering amounts in offline mode.
- Fixed when put max value transaction details are not presented
- Other UI fixes
- Other translations and wording fixes

## [1.0.3][v1.0.3] - 10-May-2021

### Milestone: Post-launch Opt-in

- Added a custom view for Opt-in payout transactions

## [1.0.2][v1.0.2] - 13-Apr-2021

### Milestone: New testnet update

##
:warning: **This version updates testnet profiles to use the new testnet network. You will be able to claim new testnet XYM using the faucet.**
##

#### Added

- Harvesting persistent delegation request now has a timeout to indicate when de harvesting fails
- When doing harvesting transactions you can now select fee
- Added the possibility to start delegated harvesting on a custom node
- Now failed aggregate bonded transactions due to listener closing connection are recovered and broadcasted
- Reproduce sounds when having a new transaction
- Disable link delegated harvesting when importance is 0

#### Changed

- Harvesting is separated between two modes, delegated harvesting for easy usage and remote/key link harvesting for advanced usage.
- minFeeMultiplier is being used as slowest and averageFeeMultiplier as highest, the rest use a distribution in between to avoid network fees going up

#### Fixed

- Harvesting status is now preserved between devices
- Offline transactions failing on mainnet
- Offline transaction cosignature also show a transaction detail view when importing payload
- Harvesting VRF and Remote keys where shared between profiles
- Import QR was not working on a fully offline machine
- Ledger with harvesting issues
- Confirm buttons where dispalced

## [1.0.1][v1.0.1] - 29-Mar-2021

### Milestone: [catapult-server@v1.0.0.0](https://github.com/symbol/catapult-server/releases/tag/v1.0.0.0)

#### Changed

- Changed transaction fee structure to align with network transaction fees. Reduced slow and average fee multipliers.
- Increased HashLock duration and AggregatedBonded transaction deadline to 48 hours.

## [1.0.0][v1.0.0] - 15-Mar-2021

### Milestone: [catapult-server@v1.0.0.0](https://github.com/symbol/catapult-server/releases/tag/v1.0.0.0)

- Symbol mainnet launch release.

## [0.15.1][v0.15.1] - 13-Mar-2021

### Milestone: [catapult-server@v1.0.0.0](https://github.com/symbol/catapult-server/releases/tag/v1.0.0.0)

- Pre Symbol launch release.
- Updated experimental Symbol mainnet node with final Opt In balances

## [0.15.0][v0.15.0] - 11-Mar-2021

### Milestone: [catapult-server@v0.10.0.8](https://github.com/symbol/catapult-server/releases/tag/v0.10.0.8)

- Preview version for Symbol Mainnet.
- Support read-only experimental Symbol Mainnet node for Symbol Opt-In accounts & balances preview (Valid Opt-In only).
- Fixed various issues.

:note: When using Leger to create / import a mainnet profile, please wait for the device to finish loading each selected account. Ledger devices cannot handle too many concurrent requests at a time.

New Opt-In accounts created after this beta release will not be shown on Opt-In mnemonic importing. A new version after the Opt-In snapshot will be release includes all valid opt-in accounts.

## [0.14.1][v0.14.1] - 18-Feb-2021

### Milestone: [catapult-server@v0.10.0.7](https://github.com/symbol/catapult-server/releases/tag/v0.10.0.7)

#### Added

- Allow use of the wallet without a running node.
- Added T&C to Ledger integration.
- Added fees label in Aggregated transaction form.

#### Changed

- Removed default nodes on wallet initialization. Changed to randomly sync to working nodes.
- Split reserved nodes by network types.
- Removed unnecessary notifications.
- Changed Node Key Link description.
- UX improvement on profile creation.
- Localized amount display.
- Various UI improvements.
- Language improvement.

#### Fixed

- Fixed fee selector in metadata transaction from.
- Fixed Mosaic supply amount decimal part issue.
- Fixed Mosaic shows as expired when the balance is 0 issue.
- Fixed transfer tab becomes inactive after toggling from multisig account issue.
- Fixed Ledger notification issue on MacOS.
- Fixed cosignature transaction modal issue.
- Fixed versions in Settings.
- Fixed profile creation wizard issue.
- Fixed estimated rental fees on transaction history list issue.
- Fixed metadata cosign with single accounts issue.
- Fixed Aggregated transaction save button malfunction issue.
- Fixed alias validation issue.

## [0.14.0][v0.14.0] - 08-Feb-2021

### Milestone: [catapult-server@v0.10.0.6](https://github.com/symbol/catapult-client/releases/tag/v0.10.0.6)

**This version only works with the latest testnet (0.10.0.6), it is not backward compatible.**

##
:warning: **This version(0.14.0) resets the previous user profile and locally stored data. The new HD path will generate different keys and addresses from an existing testnet mnemonic phrases. It is highly recommended to backup your test account profiles before using this version, especially the private keys of your seed(HD) accounts. Old testnet private keys can still be restored / re-imported as privateKey accounts in this new version.**
##

#### Added

- Ledger integration support. The integration code work has been finished, it may not work until the Ledger integration app is available and fully tested.
- Added address validation for cosignatories in multisig account creation.
- Added backup warning after private key account imported into the profile.
- Added core server error message transformer.

#### Changed

- Changed delegated harvesting process. Support persisting linked private keys locally for remote & local harvesting (node owners) purposes.
- Improved vuex store, optimized rest API requests.
- Changed HD seed account generation to use profile network type rather than node network type.
- Language improvement in English and Japanese.
- Removed Trezor button.
- Balance panel UI improvement.
- Transaction confirmation modal UI improvement.
- Profile creation page UI improvement.
- Aggregate transaction page UI improvement.
- Changed importance score to show in a percentage format

#### Fixed

- Split HD wallet path between MainNet and TestNet for seed accounts generation [**Account Profile & Localstorage Reset**].
- Fixed cosigners cannot receive partial transaction notification issue.
- Fixed cosigners cannot cosign partial transaction issue.
- Fixed WebSocket listener not closing properly after switching accounts/nodes issue.
- Fixed metadata value showing with different encoding issues.
- Fixed an issue that the application can be used without accepting T&C.
- Fixed none readable hint texts issue.
- Fixed delegated harvesting throws Failure_Core_Past_Deadline issue.
- Fixed the issue that sends transaction button not disabled when the inner transaction is empty in the Aggregate transaction form.
- Fixed aggrege transaction can be seen from different account issue.
- Fixed multisig creation form accessibility issue.
- Fixed fees selector in an aggregate transaction not always display issue.
- Fixed maxFee selector warning overlaps on other warning component issue.
- Fixed password is displayed as plain text in updated password form.
- Fixed duplicated seed account issue.
- Fixed modal confirmation checkbox and text-overflow issue.
- Fixed selected signer gets reset issue in Aggregate transaction form.
- Fixed mosaic fractional part display issue.
- Other UI / UX fixes.

## [0.13.8][v0.13.8] - 19-Jan-2021

### Milestone: [catapult-server@v0.10.0.5](https://github.com/symbol/catapult-client/releases/tag/v0.10.0.5)

**This version only works with latest testnet (0.10.0.5), it is not backward compatible.**
#### Fixed

- Fixed electron-shortcut dependency issue.
- Updated reserved testnet node url (0.10.0.5)
- Reset local storage for new network 0.10.0.5

## [0.13.7][v0.13.7] - 14-Jan-2021

### Milestone: [catapult-server@v0.10.0.5](https://github.com/symbol/catapult-client/releases/tag/v0.10.0.5)

#### Added
- Add URL validation procedure to the web-contents-created callback to avoid remote code execution attacks.
- Added pop-up when co-signatory address is not valid on multisig page.
- Added icon for NODE_KEY_LINK transactions.
- added minFeeMultiplier to support the new catapult-server minimal fee requirement.
#### Fixed
- Improve Japanese translation.
- Fixed validation for duplicates in contact creation.
- Removed additional space in Select Contact window
- Fixed visibility for balance in profile import form.
- Updated Electron.
- Updated feeds to use HTTPS to avoid potential content spoofing.
- Fixed import account stalls at Mnemonic Passphrase stage.
- Fixed validation in the contact form.
- Removed Foundation tags.
- Fixed transaction filter is not closed after clicking outside the dropdown.
- Fixed UI issue in Account Restrictions.
  - Button New Address Restriction is out of the window.
  - Button Cancel is out of the window.
  - Address/ Mosaic deletion window doesn't disappear when the restriction was removed.
  - Multisig account is not fully visible on the address restriction page.
- Fixed not all the Aggregate page is inactive under Multisig account.
- Fixed carriage in "To" field for Simple transaction under Multisig account via Aggregate.
- Fixed single character namespace creation is disabled.
- Fixed note not visible with normal window size in all transaction forms.
- Fixed import Transaction URI" dialog window has the wrong size.
- Fixed unable to convert the account to multi-signature
- Fixed inability of converting the account to multisig
- Fixed mnemonic for password backup is always displayed as invalid.
- Fixed "Add a cosignatory" button missing on Multisig page after toggling from co-signer to not co-signer via upper menu.
- Fixed setting form URL update state.
- Fixed mnemonic issues.
- Fixed UI bugs.


## [0.13.6][v0.13.6] - 11-Dec-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-client/releases/tag/v0.10.0.4)

#### Added

- Added Account Restrictions feature (add and delete restrictions), includes the following types:
  - Address Restrictions
  - Mosaic Restrictions
  - Operation(Transaction Type) Restrictions
- Added cross-platform zip artifact release
  - Allows opening directly index.html in the browser (after unzipping the archive file)
- Added account metadata transaction update feature
- Added confirmation modal (with warning) after the delete account button is clicked
#### Fixed

- Fixed multisig account sends transaction issue.
- Fixed NodeSelector to filter nodes with role type 'peer'.
  - Until the mainnet release we will keep the static node list(starts with 'beacon') added on top of the dynamic list.
- Fixed ContactQR publickey bug on export (Import QR Code, next button missing #725).
- Fixed required-cosignature count bug on metadata transaction.
- Fixed target account to the selected signer for mosaic and namespace metadata and removed from the forms.
- Fixed coins transfered from co-signers instead of multi-sig account issue.
- Fixed harvesting with multi-sig account on different profile issue.
- Fixed missing add button in aggregate transactions
- Fixed show notification in case mnemonic not valid before going to next step
- Fixed AddressQR and ContactQR to use the same QRDisplay component.
- Fixed overflow on Transaction Modal.
- Fixed translation issues (especially Japaneese).
- Improved multi-sig graph view on Account Details Page and Aliases display.
- UI fixes
  - Fixed unable to add json Address Book after attaching invalid format file issue.
  - Fixed select contact window issues.
  - Fixed fee selector is not visible issue on modify mosaic supply modal.
  - Fixed empty window after logout issue.
## [0.13.5][v0.13.5] - 18-Nov-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-client/releases/tag/v0.10.0.4)

#### Added

- Added Delegated Harvesting (Part 2/2).
  - Split Delegated harvesting activation into 2 steps: Key linking & Persistent delegation message sending.
  - Activation is now supporting multisig accounts by sending key link & persistent delegation message in AggregaredBonded transaction for cosigning.
  - Allow the user to manually input the remote node's public for the node key links.
  - Extended harvest node selector to load all peers. Node public key is loaded automatically for all `Dual Nodes` with latest catapult-rest changes implemented (Due to be released with the next full server release and Testnet patch, note this will not be fully functional until the release, until then please use the known nodes from the drop-down list or provide the node public key manually).
  - Activation status has been changed to using catapult-server's `unlockedAccount` diagnostic API (Due to be released with the next full server release and Testnet patch, note this will not be fully functional on all peer nodes until the release).
  - Added delegated harvesting eligibility check (10K stake)
- Added MeataData for Account / Modaic / Namespace.
  - Metadata creation with randomly generated scope key.
  - Existing metadata modification will be implemented in the next release.
- Added Aggregate Transaction support.
  - Currently support 3 types of inner transaction: Transfer / MosaicDefination / NamespaceRegistration.
- Added AddressBook import from JSON back up.
- Added logout button under the settings page.
- Added AddressQR to contact details.
  - AddressQR currently cannot be exported. We acknowledged this issue (not logged in github issues). This will be fixed in the next release.

#### Fixed

- Fixed account name not showing properly after the update.
- Fixed bugs in transaction CSV download.
- Fixed bugs in account deletion from multiple profiles.
- Fixed invalid node URL bug.
- Fixed the bug of transaction date in transaction history.
- Fixed harvesting blocks UI.
- Improved aggregate transactions UI
- Accounts restyled. The separation between private keys and seed accounts
- Aligned all dropdowns.
- Download paper wallets on account creation.
- Network settings showing a list of nodes.
- Fixed private key overflow.
- Changed transaction modals styles.
- Other UI fixes.

NOTE: We have known issues which have been logged into github and will look for fixing them in the next release.

## [0.13.4][v0.13.4] - 11-Nov-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-server/releases/tag/v0.10.0.4)

#### Fixed

- Fixed delegated harvesting activation issues.
- Added existing NGL harvesting nodes to delegated harvesting node selector for function preview purposes.
- UI fixed on the delegated harvesting activation confirmation page.

## [0.13.3][v0.13.3] - 09-Nov-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-server/releases/tag/v0.10.0.4)

#### Added

- Added AddressBook to the user profile.
- Added AddressBook backup function.
- Added AddressQR feature to symbol-qr-library.
- Added `Sender` and `Recipient` filter in transaction history.
- First part (1/2) of Delegated Harvesting release. Enabled delegated harvesting activation and deactivation on existing known nodes only. Activation status and full peer nodes selection will be released in the next drop.

#### Changes

- Recipient input can now use known contacts from AddressBook
- Contact names (known contacts from AddressBook) are shown in the transaction history list.
- Restyled news page.
- Removed modal close buttons.
- Restyled general modals structure.
- Aligned dropdowns with input sizes.
- Restyled confirm buttons on modals.
- Fee dropdown hover styles.
- Fix multisig add cosignatories was overlapping.
- New layout in settings modal.
- Refactored navigation links for settings and account.
- Styled contact list.
- Styled address book details page.
- Disabled encrypting / decrypting message for multisig account.

#### Fixed

- Fixed minApproval and minRemoval showing the wrong values issue.
- Blocked users form adding currently selected account as a cosigner for itself.
- Fixed multisig graph showing on non-multisig account issue.
- Set overlay component position to block transactions forms properly in multisig accounts
- Fixed issues in transaction history export csv.
- Various UI issues fixed.

## [0.13.2][v0.13.2] - 02-Nov-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-server/releases/tag/v0.10.0.4)

#### Added

- Docker support on the wallet web mode. Docker images can be created for development and testing purposes.
- Added warning banner on footer when the wallet is running under dev (web) mode.
- Added paper wallet account backup which generates multiple pages backup with both mnemonic and private key accounts.
- Added Encrypt / Decrypt message support in TransferTransaction.

#### Changes

- Upgraded symbol-hd-wallets, symbol-qr-library and symbol-uri-scheme with removed Symbol-SDK dependency
- Upgraded symbol-sdk to latest v0.21.13 alpha (0.10.x compat)
- Allow multiple private key accounts to be imported into the same profile as the mnemonic account.
- Profile backup is now using Symbole-Paper-Wallet with multiple accounts support.
- Applied the first iteration of UI implementation.
  - Restyled login access profile
  - Restyled profile creation and profile import with new UI styles
  - General layouts applied
  - Styled buttons, forms, and tables
  - Aggregate page UI layout
  - Harversting page UI layout

#### Fixed

- Fees (various available) are set to be visible with sorting in the transaction creation form.
- Fixed Deadline timestamp issue in the transaction list view.
- Fixed Alias display issue in account info page when signer of the alias transaction is not current account.
- Fixed multi-level multisig account creation & display issue.
- Improved available note list view, separated node's friendly name, and url.
- Fixed issues when resetting transaction entry forms.
- Fixed issues in node switching when currently selected node becomes not available.
- Fixed subnamespace display issue. Subnamnespace is not visible with corrected type labels.
- Various UI issues fixed.

## [0.13.0][v0.13.0] - 25-Sep-2020

### Milestone: [catapult-server@v0.10.x](https://github.com/symbol/catapult-server/releases/tag/v0.10.0)

#### Changes

- Upgraded symbol-hd-wallets and symbol-qr-library to use `next` tag
- Upgraded symbol-sdk to latest v0.20.8 alpha (0.10.x compat)
- Added new testnet nodes in config/network.conf.json

#### Fixed

- Multiple fixes on breaking changes of upcoming 0.21 SDK
- Updated block height reader to use /chain/info
- Fixed a WebSocket CLOSED state due to invalid UNSUBSCRIBE order

## [0.12.0][v0.12.0] - 16-Jul-2020

### Milestone: [catapult-server@v0.9.6.3](https://github.com/symbol/catapult-server/releases/tag/v0.9.6.3)

#### Added

- Added compatibility for 0.9.6.3 server transactions and blocks(fixes #415)
- Added compatibility for 0.9.6.3 server entities changes from public key to addresses(fixes #414)
- Added database migrations for 0.9.6.3 testnet network reset including profiles and accounts table (**BREAKING CHANGE**)
- Added new **signerAddress** storage instead of signerPublicKey where necessary
- Added more japanese translations (Thanks @44uk)

#### Fixed

- Fixed settings screen not appeaering on MacOS (fixes #448)
- Fixed Add mosaic button on FormTransferTransaction (fixes #437)
- Aligned all language files to prepare adding further translated languages

## [0.11.0][v0.11.0] - 24-Jun-2020

### Milestone: [catapult-server@v0.9.5.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.5.1)

#### Added

- Added first implementation of Harvesting setup wizard for HD Profiles (fixes #326)
- Added AccountKeyLink transaction wrapping with PersistentDelegationRequestTransaction
- Added possibility to create unlimited duration mosaics (fixes #413)
- Added settings modal box with new custom node selector (fixes #348)
- Separated mosaic configuration for different accounts (fixes #379, #380)
- Improved news module and added several bugfixes related to news
- Removed duplicate menu actions on menu clicks

#### Fixed

- Fixed namespace name validator to use same as SDK (fixes #412)
- Fixed login page visual bug (fixes #431)
- Fixed selector fields consistency to use iView's Select component (fixes #388, #347)
- Fixed private key display replication bug (fixes #403)
- Several wording and UI fixes on languages files (fixes #390, #391, #404, #252)

## [0.10.0][v0.10.0] - 27-May-2020

### Milestone: [catapult-server@v0.9.5.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.5.1)

#### Added

- Upgrade to testnet 0.9.5.1 with SDK v0.19.2 (fixes #385)
- Added **recommended fees** feature using transaction size and network median fees
- Added transaction command to replace staged transactions
- Added TransactionAnnouncerService to cope with transaction timeouts and errors
- Improved components styling with scoped less (fixes #307, #273)
- Removed duplicate cancel actions on modals (fixes #367)

#### Fixed

- Fixed reactivity of locale for custom validation messages (fixes #374)
- Fixed invalid profile listing in login (fixes #341, #353)
- Fixed multisig edition form deleting accounts (fixes #384)
- Fixed wording on multisig form (fixes #366)

## [v0.9.9][v0.9.9]

### Milestone: [catapult-server@v0.9.4.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.4.1)

#### Added

- Added release process compliant with NIP14
- Added Apache v2 license (fixes #209)
- upgrade SDK to v0.18.0, (fixes #276)
- remove AESEncryptionService, (fixes #277)
- Testnet upgrade, (fixes #292)
- Move user data storage folder to /home/.symbol-desktop-wallet
- Rename accounts to profiles, wallets to accounts (fixes #304)

#### Fixed

- Fixed mosaic namespace resolution inside transfers (fixes #275)
- Fixed hardcoded network configuration properties (fixes #140) (fixes #139)
- Fixed private key import of duplicates (fixes #214)
- Fixed vue-router error logs (fixes #252)

## [v0.9.8][v0.9.8] -

### Milestone: [catapult-server@v0.9.3.2](https://github.com/symbol/catapult-server/releases/tag/v0.9.3.2)

### [v0.9.8-beta1][v0.9.8-beta1] - 17-Apr-2020

#### Added

- Added transaction status filters and multisig account selector (fixes #183)

#### Fixed

- Fixed wallet import in subwallet creation (fixes #214)


## [v0.9.7][v0.9.7] - 06-Apr-2020

### Milestone: [catapult-server@v0.9.3.2](https://github.com/symbol/catapult-server/releases/tag/v0.9.3.2)

### [v0.9.7-beta1][v0.9.7-beta1] - 06-Apr-2020

#### Added

- Added refresh button for namespace list (fixes #186)
- Added refresh button for mosaics list (fixes #146)
- Added automatic generation of QR Code for Invoices (fixes #168)
- Added eslint and linter configuration (fixes #166)

#### Fixed

- SignerSelector address format bug starting with A (fixes #205)
- Password change related bug fixes (fixes #195)
- Fix incorrect max fee display (fixes #188)
- Fixed mosaic balance panel list Close button (fixes #151)


## [v0.9.6][v0.9.6] - 21-Mar-2020

### Milestone: [catapult-server@v0.9.3.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.3.1)

### [v0.9.6-beta2][v0.9.6-beta2] - 21-Mar-2020

#### Added

- Added aliases to wallet details (fixes #26)
- Added multisig accounts transaction list link (fixes #84)

#### Changed

- Added usage of repository factory for REST (fixes #131)

#### Fixed

- Fixed account import cancellation (fixes #135)
- Fixed transaction pagination (fixes #112)
- Fixed dashboard CSS (fixes #111)
- Fixed SignerSelector mutation (fixes #115)
- Fixed form submit behaviour (fixes #98)

### [v0.9.6-beta1][v0.9.6-beta1] - 17-Mar-2020

#### Added

- Permit to query partial transactions of multisig accounts (fixes #68)
- Skip expired mosaics in transfer form (fixes #61)

#### Changed

- Changed navigation bar logos to use Symbol branding (fixes #72)
- Add reactivity to confirmed transaction events (fixes #69)

#### Fixed

- Fixed sub wallet creation form (fixes #103)
- Added unsubscription from websocket channels (fixes #99)
- Fixed duplicate words in mnemonic passphrases (fixes #87)
- Reset cosignatories from multisig form (fixes #85)
- Fix reactivity of account balance panel (fixes #79)


## [v0.9.5][v0.9.5] - 11-Mar-2020

### Milestone: [catapult-server@v0.9.3.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.3.1)

### [v0.9.5-beta6][v0.9.5-beta6] - 11-Mar-2020

#### Fixed

- Fixed password field input validation (fixes #57)
- Added new Symbol icons (fixes #72)
- Fixed child account creation (fixes #64)
- Fixed namespace state updates (fixes #67)
- Fixed MosaicBalanceList reactivity

### [v0.9.5-beta5][v0.9.5-beta5] - 10-Mar-2020

#### Fixed

- Fixed namespaces and mosaics database schema to hold hex instead of UInt64 (fixes #59)
- Hide expired mosaics in transfer inputs, (fixes #61)
- Fix mosaic balance list, (fixes #65)
- Type store / mosaic state
- Persist mosaic hidden state to database

### [v0.9.5-beta4][v0.9.5-beta4] - 09-Mar-2020

#### Fixed

- Patched windows build postcss properties
- Fixed PeerSelector component with loading state (fixes #23)
- Fixed transaction list layout for better readability
- Added beautified empty messages for table displays
- Fixed FormAliasTransaction for mosaic aliases
- Fixed pagination component layout
- Fixed mnemonic import wallet selection screen

### [v0.9.5-beta2][v0.9.5-beta2] - 06-Mar-2020

#### Fixed

- Fixed WalletSelectorPanel balances listing (fixes #27)
- Fixed account import pages (fixes #54)
- Fixed newly added transfer mosaic attachments

### [v0.9.5-beta1][v0.9.5-beta1] - 06-Mar-2020

#### Added

- Added TransactionService methods handling transaction signature
- Added TransactionService methods handling transaction broadcast
- Added store actions for better reactivity across components
- Added endpoints database table
- Improved `FormTransactionBase` to make use of `isCosignatoryMode` state change
- Added automatic **funds lock** creation for multi-signature transactions (aggregate bonded)
- Added possibility to _aggregate transactions_ that are _signed_ and _on-stage_ (used in `FormMosaicDefinitionTransaction`)
- Added rebranded account creation pages
- Added and fixed account import pages
- Fixed unconfirmed and partial transaction removal from lists
- Added `FormMultisigAccountModificationTransaction` with common form for conversion and modifications

#### Known Issues

- Missing harvesting setup (account link & persistent delegation requests)
- Some missing UI fixes for Symbol rebrand

## [v0.9.4-beta][v0.9.4-beta] - 25-Feb-2020

### Milestone: [catapult-server@v0.9.2.1](https://github.com/symbol/catapult-server/releases/tag/v0.9.2.1)

#### Added

- `FormAccountUnlock`: standardize practice of unlocking account across app
- `FormTransactionBase`: base abstraction layer for transaction forms
- `SignerSelector`: generic transaction signer selector, works with multisig to change owned assets states
- General change of views files (*.vue) paths with result :
    * Components in src/components/
    * Modal Dialogs in src/views/modals/
    * Pages in src/views/pages/
    * Layouts in src/components/
    * Forms in src/views/forms/
- Added namespaced vuex Store managing application state changes
- Added namespaces vuex Store managing REST requests changing state (action REST_*)
- Added src/core/database/ with LocalStorageBackend, models and tables schemas
- Added repository abstraction layer to work with persistent storage
- Added business layer implementations in src/services/*
- Rewrote all route names and use route names instead of paths for redirects

#### Known Issues

- Missing harvesting setup (account link & persistent delegation requests)
- Some missing UI fixes for Symbol rebrand

[v1.1.0]: https://github.com/symbol/desktop-wallet/releases/tag/v1.1.0
[v1.0.13]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.13
[v1.0.12]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.12
[v1.0.11]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.11
[v1.0.9]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.9
[v1.0.8]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.8
[v1.0.7]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.7
[v1.0.6]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.6
[v1.0.5]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.5
[v1.0.4]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.4
[v1.0.3]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.3
[v1.0.2]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.2
[v1.0.1]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.1
[v1.0.0]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.0
[v1.0.0]: https://github.com/symbol/desktop-wallet/releases/tag/v1.0.0-beta.2
[v0.15.1]: https://github.com/symbol/desktop-wallet/releases/tag/v0.15.1
[v0.15.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.15.0
[v0.14.1]: https://github.com/symbol/desktop-wallet/releases/tag/v0.14.1
[v0.14.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.14.0
[v0.13.8]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.8
[v0.13.7]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.7
[v0.13.6]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.6
[v0.13.5]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.5
[v0.13.4]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.4
[v0.13.3]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.3
[v0.13.2]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.2
[v0.13.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.13.0
[v0.12.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.12.0
[v0.11.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.11.0
[v0.10.0]: https://github.com/symbol/desktop-wallet/releases/tag/v0.10.0
[v0.9.9]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.9
[v0.9.8]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.8-beta1
[v0.9.8-beta1]: https://github.com/symbol/desktop-wallet/compare/v0.9.7-beta1...v0.9.8-beta1
[v0.9.7]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.7-beta1
[v0.9.7-beta1]: https://github.com/symbol/desktop-wallet/compare/v0.9.6...v0.9.7-beta1
[v0.9.6]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.6-beta2
[v0.9.6-beta2]: https://github.com/symbol/desktop-wallet/compare/v0.9.6-beta1...v0.9.6-beta2
[v0.9.6-beta1]: https://github.com/symbol/desktop-wallet/compare/v0.9.5-beta6...v0.9.6-beta1
[v0.9.5]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.5-beta6
[v0.9.5-beta6]: https://github.com/symbol/desktop-wallet/compare/v0.9.5-beta5...v0.9.5-beta6
[v0.9.5-beta5]: https://github.com/symbol/desktop-wallet/compare/v0.9.5-beta4...v0.9.5-beta5
[v0.9.5-beta4]: https://github.com/symbol/desktop-wallet/compare/v0.9.5-beta2...v0.9.5-beta4
[v0.9.5-beta2]: https://github.com/symbol/desktop-wallet/compare/v0.9.5-beta1...v0.9.5-beta2
[v0.9.5-beta1]: https://github.com/symbol/desktop-wallet/compare/v0.9.4-beta...v0.9.5-beta1
[v0.9.4-beta]: https://github.com/symbol/desktop-wallet/releases/tag/v0.9.4-beta
