<p align="center">
  <img src="icon.png" alt="Wisp Logo" width="21%">
</p>

# Wisp on StartOS

> **Upstream docs:** <https://github.com/privkeyio/wisp/blob/main/README.md>
>
> Everything not listed in this document should behave the same as upstream
> Wisp. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable.

[Wisp](https://github.com/privkeyio/wisp) is a fast, lightweight Nostr relay written in Zig. It uses LMDB for storage with no external database and includes a Spider mode that syncs events from the people you follow on other relays.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Single container running wisp, compiled from source (Zig) in the `Dockerfile` and pinned to an upstream release tag.

**Architectures:** x86_64, aarch64

The relay reads its configuration from a generated `wisp.toml` and serves a Nostr websocket on port 7777.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | LMDB database. wisp opens LMDB in `MDB_NOSUBDIR` mode, so the data file is `/data/wisp` (plus `/data/wisp-lock`). |
| `config` | `/app/wisp.toml` (file mount, read-only) | Generated TOML configuration file |

---

## Configuration Management

Configuration is managed entirely through Actions — there is no traditional config UI. The package writes a TOML config at `/app/wisp.toml`; the daemon runs `wisp relay /app/wisp.toml`.

Fixed, not exposed to the user:

```toml
[server]
host = "0.0.0.0"
port = 7777

[storage]
path = "/data/wisp"
```

Everything else (relay info, spider, limits, access control) is set through the Actions below. **Changes take effect the next time the relay starts.**

The package does not set `[storage] sync`, so wisp uses its default `meta` durability: data is flushed on every commit and a crash or power loss can at worst roll back the last transaction, never corrupt the database. This is the right default for an always-on home server.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Type | Description |
|-----------|------|----------|------|-------------|
| Relay Websocket | 7777 | `ws://` | api | Nostr client connections |

Clients connect using the standard Nostr websocket protocol. The interface is exposed via Tor (.onion) and LAN (.local). Tor uses `ws://`, not `wss://`.

---

## Actions (StartOS UI)

All actions are in the `configure` group, have visibility `enabled`, and are available at any service status (running or stopped). Pubkey fields accept an `npub` or a 64-character hex key; npubs are decoded to hex before being written to `wisp.toml`.

### Relay Information (`configure-info`)

NIP-11 metadata advertised to clients: **Name**, **Description**, **Admin Pubkey**, **Admin Contact**, and the **Relay URL** advertised for NIP-42 authentication (selected from the relay's own interface addresses).

### Spider Sync (`configure-spider`)

wisp's signature feature. **Enable Spider**, set **Your Pubkey**, and the relay fetches your contact list and continuously syncs those people's notes from other relays into your own. Tunable: **Source Relays**, **Additional Pubkeys**, and **Sync Interval**.

### Limits (`configure-limits`)

Throughput and resource caps: max connections (total and per IP), max subscriptions and filters, message/content/tag sizes, events per minute, default/max query limits, idle timeout, and a minimum NIP-13 proof-of-work difficulty.

### Access Control (`configure-access`)

Require NIP-42 authentication (to connect and/or to publish), restrict connections with an IP allowlist/blocklist, and set the **Management Pubkeys** permitted to administer the relay over NIP-86.

---

## Backups and Restore

**Volumes backed up:** `main`, `config`

- `main` — the LMDB database with all relay events
- `config` — the `wisp.toml` configuration

**Restore behavior:** all relay data and configuration are restored. No reconfiguration needed.

---

## Health Checks

| Check | Method | Display | Message |
|-------|--------|---------|---------|
| Relay | Port listening (7777) | "Relay" | "The relay is ready and accepting connections" / "The relay is not responding" |

---

## Dependencies

None.

---

## Limitations and Differences

1. **Fixed network binding** — always binds to `0.0.0.0:7777`; not configurable.
2. **Config changes require a restart** — Actions write `wisp.toml`; wisp reads it at startup, so changes apply on the next start.
3. **Import/export not yet surfaced** — wisp's JSONL `import`/`export` commands are not exposed as Actions (tracked in `TODO.md`); use backups to preserve data.

---

## What Is Unchanged from Upstream

- Full Nostr relay protocol support (NIPs 1, 2, 9, 11, 13, 16, 33, 40, 42, 45, 50, 65, 70, 77, 86)
- LMDB storage backend
- Spider mode for syncing events from external relays
- Rate limiting and event validation
- NIP-86 relay management API

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: wisp
image: built from source (privkeyio/wisp, Zig)
architectures:
  - x86_64
  - aarch64
volumes:
  main: /data (LMDB; data file at /data/wisp)
  config: /app/wisp.toml (file mount, read-only)
ports:
  relay: 7777
dependencies: none
config_file: /app/wisp.toml
actions:
  - configure-info
  - configure-spider
  - configure-limits
  - configure-access
```
