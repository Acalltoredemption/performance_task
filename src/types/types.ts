export interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    middle_initial: string | null;
    verified: boolean;
    created_at: string;
    district: any;
    active: boolean;
}

export interface FilterData {
    activeToggle: boolean,
        district: string
}
