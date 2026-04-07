import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

import { getCategoryPathParts } from "@utils/category";
import { parseTags } from "@utils/tag";


// Helper for handling dates that might be empty strings from JSON
const dateSchema = z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    return arg;
}, z.coerce.date());
const optionalDateSchema = z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() === "") return undefined;
    return arg;
}, z.coerce.date().optional());

const categorySchema = z.preprocess((arg) => {
    const parts = getCategoryPathParts(arg as any);
    return parts ?? arg;
}, z.union([z.string(), z.array(z.string())]).optional().nullable().default(""));

const tagsSchema = z.preprocess((arg) => {
    return parseTags(arg);
}, z.array(z.string()).optional().default([]));

const postsCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        published: dateSchema,
        updated: optionalDateSchema,
        description: z.string().optional().default(""),
        cover: z.string().optional().default(""),
        coverInContent: z.boolean().optional().default(false),
        category: categorySchema,
        tags: tagsSchema,
        lang: z.string().optional().default(""),
        pinned: z.boolean().optional().default(false),
        author: z.string().optional().default(""),
        sourceLink: z.string().optional().default(""),
        licenseName: z.string().optional().default(""),
        licenseUrl: z.string().optional().default(""),
        comment: z.boolean().optional().default(true),
        draft: z.boolean().optional().default(false),

        /* Page encryption fields */
        encrypted: z.boolean().optional().default(false),
        password: z.string().optional().default(""),

        /* Custom routeName */
        routeName: z.string().optional(),

        /* For internal use */
        prevTitle: z.string().default(""),
        prevSlug: z.string().default(""),
        nextTitle: z.string().default(""),
        nextSlug: z.string().default(""),
    }),
});

const specCollection = defineCollection({
    loader: glob({ pattern: '[^_]*.{md,mdx}', base: "./src/content" }),
    schema: z.object({}),
});

// export const collections = {
//     posts: postsCollection,
//     spec: specCollection,
// };

// 👇 从这里开始是你新加的代码：定义 notesCollection
const notesCollection = defineCollection({
    // 注意看这里！它会去专门读取 src/content/notes 文件夹下的 markdown 文件
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/notes" }),
    // 为了省事和统一，这里的 schema 直接完全照抄 postsCollection 的
    schema: z.object({
        title: z.string(),
        published: dateSchema,
        updated: optionalDateSchema,
        description: z.string().optional().default(""),
        cover: z.string().optional().default(""),
        coverInContent: z.boolean().optional().default(false),
        category: categorySchema,
        tags: tagsSchema,
        lang: z.string().optional().default(""),
        pinned: z.boolean().optional().default(false),
        author: z.string().optional().default(""),
        sourceLink: z.string().optional().default(""),
        licenseName: z.string().optional().default(""),
        licenseUrl: z.string().optional().default(""),
        comment: z.boolean().optional().default(true),
        draft: z.boolean().optional().default(false),
        encrypted: z.boolean().optional().default(false),
        password: z.string().optional().default(""),
        routeName: z.string().optional(),
        prevTitle: z.string().default(""),
        prevSlug: z.string().default(""),
        nextTitle: z.string().default(""),
        nextSlug: z.string().default(""),
    }),
});

// 👇 最后，记得在导出列表里把 notes 加上！
export const collections = {
    posts: postsCollection,
    spec: specCollection,
    notes: notesCollection, // 添加了这一行
};