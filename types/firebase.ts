export interface FirebaseUser {
    id?: string;
    name?: string;
    email?: string;
    emailVerified?: Date | any;
    image?: string;
    password?: string;
    role: string; // default "ADMIN"
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    image?: string;
    category?: string;
    readTime?: string; // default "5 dk"
    status: string; // default "published"
    views: number; // default 0
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Client {
    id?: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    logo_url?: string;
    status: string; // active, potential, inactive
    order: number;
    tags: string[];
    notes?: string;
    totalRevenue: number;
    totalPaid: number;
    balance: number;
    lastTransactionDate?: Date | any;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface ContentSection {
    type: "2-square" | "3-square" | "3-vertical-9-16";
    media: {
        url: string;
        type: "image" | "video";
    }[];
}

export interface Project {
    id?: string | number;
    clientId?: string;
    internalName?: string;
    publicTitle?: string;
    slug?: string;
    description?: string;
    desc?: string; // compatibility
    content?: string;

    name?: string; // deprecated
    title?: string; // deprecated

    status: string; // in_progress, pending, completed
    category?: string;
    categories: string[];
    order: number;

    budget?: number;
    actualCost: number;
    startDate?: Date | any;
    endDate?: Date | any;
    priority: string;
    progress: number;

    image?: string;
    gallery: any[];
    files: any[];

    heroImage?: string;
    heroVideo?: string;
    year?: string;
    services: any[];
    contentBlocks: ContentSection[]; // Updated type

    client?: string; // For case study page
    clientInfo?: any;
    market?: string;
    industry?: string;
    clientType?: string;
    websiteUrl?: string;
    notes?: string;

    isLabProject: boolean;
    thumbnail?: string;
    liveUrl?: string;
    tags: string[];

    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Task {
    id?: string;
    projectId?: string;
    userId?: string;
    assignedTo?: string; // legacy string/ref
    title: string;
    description?: string;
    status: string; // todo, in_progress, done
    priority: string; // low, medium, high
    dueDate?: Date | any;
    completedAt?: Date | any;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface TaskAttachment {
    id?: string;
    taskId: string;
    name: string;
    url: string;
    type?: string;
    size?: number;
    createdAt?: Date | any;
}

export interface Income {
    id?: string;
    clientId?: string;
    projectId?: string;
    amount: number;
    date: Date | any;
    category: string; // payment, deposit, refund
    paymentMethod?: string;
    invoiceNumber?: string;
    description?: string;
    status: string; // paid, pending
    isPaid: boolean;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Expense {
    id?: string;
    amount: number;
    date: Date | any;
    category: string;
    description?: string;
    invoiceNumber?: string;
    vendor?: string;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Payable {
    id?: string;
    vendorName: string;
    amount: number;
    dueDate?: Date | any;
    status: string; // pending, paid
    category?: string;
    description?: string;
    paidDate?: Date | any;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Receivable {
    id?: string;
    clientName: string;
    amount: number;
    dueDate?: Date | any;
    status: string; // pending, paid
    description?: string;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface ClientTransaction {
    id?: string;
    clientId: string;
    type: string; // invoice, payment, refund
    amount: number;
    description?: string;
    referenceId?: string;
    transactionDate: Date | any;
    createdAt?: Date | any;
}

export interface Service {
    id?: string;
    title: string;
    slug: string;
    description?: string;
    icon?: string;
    status: string; // Aktif, Pasif
    views: number;
    projectsCount: number;
    createdAt?: Date | any;
}

export interface Message {
    id?: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt?: Date | any;
}

export interface Setting {
    id?: string;
    key: string;
    value: any;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Page {
    id?: string;
    title: string;
    slug: string;
    content?: string;
    status: string; // published, draft
    createdAt?: Date | any;
    updatedAt?: Date | any;
}

export interface Testimonial {
    id?: string;
    author: string;
    role?: string;
    company?: string;
    content: string;
    avatarUrl?: string;
    rating: number; // default 5
    order: number;
    isActive: boolean;
    createdAt?: Date | any;
    updatedAt?: Date | any;
}
