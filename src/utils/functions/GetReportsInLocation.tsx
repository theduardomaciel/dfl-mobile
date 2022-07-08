import { Report } from "../../@types/application";
import { api } from "../api";

export async function GetReportsInLocation(location: string, includeInfo?: boolean) {
    try {
        const searchString = `/report?location=${location}${includeInfo ? "&includeInfo=true" : ""}`
        console.log(searchString, location, includeInfo)
        const reportsResponse = await api.get(searchString)
        if (reportsResponse.status === 200) {
            const reports = reportsResponse.data as Array<Report>
            return reports
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}