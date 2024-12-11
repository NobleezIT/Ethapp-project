import { ethers } from 'ethers';

// Connect wallet
const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    document.getElementById('walletAddress').textContent = `Wallet Address: ${walletAddress}`;

    // Display balance
    const balance = await provider.getBalance(walletAddress);
    document.getElementById('balance').textContent = `Balance: ${ethers.utils.formatEther(balance)} ETH`;

    return { provider, signer, walletAddress };
  } else {
    alert("Please install MetaMask!");
    return null;
  }
};

// Send ETH
const sendEth = async () => {
  const { signer } = await connectWallet();
  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;

  if (!ethers.utils.isAddress(recipient)) {
    alert("Invalid recipient address");
    return;
  }

  const tx = await signer.sendTransaction({
    to: recipient,
    value: ethers.utils.parseEther(amount),
  });

  alert(`Transaction sent! Tx Hash: ${tx.hash}`);
};

// Cast a vote
const castVote = async (proposal) => {
  const { signer } = await connectWallet();

  // Contract address and ABI
  const contractAddress = "0x35cd167FA931C6c5E07AbB2621846FC35D54baD6";
  const abi = [
    "function vote(uint8 proposal) public"
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const tx = await contract.vote(proposal);
    alert(`Vote cast! Tx Hash: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    alert("Failed to cast vote. Ensure you have enough ETH for gas.");
  }
};

// Event Listeners
document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('sendEth').addEventListener('click', sendEth);
document.getElementById('voteProposal1').addEventListener('click', () => castVote(1));
document.getElementById('voteProposal2').addEventListener('click', () => castVote(2));
