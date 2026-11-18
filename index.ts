import { db } from "./database.ts";

const srv = Bun.serve({
    port: 3000,

    routes: {
        "/": {
            GET: () => new Response(Bun.file("cadastro.html"))
        },

        "/cadastro": {
            POST: async (req) => {
                const body = await req.json();

                const { username, email, password } = body;

                if (!username || !email || !password) {
                    return new Response("Preencha todos os campos", {
                        status: 400
                    });
                }

                const passwordHash = await Bun.password.hash(password);

                try {
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