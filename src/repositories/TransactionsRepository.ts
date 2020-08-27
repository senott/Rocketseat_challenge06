import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomes = await this.find({
      where: {
        type: 'income',
      },
    });

    const totalIncome = incomes.reduce((total, item) => total + item.value, 0);

    const outcomes = await this.find({
      where: {
        type: 'outcome',
      },
    });

    const totalOutcome = outcomes.reduce(
      (total, item) => total + item.value,
      0,
    );

    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
