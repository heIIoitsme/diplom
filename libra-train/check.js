import 'dotenv/config';
import { dbService } from './src/backend/database/database.service.js'

dbService.connect().then(()=>{
    dbService.insert('collectionName', 'data'),
    console.log('ok')
})