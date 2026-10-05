import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecting to BusinessX...</title>
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; margin: 0; }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #1877F2; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="spinner"></div>
        <h2>Returning to App...</h2>
        <p>Please wait while we log you in.</p>
        <p id="error-msg" style="color: red; display: none;"></p>
      </div>

      <script>
        // Facebook returns OAuth tokens in the hash fragment (#access_token=...)
        const hash = window.location.hash;
        const search = window.location.search;
        
        let stateStr = null;
        
        // Extract state (which contains our exp:// return URL)
        if (search.includes('state=')) {
           const params = new URLSearchParams(search);
           stateStr = params.get('state');
        } else if (hash.includes('state=')) {
           const params = new URLSearchParams(hash.replace('#', '?'));
           stateStr = params.get('state');
        }

        if (stateStr) {
          try {
            const returnUrl = decodeURIComponent(stateStr);
            // Reconstruct the deep link to send the token back to the Expo app
            const finalUrl = returnUrl + (returnUrl.includes('?') ? '&' : '?') + "proxy=1&" + hash.replace('#', '');
            
            console.log("Redirecting to:", finalUrl);
            window.location.href = finalUrl;
          } catch(e) {
             document.getElementById('error-msg').style.display = 'block';
             document.getElementById('error-msg').innerText = "Error parsing return URL.";
          }
        } else {
          document.getElementById('error-msg').style.display = 'block';
          document.getElementById('error-msg').innerText = "Error: Missing state parameter from Facebook.";
        }
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
