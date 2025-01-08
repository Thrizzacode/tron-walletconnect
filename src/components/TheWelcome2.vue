<template>
  <div>
    <button @click="linkStart">connect</button>
    <button @click="linkEnd">disconnect</button>
  </div>
</template>

<script setup>
import { WalletConnectWallet, WalletConnectChainID } from '@tronweb3/walletconnect-tron'
const wallet = new WalletConnectWallet({
  network: WalletConnectChainID.Mainnet,
  options: {
    relayUrl: 'wss://relay.walletconnect.com',
    projectId: '7c08db3a9380894831aad46f66097a34',
    metadata: {
      name: 'JustLend',
      description: 'JustLend WalletConnect',
      url: 'https://app.justlend.org/',
      icons: ['https://app.justlend.org/mainLogo.svg'],
    },
    chains: ['tron:728126428'],
  },
  web3ModalConfig: {
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': 1000,
    },
    /**
     * Recommended Wallets are fetched from WalletConnect explore api:
     * https://walletconnect.com/explorer?type=wallet&version=2.
     * You can copy these ids from the page.
     */
    explorerRecommendedWalletIds: [
      '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    ],
  },
})

const linkStart = async () => {
  await wallet.connect()
  console.log(wallet.address)
}

const linkEnd = async () => {
  await wallet.disconnect()
  console.log(wallet.address)
}
</script>
