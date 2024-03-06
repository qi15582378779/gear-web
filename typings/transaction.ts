export enum TransactionTypes {
  Deposit = 'Deposit', // 充值
  Withdrawal = 'Withdrawal', // 提现
  Purchase = 'Purchase', // 购买
  PurchaseAndFreezeDeposit = 'Purchase And Freeze Deposit', // 购买并冻结保证金
  CancelTransaction = 'Cancel Transaction', // 取消交易
  FreezeDeposit = 'Freeze Deposit', // 冻结保证金
  UnfreezeDeposit = 'Unfreeze Deposit', // 解冻保证金
  NormalCompletion = 'Normal Completion', // 正常完成交易
  NegotiatedCompletion = 'Negotiated Completion', // 协商完成交易
  DefaultedCompletion = 'Defaulted Completion' // 违约完成交易
}

export enum TransactionStatus {
  pending = 'pending',
  success = 'success',
  fail = 'fail',
  cancel = 'cancel'
}

export enum TRANS_CHANNEL {
  LOCAL = 'local',
  WEB3 = 'web3',
  PAYPAL = 'paypal'
}
