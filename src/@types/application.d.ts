export type User = {
    id: string;
    google_id: string;
    birthday: string;
    gender: string;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
    createdAt: string;
}

export type Profile = {
    id: number;
    username: string;
    image_url: string;
    defaultCity: string;
    level: number;
    experience: number;
    reports?: Array<Report>;
}

export type Report = {
    profile: Profile,
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
    comments: Array<Comment>,
}

export type Comment = {
    id: number;
    content: string;
    profile: Profile;
    Report: Report;
}