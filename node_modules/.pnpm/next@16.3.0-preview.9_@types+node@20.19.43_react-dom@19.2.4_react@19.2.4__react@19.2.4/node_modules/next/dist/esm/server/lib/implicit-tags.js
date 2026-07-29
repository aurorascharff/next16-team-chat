import { NEXT_CACHE_IMPLICIT_TAG_ID } from '../../lib/constants';
import { getCacheHandlerEntries } from '../use-cache/handlers';
import { encodeCacheTag } from './encode-cache-tag';
import { createLazyResult } from './lazy-result';
const getDerivedTags = (pathname)=>{
    const derivedTags = [
        `/layout`
    ];
    // we automatically add the current path segments as tags
    // for revalidatePath handling
    if (pathname.startsWith('/')) {
        const pathnameParts = pathname.split('/');
        for(let i = 1; i < pathnameParts.length + 1; i++){
            let curPathname = pathnameParts.slice(0, i).join('/');
            if (curPathname) {
                // all derived tags other than the page are layout tags
                if (!curPathname.endsWith('/page') && !curPathname.endsWith('/route')) {
                    curPathname = `${curPathname}${!curPathname.endsWith('/') ? '/' : ''}layout`;
                }
                derivedTags.push(curPathname);
            }
        }
    }
    return derivedTags;
};
/**
 * Creates a map with lazy results that fetch the expiration value for the given
 * tags and respective cache kind when they're awaited for the first time.
 */ function createTagsExpirationsByCacheKind(tags) {
    const expirationsByCacheKind = new Map();
    const cacheHandlers = getCacheHandlerEntries();
    if (cacheHandlers) {
        for (const [kind, cacheHandler] of cacheHandlers){
            if ('getExpiration' in cacheHandler) {
                expirationsByCacheKind.set(kind, createLazyResult(async ()=>cacheHandler.getExpiration(tags)));
            }
        }
    }
    return expirationsByCacheKind;
}
export async function getImplicitTags(page, pathname, fallbackRouteParams) {
    const tags = new Set();
    // Add the derived tags from the page. Encode each tag so a non-ASCII
    // pathname doesn't trip header validation when written to
    // `x-next-cache-tags`. Idempotent on already-ASCII input.
    const derivedTags = getDerivedTags(page);
    for (let tag of derivedTags){
        tag = encodeCacheTag(`${NEXT_CACHE_IMPLICIT_TAG_ID}${tag}`);
        tags.add(tag);
    }
    // Add the tags from the pathname. If the route has unknown params, we don't
    // want to add the pathname as a tag, as it will be invalid.
    if (pathname && (!fallbackRouteParams || fallbackRouteParams.size === 0)) {
        const tag = encodeCacheTag(`${NEXT_CACHE_IMPLICIT_TAG_ID}${pathname}`);
        tags.add(tag);
    }
    if (tags.has(`${NEXT_CACHE_IMPLICIT_TAG_ID}/`)) {
        tags.add(`${NEXT_CACHE_IMPLICIT_TAG_ID}/index`);
    }
    if (tags.has(`${NEXT_CACHE_IMPLICIT_TAG_ID}/index`)) {
        tags.add(`${NEXT_CACHE_IMPLICIT_TAG_ID}/`);
    }
    const tagsArray = Array.from(tags);
    return {
        tags: tagsArray,
        expirationsByCacheKind: createTagsExpirationsByCacheKind(tagsArray)
    };
}

//# sourceMappingURL=implicit-tags.js.map