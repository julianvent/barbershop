import { AccountService } from "../services/account.service.js"
import { hash } from "../services/password.service.js"
import { Account } from "../models/account.model.js"


export async function createDefaultAdminIfNotExist() {
    const adminEmail = 'sagozbarberdev@gmail.com'
    const adminPassword = 'admin123'
    const existingAccount = await Account.findOne({ where: { email: adminEmail } })

    if(!existingAccount){
        const account = {
            full_name: "admin",
            email: adminEmail,
            password: adminPassword,
            role: "admin"
        };

        AccountService.create(account)
        console.log("Default admin account created.");
    }
    else{
        console.log("Default admin already exists.")
    }
}