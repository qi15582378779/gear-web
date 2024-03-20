import * as BufferLayout from 'buffer-layout';

export const createTransferInstruction = (programId, source, destination, owner, multiSigners, amount) => {
  const dataLayout = struct([u8('instruction'), uint64('amount')]);
  const data = buffer.Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 3,
      // Transfer instruction
      amount: new u64(amount).toBuffer()
    },
    data
  );
  let keys = [
    {
      pubkey: source,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: destination,
      isSigner: false,
      isWritable: true
    }
  ];

  if (multiSigners.length === 0) {
    keys.push({
      pubkey: owner,
      isSigner: true,
      isWritable: false
    });
  } else {
    keys.push({
      pubkey: owner,
      isSigner: false,
      isWritable: false
    });
    multiSigners.forEach((signer) =>
      keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false
      })
    );
  }

  return new TransactionInstruction({
    keys,
    programId: programId,
    data
  });
};
