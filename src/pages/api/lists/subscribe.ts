type SubscribeBody = {
    email: string;
}

export async function POST({ request }) {
    // Check for valid request body
    if (!request.body) {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 400 }
        )
    }
    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 400 }
        )
    }
    if (typeof body['email'] != "string") {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 400 }
        )
    }
    body = body as SubscribeBody;

    // Timeout after 5 seconds
    setTimeout(() => {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 500 },
        )
    }, 5000);

    let res: Response;

    try {
        res = await fetch("https://postal.hackclub.com/subscribe", {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: `email=${encodeURIComponent(body.email)}&hp=&list=YAbJpY892wYYel892gyGNghouQ&subform=yes`,
            method: "POST"
        });
    } catch {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 500 }
        )
    }
    if (res.redirected && (res.url == "https://www.apohacks.com/lists/success" || res.url == "https://www.apohacks.com/lists/prevsub")) {
        return new Response(
            JSON.stringify({ success: true }),
            { headers: { "Content-Type": "application/json", }, status: 200 }
        )
    } else {
        return new Response(
            JSON.stringify({ success: false }),
            { headers: { "Content-Type": "application/json", }, status: 500 }
        )
    }
}