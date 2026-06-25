# New Home L&S

Site do Cha de Casa Nova de Samuel & Larissa — lista de presentes interativa com autenticacao, selecao de gifts e painel admin.

## Requisitos

- **Node.js** >= 18
- **MySQL** >= 8

## Instalacao

```bash
git clone https://github.com/Narlan-Dev/new-home-ls.git
cd new-home-ls
npm install
```

## Configuracao

Crie um arquivo `.env` na raiz do projeto:

```env
ENV=development
PORT=8080
APP_URL=http://localhost:8080

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sl_db

TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_FROM=+14155238886
WHATSAPP_NOTIFY_NUMBER=+5573999999999
```

> **WhatsApp:** As variaveis `TWILIO_*` e `WHATSAPP_NOTIFY_NUMBER` sao opcionais. Se `WHATSAPP_NOTIFY_NUMBER` nao estiver definida, nenhuma notificacao e enviada. Para usar o sandbox gratuito do Twilio, o destinatario precisa enviar a mensagem de opt-in a cada 72h.

## Banco de dados

Crie o banco, as tabelas e popule com dados iniciais:

```bash
npm run db:init
```

Ou separadamente:

```bash
npm run db:setup   # cria banco + tabelas (users, gifts)
npm run db:seed    # insere admins + presentes mock
```

> Se as tabelas ja existem e voce alterou o schema, drope-as antes de rodar o setup novamente.

## Rodando

```bash
npm start
```

Acesse `http://localhost:8080`.

## Estrutura do projeto

```
server.js                              # Express server + rotas API
.env                                   # variaveis de ambiente (gitignored)
src/
  index.html                           # shell principal (monta secoes via fetch)
  main.js                              # orquestrador (carrega secoes, scripts, init)
  main.css                             # design system (tokens, tipografia, base)
  hotsite.css                          # layout da landing page
  constants/
    roles.enum.js                      # ADMIN | CLIENT
  database/
    connection.js                      # conexao MySQL (mysql2/promise)
    setup.js                           # cria banco + tabelas
    seed.js                            # popula admins + gifts
  routes/
    index.js                           # agrupa todas as rotas
    auth.routes.js                     # POST /api/auth
    gifts.routes.js                    # GET/POST /api/gifts, select, deselect, update, delete
  modules/
    auth.js                            # auth frontend (localStorage, modal, login/logout)
    whatsapp.js                        # notificacao WhatsApp via Twilio
    home/
      auth/
        auth.service.js                # logica de autenticacao (backend)
      gifts/
        gifts.service.js               # CRUD de presentes + notificacao (backend)
  pages/home/
    nav.html                           # navegacao
    hero.html                          # hero com foto do casal
    stats.html                         # banda de estatisticas
    about.html                         # sobre nos
    schedule.html                      # programacao do dia
    gifts/
      gifts.html                       # secao lista de presentes (container)
      gifts.css                        # grid + botao admin
    faq.html                           # duvidas frequentes
    pix.html                           # secao PIX
    footer.html                        # rodape com creditos
  components/
    auth-modal/                        # modal login/registro
    confirm-modal/                     # modal de confirmacao generico
    gift-card/                         # card de presente (renderizado do banco)
    gift-item/                         # modal detalhes do presente
    add-gift-modal/                    # modal adicionar/editar presente (admin)
```

## API

| Metodo | Rota                        | Descricao                     | Acesso  |
|--------|-----------------------------|-------------------------------|---------|
| POST   | `/api/auth`                 | Login / registro              | publico |
| GET    | `/api/gifts`                | Listar presentes              | publico |
| POST   | `/api/gifts`                | Adicionar presente            | admin   |
| POST   | `/api/gifts/:id/select`     | Selecionar presente           | logado  |
| POST   | `/api/gifts/:id/deselect`   | Desmarcar presente            | admin   |
| POST   | `/api/gifts/:id/update`     | Editar presente               | admin   |
| POST   | `/api/gifts/:id/delete`     | Excluir presente              | admin   |

## Admins padrao (seed)

| Nome        | Telefone     |
|-------------|------------- |
| LaryssaADM  | +557391306647|
| SamuelADM   | +557391154203|

## Creditos

Desenvolvido por **Narlan Menezes Aragao** — Engenheiro de Software.
