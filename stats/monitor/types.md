{
communities: {[communityAddress: string]: CommunityStatus}
subplebbits: {[subplebbitAddress: string]: SubplebbitStatus}
ipfsGateways: {[ipfsGatewaysUrl: string]: IpfsGatewayStatus}
pubsubProviders: {[pubsubProviderUrl: string]: PubsubProviderStatus}
httpRouters: {[httpRouterUrl: string]: HttpRouterStatus}
previewers: {[previewerUrl: string]: PreviewerStatus}
plebbitPreviewers: {[plebbitPreviewerUrl: string]: PlebbitPreviewerStatus}
seeders: {[seederPeerId: string]: SeederStatus}
chainProviders: {[chainProviderUrl: string]: ChainProviderStatus}
webpages: {[webpageUrl: string]: WebpageStatus}
nfts: {[nftName: string]: NftStatus}
network: NetworkStatus
plebbit: PlebbitStatus
}

CommunityStatus {
address: string
communityAddress: string
clientId: string
title: string
directoryCode: string
getSubplebbitCount: number
lastSubplebbitUpdateTimestamp: number
ipnsDhtPeers: Multiaddresses[] // bitsocial clients do not run the ipfs dht directly, so delegated routing is used
ipnsHttpRoutersPeers: Multiaddresses[]
ipnsCidHttpRoutersPeers: Multiaddresses[]
pubsubPeers: Multiaddresses[]
pubsubDhtPeers: Multiaddresses[]
pubsubHttpRoutersPeers: Multiaddresses[]
pubsubMessageCount: number
lastPubsubMessageTimestamp: number
lastSubplebbitPubsubMessageTimestamp: number
}

SubplebbitStatus {
address: string
getSubplebbitCount: number
lastSubplebbitUpdateTimestamp: number
ipnsDhtPeers: Multiaddresses[] // plebbit nodes dont run the ipfs dht, so only through delegated routing
ipnsHttpRoutersPeers: Multiaddresses[]
ipnsCidHttpRoutersPeers: Multiaddresses[]
pubsubPeers: Multiaddresses[]
pubsubDhtPeers: Multiaddresses[] // plebbit nodes dont run the ipfs dht, so only through delegated routing
pubsubHttpRoutersPeers: Multiaddresses[]
pubsubMessageCount: number
lastPubsubMessageTimestamp: number
lastSubplebbitPubsubMessageTimestamp: number
}

IpfsGatewayStatus {
url: string
commentFetchCount: number
lastCommentFetchTime: number
lastCommentFetchSuccess: bool
lastCommentFetchAttemptCount: number
subplebbitIpnsFetches: {[subplebbitAddress: string]: SubplebbitIpnsFetch}
}

SubplebbitIpnsFetch {
subplebbitIpnsFetchCount: number
lastSubplebbitIpnsFetchSuccess: bool
lastSubplebbitIpnsFetchTime: number
lastSubplebbitIpnsFetchTimestamp: number
lastSubplebbitIpnsFetchAttemptTimestamp: number
lastSubplebbitIpnsFetchAttemptCount: number
}

PubsubProviderStatus {
url: string
publishCount: number
lastSubscribeTime: number
lastPublishTime: number
lastPublishSuccess: bool
lastPublishAttemptCount: number
}

HttpRouterStatus {
url: string
getProvidersFetchCount: number
lastGetProvidersFetchSuccess: number
lastGetProvidersFetchTime: number
subplebbitIpnsGetProvidersFetches: {[subplebbitAddress: string]: SubplebbitIpnsGetProvidersFetch}
}

SubplebbitIpnsGetProvidersFetch {
subplebbitIpnsGetProvidersFetchCount: number
lastSubplebbitIpnsGetProvidersFetchSuccess: bool
lastSubplebbitIpnsGetProvidersFetchTime: number
lastSubplebbitIpnsGetProvidersFetchProviderCount: number
}

NftStatus {
name: string
ipfsGatewayFetches: {[ipfsGatewayUrl: string]: NftIpfsGatewayFetch}
}

NftIpfsGatewayFetch {
ipfsGatewayFetchCount: number
lastIpfsGatewayFetchSuccess: bool
lastIpfsGatewayFetchTime: number
}

PlebbitStatus {
subplebbitCount: number
subplebbitsStats: {
allActiveUserCount: number
allPostCount: number
etc...
}
}

PreviewerStatus {
url: string
commentPreviewFetchCount: number
lastCommentPreviewFetchSuccess: bool
lastCommentPreviewFetchTime: number
}

SeederStatus {
peerId: string
subplebbitUpdateCidFetch: number
lastSubplebbitUpdateCidFetchSuccess: bool
lastSubplebbitUpdateCidFetchTime: number
}

NetworkStatus {
communityCount: number
communityStats: {
allActiveUserCount: number
allPostCount: number
etc...
}
}
