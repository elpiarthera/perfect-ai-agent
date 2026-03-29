import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAudioUrl = query({
  args: { slug: v.string(), locale: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("audioFiles")
      .withIndex("by_slug_locale", (q) =>
        q.eq("slug", args.slug).eq("locale", args.locale)
      )
      .unique();
    if (!record) return null;
    return await ctx.storage.getUrl(record.storageId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveAudioFile = mutation({
  args: {
    slug: v.string(),
    locale: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
  },
  returns: v.id("audioFiles"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("audioFiles")
      .withIndex("by_slug_locale", (q) =>
        q.eq("slug", args.slug).eq("locale", args.locale)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        filename: args.filename,
      });
      return existing._id;
    }
    return await ctx.db.insert("audioFiles", {
      slug: args.slug,
      locale: args.locale,
      storageId: args.storageId,
      filename: args.filename,
    });
  },
});
