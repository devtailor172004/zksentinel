// Web3 Integration - MetaMask Wallet Connection
class Web3Integration {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.chainId = null;
        this. isConnected = false;
        this. initWeb3();
    }

    // Check if MetaMask is installed
    async initWeb3() {
        if (typeof window. ethereum !== 'undefined') {
            console.log('✅ MetaMask detected! ');
            this.web3 = new Web3(window.ethereum);
            this.setupEventListeners();
        } else {
            console.log('❌ MetaMask not installed.  Install from https://metamask.io');
            this.showMetaMaskPrompt();
        }
    }

    // Setup MetaMask event listeners
    setupEventListeners() {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                console. log('Wallet disconnected');
                this.account = null;
                this.isConnected = false;
                this.updateUI();
            } else {
                this.account = accounts[0];
                this.isConnected = true;
                console.log('Account switched:', this.account);
                this. updateUI();
            }
        });

        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Chain changed:', chainId);
            this.chainId = chainId;
            window.location.reload();
        });
    }

    // Connect wallet
    async connectWallet() {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            this.account = accounts[0];
            this.isConnected = true;
            
            // Get chain ID
            this.chainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            
            console.log('✅ Wallet connected:', this.account);
            console.log('Chain ID:', this. chainId);
            
            this.updateUI();
            return this.account;
        } catch (error) {
            console.error('❌ Connection failed:', error);
            alert('Failed to connect wallet.  Please try again.');
        }
    }

    // Disconnect wallet
    async disconnectWallet() {
        this.account = null;
        this.isConnected = false;
        console.log('Wallet disconnected');
        this.updateUI();
    }

    // Switch to Polygon Mumbai (Testnet)
    async switchToPolygonMumbai() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            });
        } catch (error) {
            if (error.code === 4902) {
                await this.addPolygonMumbai();
            } else {
                console.error('Failed to switch network:', error);
            }
        }
    }

    // Add Polygon Mumbai network to MetaMask
    async addPolygonMumbai() {
        try {
            await window. ethereum.request({
                method: 'wallet_addEthereumChain',
                params:  [{
                    chainId: '0x13881',
                    chainName: 'Polygon Mumbai',
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol:  'MATIC',
                        decimals: 18
                    }
                }]
            });
            console.log('✅ Polygon Mumbai added to MetaMask');
        } catch (error) {
            console. error('Failed to add network:', error);
        }
    }

    // Get wallet balance
    async getBalance() {
        try {
            const balance = await this.web3.eth.getBalance(this.account);
            const balanceInEth = this.web3.utils.fromWei(balance, 'ether');
            console.log('Balance:', balanceInEth, 'MATIC');
            return balanceInEth;
        } catch (error) {
            console. error('Error getting balance:', error);
        }
    }

    // Update UI with wallet info
    updateUI() {
        const walletButton = document.getElementById('wallet-connect');
        const walletInfo = document.getElementById('wallet-info');
        
        if (this.isConnected && this.account) {
            if (walletButton) {
                walletButton.textContent = `Connected: ${this.account. substring(0, 6)}...${this.account.substring(38)}`;
                walletButton.style.backgroundColor = '#00ff41';
                walletButton.style.color = '#000000';
            }
            
            if (walletInfo) {
                walletInfo.innerHTML = `
                    <p><strong>Connected Account:</strong> ${this.account}</p>
                    <p><strong>Chain ID:</strong> ${this.chainId}</p>
                `;
            }
        } else {
            if (walletButton) {
                walletButton.textContent = 'Connect Wallet';
                walletButton.style.backgroundColor = 'transparent';
                walletButton.style.color = '#00ff41';
            }
        }
    }

    // Show MetaMask not installed message
    showMetaMaskPrompt() {
        const message = `
            ⚠️ MetaMask Not Installed! 
            
            Download MetaMask: 
            https://metamask.io
            
            Then refresh this page.
        `;
        console.warn(message);
        alert(message);
    }

    // Get account details
    getAccountInfo() {
        return {
            account: this.account,
            isConnected: this.isConnected,
            chainId: this. chainId
        };
    }
}

// Initialize when page loads
let web3Integration;
window.addEventListener('DOMContentLoaded', () => {
    web3Integration = new Web3Integration();
});