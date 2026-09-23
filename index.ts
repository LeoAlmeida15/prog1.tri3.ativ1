const srv = Bun.serve({
    port: 3000,
    routes: {
        "/": {
            GET: (a) => {
                const url = new URL(a.url)
                const search = url.searchParams
                const nome = search.get("nome")
                console.log(nome)
                return new Response("oi " + nome)
            },
        },

        "/pessoa/:id": {
            GET: (req) => {
            return new Response(`oi ${req.params.id}`)
            }
        },

        "/test": {
            GET: (req) => {
                const url = new URL(req.url)
                const search = url.searchParams
                const nome = search.get("nome")
                console.log(nome)
                return new Response("LeoAlm3ida_GET")
            },

            POST: async (req) => {
                const body = await req.body.text()
                console.log(body)
                return new Response("LeoAlm3ida_POST")
            },

            PUT: () => new Response("LeoAlm3ida_PUT"),
            DELETE: () => new Response("LeoAlm3ida_DELETE")
        }
    }
})

console.log(`Server running: ${srv.url}`)
