const OGSale = artifacts.require("OGSale");
const NordiaForFuture = artifacts.require("NordiaForFuture");
const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');

let whitelists = [
    '0x79687E28c543E8EC6F1b3fCc779f83a791279f68',
    '0x117289448Daed9B563E3575E59240Ba4b0c4D53a',
    '0x320B620147F450a63d7eeACE5053Ce8BB1B9cd2f',
    '0xf5Fda3393ab2EbBc4F9dB28BB541829F70B247F3',
    '0x8988d44e5aFE23Ce77e1a5ACD47CDc8DBf65652a'
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
    const hexProof = merkleTree.getHexProof(keccak256('0x8988d44e5aFE23Ce77e1a5ACD47CDc8DBf65652a'));
    // console.log(hexProof);
    await ogSale.claimNft(hexProof, {
        value: web3.utils.toWei('0.075', "ether")
    });

}