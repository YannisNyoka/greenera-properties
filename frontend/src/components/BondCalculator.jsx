import { useState, useMemo } from 'react';

function BondCalculator({ propertyPrice }) {
  const [price, setPrice] = useState(propertyPrice || 1000000);
  const [depositPercent, setDepositPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(11.5); // typical SA prime-linked bond rate — adjustable
  const [termYears, setTermYears] = useState(20);

  const results = useMemo(() => {
    const deposit = (price * depositPercent) / 100;
    const loanAmount = price - deposit;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = termYears * 12;

    if (loanAmount <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return { monthlyPayment: 0, totalRepayment: 0, totalInterest: 0, loanAmount: 0 };
    }

    // Standard amortization formula: M = P[r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalRepayment = monthlyPayment * numPayments;
    const totalInterest = totalRepayment - loanAmount;

    return { monthlyPayment, totalRepayment, totalInterest, loanAmount };
  }, [price, depositPercent, interestRate, termYears]);

  const formatCurrency = (n) =>
    n.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 });

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
      <h3>Bond Repayment Calculator</h3>

      <div className="form mt-1">
        <label>
          Property Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: '100%', marginTop: '0.25rem' }}
          />
        </label>

        <label>
          Deposit: {depositPercent}% ({formatCurrency((price * depositPercent) / 100)})
          <input
            type="range"
            min="0"
            max="50"
            value={depositPercent}
            onChange={(e) => setDepositPercent(Number(e.target.value))}
            style={{ width: '100%', marginTop: '0.25rem' }}
          />
        </label>

        <div className="form-row">
          <label>
            Interest Rate (%)
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </label>

          <label>
            Term (years)
            <select
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              {[10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-2" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <p className="card-price" style={{ fontSize: '1.4rem' }}>
          {formatCurrency(results.monthlyPayment)} <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 400 }}>/ month</span>
        </p>
        <p className="text-muted">Loan amount: {formatCurrency(results.loanAmount)}</p>
        <p className="text-muted">Total interest over {termYears} years: {formatCurrency(results.totalInterest)}</p>
        <p className="text-muted">Total repayment: {formatCurrency(results.totalRepayment)}</p>
      </div>

      <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
        Estimate only — actual bond terms depend on your credit profile and the lender's assessment. Not financial advice.
      </p>
    </div>
  );
}

export default BondCalculator;