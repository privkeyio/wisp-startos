export const relayPort = 7777
export const relayInterfaceId = 'websocket'

// The `main` volume is mounted here (a directory).
export const storageMountpoint = '/data'

// Where the LMDB database lives inside the container. wisp opens LMDB in
// MDB_NOSUBDIR mode, so this is the data *file* path (it also creates
// `<path>-lock`), not a directory. It sits inside the mounted volume.
export const storagePath = '/data/wisp'

// Where the generated wisp.toml is mounted inside the container.
export const configPath = '/app/wisp.toml'

// Default spider relays wisp falls back to when none are configured. Mirrors
// the upstream default set so a freshly-enabled spider has somewhere to sync
// from.
export const defaultSpiderRelays = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
]

// Validation pattern for Action inputs that accept an npub or a 64-char hex
// pubkey. wisp stores hex; npubs are decoded by pubkeyToHex before writing.
export const npubOrHexPattern = '^(npub1[02-9ac-hj-np-z]{6,}|[0-9a-fA-F]{64})$'

// Read a comma-joined config string back into a list, dropping empties.
export function splitCsv(s: string | undefined): string[] {
  return s ? s.split(',').filter(Boolean) : []
}

// Decode a list of npub/hex pubkeys to hex and join for storage, or undefined
// when the list is empty.
export function joinPubkeys(list: string[]): string | undefined {
  return list.length ? list.map(pubkeyToHex).join(',') : undefined
}

// Accept either a 64-char hex pubkey or an npub, returning lowercase hex.
// wisp's config only understands hex, so npubs entered in Actions are decoded
// here before being written to wisp.toml.
export function pubkeyToHex(input: string): string {
  const v = input.trim()
  if (/^[0-9a-fA-F]{64}$/.test(v)) return v.toLowerCase()
  if (/^npub1[02-9ac-hj-np-z]+$/.test(v)) {
    const decoded = bech32Decode(v)
    if (!decoded || decoded.hrp !== 'npub') {
      throw new Error(`Invalid npub: ${input}`)
    }
    const bytes = convertBits(decoded.words, 5, 8, false)
    if (!bytes || bytes.length !== 32) {
      throw new Error(`Invalid npub (expected 32 bytes): ${input}`)
    }
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  throw new Error(
    `Invalid pubkey "${input}": expected a 64-character hex key or an npub.`,
  )
}

// --- minimal bech32 (NIP-19) decoder ---------------------------------------

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

function polymod(values: number[]): number {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
  let chk = 1
  for (const v of values) {
    const top = chk >>> 25
    chk = ((chk & 0x1ffffff) << 5) ^ v
    for (let i = 0; i < 5; i++) {
      if ((top >>> i) & 1) chk ^= GEN[i]
    }
  }
  return chk
}

function hrpExpand(hrp: string): number[] {
  const out: number[] = []
  for (let i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) >>> 5)
  out.push(0)
  for (let i = 0; i < hrp.length; i++) out.push(hrp.charCodeAt(i) & 31)
  return out
}

function bech32Decode(str: string): { hrp: string; words: number[] } | null {
  const lower = str.toLowerCase()
  const pos = lower.lastIndexOf('1')
  if (pos < 1 || pos + 7 > lower.length) return null
  const hrp = lower.slice(0, pos)
  const words: number[] = []
  for (const c of lower.slice(pos + 1)) {
    const idx = CHARSET.indexOf(c)
    if (idx === -1) return null
    words.push(idx)
  }
  if (polymod(hrpExpand(hrp).concat(words)) !== 1) return null
  return { hrp, words: words.slice(0, -6) }
}

function convertBits(
  data: number[],
  from: number,
  to: number,
  pad: boolean,
): number[] | null {
  let acc = 0
  let bits = 0
  const ret: number[] = []
  const maxv = (1 << to) - 1
  for (const value of data) {
    if (value < 0 || value >>> from !== 0) return null
    acc = (acc << from) | value
    bits += from
    while (bits >= to) {
      bits -= to
      ret.push((acc >>> bits) & maxv)
    }
  }
  if (pad) {
    if (bits > 0) ret.push((acc << (to - bits)) & maxv)
  } else if (bits >= from || ((acc << (to - bits)) & maxv) !== 0) {
    return null
  }
  return ret
}
