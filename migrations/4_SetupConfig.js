const OGSale = artifacts.require("OGSale");
const NordiaForFuture = artifacts.require("NordiaForFuture");

module.exports = async function (deployer) {
    const nff = await NordiaForFuture.deployed();
    // const nff = await NordiaForFuture.at('0x4ff3275c92eaa064D87B0Fe422D15f3bFeAD8E64');
    const ogSale = await OGSale.deployed();
    //const ogSale = await OGSale.at('0x2862228b6a04aCe1E9B00A08E4368d0e4ABcc053');
    const ADMIN = await nff.DEFAULT_ADMIN_ROLE();
    await nff.grantRole(ADMIN, ogSale.address);
    await ogSale.setNFTContract(nff.address);
}