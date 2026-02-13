async function test() {
  try {
    console.log('Testing /api/v1/health...');
    const healthRes = await fetch('http://localhost:3000/api/v1/health');
    const healthData = await healthRes.json();
    console.log('Health:', healthData);

    console.log('Testing /api/v1/auth/oauth...');
    const oauthRes = await fetch('http://localhost:3000/api/v1/auth/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: 'google',
        redirectTo: 'http://localhost:5173'
      })
    });
    
    if (!oauthRes.ok) {
        console.log('Error status:', oauthRes.status);
        const text = await oauthRes.text();
        console.log('Error body:', text);
    } else {
        const oauthData = await oauthRes.json();
        console.log('OAuth:', oauthData);
    }
  } catch (error) {
     console.log('Error:', error.message);
  }
}

test();
