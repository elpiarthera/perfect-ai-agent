import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all approved wall responses, newest first.
 */
export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("wallResponses"),
      _creationTime: v.number(),
      modelName: v.string(),
      responseText: v.string(),
      pullQuote: v.string(),
      source: v.union(v.literal("benchmark"), v.literal("community")),
      status: v.union(
        v.literal("approved"),
        v.literal("pending"),
        v.literal("rejected")
      ),
      submitterName: v.optional(v.string()),
      submittedAt: v.number(),
      approvedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("wallResponses")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .collect();
  },
});

/**
 * Get a single response by ID.
 */
export const getById = query({
  args: { id: v.id("wallResponses") },
  returns: v.union(
    v.object({
      _id: v.id("wallResponses"),
      _creationTime: v.number(),
      modelName: v.string(),
      responseText: v.string(),
      pullQuote: v.string(),
      source: v.union(v.literal("benchmark"), v.literal("community")),
      status: v.union(
        v.literal("approved"),
        v.literal("pending"),
        v.literal("rejected")
      ),
      submitterName: v.optional(v.string()),
      submittedAt: v.number(),
      approvedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Submit a new community response (status: pending).
 * Validates: modelName required, responseText 200-50000 chars.
 */
export const submit = mutation({
  args: {
    modelName: v.string(),
    responseText: v.string(),
    submitterName: v.optional(v.string()),
  },
  returns: v.id("wallResponses"),
  handler: async (ctx, args) => {
    // Validate modelName is not empty
    if (!args.modelName.trim()) {
      throw new Error("Model name is required");
    }

    // Validate responseText length: 200-50000 chars
    if (args.responseText.length < 200) {
      throw new Error("Response must be at least 200 characters");
    }
    if (args.responseText.length > 50000) {
      throw new Error("Response must be under 50,000 characters");
    }

    // Auto-extract pull quote: first sentence over 40 chars, or first 150 chars
    const sentences = args.responseText
      .replace(/\*\*[^*]+\*\*/g, "") // strip markdown bold
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 40);
    const pullQuote = sentences.length > 0
      ? sentences[0] + "."
      : args.responseText.slice(0, 150) + "...";

    return await ctx.db.insert("wallResponses", {
      modelName: args.modelName.trim(),
      responseText: args.responseText,
      pullQuote,
      source: "community",
      status: "pending",
      submitterName: args.submitterName?.trim() || undefined,
      submittedAt: Date.now(),
    });
  },
});

/**
 * Approve a pending response (admin use).
 */
export const approve = mutation({
  args: { id: v.id("wallResponses") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const response = await ctx.db.get(args.id);
    if (!response) {
      throw new Error("Response not found");
    }
    if (response.status !== "pending") {
      throw new Error("Only pending responses can be approved");
    }
    await ctx.db.patch(args.id, {
      status: "approved",
      approvedAt: Date.now(),
    });
    return null;
  },
});

/**
 * Reject a pending response (admin use).
 */
export const reject = mutation({
  args: { id: v.id("wallResponses") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const response = await ctx.db.get(args.id);
    if (!response) {
      throw new Error("Response not found");
    }
    if (response.status !== "pending") {
      throw new Error("Only pending responses can be rejected");
    }
    await ctx.db.patch(args.id, {
      status: "rejected",
    });
    return null;
  },
});
