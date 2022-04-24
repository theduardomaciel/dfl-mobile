import { Report } from "../../@types/application";
import { api } from "../api";

export async function GetReportsInLocation(location: string) {
    try {
        const reportsResponse = await api.post("/reports/search", {
            location: location
        })
        return reportsResponse.data as Array<Report>;
    } catch (error) {
        console.log(error)
        return error
    }
}