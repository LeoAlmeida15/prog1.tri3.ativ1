import { db } from "./db";

//           Banco de Dados   HTTP
// [C]reate  insert           post
// [R]ead    select           get
// [U]pdate  update           put
// [U]pdate  update           patch
// [D]elete  delete           delete

const srv = Bun.serve({
    port: 3000,

    routes: {

        "/user": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM users
                `);

                const deResp = query.all();

                return Response.json(deResp);
            },

            POST: async (req) => {
                const body = await req.body.json();

                const query = db.query(`
                    INSERT INTO users(username, email, password_hash)
                    VALUES(:username, :email, :password_hash)
                `);

                const dbResp = query.run({
                    ":username": body.username,
                    ":email": body.email,
                    ":password_hash": body.password
                });

                return Response.json({
                    message: "Usuário criado com sucesso",
                    dbResp
                });
            }
        },

        "/user/:id": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM users
                    WHERE id=:_id_
                `);

                const deResp = query.get({
                    ":_id_": req.params.id
                });

                return Response.json(deResp);
            },

            PUT: async (req) => {
                const body = await req.body.json();

                const query = db.query(`
                    UPDATE users
                    SET username=:username,
                        email=:email,
                        password_hash=:password_hash
                    WHERE id=:_id_
                `);

                const dbResp = query.run({
                    ":_id_": req.params.id,
                    ":username": body.username,
                    ":email": body.email,
                    ":password_hash": body.password
                });

                return Response.json({
                    message: "Usuário modificado com sucesso",
                    dbResp
                });
            },

            DELETE: (req) => {
                const query = db.query(`
                    DELETE FROM users
                    WHERE id=:_id_
                `);

                const dbResp = query.run({
                    ":_id_": req.params.id
                });

                return Response.json({
                    message: "Usuário deletado com sucesso",
                    dbResp
                });
            }
        },

        "/receitas": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM receitas
                `);

                const deResp = query.all();

                return Response.json(deResp);
            },

            POST: async (req) => {
                const body = await req.body.json();

                const query = db.query(`
                    INSERT INTO receitas(
                        nome,
                        descricao,
                        ingredientes,
                        preparo,
                        categoria
                    )
                    VALUES(
                        :nome,
                        :descricao,
                        :ingredientes,
                        :preparo,
                        :categoria
                    )
                `);

                const dbResp = query.run({
                    ":nome": body.nome,
                    ":descricao": body.descricao,
                    ":ingredientes": body.ingredientes,
                    ":preparo": body.preparo,
                    ":categoria": body.categoria
                });

                return Response.json({
                    message: "Receita adicionada com sucesso",
                    dbResp
                });
            }
        },

        "/receitas/:id": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM receitas
                    WHERE id=:_id_
                `);

                const deResp = query.get({
                    ":_id_": req.params.id
                });

                return Response.json(deResp);
            },

            PUT: async (req) => {
                const body = await req.body.json();

                const query = db.query(`
                    UPDATE receitas
                    SET nome=:nome,
                        descricao=:descricao,
                        ingredientes=:ingredientes,
                        preparo=:preparo,
                        categoria=:categoria
                    WHERE id=:_id_
                `);

                const dbResp = query.run({
                    ":nome": body.nome,
                    ":descricao": body.descricao,
                    ":ingredientes": body.ingredientes,
                    ":preparo": body.preparo,
                    ":categoria": body.categoria,
                    ":_id_": req.params.id
                });

                return Response.json({
                    message: "Receita modificada com sucesso",
                    dbResp
                });
            },

            DELETE: (req) => {
                const query = db.query(`
                    DELETE FROM receitas
                    WHERE id=:_id_
                `);

                const dbResp = query.run({
                    ":_id_": req.params.id
                });

                return Response.json({
                    message: "Receita deletada com sucesso",
                    dbResp
                });
            }
        }
    }
});

console.log(`Server running: ${srv.url}`);
