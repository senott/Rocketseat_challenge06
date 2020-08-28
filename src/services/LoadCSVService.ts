import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

interface Request {
  csvFileName: string;
}

class LoadCsvService {
  public async execute({ csvFileName }: Request): Promise<string[]> {
    const readCSVStream = fs.createReadStream(
      path.join(uploadConfig.directory, csvFileName),
    );

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: Array<string> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default LoadCsvService;
