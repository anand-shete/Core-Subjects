## Cryptography

Cryptography is a process of converting readable data (plain text) into text which is difficult to understand (cipher text)
It makes use of "Cryptography key" which is a mathematical value used by encryption methods to make readable text unreadable

## Types of Encryption

### Symmetric encryption

Same key is used for both encryption and decryption

#### 1. DES algotithm

Fixed key length of 56 bits
Process data in 64 bits
Performs 16 rounds in encryption process

> DES is not recommended to use because of low key size

**Pros**

- Fast and less computation compared to asymmetric
- Good for encrypting bulk data (e.g. chat application)

**Cons**

- Key distribution i.e. how to securely distribute key between client and server without MITM attack is an issue
- No. of client increases, means server has to manage more symmetric keys and their distribution

#### 2. Advanced Encryption Standard Algorithm (AES)

AES has key length of 128, 192 or 256 bits
It is block cipher which means that it processes data in 128 bits
Encryption round depends on key size

- 10 rounds → 128 bits key
- 12 rounds → 192 bits key
- 14 rounds → 256 bits key

### Asymmetric encryption

Different keys are used for encryption and decryption

- Public key is used by sender to encrypt
- Private key is used by receiver to decrypt

#### Algorithms

1. RSA (2048 bit key length)
2. DSA
3. Diffie-Hellman
4. ECDHE

**Pros**

- No security issues with key distribution since receiver has secret (private) key to themselves
- Provides key exchange protocols like Diffe-Hellman, ECDHE
- Digital signature can be created using asymmetric encryption which helps to authenticate and provide integrity

**Cons**

- More computation intensive compared to symmetric encryption
- Might not be suitable for encrypting bulk data since it is slow
