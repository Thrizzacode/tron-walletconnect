<template>
  <div class="container">
    <button class="btn" @click="linkStart">Connect</button>
    <button class="btn" @click="linkEnd">Disconnect</button>
    <div v-if="status" style="display: flex; flex-direction: column; gap: 10px">
      <button class="btn" @click="signMessage">Sign Message</button>
      <div style="display: flex; gap: 10px">
        <div>
          <div>
            <label for="transferAddress">代幣地址: </label>
            <input
              style="width: 270px"
              type="text"
              v-model="transferAddress"
              placeholder="請輸入要轉帳的代幣地址"
            />
          </div>

          <div>
            <label for="transferAddress">要轉入的錢包地址: </label>
            <input
              style="width: 270px"
              type="text"
              v-model="toAddress"
              placeholder="請輸入要轉入的地址"
            />
          </div>

          <div>
            <label for="transferAddress">要轉入的金額: </label>
            <input style="width: 100px" type="number" v-model="amount" placeholder="請輸入金額" />
          </div>
        </div>
      </div>
      <button class="btn" @click="signTransaction">Transfer</button>
    </div>

    <div>
      <p>
        Status: <span>{{ status ? 'Connected' : 'Disconnect' }}</span>
      </p>
      <p>
        Your Address: <span>{{ address }}</span>
      </p>
    </div>

    <h3 style="margin-top: 50px; font-weight: bold">支援錢包</h3>
    <div class="wallets">
      <a href="https://www.tokenpocket.pro/">
        <img width="100" class="icon" src="@/assets/icons/tp.png" alt="" />
      </a>
      <a href="https://trustwallet.com/">
        <img width="100" class="icon" src="@/assets/icons/tw.png" alt="" />
      </a>
    </div>
    <h4>*點擊前往安裝</h4>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { WalletConnectWallet, WalletConnectChainID } from '@tronweb3/walletconnect-tron'
import { TronWeb } from 'tronweb'

const address = ref('')
const transferAddress = ref('TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3')
const toAddress = ref('TX48fYG69pGjZcC7W3ADZg6UwkwQooh2xj')
const amount = ref(100)

const status = ref(false)
const tronWeb = new TronWeb({
  // fullHost: 'https://api.nileex.io',
  fullHost: 'https://nile.trongrid.io/',
})
const wallet = new WalletConnectWallet({
  // network: WalletConnectChainID.Nile,
  network: WalletConnectChainID.Mainnet,
  options: {
    relayUrl: 'wss://relay.walletconnect.com',
    projectId: '7c08db3a9380894831aad46f66097a34',
    metadata: {
      name: '88M Market',
      description: '88M WalletConnect',
      url: 'https://app.justlend.org/',
      icons: ['https://app.justlend.org/mainLogo.svg'],
    },
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
  address.value = wallet.address
  status.value = true
  console.log(wallet)
}

const linkEnd = async () => {
  await wallet.disconnect()
  address.value = ''
  status.value = false
  console.log(wallet.address)
}

const signMessage = async () => {
  try {
    const signature = await wallet.signMessage('hello world')
    alert('signMessage:' + signature)
  } catch (error) {
    console.log('error:' + error)
  }
}

const signTransaction = async () => {
  try {
    // const testContract = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
    const testTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      transferAddress.value,
      'transfer(address,uint256)',
      { feeLimit: 200000000 },
      [
        { type: 'address', value: toAddress.value },
        { type: 'uint256', value: amount.value },
      ],
      wallet.address,
    )

    console.log(testTransaction)
    console.log(wallet)
    const signature = await wallet.signTransaction(testTransaction)
    await tronWeb.trx.sendRawTransaction(signature)
    console.log(signature)
    alert('signTransaction:' + signature.txID)
  } catch (error) {
    console.log('error:', error)
  }
}

const checkConnectStatus = async () => {
  // const isConnected = await wallet.checkConnectStatus()
  const { address: add } = await wallet.checkConnectStatus()
  console.log(add, wallet)
  if (add) {
    address.value = wallet.address
    status.value = true
  }
}

onMounted(() => {
  checkConnectStatus()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100vh;
}

.btn {
  padding: 10px 20px;
  background-color: #60dd7f;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.wallets {
  display: flex;
  gap: 20px;
}

.icon {
  border-radius: 50%;
  padding: 5px;
  background-color: #fff;
}
</style>
