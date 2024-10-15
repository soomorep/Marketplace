# Skill Exchange Marketplace

A decentralized marketplace for exchanging skills and services on the Stacks blockchain.

## Overview

This project implements a smart contract for a skill exchange marketplace using Clarity, the smart contract language for the Stacks blockchain. Users can list services, initiate trades, complete trades, and build reputation within the system.

## Features

- List services with descriptions and prices
- Initiate trades for listed services
- Complete trades and update user reputations
- Refund trades if necessary
- View service details, trade information, and user reputations

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet): Clarity development tool
- [Node.js](https://nodejs.org/): JavaScript runtime (for running tests)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/skill-exchange-marketplace.git
   cd skill-exchange-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running Tests

To run the test suite:

```
npm test
```

## Contract Details

The main contract file is `contracts/skill-exchange-marketplace.clar`. It defines the following main functions:

- `list-service`: List a new service
- `initiate-trade`: Start a trade for a listed service
- `complete-trade`: Mark a trade as completed and update reputations
- `refund-trade`: Refund a trade

## Future Improvements

- Implement token-based payments
- Add NFT rewards for completed trades
- Enhance the reputation system
- Implement a more robust escrow mechanism

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
