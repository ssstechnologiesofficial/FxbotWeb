export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const investmentPackages = [
    {
      id: 1,
      name: "Starter Plan",
      minAmount: 100,
      maxAmount: 999,
      driPercentage: 6,
      fsPercentage: 6,
      lockPeriod: 17,
      features: [
        "DRI 6% monthly return",
        "FS 6% monthly return", 
        "17-month lock period",
        "Basic support"
      ]
    },
    {
      id: 2,
      name: "Professional Plan",
      minAmount: 1000,
      maxAmount: 4999,
      driPercentage: 6,
      fsPercentage: 6,
      lockPeriod: 17,
      features: [
        "DRI 6% monthly return",
        "FS 6% monthly return",
        "17-month lock period", 
        "Priority support",
        "Advanced analytics"
      ]
    },
    {
      id: 3,
      name: "Premium Plan",
      minAmount: 5000,
      maxAmount: 19999,
      driPercentage: 6,
      fsPercentage: 6,
      lockPeriod: 17,
      features: [
        "DRI 6% monthly return",
        "FS 6% monthly return",
        "17-month lock period",
        "VIP support",
        "Advanced analytics",
        "Personal account manager"
      ]
    },
    {
      id: 4,
      name: "Elite Plan",
      minAmount: 20000,
      maxAmount: 100000,
      driPercentage: 6,
      fsPercentage: 6,
      lockPeriod: 17,
      features: [
        "DRI 6% monthly return",
        "FS 6% monthly return",
        "17-month lock period",
        "Elite support",
        "Premium analytics",
        "Dedicated account manager",
        "Exclusive market insights"
      ]
    }
  ];

  res.status(200).json({ 
    success: true, 
    packages: investmentPackages 
  });
}