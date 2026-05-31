const net = require('net');

console.log('Iniciando transferencia falsa...');
const cliente = new net.Socket();

// Nos conectamos al puerto de archivos (53318) que programaste
cliente.connect(53318, '127.0.0.1', () => {
    console.log('✅ Conectado al servidor de LocalSend');
    
    // 1. Mandamos el JSON con los datos del archivo
    const metadatos = { nombre: "video_vacaciones_falso.mp4", peso: 100 };
    cliente.write(JSON.stringify(metadatos));

    // 2. Simulamos el envío de "pedazos" del archivo cada medio segundo
    let bytesEnviados = 0;
    const intervalo = setInterval(() => {
        bytesEnviados += 20; // Avanza un 20%
        cliente.write(Buffer.alloc(20)); // Enviamos bytes vacíos
        
        console.log(`Enviando chunk... ${bytesEnviados}%`);
        
        if (bytesEnviados >= 100) {
            clearInterval(intervalo);
            cliente.end();
            console.log('🎉 Archivo transferido con éxito.');
        }
    }, 500); 
});
