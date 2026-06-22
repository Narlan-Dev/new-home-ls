export function collectFormData() {
  const f = document.forms['aulaForm'];
  const val = name => f.elements[name]?.value?.trim() || '';
  const checked = name => f.elements[name]?.checked || false;

  const objetivos = [];
  document.querySelectorAll('#objetivosContainer .objetivo-row input').forEach(input => {
    if (input.value.trim()) objetivos.push(input.value.trim());
  });

  const topicos = [];
  document.querySelectorAll('.topico-card').forEach(card => {
    const id = card.dataset.id;

    const hasCodigo = checked(`topico_has_codigo_${id}`);
    let codigo;
    if (hasCodigo) {
      const anatomia = [];
      card.querySelectorAll(`[name^="topico_codigo_anatomia_${id}_"]`).forEach(input => {
        if (input.value.trim()) anatomia.push(input.value.trim());
      });
      codigo = {
        arquivo: val(`topico_codigo_arquivo_${id}`) || 'exemplo.py',
        linhas: val(`topico_codigo_linhas_${id}`),
        anatomia
      };
    }

    const atividadeMode = card.querySelector(`[name="topico_atividade_mode_${id}"]:checked`)?.value || 'manual';
    let atividade;
    if (atividadeMode === 'ia') {
      atividade = { ia_generate: true };
    } else {
      atividade = {
        titulo: val(`topico_ativ_titulo_${id}`),
        enunciado: val(`topico_ativ_enunciado_${id}`),
        tipo: val(`topico_ativ_tipo_${id}`) || 'reflexao',
        uso_ia: checked(`topico_ativ_uso_ia_${id}`)
      };
    }

    const conteudoMode = card.querySelector(`[name="topico_conteudo_mode_${id}"]:checked`)?.value || 'manual';
    const iaDescricao = val(`topico_ia_descricao_${id}`);
    const topico = {
      titulo: val(`topico_titulo_${id}`),
      ...(conteudoMode === 'ia'
        ? { ia_generate: true, ...(iaDescricao ? { descricao: iaDescricao } : {}) }
        : { conteudo: val(`topico_conteudo_${id}`) }),
      atividade
    };
    if (codigo) topico.codigo = codigo;

    const hasImagem = checked(`topico_has_imagem_${id}`);
    if (hasImagem) {
      const imagemUrl = val(`topico_imagem_url_${id}`);
      const imagemTexto = val(`topico_imagem_texto_${id}`);
      const imagemLegenda = val(`topico_imagem_legenda_${id}`);
      if (imagemUrl) {
        topico.imagem = {
          url: imagemUrl,
          ...(imagemTexto ? { texto: imagemTexto } : {}),
          ...(imagemLegenda ? { legenda: imagemLegenda } : {})
        };
      }
    }

    topicos.push(topico);
  });

  const data = {
    modulo: parseInt(val('modulo')) || 1,
    aula: parseInt(val('aula')) || 1,
    titulo: val('titulo'),
    professor: val('professor'),
    semanas: parseInt(val('semanas')) || 4,
    carga_horaria: val('carga_horaria') || '24h',
    linguagem: val('linguagem') || 'Python',
    descricao: val('descricao'),
    objetivos,
    nota_pedagogica: {
      uso_ia: checked('uso_ia'),
      texto: val('nota_texto')
    },
    topicos
  };

  if (checked('pilaresToggle')) {
    const itens = [];
    for (let i = 0; i < 4; i++) {
      itens.push({ titulo: val(`pilar_titulo_${i}`), descricao: val(`pilar_desc_${i}`) });
    }
    data.pilares = {
      titulo: val('pilares_titulo') || 'Os 4 pilares',
      descricao: val('pilares_descricao'),
      itens
    };
  }

  if (checked('principioToggle')) {
    data.principio = {
      frase: val('principio_frase'),
      contexto: val('principio_contexto')
    };
  }

  return data;
}
