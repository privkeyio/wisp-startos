<img src="icon.png" alt="Wisp Logo" width="300">

# Wisp for StartOS

[Wisp](https://github.com/privkeyio/wisp) is a lightweight, high-performance Nostr relay written in Zig.

## Building from source

1. Set up your [environment](https://docs.start9.com/packaging-guide/environment-setup.html).

1. Clone this repository recursively:
   ```bash
   git clone --recursive https://github.com/privkeyio/wisp-startos
   cd wisp-startos
   ```

1. Run `make`.

1. The resulting `.s9pk` can be side loaded into StartOS.

For a complete list of build options, see the [docs](https://docs.start9.com/packaging-guide/building.html)

## Features

- High-performance WebSocket relay
- LMDB storage backend
- Full Nostr protocol support
- NIP-11 relay information document
- Configurable rate limiting
