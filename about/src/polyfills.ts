// Browser polyfills required by @pkcprotocol/pkc-js (libp2p, helia, ed25519
// signers) when the blog page runs purely peer-to-peer in the browser.
// Mirrors 5chan's `src/polyfills.js` setup so the same client code paths work.
// Must be imported once before any pkc-js / bitsocial-react-hooks import.

import { Buffer } from "buffer";
import process from "process";
import "isomorphic-fetch";

declare global {
  interface Window {
    Buffer: typeof Buffer;
    // process is provided by the polyfill; type intentionally permissive.
    process: typeof process;
    global: typeof window;
  }
}

window.Buffer = Buffer;
window.process = process;
window.global = window;

// Fake a Node.js version so libraries that key off `process.version` (ethers,
// some libp2p transports) take the browser code path. `process.version` is
// typed as readonly; we have to assert through `any` to override it.
(window.process as unknown as { version: string }).version = "";
window.process.env = window.process.env || {};
