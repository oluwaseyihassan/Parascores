import api from "./api";

export const getLeagues = async (page: number,per_page: number,includes: string) => {
    try {
    const response = await api.get(`/leagues?per_page=${per_page}&page=${page}&includes=${includes}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching leagues:", error);
        throw error;
    }
}

export const getLeaguesByDate = async (date: string,page: number,per_page: number, includes: string) => {
    try {
        const response = await api.get(`/leagues/date/${date}?page=${page}&per_page=${per_page}&includes=${includes}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching leagues by date:", error);
        throw error;
    }
}

export const getLeagueById = async (id: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/leagues/${id}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching league by ID:", error);
        throw error;
    }

}

export const getFixtureById = async (id: number, includes: string,filters: string) => {
    try {
        const response = await api.get(`/fixtures/${id}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching fixture by ID:", error);
        throw error;
    }
}

export const getStandinsBySeasonId = async (seasonId: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/standings/seasons/${seasonId}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching standings by season ID:", error);
        throw error;
    }
}

export const getStandinsByRoundId = async (roundId: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/standings/rounds/${roundId}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching standings by round ID:", error);
        throw error;
    }
}

export const getHeadToHead = async (team1Id: number, team2Id: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/fixtures/headtohead/${team1Id}/${team2Id}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching head-to-head data:", error);
        throw error;
    }
}

export const getTopScorersById = async (season_id: number, page: number, per_page: number , includes: string, filters: string) => {
    try {
        const response = await api.get(`/topscorers/seasons/${season_id}?page=${page}&per_page=${per_page}&includes=${includes}&filters=${filters}`)
        return response.data
    } catch (error) {
        console.log("Error fetching top scorers by season ID:", error)
        throw error
    }
}

export const getTeamById = async (id: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/teams/${id}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching team by ID:", error);
        throw error;
    }
}

export const getTeamFixturesByDateRange = async (teamId: number, startDate: string, endDate: string, includes: string, filters: string) => {
    try {
        const response = await api.get(`/fixtures/between/${startDate}/${endDate}/${teamId}?includes=${includes}&filters=${filters}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching team fixtures by date range:", error);
        throw error;
    }
}


export const getRoundsBySeasonId = async (seasonId: number, includes: string, filters: string) => {
    try {
        const response = await api.get(`/rounds/seasons/${seasonId}?includes=${includes}&filters=${filters}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching rounds by season ID:", error);
        throw error;
    }
}