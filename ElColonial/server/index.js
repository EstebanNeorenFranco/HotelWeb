const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router(); // Aquí se define el router



dotenv.config();

app.use(cors());
app.use(express.json());




// Crear conexión con la base de datos directamente
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Ruta para obtener reservas
app.get('/reservas', (req, res) => {
    const sql = 'SELECT * FROM reserva';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});

// Ruta para obtener habitaciones disponibles
app.post('/api/habitaciones-disponibles', (req, res) => {
    const { p_cantidad_adultos, p_cantidad_menores, p_checkin, p_checkout } = req.body;

    const sql = 'CALL habitaciones_disponibles(?, ?, ?, ?)'; // Asegúrate de ajustar según los parámetros del procedimiento

    db.query(sql, [p_cantidad_adultos, p_cantidad_menores, p_checkin, p_checkout], (err, results) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento:', err);
            return res.status(500).json({ message: 'Error al obtener habitaciones disponibles', error: err.message });
        }

        const habitaciones = results[0]; // Ajusta según cómo devuelve los resultados tu procedimiento
        res.json(habitaciones);
    });
});



// Ruta para insertar una nueva reserva
app.post('/api/reserva', (req, res) => {
    const { nombre, apellido, mail, telefono, fechacheckin, fechacheckout, tipo_habitacion } = req.body;

    if (!nombre || !apellido || !mail || !telefono || !fechacheckin || !fechacheckout || !tipo_habitacion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const estado_pago = 'Pendiente';
    const estado_reserva = 'Pendiente';

    const sql = `INSERT INTO reserva 
        (nombre, apellido, mail, telefono, fecha_checkin, fecha_checkout, estado_pago, estado_reserva, tipo_habitacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellido, mail, telefono, fechacheckin, fechacheckout, estado_pago, estado_reserva, tipo_habitacion], (err, result) => {
        if (err) {
            console.error('Error al insertar la reserva:', err);
            return res.status(500).json({ message: 'Error al insertar la reserva' });
        }
        res.status(201).json({ message: 'Reserva creada con éxito', reservaId: result.insertId });
    });
});

// Sección inicio de usuarios
const users = [
    { username: 'admin', password: 'admin123' }  // Usuario de ejemplo
];

// Endpoint para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token no válido' });
        req.user = decoded;
        next();
    });
};

// Ruta protegida (Ejemplo)
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

// Ruta para editar una reserva
app.put('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    console.log('ID recibido:', id); // Imprimir el ID recibido
    const { nombre, apellido, mail, estado_pago, estado_reserva, tipo_habitacion } = req.body;

    const sql = `UPDATE reserva 
                 SET nombre = ?, apellido = ?, mail = ?, estado_pago = ?, estado_reserva = ?, tipo_habitacion = ? 
                 WHERE id = ?`;
    
    db.query(sql, [nombre, apellido, mail, estado_pago, estado_reserva, tipo_habitacion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la reserva:', err);
            return res.status(500).json({ message: 'Error al actualizar la reserva', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.json({ message: 'Reserva actualizada con éxito' });
    });
});


// Ruta para eliminar una reserva
app.delete('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const sql = `DELETE FROM reserva WHERE id = ?`;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la reserva:', err);
            return res.status(500).json({ message: 'Error al eliminar la reserva' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.json({ message: 'Reserva eliminada con éxito' });
    });
});

// Ruta para obtener facturación mensual por año
app.get('/facturacion/:year', (req, res) => {
    const year = parseInt(req.params.year, 10);
    
    if (isNaN(year) || year < 1900 || year > 2100) { // Validación básica del año
        return res.status(400).json({ message: 'Año inválido' });
    }

    const sql = 'CALL facturacion_mensual(?)';

    db.query(sql, [year], (err, results) => {
        if (err) {
            console.error('Error ejecutando el procedimiento:', err);
            return res.status(500).json({ message: 'Error al ejecutar el procedimiento', error: err.message });
        }

        // Asumiendo que el procedimiento devuelve una única tabla de resultados
        const facturacion = results[0];
        res.json(facturacion);
    });
});

//--------------------------------

// Ruta para obtener todos los alquileres mensuales
app.get('/alquileres', (req, res) => {
    const sql = 'SELECT * FROM alquiler_mensual';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});


// Ruta para editar un alquiler mensual
app.put('/alquileres/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const { habitacion_id, fecha_inicio, fecha_fin, monto, estado, fecha_alta, fecha_baja } = req.body;

    const sql = `UPDATE alquiler_mensual 
                 SET habitacion_id = ?, fecha_inicio = ?, fecha_fin = ?, monto = ?, estado = ?, fecha_alta = ?, fecha_baja = ? 
                 WHERE id = ?`;
    
    db.query(sql, [habitacion_id, fecha_inicio, fecha_fin, monto, estado, fecha_alta, fecha_baja, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el alquiler mensual:', err);
            return res.status(500).json({ message: 'Error al actualizar el alquiler mensual', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alquiler mensual no encontrado' });
        }

        res.json({ message: 'Alquiler mensual actualizado con éxito' });
    });
});

// Ruta para eliminar un alquiler mensual
app.delete('/alquileres/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const sql = `DELETE FROM alquiler_mensual WHERE id = ?`;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el alquiler mensual:', err);
            return res.status(500).json({ message: 'Error al eliminar el alquiler mensual' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alquiler mensual no encontrado' });
        }

        res.json({ message: 'Alquiler mensual eliminado con éxito' });
    });
});


// Ruta para agregar un nuevo alquiler mensual
app.post('/alquileres', (req, res) => {
    const { habitacion_id, fecha_inicio, fecha_fin, monto, estado, fecha_alta, fecha_baja } = req.body;

    // Verificamos que se envíen todos los campos necesarios
    if (!habitacion_id || !fecha_inicio || !fecha_fin || !monto || !estado || !fecha_alta) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const sql = `INSERT INTO alquiler_mensual (habitacion_id, fecha_inicio, fecha_fin, monto, estado, fecha_alta, fecha_baja) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [habitacion_id, fecha_inicio, fecha_fin, monto, estado, fecha_alta, fecha_baja], (err, result) => {
        if (err) {
            console.error('Error al agregar el alquiler mensual:', err);
            return res.status(500).json({ message: 'Error al agregar el alquiler mensual', error: err.message });
        }

        res.status(201).json({ message: 'Alquiler mensual agregado con éxito', alquilerId: result.insertId });
    });
});



