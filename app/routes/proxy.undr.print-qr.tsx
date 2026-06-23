import { useEffect } from 'react';
import { useLocation } from 'react-router';

function decodeParam(v: string | null) {
  return v ? decodeURIComponent(String(v)) : '';
}

export default function PrintQrProxy() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const productTitle = decodeParam(params.get('productTitle'));
  const variant = decodeParam(params.get('variant'));
  const variantNo = decodeParam(params.get('variantNo'));
  const quantity = decodeParam(params.get('quantity'));
  const orderNumber = decodeParam(params.get('orderNumber'));
  const customerName = decodeParam(params.get('customerName'));
  const customerEmail = decodeParam(params.get('customerEmail'));
  const kitNumber = decodeParam(params.get('kitNumber'));
  const qrUrl = decodeParam(params.get('qrUrl'));

  useEffect(() => {
    console.log('[print-qr-proxy] page loaded', { productTitle, variant, quantity, orderNumber, customerName, customerEmail, kitNumber, qrUrl });
    const t = setTimeout(() => {
      try {
        console.log('[print-qr-proxy] calling window.print()');
        window.print();
        console.log('[print-qr-proxy] window.print() returned');
      } catch (e) {
        console.error('[print-qr-proxy] print failed', e);
      }
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Print QR</title>
        <style>{`body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111} .card{max-width:720px;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:8px} img.qr{max-width:300px;height:auto} .row{display:flex;gap:16px;align-items:flex-start}`}</style>
      </head>
      <body>
        <div className="card">
          <h1>Kit Registration</h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {qrUrl ? (
              <img className="qr" src={qrUrl} alt="QR code" />
            ) : (
              <div style={{ width: 300, height: 300, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No QR</div>
            )}
            <p style={{ marginTop: 12, fontSize: 18 }}><strong>Kit #:</strong> {kitNumber}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
