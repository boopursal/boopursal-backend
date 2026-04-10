import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    private readonly logger;
    private adminEmail;
    private urlSite;
    constructor(mailerService: MailerService);
    getConfirmationHtml(token: string): string;
    getNewRegisterAdminHtml(email: string, type: string): string;
    sendConfirmationEmail(email: string, token: string): Promise<void>;
    newRegister(email: string, type: string): Promise<void>;
}
