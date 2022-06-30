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
    level: number;
    experience: number;
    reports?: Array<Report>;
    ratings: any;
}

export type Report = {
    profile: Profile,
    id: number,
    createdAt: string,
    address: string,
    coordinates: Array<string>,
    image_url: string,
    image_deleteHash: string,
    tags: string,
    suggestion: string,
    hasTrashBins: boolean,

    profile_id: number,

    note1: number,
    note2: number,
    note3: number,
    note4: number,
    note5: number,

    resolved: boolean,
    comments: Array<Comment>,
}

export type Comment = {
    id: number;
    content: string;
    profile: Profile;
    Report: Report;
    createdAt: string;
}

export type Region = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}