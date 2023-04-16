# lionhack2023

## Axelar Submission Information
1. Transaction link: https://testnet.axelarscan.io/gmp/0x645a67b15d35e1ff26a865098f2c01ef124cc46bbaa3a2f5f4318a89a70a3ce5:1
2. Source code (in this repository, Axelar integration in contracts folder)
3. Our Experiences:
    - We had a bug in our code that was a mix of a negative and positive experience for us. When writing our smart contracts, we used the wrong gateway address in our destination contract. We assumed it was supposed to be the same gateway address for both the sender and receiver, even though they were on different chains. This was a somewhat negative experience because we couldn't figure out the issue for a long period of time (we were responsible for many errored transactions on https://testnet.axelarscan.io/gmp/search 😅). However, it was also a positive experience because when debugging, we learned a lot more about Axelar than we would've if we were successful in our first attempts. We kept digging deeper to see what the error could be. We also talked to the team on Discord and they were helpful in our debugging attempts, and after many attempts we eventually figured out the error.
    - In general, we enjoyed learning about Axelar. We hadn't worked with bridges in the past and had always seen them as somewhat complicated. However, Axelar's documentation was very helpful and had many examples that allowed us to see how to utilize Axelar's functionality. It was also perfect and essential to our use case that we wanted to explore within making governance easier on multiple chains.

## Avalanche Submission Information
We built our governance system on the Avalanche C-Chain, but really wanted to deploy it on its own subnet. We designed the subnet [here](./avalanche_subnet/spec.md).

## Dev Notes

### Hardhat Commands
```
npx hardhat help
npx hardhat compile
npx hardhat test
npx hardhat clean
npx hardhat node
npx hardhat accounts

npx hardhat run scripts/deploy.js --network fuji
```

### Resources
- https://docs.avax.network/dapps/developer-toolchains/using-hardhat-with-the-avalanche-c-chain
- https://hardhat.org/tutorial