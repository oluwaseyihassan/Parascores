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
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching leagues by date:", error);
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

