const { getConnection } = require('./connection');

const GIFTS = [
  {
    name: 'Jogo de Panelas',
    category: 'cozinha',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description:
      'Antiaderente, 5 peças. Base para qualquer receita do dia a dia.',
    price: 189.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Liquidificador',
    category: 'cozinha',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description:
      'Potente, 1000W. Pra suco, vitamina, sopa e o que mais inventar.',
    price: 149.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Air Fryer',
    category: 'eletro',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: '4 litros, timer digital. Praticidade no dia a dia sem óleo.',
    price: 299.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Jogo de Cama Casal',
    category: 'quarto',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: 'Algodão 200 fios, 4 peças. Conforto pra noites bem dormidas.',
    price: 129.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Jogo de Talheres',
    category: 'cozinha',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: 'Inox, 24 peças. Pra receber visita com estilo e carinho.',
    price: 89.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Jogo de Toalhas',
    category: 'banho',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: 'Felpudas, 5 peças. Maciez de hotel no banheiro de casa.',
    price: 79.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Escorredor de Louça',
    category: 'cozinha',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: 'Inox com bandeja. Organização na pia sem drama.',
    price: 69.9,
    image_url: '/public/gift.png',
  },
  {
    name: 'Conjunto de Potes',
    category: 'cozinha',
    link: 'https://www.mercadolivre.com.br/celular-samsung-galaxy-a17-5g-com-ia-128gb-4gb-ram-cm-de-50mp-tela-de-67-nfc-ip54-preto/p/MLB55027309?pdp_filters=item_id%3AMLB6543431512&matt_tool=38524122#origin=share&sid=share&wid=MLB6543431512&action=copy',
    description: 'Herméticos, 10 peças. Organizar a cozinha nunca foi tão bom.',
    price: 59.9,
    image_url: '/public/gift.png',
  },
];

const ADMINS = [
  { name: 'LaryssaADM', phone: '+5573991306647', role: 'ADMIN' },
  { name: 'SamuelADM', phone: '+5573991154203', role: 'ADMIN' },
];

const INSERT_GIFT = `
  INSERT INTO gifts (name, category, description, price, link, image_url)
  VALUES (?, ?, ?, ?, ?, ?)
`;

const INSERT_USER = `
  INSERT INTO users (name, phone, role)
  VALUES (?, ?, ?)
`;

async function run() {
  const conn = await getConnection();

  // seed users
  const [userRows] = await conn.execute('SELECT COUNT(*) AS total FROM users');
  if (userRows[0].total > 0) {
    console.log(
      `tabela users já tem ${userRows[0].total} registros. pulando seed.`,
    );
  } else {
    for (const u of ADMINS) {
      await conn.execute(INSERT_USER, [u.name, u.phone, u.role]);
      console.log(`  + ${u.name} (${u.role})`);
    }
    console.log(`${ADMINS.length} admins inseridos.`);
  }

  // seed gifts
  const [giftRows] = await conn.execute('SELECT COUNT(*) AS total FROM gifts');
  if (giftRows[0].total > 0) {
    console.log(
      `tabela gifts já tem ${giftRows[0].total} registros. pulando seed.`,
    );
  } else {
    for (const g of GIFTS) {
      await conn.execute(INSERT_GIFT, [
        g.name,
        g.category,
        g.description,
        g.price,
        g.link || null,
        g.image_url,
      ]);
      console.log(`  + ${g.name}`);
    }
    console.log(`${GIFTS.length} presentes inseridos.`);
  }

  await conn.end();
  console.log('done.');
}

run().catch((e) => {
  console.error('MySQL error:', e.message);
  process.exit(1);
});
