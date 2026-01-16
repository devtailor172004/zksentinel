async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Initialize a Web3 provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // You can use the provider to create a signer
            const signer = provider.getSigner();

            console.log('MetaMask connected:', await signer.getAddress());
        } catch (error) {
            console.error('User denied account access or there was an error:', error);
        }
    } else {
        console.error('Please install MetaMask!');
    }
}

// Call the function to connect to MetaMask
connectMetaMask();