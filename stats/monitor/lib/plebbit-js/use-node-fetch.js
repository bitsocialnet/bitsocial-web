// import this file before '@plebbit/plebbit-js' or 'kubo-rpc-client' to use node-fetch instead of native fetch

import nodeFetch from "node-fetch";

globalThis.fetch = nodeFetch;
globalThis.Headers = nodeFetch.Headers;
globalThis.Request = nodeFetch.Request;
globalThis.Response = nodeFetch.Response;
