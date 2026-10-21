import { db } from "./database.ts";

const srv = Bun.serve({
    port: 3000,

    routes: {
        "/": {
            GET: (req) => {
                const url = new URL(req.url);
                const search = url.searchParams;
                const nome = search.get("nome");

                console.log(nome);

                return new Response("oi " + nome);
            },
        },

        "/pessoa/:id": {
            GET: (req) => {
                return new Response(`oi ${req.params.id}`);
            }
        },

        "/test": {
            GET: (req) => {
                const url = new URL(req.url);
                const search = url.searchParams;
                const nome = search.get("nome");

                console.log(nome);

                return new Response("LeoAlm3ida_GET");
            },

            POST: async (req) => {
                const body = await req.text();
                console.log(body);

                return new Response("LeoAlm3ida_POST");
            },

            PUT: () => new Response("LeoAlm3ida_PUT"),

            DELETE: () => new Response("LeoAlm3ida_DELETE")
        },

        "/cadastro": {
            GET: () => {
                return new Response(Bun.file("cadastro.html"));
            },

            POST: async (req) => {
                const body = await req.json();

                const { username, email, password } = body;

                if (!username || !email || !password) {
                    return new Response("Preencha todos os campos", {
                        status: 400
                    });
                }

                if (password.length < 6) {
                    return new Response("A senha deve ter pelo menos 6 caracteres", {
                        status: 400
                    });
                }

                try {
                    const passwordHash = await Bun.password.hash(password);

                    db.query(`
                        INSERT INTO users (username, email, password_hash)
                        VALUES (?, ?, ?)
                    `).run(username, email, passwordHash);

                    return new Response("Cadastro realizado com sucesso!", {
                        status: 201
                    });
                } catch {
                    return new Response("Usuário ou e-mail já cadastrado", {
                        status: 409
                    });
                }
            }
        }
    }
});

console.log(`Servidor rodando: ${srv.url}`);


