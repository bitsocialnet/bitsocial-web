// Configuration for the Bitsocial Updates blog community.
//
// The blog is an actual Bitsocial community at blog.bitsocial.bso. The /blog
// page itself is a Bitsocial client: it fetches the feed directly over libp2p
// using @bitsocial/bitsocial-react-hooks, so the same feed can also be browsed
// from any other Bitsocial app.

export const BLOG_COMMUNITY_ADDRESS = "blog.bitsocial.bso";

// libp2p-key (base58) form of the community's signer public key. Used as the
// stable `publicKey` field in CommunityIdentifier so hooks can resolve the
// feed even when the human-readable address (.bso domain) hasn't propagated.
export const BLOG_COMMUNITY_PUBLIC_KEY = "12D3KooWSuX9mVvLCfPa1f421Le88phwhuqMHEcW4pd6Q9uEjAcQ";

// Subset of the community fields the blog UI cares about. The hooks return
// richer objects than this; we only narrow to what we render.
export interface BlogFlair {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}
