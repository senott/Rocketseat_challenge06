import Transaction, { TransactionType } from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import LoadCSVService from './LoadCSVService';

interface Request {
  csvFileName: string;
}

class ImportTransactionsService {
  async execute({ csvFileName }: Request): Promise<Transaction[]> {
    const loadCSV = new LoadCSVService();

    const data = await loadCSV.execute({ csvFileName });

    const transactions: Array<Transaction> = [];

    const createTransactionService = new CreateTransactionService();

    for (let i = 0; i < data.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title: data[i][0],
        type: data[i][1] as TransactionType,
        value: parseFloat(data[i][2]),
        category: data[i][3],
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
