import axios from "axios";

export const sendMessage = async (payload, REACT_APP_BASE_URL) => {
    try {
        if (!payload) throw new Error("Payload missing");
        const res = await axios.post(`${REACT_APP_BASE_URL}/ai/chat`, payload);
        return res.data.reply;

    } catch (err) {
        throw err;
    }
}