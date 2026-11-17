const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// BSIP-10 key address: base58btc of an identity multihash (0x00 0x24) over a libp2p Ed25519
// PublicKey protobuf (0x08 0x01 0x12 0x20) and the 32 key bytes.
const PREFIX = [0x00, 0x24, 0x08, 0x01, 0x12, 0x20];
const LENGTH = 38;

/** Whether a string is a BSIP-10 key address, the only value a `bitsocial` record may start with. */
export function isKeyAddress(value: string): boolean {
  if (value.length !== 52 || !value.startsWith("12D3KooW")) return false;
  let number = 0n;
  for (const character of value) {
    const digit = BASE58.indexOf(character);
    if (digit < 0) return false;
    number = number * 58n + BigInt(digit);
  }
  const bytes: number[] = [];
  while (number > 0n) {
    bytes.unshift(Number(number % 256n));
    number /= 256n;
  }
  // Each leading "1" is a leading zero byte that the number above cannot hold.
  for (let i = 0; i < value.length && value[i] === "1"; i++) bytes.unshift(0);
  return bytes.length === LENGTH && PREFIX.every((byte, index) => bytes[index] === byte);
}
