import { User } from "../../@types/application";
import { api } from "../api";

export async function GetUserWithVersion() {
    try {
        const userResponse = await api.post("/user", {
            user_id: "f01b34e6-6254-4827-8dc6-0d183cc63939"
        })
        const userData = userResponse.data as User
        return userData.gender
    } catch (error) {
        console.log(error)
        return "error"
    }
}