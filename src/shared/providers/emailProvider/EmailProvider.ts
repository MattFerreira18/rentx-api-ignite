import aws from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import { createTransport, Transporter } from 'nodemailer';

import { IEmailProvider } from './IEmailProvider';

export class EmailProvider implements IEmailProvider {
  private client: Transporter;

  constructor() {
    this.client = createTransport({
      SES: new aws.SES({
        apiVersion: '2018-02-01',
        region: process.env.AWS_REGION,
      }),
    });
  }

  async send(to: string, subject: string, variables: any, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: 'Rentx <noreplay@rentx.com.br>',
      subject,
      html: templateHTML,
    });
  }
}
