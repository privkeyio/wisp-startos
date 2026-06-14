# Wisp

## Documentation

- [Wisp documentation](https://docs.privkey.io/wisp/): full project documentation.
- [Wisp README](https://github.com/privkeyio/wisp/blob/main/README.md): upstream overview and operator notes.
- [wisp.toml reference](https://github.com/privkeyio/wisp/blob/main/wisp.toml.example): the full upstream configuration file, with every setting documented inline.

## What you get on StartOS

- A **Wisp** Nostr relay backed by an LMDB database, with no external database to manage. Storage is crash-safe by default: a power loss can at most lose the last write, never corrupt your relay.
- A **Relay Websocket** interface exposing the relay at port 7777 over Tor and LAN.
- Configuration entirely through StartOS Actions; there is no separate config UI, and you do not edit `wisp.toml` by hand.

## Using Wisp

### Connecting clients

The **Relay Websocket** interface holds the URLs your clients use. Copy a Tor or LAN address from that interface and add it to your Nostr client of choice (Damus, Amethyst, noStrudel, etc.) as a relay.

The relay speaks plain `ws://` over Tor and LAN rather than `wss://`. If you connect from a web client served over HTTPS, you may need to allow insecure websockets for the relay's address in your browser.

### Actions

All actions live under the **Configure** group and can be run whether the relay is running or stopped. **Changes take effect the next time the relay starts**, so restart the service after saving.

- **Relay Information**: set the relay's **Name**, **Description**, **Admin Pubkey**, **Admin Contact**, and the **Relay URL** advertised for NIP-42 authentication. These are the fields other Nostr clients see when they query your relay for its NIP-11 information. The Admin Pubkey accepts an `npub` or a 64-character hex key.
- **Spider Sync**: Wisp's signature feature. Enable it and enter **Your Pubkey** (`npub` or hex); Spider fetches your contact list and continuously syncs those people's notes from other relays into your own relay, so your personal feed lives on hardware you control. Optionally tune the **Source Relays**, **Additional Pubkeys** to follow, and the **Sync Interval**.
- **Limits**: tune throughput and resource caps: max connections (total and per IP), max subscriptions and filters, message/content/tag sizes, events per minute, query limits, idle timeout, and a minimum NIP-13 proof-of-work difficulty for incoming events.
- **Access Control**: require NIP-42 authentication (to connect and/or to publish), restrict connections with an IP allowlist/blocklist, and set the **Management Pubkeys** permitted to administer the relay over NIP-86. Pubkeys accept `npub` or hex.

## Supported NIPs

Wisp supports NIPs 1, 2, 9, 11, 13, 16, 33, 40, 42, 45, 50, 65, 70, 77, and 86.

## Backups

The relay's LMDB database and its `wisp.toml` configuration are both included in StartOS backups, so a restore brings back all events and settings with no reconfiguration.
