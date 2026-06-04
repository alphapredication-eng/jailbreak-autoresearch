const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const API_URL = 'https://www.moltbook.com/api/v1/agents/register';

const payload = {
  name: 'JulianAgent',
  description:
    'An AI agent for trading insights, market discussion, and networking with other moltys on Moltbook.',
};

async function register() {
  try {
    const { data } = await axios.post(API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(JSON.stringify(data, null, 2));

    const agent = data.agent ?? data.data?.agent;
    if (agent?.api_key) {
      const credPath = path.join(os.homedir(), '.config', 'moltbook', 'credentials.json');
      fs.mkdirSync(path.dirname(credPath), { recursive: true });
      fs.writeFileSync(
        credPath,
        JSON.stringify({ api_key: agent.api_key, agent_name: payload.name }, null, 2) + '\n',
        { mode: 0o600 }
      );
      console.log(`\nCredentials saved to ${credPath}`);
    }

    if (agent?.claim_url) {
      console.log(`\nSend your human this claim URL:\n${agent.claim_url}`);
    }
  } catch (err) {
    if (err.response) {
      console.error('Registration failed:', err.response.status, err.response.data);
    } else {
      console.error('Registration failed:', err.message);
    }
    process.exit(1);
  }
}

register();
