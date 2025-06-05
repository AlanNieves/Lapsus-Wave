import express, { Request, Response } from 'express';
import dgram from 'dgram';
import net from 'net';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Descubrir dispositivos Roku
app.get('/api/discover-roku', (req: Request, res: Response) => {
  const client = dgram.createSocket('udp4');
  const devices: Array<{ ip: string; name: string }> = [];

  client.on('message', (msg, rinfo) => {
    const response = msg.toString();
    if (response.includes('ROKU') && response.includes('LOCATION:')) {
      devices.push({
        ip: rinfo.address,
        name: `Roku ${rinfo.address}`
      });
    }
  });

  const searchMsg = Buffer.from([
    'M-SEARCH * HTTP/1.1',
    'HOST: 239.255.255.250:1900',
    'MAN: "ssdp:discover"',
    'MX: 3',
    'ST: roku:ecp',
    '', // Línea vacía al final
    ''
  ].join('\r\n'));

  client.send(searchMsg, 1900, '239.255.255.250');

  setTimeout(() => {
    client.close();
    res.json(devices);
  }, 3000);
});

// Reproducir en dispositivo Roku
app.post('/api/play-roku', (req: Request, res: Response) => {
  const { ip, mediaUrl, title } = req.body;

  // Paso 1: Lanzar aplicación Roku Media Player
  const launchClient = net.connect(8060, ip, () => {
    const launchCommand = [
      'POST /launch/837 HTTP/1.1',
      'Host: ' + ip + ':8060',
      'Content-Length: 0',
      '',
      ''
    ].join('\r\n');
    launchClient.write(launchCommand);
    launchClient.end();
  });

  launchClient.on('error', (err) => {
    console.error('Error al lanzar app:', err);
    res.status(500).send('Error');
  });

  // Esperar 1 segundo para que se abra la app
  setTimeout(() => {
    // Paso 2: Enviar contenido a reproducir
    const playClient = net.connect(8060, ip, () => {
      const playCommand = [
        'POST /input?t=video&u=' + encodeURIComponent(mediaUrl) +
        '&videoName=' + encodeURIComponent(title) + ' HTTP/1.1',
        'Host: ' + ip + ':8060',
        'Content-Length: 0',
        '',
        ''
      ].join('\r\n');
      playClient.write(playCommand);
      playClient.end();
    });

    playClient.on('error', (err) => {
      console.error('Error al reproducir:', err);
      res.status(500).send('Error');
    });

    playClient.on('data', () => {
      playClient.end();
      res.sendStatus(200);
    });
  }, 1000);
});

// Iniciar servidor
app.listen(5000, () => {
  console.log('Backend ejecutándose en http://localhost:5000');
});