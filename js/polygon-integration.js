// Polygon Mumbai Integration
class PolygonIntegration {
    constructor() {
        this.networkName = 'Polygon Mumbai';
        this.chainId = '0x13881';
        this.rpcUrl = 'https://rpc-mumbai.maticvigil.com';
        this.blockExplorer = 'https://mumbai.polygonscan.com';
        this.isConnected = false;
    }

    // Check if connected to correct network
    async checkNetwork() {
        try {
            if (! web3Integration || !web3Integration.isConnected) {
                console.log('⚠️ Wallet not connected');
                return false;
            }

            const currentChainId = await window.ethereum.request({
                method: 'eth_chainId'
            });

            if (currentChainId !== this.chainId) {
                console.log('❌ Wrong network!  Switching to Mumbai...');
                await web3Integration.switchToPolygonMumbai();
                return false;
            }

            console.log('✅ Connected to Polygon Mumbai! ');
            this.isConnected = true;
            return true;
        } catch (error) {
            console.error('Network check failed:', error);
            return false;
        }
    }

    // Get wallet balance on Polygon
    async getPolygonBalance() {
        try {
            if (!web3Integration || !web3Integration.account) {
                console.log('Wallet not connected');
                return null;
            }

            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [web3Integration.account, 'latest']
            });

            const balanceInMatic = web3Integration.web3.utils.fromWei(balance, 'ether');
            console.log(`Balance: ${balanceInMatic} MATIC`);
            return balanceInMatic;
        } catch (error) {
            console.error('Error getting balance:', error);
            return null;
        }
    }

    // Send transaction on Polygon (for testing)
    async sendTestTransaction(toAddress, amountInMatic) {
        try {
            if (!web3Integration || ! web3Integration.account) {
                console.error('Wallet not connected');
                return null;
            }

            const amountInWei = web3Integration.web3.utils.toWei(amountInMatic, 'ether');

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: web3Integration.account,
                    to: toAddress,
                    value:  amountInWei
                }]
            });

            console. log('✅ Transaction sent:', txHash);
            console.log('View on explorer:  ' + this.blockExplorer + '/tx/' + txHash);
            return txHash;
        } catch (error) {
            console. error('Transaction failed:', error);
            return null;
        }
    }

    // Get transaction receipt
    async getTransactionStatus(txHash) {
        try {
            const receipt = await window.ethereum.request({
                method: 'eth_getTransactionReceipt',
                params: [txHash]
            });

            if (receipt) {
                console.log('✅ Transaction confirmed! ');
                return {
                    status: 'confirmed',
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed
                };
            } else {
                console.log('⏳ Transaction pending...');
                return { status: 'pending' };
            }
        } catch (error) {
            console.error('Error getting transaction status:', error);
            return null;
        }
    }

    // Get network info
    getNetworkInfo() {
        return {
            name: this.networkName,
            chainId: this.chainId,
            rpcUrl: this. rpcUrl,
            blockExplorer: this.blockExplorer,
            isConnected: this. isConnected
        };
    }

    // Display network info on page
    displayNetworkInfo() {
        const info = this. getNetworkInfo();
        console.log('Network Info:', info);
        
        const networkDisplay = document.getElementById('network-info');
        if (networkDisplay) {
            networkDisplay.innerHTML = `
                <p><strong>Network:</strong> ${info.name}</p>
                <p><strong>Chain ID: </strong> ${info.chainId}</p>
                <p><strong>Status:</strong> ${info.isConnected ? '✅ Connected' : '❌ Not Connected'}</p>
                <p><strong>Explorer:</strong> <a href="${info.blockExplorer}" target="_blank">Polygonscan</a></p>
            `;
        }
    }
}

// Initialize Polygon Integration
let polygonIntegration;
window.addEventListener('DOMContentLoaded', () => {
    polygonIntegration = new PolygonIntegration();
});