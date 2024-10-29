import React, { useState } from 'react';


const EnviarCorreo = () => {
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviarCorreo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/enviar-correo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinatario: correo,
          asunto: asunto,
          texto: mensaje,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Correo enviado con éxito');
      } else {
        alert('Error enviando correo: ' + data.message);
      }
    } catch (error) {
      console.error("Error enviando correo: ", error);
      alert('Error enviando correo');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc' }}>
      <h1 style={{ textAlign: 'center' }}>Enviar Correo</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Correo destinatario:</label>
        <input
          type="email"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Correo destinatario"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Asunto:</label>
        <input
          type="text"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Mensaje:</label>
        <textarea
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Escribe tu mensaje aquí"
          rows="4"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
      </div>

      <button
        style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        onClick={handleEnviarCorreo}
      >
        Enviar Correo
      </button>
    </div>
  );
};

export default EnviarCorreo;
