import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");

  const issue = async () => {
    const canonical = `demo|${Date.now()}`;
    const res = await fetch("/api/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canonical }),
    });
    const { signature } = await res.json();
    const qrText = `LOY|${canonical}|${signature}`;
    setQr(qrText);
  };

  const verify = async () => {
    if (!qr) return;
    const parts = qr.split("|");
    const canonical = parts[1];
    const signature = parts[2];
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canonical, signature }),
    });
    const { ok } = await res.json();
    setText(ok ? "✔️ التوقيع صحيح" : "❌ التوقيع غير صحيح");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>تطبيق ولاء تجريبي</h1>
      <button onClick={issue}>إصدار QR</button>
      {qr && (
        <div style={{ marginTop: 20 }}>
          <QRCodeCanvas value={qr} size={180} />
          <p>{qr}</p>
          <button onClick={verify}>تحقق من QR</button>
        </div>
      )}
      <div style={{ marginTop: 20 }}>{text}</div>
    </div>
  );
}

export default App;
