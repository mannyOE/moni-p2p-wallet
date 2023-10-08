# Moni P2P Wallet System - Backend Engineering Test

This repository contains my solution for the Moni Backend Engineering Test, which involves creating a simple P2P wallet system using Node.js (NestJS), TypeScript, and either PostgresDB. In this README, I will provide an overview of the project, explain its structure, and describe how to run it locally. Additionally, I will briefly touch on the bonus task of deploying the solution to a cloud service provider.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
3. [Usage](#usage)
    - [Creating a User](#creating-a-user)
    - [Funding a Wallet](#funding-a-wallet)
    - [Sending Funds](#sending-funds)

## Project Overview

The Moni P2P Wallet System is a basic implementation of a peer-to-peer wallet system. It allows users to create accounts, create wallets associated with their accounts, fund their wallets using Paystack funding options, and perform P2P transactions by sending and receiving funds from other users.

## Getting Started

[API Documentation Postman](https://documenter.getpostman.com/view/25910701/2s9YJgULa5)

### Prerequisites

Before you can run the project, ensure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd moni-p2p-wallet
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root directory and configure the following environment variables:

   ```env
   # Database configuration
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASS=
    DB_DIALECT=postgres
    DB_NAME_TEST=
    DB_NAME_DEVELOPMENT=
    DB_NAME_PRODUCTION=

    # JWT (JSON Web Token) Configuration
    JWTKEY=
    TOKEN_EXPIRATION=2h
    BEARER=Bearer

    # Application Port
    PORT=7600

    # Paystack API Keys
    PAYSTACK_SECRET=
    PAYSTACK_PUBLIC=

    # Database URL (You can use this format or specify individual variables)
    DATABASE_URL=

   ```

## Usage

### Creating a User

To create a new user, make a POST request to `/api/users` with the following JSON payload:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St, City",
  "dob": "1990-01-01",
  "phone_number": "+1234567890"
}
```

### Funding a Wallet

To fund a wallet, you can make a POST request to `/api/v1/transactions/initiate` with the amount to be funded.

### Sending Funds

To send funds from one wallet to another, make a POST request to `/api/v1/transactions/transfer` with the following JSON payload:

```json
{
  "email": "selena.gomez@mailinator.com",
  "amount": 500.00
}
```