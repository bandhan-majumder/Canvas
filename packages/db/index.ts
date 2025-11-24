import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

// You can specify any property from the node-postgres connection options
const drizzleClient = drizzle(process.env.DATABASE_URL!);

export default drizzleClient;