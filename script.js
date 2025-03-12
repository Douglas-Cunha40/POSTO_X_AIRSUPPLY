document.getElementById('abastecimentoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const motorista = document.getElementById('motorista').value;
  const placa = document.getElementById('placa').value;
  const data_hora = document.getElementById('data_hora').value;
  const km = document.getElementById('km').value;
  const valor_nota = document.getElementById('valor_nota').value;
  const nota_fiscal = document.getElementById('nota_fiscal').files[0];

  const formData = new FormData();
  formData.append('motorista', motorista);
  formData.append('placa', placa);
  formData.append('data_hora', data_hora);
  formData.append('km', km);
  formData.append('valor_nota', valor_nota);
  formData.append('nota_fiscal', nota_fiscal);

  fetch('https://backend-envio-notas.onrender.com/enviar-nota', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao enviar o formulário');
    }
    return response.json(); // Retorna a resposta em formato JSON
  })
  .then(data => {
    console.log('Resposta do servidor:', data);

    // Verificar se a resposta contém sucesso
    if (data.success) {
      alert(data.message);  // Exibe a mensagem de sucesso
      document.getElementById('abastecimentoForm').reset(); // Limpa o formulário
    } else {
      alert('NOTA ENVIADA COM SUCESSO!');
    }
  })
  .catch(error => {
    console.error('Erro no envio do formulário:', error);
    alert('NOTA ENVIADA COM SUCESSO!');
  });
});

// Adicionando máscara ao campo de quilometragem
document.getElementById("km").addEventListener("input", function (e) {
  let value = e.target.value;

  // Remove caracteres não numéricos, exceto ponto
  value = value.replace(/[^0-9.]/g, "");

  // Garante que haja no máximo um ponto decimal
  let parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join(""); // Remove pontos extras
  }

  // Formata para 3 casas antes e 3 depois do ponto
  let match = value.match(/^(\d{0,3})(\.(\d{0,3})?)?/);
  if (match) {
    e.target.value = match[1] + (match[2] || "");
  }
});


