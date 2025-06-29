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
    currentseason: {
        id: number;
        name: string | null
    }
    seasons: {
        id: number;
        name: string | null
    }[]
}

export type LeagueType = {
    league: League
}

export type Today = {
    id: number;
    name: string | null;
    starting_at: string | null;
    season_id: number | null;
    participants: Participants[] | null;
    round: Round | null;
    state: State | null;
    scores: Scores[] | null;
    periods: Periods[] | null;
    events: Events[] | null;
    lineups: LineUp[] | null;
    metadata: MetaData[] | null;
    statistics: Statistics[] | null;
    comments: Comments[] | null
    league: {
        id: number;
        name: string;
        image_path: string | null
    }
    venue: VenueType | null;
}

export type  VenueType = {
    id: number;
    name: string | null;
    latitude: string | null;
    longitude: string | null;
    image_path: string | null;
    city_name: string | null
    capacity: number | null
    surface: string | null
    city: string | null
    address: string | null
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
    official_name: string | null;
    latitude: string | null;
    longitude: string | null;
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
    participant_id: number
    points: number
    position: number
    result: string
    round_id: number
    season_id: number
    stage: {
        starting_at: string | null;
        ending_at: string | null
        sort_order: number
        id: number
    }
    participant: {
        id: number
        name: string | null
    }
    
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
    periods: Periods[]
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
    description: string

}

export type Events = {
    id: number;
    minute: number | null;
    extra_minute: number | null;
    player_name: string;
    player_id: number
    related_player_name: string | null
    related_player_id: number | null;
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
    period: Periods
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
        firstname: string | null;
        lastname: string | null;
        display_name: string | null
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
    }[],
    type: {
        id: number;
        name: string | null;
        developer_name: string | null;
        model_type: string | null;
    },
   

}

export type Comments = {
    id: number;
    fixture_id: number;
    comment: string | null;
    minute: number | null;
    extra_minute: number | null;
    is_goal: boolean | null;
    is_important: boolean | null;
    order: number | null;
    player: Player | null;
}

export type Type = {
    id: number;
    name: string | null;
    developer_name: string | null;
    model_type: string | null;
    stat_group: string | null;
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

export type StandingType = {
    id: number;
    league_id: number;
    season_id: number;
    position: number;
    result: string | null;
    points: number ;
    participant: {
        id: number;
        name: string;
        short_code: string | null;
        image_path: string | null;
        type: string | null;
        country_id: number | null;
    }
    stage: {
        id: number;
        name: string | null;
        league_id: number | null;
        season_id: number | null;
        sort_order: number | null;
        is_current: boolean | null;
    }
    details: {
        id: number;
        value: number | null;
        standing_type: string | null;
        type: {
            id: number;
            name: string | null;
            developer_name: string | null;
            model_type: string | null;
            stat_group: string | null;
        }

    }[]
    rule: {
        id: number;
        position: number | null;
        model_type: string | null;
        type: {
            id: number;
            name: string | null;
            developer_name: string | null;
            model_type: string | null;
            stat_group: string | null;
        }

    }
    group: {
        id: number;
        name: string | null;
    } | null
    form: {
        id: number;
        form: string | null;
        sort_order: number | null;
        fixture_id: number | null;
        fixture: {
            id: number;
            name: string | null;
            result_info: string | null;
        }

    }[]
}

export type TopScorersType = {
    id: number;
    season_id: number;
    player_id: number;
    total: number;
    position: number;
    participant_id: number;
    participant: Participants
    player: {
        id: number;
        sport_id: number;
        common_name: string | null;
        firstname: string | null;
        image_path: string | null;
        lastname: string | null;
        position: Type | null
    }
}

export type TeamType = {
    id: number;
    country_id: number;
    name: string;
    short_code: string | null;
    image_path: string | null;
    type: string | null;
    founded: number | null;
    venue_id: number | null;
    country: Country | null;
    rivals: {
        id: number;
        name: string | null;
        image_path: string | null;
        type: string | null;
        country_id: number | null;
        short_code: string | null;
        founded: number | null;
        venue_id: number | null;
    }[] | null;
    players: {
        id: number;
        name: string | null;
        jersey_number: number | null;
        player: {
            id: number;
            common_name: string | null;
            firstname: string | null;
            lastname: string | null;
            name: string | null;
            display_name: string | null;
            height: number | null;
            weight: number | null;
            date_of_birth: string | null;
            image_path: string | null;
            gender: string | null;
        }
        position: {
            id: number;
            name: string | null;
            developer_name: string | null;
            model_type: string | null;
            stat_group: string | null;
        }
    }[] | null;
    latest: {
        id: number;
        name: string | null;
        result_info: string | null;
        starting_at: string | null;
        leg: string | null;
        meta: {
            location: string | null;
        }
        scores: {
            id: number;
            participant_id: number;
            score: {
                goals: number;
                participant: string
            }
            description: string | null;
        }
    }[] | null;
    upcoming: {
        id: number;
        name: string | null;
        result_info: string | null;
        starting_at: string | null;
        leg: string | null;
        meta: {
            location: string | null;
        }
    }[] | null;
    seasons: {
        id: number;
        name: string | null;
        league_id: number | null;
        finished: boolean | null;
        is_current: boolean | null;
    }[] | null;
    activeseasons: {
        id: number;
        name: string | null;
        league_id: number | null;
        finished: boolean | null;
        is_current: boolean | null;
    }[] | null;
    statistics: {
        id: number;
        season_id: number;
        
    }[] | null;
    socials: {
        id: number;
        value: string | null;
        channel: {
            id: number;
            name: string | null;
            base_url: string | null;
            hex_color: string | null;
        } | null;
    }[] | null;
    rankings: {
        id: number;
        position: number | null;
        points: number | null;
        type: string | null
    }[] | null;
}


export type Player = {
    id: number;
    sport_id: number;
    country_id: number | null;
    nationality_id: number | null;
    city_id: number | null;
    position_id: number | null;
    detailed_position_id: number | null;
    type_id: number | null;
    common_name: string | null;
    firstname: string | null;
    lastname: string | null;
    name: string | null;
    display_name: string | null;
    image_path: string | null;
    height: number | null;
    weight: number | null;
    date_of_birth: string | null;
    gender: string | null;
}