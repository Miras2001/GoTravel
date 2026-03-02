import axios from "axios";

export const getPlacesData = async (type, sw, ne) => {
    try {
        console.log(`Fetching ${type} data with bounds:`, { sw, ne });
        
        const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
                limit: '30',
                currency: 'USD',
                lunit: 'km',
                lang: 'en_US'
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY2,
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            }
        });

        console.log(`Received ${data?.length || 0} ${type} results`);
        return data;
    } catch (error) {
        console.error(`Error fetching ${type}:`, error.response?.data || error.message);
        return [];
    }
}

