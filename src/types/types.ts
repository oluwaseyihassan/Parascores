export type League = {
    id: number;
    name: string;
    image_path: string | null;
    type: string;
    category: number;
    short_code: string | null;
    inplay: Today[] | null;
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
    events: Events[] | null;
    lineups: LineUp[] | null;
    metadata: MetaData[] | null;
    statistics: Statistics[] | null;
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
    starting_at: string | null;
    state: State | null;
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
    ticking: boolean;

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
    participant_id: number
    addition: string | null
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

export type LineUp = {
    id: number;
    fixture_id: number;
    player_id: number;
    team_id: number;
    position_id: number;
    formation_field: string | null;
    type_id: number;
    player_name: string;
    jersey_number: number | null;
    formation_position: number | null;
    player: {
        id: number;
        common_name: string | null;
        image_path: string | null;
        gender: string | null;
    },
    details: {
        id: number;
        data: {
            value: number | null;
        },
        type: {
            id: number;
            name: string | null;
            developer_name: string | null;
            model_type: string | null;
        }
    },
    type: {
        id: number;
        name: string | null;
        developer_name: string | null;
        model_type: string | null;
    },
   

}

export type Type = {
    id: number;
    name: string | null;
    developer_name: string | null;
    model_type: string | null;

}

export type MetaData = {
        id: number;
        type: Type;
       values: {
        home: string | null;
        away: string | null
       }
}

export type Statistics = {
    id: number;
    fixture_id: number;
    type_id: number;
    participant_id: number;
    data: {
        value: number
    }
    location: string;
    type: {
        id: number;
        name: string | null;
        developer_name: string | null;
        model_type: string | null;
        stat_group: string | null;
    }
}