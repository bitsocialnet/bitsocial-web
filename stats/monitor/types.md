{
communities: {[communityAddress: string]: CommunityStatus}
ipfsGateways: {[ipfsGatewaysUrl: string]: IpfsGatewayStatus}
pubsubProviders: {[pubsubProviderUrl: string]: PubsubProviderStatus}
httpRouters: {[httpRouterUrl: string]: HttpRouterStatus}
previewers: {[previewerUrl: string]: PreviewerStatus}
seeders: {[seederPeerId: string]: SeederStatus}
chainProviders: {[chainProviderUrl: string]: ChainProviderStatus}
webpages: {[webpageUrl: string]: WebpageStatus}
nfts: {[nftName: string]: NftStatus}
network: NetworkStatus
}

CommunityStatus {
address: string
communityAddress: string
clientId: string
title: string
directoryCode: string
getCommunityCount: number
lastCommunityUpdateTimestamp: number
ipnsDhtPeers: Multiaddresses[] // bitsocial clients do not run the ipfs dht directly, so delegated routing is used
ipnsHttpRoutersPeers: Multiaddresses[]
ipnsCidHttpRoutersPeers: Multiaddresses[]
pubsubPeers: Multiaddresses[]
pubsubDhtPeers: Multiaddresses[]
pubsubHttpRoutersPeers: Multiaddresses[]
pubsubMessageCount: number
lastPubsubMessageTimestamp: number
lastCommunityPubsubMessageTimestamp: number
}

IpfsGatewayStatus {
url: string
commentFetchCount: number
lastCommentFetchTime: number
lastCommentFetchSuccess: bool
lastCommentFetchAttemptCount: number
communityIpnsFetches: {[communityAddress: string]: CommunityIpnsFetch}
}

CommunityIpnsFetch {
communityIpnsFetchCount: number
lastCommunityIpnsFetchSuccess: bool
lastCommunityIpnsFetchTime: number
lastCommunityIpnsFetchTimestamp: number
lastCommunityIpnsFetchAttemptTimestamp: number
lastCommunityIpnsFetchAttemptCount: number
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
communityIpnsGetProvidersFetches: {[communityAddress: string]: CommunityIpnsGetProvidersFetch}
}

CommunityIpnsGetProvidersFetch {
communityIpnsGetProvidersFetchCount: number
lastCommunityIpnsGetProvidersFetchSuccess: bool
lastCommunityIpnsGetProvidersFetchTime: number
lastCommunityIpnsGetProvidersFetchProviderCount: number
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

PreviewerStatus {
url: string
commentPreviewFetchCount: number
lastCommentPreviewFetchSuccess: bool
lastCommentPreviewFetchTime: number
}

SeederStatus {
peerId: string
communityUpdateCidFetch: number
lastCommunityUpdateCidFetchSuccess: bool
lastCommunityUpdateCidFetchTime: number
}

NetworkStatus {
communityCount: number
communityStats: {
allActiveUserCount: number
allPostCount: number
etc...
}
}
