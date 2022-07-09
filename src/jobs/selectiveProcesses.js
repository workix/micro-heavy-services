const { Op } = require('sequelize');
import { SelectiveProcess } from '../models'

export const findExpiredProcesses = async () => {
    console.log("CRON - findExpiredProcesses")

    const sps = await SelectiveProcess.update({active: false},{ where: { active: true , expire: { [Op.lte]: new Date() } } })
    
}