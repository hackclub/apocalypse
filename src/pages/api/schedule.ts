import { createClient } from "@supabase/supabase-js";
import ical, { type CalendarResponse, type VEvent } from "node-ical";

// const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SECRET);

type Event = {
    name: string,
    type?: string,
    location?: string,
    description?: string,
    start: Date,
    end: Date,
    fullDay: boolean,
};

type Milestone = {
    name: string,
    date: Date,
};

type EventResponse = EventsSuccess | EventError;

type EventsSuccess = {
    ok: true,
    last_updated: Date,
    events: Event[],
    milestones: Milestone[],
};

type EventError = {
    ok: false,
    message: string,
    details?: string,
};

async function fetchEvents(): Promise<EventResponse> {
    let schd: CalendarResponse;

    try {
        schd = await ical.async.fromURL(import.meta.env.ICAL_URL);
    } catch (e) {
        console.error(e);
        return {
            ok: false,
            message: "Failed to fetch calendar",
            details: e.message,
        }
    }

    let events = Object.values(schd).map((event) => {
        if (event.type !== "VEVENT") {
            return;
        }
        if (!event.start || !event.end || !event.summary) {
            return;
        }

        const splitted = event.summary.split("-")
        let type;
        let name = event.summary;

        if (splitted.length > 1) {
            type = splitted[0].trim().toLowerCase();
            name = splitted.slice(1).join("-").trim();
        }

        return {
            name,
            type,
            location: event.location,
            description: event.description,
            start: event.start,
            end: event.end,
            fullDay: event.datetype === "date",
        };
    }).filter(event => event);

    let milestones = events.filter(event => event.type === "milestone").map(event => {
        return {
            name: event.name,
            date: event.start,
        };
    });

    events = events.filter(event => event.type != "milestone");

    return {
        ok: true,
        last_updated: new Date(),
        events: events,
        milestones: milestones,
    };
}

export async function GET() {

    // const { data, error } = await supabase.from("events").select("*").eq("id", "cache");
    // if (error) {
    if (true) {
        // console.error("Failed to fetch from supabase, not using cache", error);

        const events = await fetchEvents();
        if (events.ok == false) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    message: "Failed to fetch events",
                    details: events.message,
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache, must-revalidate"
                    },
                },
            );
        }

        const expires = new Date(events.last_updated);
        expires.setMinutes(expires.getMinutes() + 1);

        return new Response(
            JSON.stringify(events),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Last-Modified": events.last_updated.toUTCString(),
                    "Cache-Control": "public, must-revalidate",
                    "Expires": expires.toUTCString(),
                },
            },
        );
    }

    // if (data.length == 0) {
    //     console.warn("No cache found in supabase, fetching events");
    //     const events = await fetchEvents();
    //     if (events.ok == false) {
    //         return new Response(
    //             JSON.stringify({
    //                 ok: false,
    //                 message: "Failed to fetch events",
    //                 details: events.message,
    //             }),
    //             {
    //                 status: 500,
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Cache-Control": "no-cache, must-revalidate"
    //                 },
    //             },
    //         );
    //     }

    //     await supabase.from("events").upsert({ id: "cache", last_updated: events.last_updated, events: events.events, milestones: events.milestones })

    //     const expires = new Date(events.last_updated);
    //     expires.setMinutes(expires.getMinutes() + 1);

    //     return new Response(
    //         JSON.stringify(events),
    //         {
    //             status: 200,
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Last-Modified": events.last_updated.toUTCString(),
    //                 "Cache-Control": "public, must-revalidate",
    //                 "Expires": expires.toUTCString(),
    //             },
    //         },
    //     );
    // }

    // let events = {
    //     ok: true,
    //     last_updated: new Date(data[0].last_updated),
    //     events: data[0].events,
    //     milestones: data[0].milestones
    // } as EventsSuccess;

    // if (events.last_updated.getTime() + 60000 <= Date.now()) {
    //     const newEvents = await fetchEvents();
    //     if (newEvents.ok == false) {
    //         return new Response(
    //             JSON.stringify({
    //                 ok: false,
    //                 message: "Failed to fetch events",
    //                 details: newEvents.message,
    //             }),
    //             {
    //                 status: 500,
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Cache-Control": "no-cache, must-revalidate"
    //                 },
    //             },
    //         );
    //     }

    //     await supabase.from("events").upsert({ id: "cache", last_updated: newEvents.last_updated, events: newEvents.events, milestones: newEvents.milestones })

    //     events = newEvents;
    // }

    // const expires = new Date(events.last_updated);
    // expires.setMinutes(expires.getMinutes() + 1);

    // return new Response(
    //     JSON.stringify(events),
    //     {
    //         status: 200,
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Last-Modified": events.last_updated.toUTCString(),
    //             "Cache-Control": "public, must-revalidate",
    //             "Expires": expires.toUTCString(),
    //         },
    //     },
    // );
}
