export type League = {
    id: number;
    name: string;
    image_path: string | null;
    type: string;
    category: number;
    short_code: string | null;
    inplay: Inplay[] | null;
    today: Today[] | null;
    country: Country | null;
}

export type Today = {
    id: number;
    name: string | null;
    starting_at: string | null;
    participants: Participants[] | null;
    round: Round | null;
    state: State | null;
    scores: Scores[] | null;
    periods: Periods[] | null;

}

export type Inplay = {
    id: number;
    name: string | null;
}

export type Pagination = {
    count: number;
    current_page: number;
    has_more: boolean;
    per_page: number;
    next_page: number | null;
}

export type Country = {
    id: number;
    name: string;
    image_path: string | null;
}

export type Participants = {
    id: number;
    name: string;
    image_path: string | null;
    short_code: string | null;
    gender: string | null;
   meta: {
    location: string | null;
    winner: boolean | null;
    position: number;
   }
}

export type Round = {
    id: number;
    name: string | null;
    league_id: number | null;


}

export type State = {
    id: number;
    name: string | null;
    state: string | null;
    developer_name: string | null;
    short_name: string | null;
}

export type Fixture = {
    id: number;
    events: Events[] | null;
    participants: Participants[] | null;
    scores: Scores[] | null;
}

export type Scores = {
    id: number;
    score: {
        goals: number;
        participant: string
    }
    description: string | null;
}

export type Periods = {
    id: number;
    started: number;
    ended: number;
    sort_order: number;
    time_added: number | null;
    minutes: number;
    seconds: number;
    has_timer: boolean;
    counts_from: number;

}

export type Events = {
    id: number;
    minute: number | null;
    extra_minute: number | null;
    player_name: string;
    related_player_name: string | null
    result: string | null;
    info: string | null
    sort_order: number
    type: {
        id: number;
        name: string | null;
        developer_name: string | null;
        model_type: string | null;
    }
    subtype: {
        id: number;
        name: string | null;
        developer_name: string | null;
        model_type: string | null;
    } | null;
}