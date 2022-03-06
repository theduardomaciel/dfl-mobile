export type User = {
    id: number;
    google_id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
    reports: Array<Report>;
    createdAt: string;
}

export type Profile = {
    username: string;
    image_url: string;
    defaultCity: string;
    level: number;
    experience: number;
}

export type Report = {
    id: number,
    createdAt: string,
    address: string,
    coordinates: Array<number>,
    image_url: string,
    image_deleteHash: string,
    tags: string,
    suggestion: string,
    hasTrashBins: boolean,

    ratings: Array<number>,
    resolved: boolean,
    comments: Comment
}

export type Comment = {
    id: number;
    content: string;
    profile: Profile;
    Report: Report;
}