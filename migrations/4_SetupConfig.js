const OGSale = artifacts.require("OGSale");
const NordiaForFuture = artifacts.require("NordiaForFuture");
const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');

let whitelists = [
    
];
const options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
    headers: [
        {
            name: 'Access-Control-Allow-Origin',
            value: '*'
        }
    ]
};
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/", options));
console.log(web3.utils.toWei('0.075', "ether"));
module.exports = async function (deployer) {
    const nff = await NordiaForFuture.deployed();
    // const nff = await NordiaForFuture.at('0x4ff3275c92eaa064D87B0Fe422D15f3bFeAD8E64');
    const ogSale = await OGSale.deployed();
    //const ogSale = await OGSale.at('0x2862228b6a04aCe1E9B00A08E4368d0e4ABcc053');
    await nff.setRole(ogSale.address);
    await ogSale.setNFTContract(nff.address);
    const leafNodes = whitelists.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})
    const rootHash = merkleTree.getRoot();
   // console.log(rootHash);
    await ogSale.setMerkleRoot(rootHash);
    // console.log(deployer.address);
    const hexProof = merkleTree.getHexProof(keccak256(''));
    // console.log(hexProof);
    await ogSale.claimNft(hexProof, {
        value: web3.utils.toWei('0.075', "ether")
    });

}