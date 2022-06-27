// imports
// ethers for working with contract
// run for verifying the contract
/// network for getting information about the networks
const { ethers, run, network } = require("hardhat")
// async main
async function main() {
    // get the contract...
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    // deployin the contract on the netwrok...
    console.log("Deploying Contract.....")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    // checking for verifying the contract on a testnet network
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Please waiting for 6 blocks confirmation...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    // interacting with deployed contract...
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)
    // Update current value...
    const transactionResponse = await simpleStorage.store(11)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is:${updatedValue}`)
}

// verify the contract proggramatically
async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("ALready Verified...")
        } else {
            console.log(e)
        }
    }
}
// main

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
