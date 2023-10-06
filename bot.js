const fs = require('fs');
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create({
    session: 'sessionName',
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));



  function start(client) {
    client.onMessage((message) => {
      if (message.body === 'Gostaria de receber o catálogo e fazer orçamentos dos produtos.') {
        // Pergunta 1: Qual é o seu nome?
        client
          .sendText(message.from, 'Olá! Tudo bem? Seu contato seria para consumo residencial ou empresarial, como mercado, pizzaria, lanchonete e padaria?')
          .then((result) => {
            console.log('Resultado: ', result); // objeto de sucesso
          })
          .catch((error) => {
            console.error('Erro ao enviar: ', error); // objeto de erro
          });
  
        // Pergunta 2: Olá! Tudo bem? Seu contato seria para consumo residencial ou empresarial, como mercado, pizzaria, lanchonete e padaria?
        client
          .sendText(message.from, 'Qual é o seu nome?')
          .then((result) => {
            console.log('Resultado: ', result); // objeto de sucesso
  
            // Após coletar as informações, informe ao cliente para aguardar o vendedor
            client
              .sendText(message.from, 'Aguarde o vendedor...')
              .then((result) => {
                console.log('Resultado: ', result); // objeto de sucesso
              })
              .catch((error) => {
                console.error('Erro ao enviar: ', error); // objeto de erro
              });
          })
          .catch((error) => {
            console.error('Erro ao enviar: ', error); // objeto de erro
          });
      }
    });
  }
  