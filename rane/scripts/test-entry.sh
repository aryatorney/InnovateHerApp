#!/bin/bash
TODAY=$(date +%Y-%m-%d)
echo "Clearing aiInsights for $TODAY so Gemini regenerates..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: '$(dirname $0)/../.env.local' });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const r = await mongoose.connection.db.collection('entries').updateMany({date:'$TODAY', userId:'dev-user'}, {\$unset:{aiInsights:1}});
  console.log('Cleared', r.modifiedCount, 'entries');
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
"
echo "Creating entry for $TODAY..."
curl -s -X POST http://localhost:3000/api/entries -H "Content-Type: application/json" -d "{\"date\":\"$TODAY\",\"text\":\"I feel exhausted from work and had trouble focusing all day. My energy was low and I could not plan anything.\"}" | python3 -m json.tool
