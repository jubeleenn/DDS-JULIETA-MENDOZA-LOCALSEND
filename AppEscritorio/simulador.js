const dgram = require('dgram');

// Creamos un cliente UDP
const cliente = dgram.createSocket('udp4');
const mensaje = Buffer.from('¡Hola! Soy un celular falso de prueba');

console.log('Enviando latido de prueba...');

// Enviamos el mensaje al puerto 53317 de nuestra propia máquina (localhost)
cliente.send(mensaje, 53317, '127.0.0.1', (error) => {
    if (error) {
        console.error('Error al enviar el latido:', error);
    } else {
        console.log('✅ ¡Latido enviado exitosamente al puerto 53317!');
        console.log('Revisa la pantalla de tu aplicación React.');
    }
    cliente.close(); // Apagamos el celular falso
});