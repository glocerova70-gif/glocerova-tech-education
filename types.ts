export interface SlideData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    ctaText?: string;
    secondaryCta?: {
        text: string;
        link: string;
    };
    researchLinks?: {
        title: string;
        link: string;
    }[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    isLoading?: boolean;
}

export enum Section {
    HOME = 'HOME',
    METHODOLOGY = 'METHODOLOGY',
    SCIENCE = 'SCIENCE',
    IMPACT = 'IMPACT',
    JOIN_US = 'JOIN_US'
}