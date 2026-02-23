import { AccountService } from "../services/account.service.js"
import { hash } from "../services/password.service.js"
import { Account } from "../models/account.model.js"
import env from "dotenv"
env.config()

export async function createDefaultAdminIfNotExist() {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'sagozbarberdev@gmail.com'
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
    const existingAccount = await Account.findOne({ where: { email: adminEmail } })

    if(!existingAccount){
        const account = {
            full_name: "ADMIN",
            email: adminEmail,
            password: adminPassword,
            role: "admin"
        };

        await AccountService.create(account)
        console.log("Default admin account created.");
    }
    else{
        console.log("Default admin already exists.")
    }
}