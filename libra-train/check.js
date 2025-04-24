import 'dotenv/config';
import { dbService } from './src/database/database.service.js'

dbService.connect().then(()=>{
    dbService.insert('collectionName', 'data'),
    console.log('ok')
})