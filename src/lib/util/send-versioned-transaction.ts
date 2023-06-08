import {
    Connection,
    Keypair,
    PublicKey,
    type Signer,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

export async function sendVersionedTx(
    connection: Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    signers: Signer[]
) {
    let latestBlockhash = await connection.getLatestBlockhash();
    const messageLegacy = new TransactionMessage({
        instructions,
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
    }).compileToLegacyMessage();
    const transation = new VersionedTransaction(messageLegacy);
    transation.sign(signers);
    const signature = await connection.sendTransaction(transation);
    return signature;
}
