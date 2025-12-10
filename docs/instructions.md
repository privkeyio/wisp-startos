# Instructions for Wisp on StartOS

Wisp is a lightweight, high-performance Nostr relay written in Zig.

## Usage

Once installed and started, Wisp will be available as a WebSocket endpoint. You can connect to it using any Nostr client by adding your relay URL.

### Finding Your Relay URL

1. Go to your Wisp service in StartOS
2. Click on "Interfaces"
3. Copy the WebSocket URL (either Tor or LAN address)

### Adding to Nostr Clients

Add your relay URL to your preferred Nostr client:

- **Tor address**: Use this for connections over Tor (more private, works anywhere)
- **LAN address**: Use this for local network connections (faster, only works on your local network)

## Configuration

Wisp uses sensible defaults:

- **Port**: 7777 (internal)
- **Storage**: LMDB database stored in `/data`
- **Max connections**: 1000
- **Events per minute**: 60

## Data Storage

All Nostr events are stored in an LMDB database. The data is persisted in the `main` volume and will be included in backups.

## Backups

Wisp data is automatically included in StartOS backups. This includes all stored Nostr events.