//--------------------------------

// Endpoint para obtener la facturación mensual de reservas
app.get('/facturacion/reservas/:year', (req, res) => {
    const year = req.params.year;
  
    db.query('CALL facturacion_reservas_mensual(?)', [year], (error, results) => {
      if (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al obtener los datos de facturación.' });
      }
  
      // Los resultados estarán en el primer elemento del array
      const facturacionData = results[0];
      return res.json(facturacionData);
    });
  });

// -----------------------------------------
app.get('/alquileres', (req, res) => {
    const sql = 'SELECT * FROM alquiler_mensual';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});

// Ruta para editar un alquiler mensual
app.put('/alquileres/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const { habitacion_id, fecha_inicio, fecha_fin, monto } = req.body;

    const sql = `UPDATE alquiler_mensual 
                 SET habitacion_id = ?, fecha_inicio = ?, fecha_fin = ?, monto = ? 
                 WHERE id = ?`;
    
    db.query(sql, [habitacion_id, fecha_inicio, fecha_fin, monto, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el alquiler:', err);
            return res.status(500).json({ message: 'Error al actualizar el alquiler', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alquiler no encontrado' });
        }

        res.json({ message: 'Alquiler actualizado con éxito' });
    });
});

// -----------------------------------------

app.get('/habitaciones', (req, res) => {
    const sql = 'SELECT * FROM habitacion';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});




// Ruta para eliminar una habitación
app.delete('/habitaciones/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    
    // Verificar si el ID es un número válido
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const sql = 'DELETE FROM habitacion WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la habitación:', err);
            return res.status(500).json({ message: 'Error al eliminar la habitación' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }

        res.json({ message: 'Habitación eliminada con éxito' });
    });
});

app.put('/habitaciones/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Verificar si el ID es un número válido
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    // Obtener los datos del cuerpo de la solicitud
    const { tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja } = req.body;
    console.log('Datos recibidos:', req.body); // Verifica lo que se recibe en el cuerpo de la solicitud

    // Verificar que se envíen todos los campos necesarios
    if (!tipo_habitacion || !precio || !cantidad_huespedes || !fecha_alta) {
        return res.status(400).json({ message: 'Faltan datos para actualizar la habitación' });
    }

    // Consulta para actualizar la habitación
    const sql = `UPDATE habitacion 
                 SET tipo_habitacion = ?, precio = ?, cantidad_huespedes = ?, fecha_alta = ?, fecha_baja = ? 
                 WHERE id = ?`;

    // Ejecutar la consulta
    db.query(sql, [tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la habitación:', err);
            return res.status(500).json({ message: 'Error al actualizar la habitación', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }

        res.json({ message: 'Habitación actualizada con éxito' });
    });
});

router.post('/habitaciones', async (req, res) => {
    const { tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO habitaciones (tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja) VALUES (?, ?, ?, ?, ?)',
            [tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja]
        );
        res.status(201).json({ id: result.insertId, tipo_habitacion, precio, cantidad_huespedes, fecha_alta, fecha_baja });
    } catch (error) {
        console.error('Error al agregar habitación:', error);
        res.status(500).json({ error: 'Error al agregar habitación' });
    }
});

// -----------------------------------------





app.post('/api/enviar-correo', (req, res) => {
    const { destinatario, asunto, texto } = req.body;
    
    const mailOptions = {
        from: 'esfranco@itba.edu.ar',
        to: destinatario,
        subject: asunto,
        text: texto,
    };
    
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error enviando correo:", error); // Imprime el error en la consola
              return res.status(500).send({ message: 'Error enviando correo', error });
            }
            res.status(200).send({ message: 'Correo enviado con éxito', info });
        });
    });
    
    
    
    
    // Iniciar servidor
    app.listen(process.env.PORT, () => {
        console.log(`Servidor en puerto ${process.env.PORT || 5000}`);
    });
