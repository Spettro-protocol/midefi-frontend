export const Maximillion = [
  {
    inputs: [{ internalType: 'contract CRBTC', name: 'cRBTC_', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: true,
    inputs: [],
    name: 'cRBTC',
    outputs: [{ internalType: 'contract CRBTC', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'borrower', type: 'address' }],
    name: 'repayBehalf',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'borrower', type: 'address' },
      { internalType: 'contract CRBTC', name: 'cRBTC_', type: 'address' },
    ],
    name: 'repayBehalfExplicit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
]
