import { Report } from "../../@types/application";
import { api } from "../api";

export async function GetReportsInLocation(location: string, includeInfo?: boolean) {
    try {
        const reportsResponse = await api.post("/reports/search", {
            location: location,
            includeInfo: includeInfo
        })
        return reportsResponse.data as Array<Report>;
    } catch (error) {
        console.log(error)
        return error
    }
}