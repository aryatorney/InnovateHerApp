#!/bin/bash
TODAY=$(date +%Y-%m-%d)
echo "Checking entries for $TODAY (all users):"
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const entries = await mongoose.connection.db.collection('entries').find({date:'$TODAY'}).toArray();
  entries.forEach(e => {
    console.log('userId:', e.userId);
    console.log('hasAiInsights:', !!e.aiInsights);
    console.log('primaryWeather:', e.primaryWeather);
    console.log('explanation:', (e.explanation || '').slice(0,60));
    console.log('---');
  });
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
" --require /Users/arya/InnovateHerApp/rane/node_modules/dotenv/config 2>/dev/null
