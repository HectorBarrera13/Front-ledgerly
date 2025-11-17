export interface Pageable<T, C> {
    items: T[];
    nextCursor: C | null;
}
