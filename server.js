const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuração para lidar com o envio de formulários e arquivos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Multer para armazenamento temporário (requer que o "uploads" exista)
const upload = multer({ dest: 'uploads/' }); // Pasta para armazenar os arquivos temporariamente

// Configuração do transporte do Nodemailer para enviar e-mail com Outlook
const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: 'antonio.almeida@airsupplybr.com',
    pass: 'Pon65294',
  },
});

// Rota POST para enviar o e-mail com os dados do formulário
app.post('/enviar-nota', upload.single('nota_fiscal'), (req, res) => {
  console.log('Dados recebidos:', req.body); // Exibir os dados do formulário para depuração
  console.log('Arquivo enviado:', req.file);  // Exibir informações sobre o arquivo recebido
  
  const { motorista, placa, data_hora, km, valor_nota } = req.body;
  const nota_fiscal = req.file;

  // Verificar se o arquivo foi anexado
  if (!nota_fiscal) {
    return res.status(400).send('Nenhum arquivo anexado');
  }

  // Configuração do e-mail com os dados do formulário e o anexo
  const mailOptions = {
    from: 'antonio.almeida@airsupplybr.com',
    to: 'antonio.almeida@airsupplybr.com',
    subject: 'Nova Nota Fiscal Recebida',
    text: `
      Motorista: ${motorista}
      Placa do Veículo: ${placa}
      Data e Hora: ${data_hora}
      Kilometragem no Abastecimento: ${km}
      Valor da Nota: R$ ${valor_nota}
    `,
    attachments: [
      {
        filename: nota_fiscal.originalname, // Nome original do arquivo
        path: nota_fiscal.path, // Caminho onde o arquivo foi armazenado temporariamente
      },
    ],
  };

  // Envio do e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
      return res.status(500).send(`Erro ao enviar o e-mail: ${error.message}`);
    }
    console.log('E-mail enviado:', info);
    return res.status(200).send('E-mail enviado com sucesso');
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
